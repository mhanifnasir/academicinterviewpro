# Academic Interview Pro — Backup, Disaster Recovery & Business Continuity Plan

**Recovery Point Objective (RPO):** < 24 Hours (Daily cold dump) / < 1 Hour (Supabase WAL replication)  
**Recovery Time Objective (RTO):** < 15 Minutes (Cluster failover / Restore)  
**Storage Target:** Local encrypted storage `/var/backups/academicinterviewpro` + Supabase Cloud Auto-Backups

---

## 1. Automated Backup Strategy

### 1.1 Daily Database Dump (`scripts/backup-db.sh`)
Academic Interview Pro includes an automated PostgreSQL backup utility that:
1. Connects to PostgreSQL using `DIRECT_URL`.
2. Generates an encrypted/compressed `.sql.gz` archive using `pg_dump`.
3. Performs a gzip test verify drill immediately after creation.
4. Purges local archives older than 30 days.

### 1.2 Crontab Schedule
Install the backup job on the Azure VPS under the `deploy` user crontab:
```bash
crontab -e
```
Add the following entry to execute daily at 03:00 AM Pakistan Standard Time (PKT / UTC+5):
```cron
0 22 * * * /var/www/academicinterviewpro/scripts/backup-db.sh >> /var/log/academicinterviewpro/backup.log 2>&1
```

---

## 2. PostgreSQL Restoration Procedures

### 2.1 Full Database Restore Drill
In the event of accidental data deletion or schema corruption:

1. **Locate the target backup archive:**
   ```bash
   ls -lt /var/backups/academicinterviewpro/postgres/
   # Example: academicinterviewpro_db_20261120_220000.sql.gz
   ```

2. **Decompress the target backup:**
   ```bash
   gunzip -c /var/backups/academicinterviewpro/postgres/academicinterviewpro_db_20261120_220000.sql.gz > /tmp/restore_target.sql
   ```

3. **Execute restoration against Supabase PostgreSQL:**
   ```bash
   export $(grep -v '^#' /var/www/academicinterviewpro/.env.production | xargs)
   psql "${DIRECT_URL}" -f /tmp/restore_target.sql
   ```

4. **Clean up temporary unencrypted SQL file:**
   ```bash
   rm -f /tmp/restore_target.sql
   ```

5. **Restart PM2 processes to invalidate cached query data:**
   ```bash
   pm2 restart academic-interview-pro
   ```

---

## 3. Disaster Recovery Scenarios & Runbooks

### Scenario A: Complete Azure VPS Destruction
If the virtual machine is terminated or becomes permanently inaccessible:
1. **Spin up a new Azure VM:** Standard_D2s_v5 Ubuntu 24.04 in UAE North.
2. **Execute Automated Provisioning:**
   ```bash
   git clone https://github.com/academicinterviewpro/academicinterviewpro.git /var/www/academicinterviewpro
   cd /var/www/academicinterviewpro
   cp .env.production.template .env.production
   nano .env.production # Paste database connection and secrets
   sudo ./scripts/deploy-azure.sh
   ```
3. **DNS Repointing:** Update the DNS A record for `academicinterviewpro.pk` to point to the new Azure VM Public IP.
4. **Issue SSL Certificate:**
   ```bash
   sudo certbot --nginx -d academicinterviewpro.pk -d www.academicinterviewpro.pk
   ```
5. **Expected Total Recovery Time:** Under 10 minutes.

### Scenario B: Corrupted Database Table
If a specific table (e.g., `test_attempts` or `user_roles`) is damaged:
1. Extract the specific table schema and data from the backup:
   ```bash
   pg_restore --table=test_attempts -d "${DIRECT_URL}" <backup-file>
   ```
2. Verify integrity in Prisma Studio:
   ```bash
   npx prisma studio --port 5555
   ```

---

## 4. Disaster Recovery Drill Schedule

| Drill Type | Frequency | Responsibility | Objective |
| :--- | :--- | :--- | :--- |
| **Gzip Integrity Check** | Daily (Automated) | `backup-db.sh` script | Ensures dump is readable and not zero-byte. |
| **Test Database Restore** | Quarterly | Lead DevOps Engineer | Restore backup to an isolated staging DB and run test suite. |
| **Failover Simulation** | Bi-annually | Infrastructure Team | Test zero-downtime server migration and DNS cutover. |
