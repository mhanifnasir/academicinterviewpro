#!/usr/bin/env bash
# ==============================================================================
# Academic Interview Pro — Zero-Downtime Azure Ubuntu 24.04 Deployment Script
# Target Host: Azure Standard_B2s / Standard_D2s_v5 Ubuntu 24.04 LTS VPS
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/academicinterviewpro"
APP_USER="deploy"
LOG_DIR="/var/log/academicinterviewpro"
GIT_BRANCH="master"

echo "==================================================================="
echo "Starting Academic Interview Pro Production Deployment on Azure VPS"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "==================================================================="

# 1. Verify Sudo / Root
if [ "$EUID" -ne 0 ]; then
  echo "[-] ERROR: This script must be executed with sudo or as root."
  exit 1
fi

# 2. System Packages & Prerequisites Check
echo "[+] Step 1/8: Checking base system dependencies..."
apt-get update -y
apt-get install -y curl wget git unzip ufw fail2ban nginx certbot python3-certbot-nginx postgresql-client

# 3. Node.js 22 LTS & PM2 Installation
if ! command -v node &> /dev/null || [[ $(node -v) != v22* ]]; then
  echo "[+] Step 2/8: Installing Node.js 22 LTS via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
  echo "[+] Step 3/8: Installing PM2 process manager globally..."
  npm install -g pm2
fi

# 4. Prepare Directory Tree & Log Stores
echo "[+] Step 4/8: Preparing deployment directories and file permissions..."
mkdir -p "${APP_DIR}"
mkdir -p "${LOG_DIR}"
mkdir -p /var/www/certbot

# Create deploy user if not present
if ! id -u "${APP_USER}" &> /dev/null; then
  useradd -m -s /bin/bash "${APP_USER}"
  usermod -aG sudo "${APP_USER}"
fi

chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"
chown -R "${APP_USER}:${APP_USER}" "${LOG_DIR}"

# 5. Git Synchronization & Dependencies Installation
echo "[+] Step 5/8: Syncing latest application source and installing dependencies..."
cd "${APP_DIR}"

# Stash local changes if any and pull
if [ -d ".git" ]; then
  sudo -u "${APP_USER}" git fetch origin "${GIT_BRANCH}"
  sudo -u "${APP_USER}" git reset --hard "origin/${GIT_BRANCH}"
fi

# Ensure production environment file is linked
if [ ! -f "${APP_DIR}/.env.production" ] && [ ! -f "${APP_DIR}/.env" ]; then
  echo "[-] WARNING: No .env.production file detected in ${APP_DIR}."
  echo "    Please create ${APP_DIR}/.env.production with production credentials."
  if [ -f "${APP_DIR}/.env.production.template" ]; then
    cp "${APP_DIR}/.env.production.template" "${APP_DIR}/.env.production"
    echo "[!] Created ${APP_DIR}/.env.production from template. Fill in required secrets."
  fi
fi

# Clean install dependencies
sudo -u "${APP_USER}" npm ci --prefer-offline --no-audit

# 6. Prisma Database Migrations
echo "[+] Step 6/8: Generating Prisma Client and executing database migrations..."
sudo -u "${APP_USER}" npx prisma generate
sudo -u "${APP_USER}" npx prisma migrate deploy

# 7. Next.js Production Build
echo "[+] Step 7/8: Compiling Next.js production build..."
sudo -u "${APP_USER}" npm run build

# 8. PM2 Cluster Reload & Nginx Configuration
echo "[+] Step 8/8: Executing zero-downtime PM2 cluster reload..."
cp "${APP_DIR}/nginx/academicinterviewpro.conf" /etc/nginx/sites-available/academicinterviewpro.conf
ln -sf /etc/nginx/sites-available/academicinterviewpro.conf /etc/nginx/sites-enabled/academicinterviewpro.conf
rm -f /etc/nginx/sites-enabled/default

# Verify Nginx syntax
nginx -t
systemctl reload nginx

# Reload or Start PM2
if pm2 describe academic-interview-pro &> /dev/null; then
  echo "[+] Reloading active PM2 cluster instances without dropping requests..."
  sudo -u "${APP_USER}" pm2 reload ecosystem.config.js --env production
else
  echo "[+] Starting new PM2 cluster..."
  sudo -u "${APP_USER}" pm2 start ecosystem.config.js --env production
fi

# Save PM2 process list and configure systemd autostart
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u "${APP_USER}" --hp "/home/${APP_USER}" || true
sudo -u "${APP_USER}" pm2 save

# Configure UFW Firewall rules
ufw allow 'OpenSSH'
ufw allow 'Nginx Full'
ufw --force enable

echo "==================================================================="
echo "Academic Interview Pro deployed successfully to Azure Ubuntu VPS!"
echo "Check health: curl http://127.0.0.1:3000/api/health"
echo "PM2 Status: pm2 status"
echo "Logs: tail -f ${LOG_DIR}/out.log"
echo "==================================================================="
