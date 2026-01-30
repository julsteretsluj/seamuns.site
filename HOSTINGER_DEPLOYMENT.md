# Deploying SEAMUNs to Hostinger

## Prerequisites
- Hostinger hosting account
- FTP/SFTP access credentials from Hostinger
- FileZilla or another FTP client (or use Hostinger's File Manager)

## Step 1: Get Your Hostinger Credentials

1. Log in to your Hostinger account at https://hpanel.hostinger.com/
2. Go to **Hosting** → Select your hosting plan
3. Find **FTP Access** or **File Manager**
4. Note down:
   - FTP Hostname (e.g., ftp.yourdomain.com)
   - FTP Username
   - FTP Password
   - FTP Port (usually 21)

## Step 2: Prepare Files for Upload

All files in the `/Users/juleskitto-astrop/mun-tracker/` directory need to be uploaded EXCEPT:
- `.git/` folder (if present)
- `node_modules/` folder (if present)
- `*.md` files (documentation)
- `.DS_Store` files
- Any test or development files

**Files TO upload:**
- All `.html` files
- All `.css` files
- All `.js` files
- `env.js` (create from `env.example.js` with your real Firebase keys; do **not** commit it to Git)
- `logo.png`
- `*.pdf` files
- `api/` folder (if using PHP backend)
- `firebase-config.js`
- `.htaccess` (important for PDF file handling)

## Step 3: Upload Files to Hostinger

### Option A: Using Hostinger File Manager (Easiest)

1. Log in to Hostinger hPanel
2. Go to **Files** → **File Manager**
3. Navigate to `public_html` folder (this is your website root)
4. Click **Upload** button
5. Select all your files and upload them
6. Make sure `index.html` is in the root of `public_html`
7. **Important:** Upload `.htaccess` file:
   - In File Manager, click **Upload**
   - Select the `.htaccess` file
   - **Note:** Files starting with a dot (`.htaccess`) may be hidden. Make sure to enable "Show hidden files" in File Manager settings, or use FTP to upload it

### Option B: Using FTP Client (FileZilla)

1. Download FileZilla from https://filezilla-project.org/
2. Open FileZilla
3. Enter your FTP credentials:
   - Host: Your FTP hostname
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
4. Click **Quickconnect**
5. Navigate to `public_html` on the remote side (right panel)
6. Drag and drop all your files from local (left panel) to remote (right panel)
7. **Important:** Make sure `.htaccess` is uploaded:
   - In FileZilla, go to **Server** → **Force show hidden files** (or enable in View settings)
   - Drag and drop the `.htaccess` file to `public_html`
   - The file should appear in the remote directory

## Step 4: Configure Firebase for Your Domain

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **seamuns-8d050**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Click **Add domain**
5. Add your Hostinger domain (e.g., `yourdomain.com` or `seamuns.com`)
6. Also add `www.yourdomain.com` if applicable

## Step 5: Set Up MySQL Database (If Using SQL Backend)

If you're using the SQL database features:

1. In Hostinger hPanel, go to **Databases** → **MySQL Databases**
2. Create a new database:
   - Database name: `seamuns_db` (or your choice)
   - Username: Create a new user
   - Password: Create a strong password
3. Note down these credentials
4. Go to **phpMyAdmin**
5. Select your database
6. Click **Import**
7. Upload your `database-schema.sql` file
8. Update `api/database.php` with your credentials:

```php
private $host = "localhost";
private $db_name = "your_database_name";
private $username = "your_database_username";
private $password = "your_database_password";
```

## Step 6: Test Your Website

1. Visit your domain: `http://yourdomain.com` or `https://yourdomain.com`
2. Test all features:
   - ✅ Navigation works
   - ✅ Pages load correctly
   - ✅ Google Sign-In works (after adding domain to Firebase)
   - ✅ Conference listings display
   - ✅ Profile page works
   - ✅ Themes and dark mode work

## Step 7: Enable HTTPS (SSL Certificate)

1. In Hostinger hPanel, go to **Security** → **SSL**
2. Enable **Free SSL Certificate** (Let's Encrypt)
3. Wait a few minutes for activation
4. Your site will be accessible via `https://yourdomain.com`

## Step 8: Update Firebase for HTTPS

1. Go back to Firebase Console
2. Update authorized domains to use HTTPS:
   - `https://yourdomain.com`
   - `https://www.yourdomain.com`

## Common Issues & Solutions

### Issue: Google Sign-In doesn't work
**Solution:** Make sure your domain is added to Firebase Authorized Domains

### Issue: 404 errors on page navigation
**Solution:** Check that all files are in the correct directory structure

### Issue: Database connection fails
**Solution:** Verify database credentials in `api/database.php`

### Issue: Images/CSS not loading
**Solution:** Check file paths are relative (not absolute) in your HTML

### Issue: Firebase not connecting
**Solution:** Check that `env.js` is present on the server with the correct Firebase keys and that `firebase-config.js` is loading it

### Issue: PDF files download as HTML or don't open correctly
**Solution:** Make sure `.htaccess` file is uploaded to `public_html` root directory. The file ensures PDFs are served with the correct MIME type.

## File Structure on Hostinger

```
public_html/
├── index.html
├── about.html
├── contact.html
├── profile.html
├── [all other .html files]
├── styles.css
├── script.js
├── env.js (gitignored locally, required on the server)
├── firebase-config.js
├── conference-detail.js
├── profile.js
├── logo.png
├── .htaccess (important for PDF MIME types)
├── [all other assets]
└── api/
    ├── database.php
    ├── conferences.php
    └── feedback.php
```

## Maintenance

### Updating Your Site
1. Make changes locally
2. Upload changed files via FTP or File Manager
3. Clear browser cache to see changes

### Backing Up
1. Regularly download all files from Hostinger
2. Export database from phpMyAdmin
3. Keep local backups

## Support

- **Hostinger Support:** https://www.hostinger.com/tutorials
- **Firebase Documentation:** https://firebase.google.com/docs
- **Contact:** @jules.ktoast on Instagram

---

**Last Updated:** October 14, 2025










