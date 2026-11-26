#!/usr/bin/env bash
# ==============================================================================
# Academic Interview Pro — Automated Application Health Watchdog Daemon
# Runs via cron every 5 minutes to verify service responsiveness
# ==============================================================================

set -euo pipefail

HEALTH_URL="http://127.0.0.1:3000/api/health"
APP_NAME="academic-interview-pro"
LOG_FILE="/var/log/academicinterviewpro/watchdog.log"
MAX_RETRIES=3

mkdir -p "$(dirname "${LOG_FILE}")"

log() {
  echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] $1" >> "${LOG_FILE}"
}

check_health() {
  local response
  response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 "${HEALTH_URL}" || echo "000")
  if [ "${response}" -eq 200 ]; then
    return 0
  else
    return 1
  fi
}

# Perform 3-retry probe
FAILURES=0
for i in $(seq 1 $MAX_RETRIES); do
  if check_health; then
    exit 0
  else
    FAILURES=$((FAILURES + 1))
    sleep 3
  fi
done

if [ "$FAILURES" -ge "$MAX_RETRIES" ]; then
  log "[-] WARNING: Health check failed $MAX_RETRIES consecutive times. Restarting PM2 process '${APP_NAME}'..."
  pm2 restart "${APP_NAME}" || true
  log "[+] Restart command dispatched to PM2."
fi
