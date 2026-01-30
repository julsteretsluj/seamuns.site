# SEAMUNs Hostinger Deployment Checklist

## Pre-Deployment Checklist

- [ ] Have Hostinger account and hosting plan active
- [ ] Have FTP credentials ready
- [ ] All files tested locally
- [ ] Firebase project configured
- [ ] Know your domain name (e.g., seamuns.com)

## Deployment Steps

### 1. Upload Files
- [ ] Log in to Hostinger hPanel
- [ ] Open File Manager
- [ ] Navigate to `public_html` folder
- [ ] Upload all HTML files
- [ ] Upload CSS files (styles.css)
- [ ] Upload JavaScript files (script.js, firebase-config.js, etc.)
- [ ] Upload **env.js** (copy of env.example.js with real Firebase keys) directly on the server — do NOT commit it to Git
- [ ] Upload images (logo.png)
- [ ] Upload PDF files
- [ ] Upload api/ folder (if using database)
- [ ] Verify index.html is in root of public_html

### 2. Configure Firebase
- [ ] Go to Firebase Console
- [ ] Select project: seamuns-8d050
- [ ] Go to Authentication → Settings → Authorized domains
- [ ] Add your domain (e.g., seamuns.com)
- [ ] Add www subdomain (e.g., www.seamuns.com)
- [ ] Save changes

### 3. Set Up Database (Optional)
- [ ] Create MySQL database in Hostinger
- [ ] Note database name, username, password
- [ ] Import database-schema.sql via phpMyAdmin
- [ ] Update api/database.php with credentials
- [ ] Test database connection

### 4. Enable SSL
- [ ] Go to Security → SSL in Hostinger
- [ ] Enable Free SSL Certificate
- [ ] Wait for activation (5-10 minutes)
- [ ] Update Firebase authorized domains to HTTPS

### 5. Testing
- [ ] Visit your domain
- [ ] Test navigation between pages
- [ ] Test Google Sign-In
- [ ] Test profile creation/editing
- [ ] Test conference listings
- [ ] Test theme switching
- [ ] Test dark mode
- [ ] Test on mobile devices
- [ ] Test all Instagram links

### 6. Post-Deployment
- [ ] Clear browser cache
- [ ] Test from different browsers
- [ ] Share link with friends for testing
- [ ] Monitor Firebase Console for errors
- [ ] Set up regular backups

## Quick Access Links

- **Hostinger hPanel:** https://hpanel.hostinger.com/
- **Firebase Console:** https://console.firebase.google.com/
- **Your Website:** http://yourdomain.com (update this)

## Emergency Contacts

- **Hostinger Support:** Live chat in hPanel
- **Firebase Support:** Firebase Console → Support
- **Developer:** @jules.ktoast on Instagram

---

**Deployment Date:** _______________
**Domain:** _______________
**Status:** _______________










