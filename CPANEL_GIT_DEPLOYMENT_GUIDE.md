# 🚀 Complete cPanel Git Deployment Guide for Elephant House AR Game
## 🌐 Target URL: `https://ehwonderonline.com/kiosk`
## 📦 GitHub Repository: `https://github.com/dilmith-loops/eh-tongue-kiosk.git`

This guide provides step-by-step instructions to host and deploy the Elephant House AR Game on your cPanel account using **Git™ Version Control** (Git Connect).

---

## 🏗️ Architecture Overview

The repository is built to run **both the Next.js Frontend and Laravel Backend together** on Apache/LiteSpeed cPanel hosting without needing Node.js or a separate PM2 process on the server:

* **🎮 Frontend (Next.js 16)**: Pre-compiled static export assets with `basePath: '/kiosk'` (`index.html`, `404.html`, `_next/`, `eh-portal/`, `privacy/`, `terms/`, 3D models, and MediaPipe WASM face tracking). Served directly by Apache at maximum speed.
* **🔌 Backend (Laravel 11)**: Located in [`backend/`](backend/), handling scores, high-frequency kiosk player sessions, multi-player device concurrency, leaderboards, and admin controls.
* **🔀 Root Router ([`.htaccess`](.htaccess) & [`index.php`](index.php))**:
  - Automatically routes `/kiosk/api/*` and `/kiosk/uploads/*` to the Laravel backend.
  - Automatically serves `/kiosk/`, `/kiosk/eh-portal/`, `/kiosk/terms/`, and static assets without collision.

---

## 📋 Prerequisites in cPanel

Before connecting Git, ensure the following are configured in your cPanel dashboard:

### 1. PHP Version (8.2 or 8.3)
1. Go to **cPanel ➔ MultiPHP Manager** (or **Select PHP Version**).
2. Set `ehwonderonline.com` to use **PHP 8.2** or **PHP 8.3**.
3. Verify that standard extensions are active:
   `pdo_mysql`, `mbstring`, `openssl`, `bcmath`, `curl`, `fileinfo`, `tokenizer`, `xml`, `zip`.

### 2. MySQL Database Setup
1. Go to **cPanel ➔ MySQL® Databases**:
   - **Create New Database**: e.g. `ehwonder_kioskdb`
   - **Create New User**: e.g. `ehwonder_gameuser` with a secure password.
   - **Add User to Database**: Check **ALL PRIVILEGES** and click **Make Changes**.
2. Go to **cPanel ➔ phpMyAdmin**:
   - Select your database (`ehwonder_kioskdb`).
   - Click the **Import** tab.
   - Choose [`elephanthouse_game.sql`](elephanthouse_game.sql) from the repository root.
   - Click **Import** to load initial schema, settings, and default admin.

---

## 🚀 Step-by-Step Git Connect in cPanel

### Method 1: Using cPanel Git™ Version Control (Recommended UI Method)

1. Log in to your **cPanel** dashboard for `ehwonderonline.com`.
2. In the **Files** section, click **Git™ Version Control**.
3. Click the blue **Create** button (top right).
4. Fill in the fields:
   * **Clone URL**: `https://github.com/dilmith-loops/eh-tongue-kiosk.git`
   * **Repository Path**: `public_html/kiosk`
     *(cPanel will automatically create the `kiosk` folder inside `public_html`)*
   * **Repository Name**: `kiosk`
5. Click **Create**.
   * cPanel will clone the repository into `/home/YOUR_USER/public_html/kiosk`.

---

### Method 2: Using cPanel Terminal / SSH (Fastest)

If your hosting provides the **Terminal** feature:

```bash
# 1. Go to public_html
cd ~/public_html

# 2. Clone repository into the 'kiosk' folder:
git clone https://github.com/dilmith-loops/eh-tongue-kiosk.git kiosk
```

---

## ⚙️ Backend Configuration

### 1. Configure `backend/.env`
In cPanel **File Manager** (or Terminal):
1. Navigate into `public_html/kiosk/backend/`.
2. Copy `.env.cpanel.example` to `.env`:
   ```bash
   cp .env.cpanel.example .env
   ```
3. Edit `backend/.env` and update the database credentials:

```env
APP_NAME="Elephant House AR Game"
APP_ENV=production
APP_KEY=base64:ekLyZjg42eqEKw2jymhalp2GzRxia10qDSzpw0Gt8eA=
APP_DEBUG=false
APP_URL=https://ehwonderonline.com/kiosk

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=yourcpaneluser_kioskdb
DB_USERNAME=yourcpaneluser_gameuser
DB_PASSWORD=YourDatabasePasswordHere

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=database

CORS_ALLOWED_ORIGINS=*
```

---

### 2. Verify PHP Dependencies (`backend/vendor/`)

#### If you have cPanel Terminal:
```bash
cd ~/public_html/kiosk/backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
```

#### If you do NOT have Terminal / Composer:
1. In your local repository, run:
   ```bash
   cd backend
   composer install --no-dev
   zip -r vendor.zip vendor
   ```
2. Upload `vendor.zip` to `public_html/kiosk/backend/` using cPanel File Manager and extract it.

---

### 3. File Permissions
Ensure Laravel storage and bootstrap cache directories are writable:
* `public_html/kiosk/backend/storage/` -> `775` (or `755`)
* `public_html/kiosk/backend/bootstrap/cache/` -> `775` (or `755`)

In cPanel Terminal:
```bash
chmod -R 775 ~/public_html/kiosk/backend/storage
chmod -R 775 ~/public_html/kiosk/backend/bootstrap/cache
```

---

## 🔄 How to Pull Future Updates (1-Click Deployment)

Whenever you push commits to GitHub `main`:

1. Open cPanel ➔ **Git™ Version Control**.
2. Find the repository (`kiosk`) and click **Manage**.
3. Go to the **Pull or Deploy** tab.
4. Click **Update from Remote**.
5. Your live game at `https://ehwonderonline.com/kiosk` is instantly updated!

---

## 🛠️ Verification & Troubleshooting Checklist

| URL to Test | Expected Result | Solution if Failing |
| :--- | :--- | :--- |
| **`https://ehwonderonline.com/kiosk`** | 3D Ice cream game interface with camera prompt. | Check that `.htaccess` exists in `public_html/kiosk/` (Enable "Show Hidden Files" in cPanel File Manager). |
| **`https://ehwonderonline.com/kiosk/api/settings`** | Returns JSON `{"status":true,"settings":{...}}`. | Check `backend/.env` database credentials and verify PHP version is 8.2+. |
| **`https://ehwonderonline.com/kiosk/eh-portal/`** | Elephant House Admin Login screen. | Ensure permissions allow reading HTML files (`644`). |
| **500 Server Error** | HTTP 500 error page. | Check `backend/storage/logs/laravel.log` and verify `storage/` directory permissions (`chmod -R 775`). |
| **404 on API requests** | API endpoint returns 404. | Confirm `mod_rewrite` is enabled on Apache and `.htaccess` is present in `public_html/kiosk/`. |
