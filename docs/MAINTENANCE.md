# Academic Interview Pro — Operational Maintenance & Reliability Guide

This guide details day-2 operations, system monitoring, zero-downtime upgrades, log management, and security maintenance for Academic Interview Pro.

---

## 1. System Monitoring & Metrics

### 1.1 Automated Health Watchdog Daemon
The application includes an automated watchdog daemon at `scripts/health-check.sh` that checks the `/api/health` endpoint every 5 minutes.

Configure the watchdog in the system crontab:
```bash
# Edit crontab
crontab -e

# Run watchdog every 5 minutes
*/5 * * * * /var/www/academicinterviewpro/scripts/health-check.sh
```

### 1.2 PM2 Real-Time Monitoring
```bash
# Real-time resource dashboard (CPU, Memory, Event Loop Latency)
pm2 monit

# Quick status check
pm2 status

# Detailed inspection of memory consumption
pm2 describe academic-interview-pro
```

### 1.3 System Resource Thresholds

| Metric | Warning Threshold | Critical Action |
| :--- | :--- | :--- |
| **CPU Utilization** | > 75% for 5 mins | PM2 automatically balances across CPU cluster instances. |
| **Memory per Node Worker** | > 850 MB | PM2 triggers `max_memory_restart: 1024M` automatically. |
| **Disk Space (`/`)** | > 80% capacity | Clear old logs in `/var/log/academicinterviewpro` and `/var/backups`. |
| **HTTP 5xx Rate** | > 1% of total traffic | Inspect `/var/log/academicinterviewpro/error.log`. |

---

## 2. Log Management & Logrotate

To prevent log files from exhausting VPS disk space, Academic Interview Pro utilizes system `logrotate`.

### 2.1 Logrotate Configuration
Create `/etc/logrotate.d/academicinterviewpro`:
```conf
/var/log/academicinterviewpro/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        pm2 reloadLogs > /dev/null 2>&1 || true
    endscript
}
```

Verify logrotate syntax:
```bash
sudo logrotate -d /etc/logrotate.d/academicinterviewpro
```

---

## 3. Routine Operating System & Security Maintenance

### 3.1 Security Patching Policy
- **Minor security patches:** Applied bi-weekly.
- **Kernel updates:** Applied during scheduled maintenance windows (Sunday 02:00 AM PKT).

```bash
# Update package indices and upgrade packages
sudo apt update && sudo apt upgrade -y

# Remove obsolete packages
sudo apt autoremove -y && sudo apt clean
```

### 3.2 SSL Certificate Auto-Renewal
Let's Encrypt certificates expire every 90 days. Certbot installs a systemd timer by default.

Verify renewal dry-run:
```bash
sudo certbot renew --dry-run
```

---

## 4. Zero-Downtime Deployment Runbook

When releasing new features or HEC curriculum updates:

```bash
# 1. SSH into the production server
ssh deploy@academicinterviewpro.pk

# 2. Enter project directory
cd /var/www/academicinterviewpro

# 3. Pull latest release from master
git pull origin master

# 4. Install production dependencies
npm ci --prefer-offline

# 5. Apply any database migrations
npx prisma generate
npx prisma migrate deploy

# 6. Build the Next.js production bundle
npm run build

# 7. Reload PM2 cluster instances gracefully
pm2 reload ecosystem.config.js --env production

# 8. Verify health endpoint
curl -I http://127.0.0.1:3000/api/health
```

---

## 5. Emergency Incident Response Matrix

| Incident | First Responder Action | Escalation |
| :--- | :--- | :--- |
| **Service Unresponsive (HTTP 502/504)** | Check PM2 (`pm2 status`). If stopped, run `pm2 restart all`. Check Nginx (`sudo systemctl status nginx`). | Check database connection pool limits in Supabase. |
| **Database Pool Exhaustion** | Verify Prisma queries use the port 6543 pooler connection string. Restart application to flush idle connections. | Increase Supabase pool size or enable statement timeouts. |
| **Spam / DDoS Attack** | Nginx rate limiters automatically drop excess traffic (`limit_req_zone`). Inspect offending IPs: `tail -n 1000 /var/log/nginx/access.log \| awk '{print $1}' \| sort \| uniq -c \| sort -nr`. Block via UFW: `sudo ufw deny from <OFFENDING_IP>`. | Enable Cloudflare Proxy / Azure DDoS Protection. |
