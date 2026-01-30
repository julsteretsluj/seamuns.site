# Firebase Setup Guide for SEAMUNs Tracker

## 🚀 Overview

This application now supports **cross-browser and cross-device login** using Firebase Authentication and Firestore Database. Follow the steps below to set up your Firebase project and enable cloud sync.

---

## 📋 Prerequisites

- A Google account
- Basic understanding of web hosting

---

## ✅ Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "seamuns-tracker")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click **"Create project"**

---

## ✅ Step 2: Register Your Web App

1. In the Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Give your app a nickname (e.g., "SEAMUNs Web App")
3. **Do NOT** check "Set up Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. **Copy the Firebase configuration** that appears (you'll need this soon)

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## ✅ Step 3: Enable Firebase Authentication

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
   - Click on **"Email/Password"**
   - Toggle **"Enable"** to ON
   - Click **"Save"**

---

## ✅ Step 4: Create Firestore Database

1. In the Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - ⚠️ **Important**: Test mode allows public read/write access. Change to production mode after setup!
4. Choose a Firestore location (e.g., `us-central` or nearest to your users)
5. Click **"Enable"**

### Set Up Firestore Security Rules (Important!)

After testing, update your Firestore rules to secure your database:

1. Go to **Firestore Database** → **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Attendance records - users can only modify their own
    match /attendance/{attendanceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      attendanceId.matches('^' + request.auth.uid + '_.*');
    }
  }
}
```

3. Click **"Publish"**

---

## ✅ Step 5: Add Your Firebase Credentials Securely

> 🔐 **Important:** Secrets are no longer stored in `firebase-config.js`.  
> Keep `env.js` out of version control so credentials stay private.

1. Copy `env.example.js` to `env.js`
   ```bash
   cp env.example.js env.js
   ```
2. Open `env.js` and paste the Firebase config you copied in Step 2:
```javascript
   window.__ENV__ = {
     FIREBASE_API_KEY: "AIzaSy...",
     FIREBASE_AUTH_DOMAIN: "your-project.firebaseapp.com",
     FIREBASE_PROJECT_ID: "your-project",
     FIREBASE_STORAGE_BUCKET: "your-project.appspot.com",
     FIREBASE_MESSAGING_SENDER_ID: "1234567890",
     FIREBASE_APP_ID: "1:1234567890:web:abcdef",
     FIREBASE_MEASUREMENT_ID: "G-XXXXXXX" // optional
};
```
3. Leave `firebase-config.js` as-is. It now reads values from `env.js` (or `process.env` during builds).
4. **Next**: Enable Firebase services in the console (see `FIREBASE_QUICK_START.md`)

---

## ✅ Step 6: Add Firebase Scripts to Remaining HTML Pages

The main pages (`index.html`, `profile.html`, `conference-template.html`) already have Firebase scripts added.

For **all other HTML pages** in your project, add these scripts before the closing `</body>` tag:

```html
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
    
    <!-- Environment Configuration (gitignored) -->
    <script src="env.js"></script>
    
    <!-- Firebase Configuration -->
    <script src="firebase-config.js"></script>
    
    <!-- Other existing scripts -->
    <script src="script.js"></script>
</body>
</html>
```

**Pages that need Firebase scripts:**
- advisor-guide.html
- awards.html
- become-participating-school.html
- chair-guide.html
- committees.html
- conduct.html
- confidence.html
- contact.html
- crisis.html
- delegate-signup.html
- examples.html
- ga.html
- how-to-host.html
- how-to-prep.html
- individual-delegates.html
- motions.html
- mun-guide.html
- participating-schools.html
- points.html
- position-papers.html
- prospective-muns.html
- resolutions.html
- speeches.html
- stand-out.html
- support.html
- templates.html

---

## ✅ Step 7: Test Your Setup

1. **Start a local server** (required for Firebase to work):
   ```bash
   python3 -m http.server 8000
   ```
   Or use any other local server method.

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

3. **Create a test account**:
   - Click "Sign Up"
   - Enter test credentials
   - Click "Create Account"

4. **Check Firebase Console**:
   - Go to **Authentication** → **Users**
   - You should see your new user listed
   - Go to **Firestore Database** → **Data**
   - You should see a `users` collection with your user data

5. **Test cross-browser login**:
   - Open a different browser (e.g., if you used Chrome, open Firefox)
   - Navigate to `http://localhost:8000`
   - Log in with the same credentials
   - Your profile, awards, and conference attendance should sync! 🎉

---

## 🔧 Troubleshooting

### Problem: "Firebase not defined" error
**Solution**: Make sure Firebase scripts load **before** `firebase-config.js` and `script.js`

### Problem: "Permission denied" in Firestore
**Solution**: Check your Firestore Security Rules and ensure authentication is working

### Problem: Can't see user data in Firestore
**Solution**: 
1. Check browser console for errors
2. Verify your Firebase config is correct
3. Ensure Firestore is in test mode during development

### Problem: Login works but data doesn't sync
**Solution**:
1. Check browser console for Firebase errors
2. Verify internet connection
3. Check Firestore Security Rules

---

## 🌐 Deploying to Production

### Option 1: Firebase Hosting (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to your project folder (or ".")
   - Configure as single-page app: No
   - Don't overwrite existing files

4. Deploy:
   ```bash
   firebase deploy
   ```

5. Your site will be live at: `https://your-project.firebaseapp.com`

### Option 2: Other Hosting (Netlify, Vercel, etc.)

Just upload all your files including `firebase-config.js` with your real Firebase credentials.

⚠️ **Security Note**: Your Firebase config apiKey is safe to expose in client-side code. However, always use Firestore Security Rules to protect your data!

---

## 📊 What Data Is Synced?

✅ **User Authentication** - Login state across all browsers/devices
✅ **User Profile** - Name, email, pronouns, profile picture, banner
✅ **Conference Attendance** - Attending/Attended status for each conference
✅ **Awards** - All awards earned at conferences

---

## 🔐 Security Best Practices

1. **Always use Firestore Security Rules** in production
2. **Don't commit sensitive data** to public repositories
3. **Monitor your Firebase usage** in the console
4. **Set up billing alerts** to avoid unexpected charges
5. **Use Firebase App Check** for additional security (optional)

---

## 💡 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Support](https://firebase.google.com/support)

---

## ✨ Congratulations!

Your SEAMUNs Tracker now supports cross-browser and cross-device login! Users can access their data from any browser or device. 🎉

