# Academic Interview Pro — Production Deployment Guide
**Target Operating Environment:** Azure Ubuntu 24.04 LTS VPS  
**Stack:** Node.js v22 LTS, PM2 Cluster Mode, Nginx Reverse Proxy, Let's Encrypt TLS 1.3, Supabase PostgreSQL

---

## 1. System Architecture Overview

Academic Interview Pro is architected for high availability, sub-100ms response latencies, and enterprise security for Pakistani Computer Science lecturer candidates.

```
                    [ Internet / Pakistani Candidates ]
                                     |
                                     v
                       [ Azure Virtual Network ]
                                     |
              +----------------------+----------------------+
              |                                             |
     [ Port 80 (HTTP) ]                            [ Port 443 (HTTPS) ]
              |                                             |
     Redirect to HTTPS                        TLS 1.3 Termination (Nginx)
                                                            |
                                             +--------------+--------------+
                                             | Rate Limiting & Gzip Cache  |
                                             +--------------+--------------+
                                                            |
                                               [ Reverse Proxy Upstream ]
                                                            |
                                           http://127.0.0.1:3000 (Keepalive)
                                                            |
                                                            v
                                            +-------------------------------+
                                            |   PM2 Next.js Cluster Mode    |
                                            |  (Node.js 22 LTS / CPU Cores) |
                                            +---------------+---------------+
                                                            |
                      +-------------------------------------+-------------------------------------+
                      |                                     |                                     |
                      v                                     v                                     v
            [ Supabase Postgres ]                 [ Google Gemini AI ]                 [ JazzCash / EasyPaisa ]
          (Pooler:6543 / Direct:5432)             (Viva Voce & Rubric)                  (HMAC-SHA256 Webhook)
```

---

## 2. Recommended Azure Hardware Provisioning

| Component | Minimum Specification | Recommended Production |
| :--- | :--- | :--- |
| **Azure VM Size** | `Standard_B2s` (2 vCPU, 4 GiB RAM) | `Standard_D2s_v5` (2 vCPU, 8 GiB RAM) |
| **Operating System** | Ubuntu Server 24.04 LTS (Noble Numbat) | Ubuntu Server 24.04 LTS |
| **Azure Region** | UAE North (Dubai) or West India | UAE North (optimal latency to Pakistan) |
| **OS Disk** | 64 GiB Premium SSD (P6) | 128 GiB Premium SSD (P10) |
| **Public IP** | Standard Static IPv4 | Standard Static IPv4 |
| **Network Security Group** | Inbound: 22 (SSH), 80 (HTTP), 443 (HTTPS) | Inbound: 22 (SSH), 80, 443 |

---

## 3. Server Hardening & Base Configuration

### 3.1 Initial Access & User Creation
Connect to the server via SSH:
```bash
ssh azureuser@<AZURE_PUBLIC_IP>
```

Create a non-root deployment user `deploy`:
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 3.2 UFW Firewall Configuration
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'
sudo ufw enable
```

### 3.3 Fail2Ban Intrusion Prevention
```bash
sudo apt update && sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 4. Automated Deployment via `scripts/deploy-azure.sh`

The repository contains an automated deployment script `scripts/deploy-azure.sh` that provisions dependencies, synchronizes source code, builds Next.js, configures Nginx, and starts PM2.

```bash
# Clone the repository into /var/www/academicinterviewpro
sudo mkdir -p /var/www/academicinterviewpro
sudo chown -R deploy:deploy /var/www/academicinterviewpro
git clone https://github.com/academicinterviewpro/academicinterviewpro.git /var/www/academicinterviewpro

# Navigate to application root
cd /var/www/academicinterviewpro

# Create production environment configuration
cp .env.production.template .env.production
nano .env.production # Fill in database credentials, API keys, and payment secrets

# Make deployment script executable and execute
chmod +x scripts/deploy-azure.sh scripts/backup-db.sh scripts/health-check.sh
sudo ./scripts/deploy-azure.sh
```

---

## 5. Manual Step-by-Step Deployment Procedure

If manual setup is preferred, follow these steps:

### Step 1: Install Node.js 22 LTS and PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx postgresql-client
sudo npm install -g pm2
```

### Step 2: Configure Environment Variables
Create `/var/www/academicinterviewpro/.env.production`:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://academicinterviewpro.pk
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
GEMINI_API_KEY="..."
ADMIN_INVITATION_SECRET="..."
```

### Step 3: Prisma Migrations & Production Build
```bash
cd /var/www/academicinterviewpro
npm ci --prefer-offline
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Step 4: PM2 Cluster Management
Start Next.js in cluster mode matching CPU core count:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

### Step 5: Nginx Reverse Proxy & Let's Encrypt SSL
```bash
sudo cp nginx/academicinterviewpro.conf /etc/nginx/sites-available/academicinterviewpro.conf
sudo ln -sf /etc/nginx/sites-available/academicinterviewpro.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Obtain SSL Certificate via Certbot
sudo certbot --nginx -d academicinterviewpro.pk -d www.academicinterviewpro.pk --non-interactive --agree-tos -m admin@academicinterviewpro.pk
```

---

## 6. Zero-Downtime Application Updates

To deploy new code changes without dropping in-flight user exams or interviews:

```bash
cd /var/www/academicinterviewpro
git pull origin master
npm ci --prefer-offline
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.js --env production
```

PM2 gracefully reloads cluster worker instances one by one, ensuring zero dropped HTTP connections.

---

## 7. Post-Deployment Verification

1. **Verify Health Endpoint:**
   ```bash
   curl -I https://academicinterviewpro.pk/api/health
   # Expected: HTTP/2 200 OK
   ```
2. **Verify Process Status:**
   ```bash
   pm2 status
   # Expected: academic-interview-pro | online | cluster
   ```
3. **Verify Security Headers:**
   ```bash
   curl -I https://academicinterviewpro.pk | grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options"
   ```
4. **Verify Application Logs:**
   ```bash
   tail -f /var/log/academicinterviewpro/out.log
   ```
