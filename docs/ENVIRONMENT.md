# Academic Interview Pro — Production Environment Variables Guide

This document catalogs every environment variable utilized across the Academic Interview Pro platform, specifying sensitivity classifications, expected formats, and secret rotation procedures.

---

## 1. Master Variable Inventory

| Variable Name | Required | Sensitivity | Default / Format | Description |
| :--- | :---: | :---: | :--- | :--- |
| `NODE_ENV` | Yes | Public | `production` | Node.js execution runtime mode. |
| `PORT` | Yes | Low | `3000` | Port on which the Next.js PM2 process listens. |
| `NEXT_PUBLIC_APP_URL` | Yes | Public | `https://academicinterviewpro.pk` | Canonical application base URL for callbacks & metadata. |
| `DATABASE_URL` | Yes | Critical | `postgresql://...:6543/postgres?sslmode=require&pgbouncer=true` | Pooled connection string for Prisma ORM query traffic. |
| `DIRECT_URL` | Yes | Critical | `postgresql://...:5432/postgres?sslmode=require` | Direct session connection string for Prisma migrations. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Public | `https://[PROJECT].supabase.co` | Supabase API project endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public | `eyJhbGciOi...` | Supabase public anonymous client JWT. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Critical | `eyJhbGciOi...` | Supabase administrative secret key (bypasses RLS). |
| `GEMINI_API_KEY` | Yes | Critical | `AIzaSy...` | Google Gemini Pro API key for viva & teaching evaluation. |
| `OPENAI_API_KEY` | No | High | `sk-proj-...` | Fallback OpenAI API key for language processing. |
| `DEEPGRAM_API_KEY` | No | High | `dg-...` | Real-time speech-to-text / text-to-speech engine key. |
| `PISTON_API_URL` | No | Medium | `https://emkc.org/api/v2/piston` | Endpoint for isolated sandboxed code execution. |
| `JUDGE0_API_URL` | No | Medium | `http://...:2358` | Alternative Judge0 CE sandbox API endpoint. |
| `JAZZCASH_MERCHANT_ID` | Yes | High | String | Registered JazzCash merchant identifier. |
| `JAZZCASH_PASSWORD` | Yes | Critical | String | JazzCash merchant API authentication password. |
| `JAZZCASH_INTEGRITY_SALT` | Yes | Critical | String | Cryptographic salt for calculating HMAC-SHA256 signatures. |
| `EASYPAISA_STORE_ID` | Yes | High | String | Registered EasyPaisa merchant store code. |
| `EASYPAISA_HASH_KEY` | Yes | Critical | String | Secret hash key for EasyPaisa checksum verification. |
| `ADMIN_INVITATION_SECRET` | Yes | Critical | 64-char hex string | Secret token required to register or elevate admin accounts. |
| `CRON_SECRET` | Yes | High | 64-char hex string | Bearer token protecting background maintenance endpoints. |

---

## 2. Sensitivity Tiers & Storage Policy

- **Critical:** Must NEVER be committed to Git or exposed to the client bundle. Store exclusively on the production server in `/var/www/academicinterviewpro/.env.production` with file permissions `600` (readable only by `deploy` user).
- **High:** Merchant credentials and AI keys. Monitored for quota misuse; restrict API key scopes where supported.
- **Public:** Variables prefixed with `NEXT_PUBLIC_` are baked into client-side JS bundles at compile time. Never place secrets in `NEXT_PUBLIC_` variables.

---

## 3. Secret Rotation Protocols

### 3.1 Rotating Database Passwords
1. Generate a new database password in the Supabase Dashboard (`Database` -> `Database Settings`).
2. Update `DATABASE_URL` and `DIRECT_URL` in `/var/www/academicinterviewpro/.env.production`.
3. Test connectivity:
   ```bash
   npx prisma db pull
   ```
4. Reload the running PM2 cluster without downtime:
   ```bash
   pm2 reload ecosystem.config.js --update-env
   ```

### 3.2 Rotating Payment Gateway Salts
1. Obtain the updated Merchant Integrity Salt from the JazzCash or EasyPaisa Merchant Portal.
2. Update `JAZZCASH_INTEGRITY_SALT` or `EASYPAISA_HASH_KEY` in `.env.production`.
3. Reload PM2 cluster:
   ```bash
   pm2 reload academic-interview-pro --update-env
   ```
4. Verify by executing a test PKR 1 sandbox transaction.

### 3.3 Rotating Gemini / AI API Keys
1. Create a new API key in Google Cloud Console / Google AI Studio.
2. Update `GEMINI_API_KEY` in `.env.production`.
3. Reload PM2 cluster:
   ```bash
   pm2 reload academic-interview-pro --update-env
   ```
4. Deactivate the obsolete API key in Google Cloud Console.
