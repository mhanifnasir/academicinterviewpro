#!/usr/bin/env bash
# ==============================================================================
# Academic Interview Pro — Automated PostgreSQL Daily Backup & Rotation Script
# Target: Supabase PostgreSQL / Azure Database for PostgreSQL
# Retention: 30 Days Local & Cloud Archival
# ==============================================================================

set -euo pipefail

BACKUP_DIR="/var/backups/academicinterviewpro/postgres"
LOG_FILE="/var/log/academicinterviewpro/backup.log"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/academicinterviewpro_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=30

mkdir -p "${BACKUP_DIR}"
mkdir -p "$(dirname "${LOG_FILE}")"

log() {
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" | tee -a "${LOG_FILE}"
}

log "Starting database backup drill..."

# Source production environment variables to read DATABASE_URL or DIRECT_URL
if [ -f "/var/www/academicinterviewpro/.env.production" ]; then
  # Export non-comment lines
  export $(grep -v '^#' /var/www/academicinterviewpro/.env.production | xargs)
elif [ -f "/var/www/academicinterviewpro/.env" ]; then
  export $(grep -v '^#' /var/www/academicinterviewpro/.env | xargs)
fi

DB_CONN="${DIRECT_URL:-${DATABASE_URL:-}}"

if [ -z "${DB_CONN}" ]; then
  log "[-] ERROR: Neither DIRECT_URL nor DATABASE_URL environment variable is set."
  exit 1
fi

# Execute pg_dump with gzip compression
log "[+] Dumping database via pg_dump to ${BACKUP_FILE}..."
pg_dump "${DB_CONN}" \
  --format=plain \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists | gzip -9 > "${BACKUP_FILE}"

# Verify integrity of generated archive
log "[+] Verifying gzip archive integrity..."
if gzip -t "${BACKUP_FILE}"; then
  FILE_SIZE=$(du -h "${BACKUP_FILE}" | cut -f1)
  log "[+] Backup verified successfully! File size: ${FILE_SIZE}"
else
  log "[-] ERROR: Backup file failed gzip integrity check!"
  rm -f "${BACKUP_FILE}"
  exit 1
fi

# Prune archives older than RETENTION_DAYS
log "[+] Purging local backup archives older than ${RETENTION_DAYS} days..."
DELETED_COUNT=$(find "${BACKUP_DIR}" -name "academicinterviewpro_db_*.sql.gz" -type f -mtime +${RETENTION_DAYS} -print -delete | wc -l)
log "[+] Pruned ${DELETED_COUNT} outdated backup archive(s)."

log "Database backup process completed successfully."
