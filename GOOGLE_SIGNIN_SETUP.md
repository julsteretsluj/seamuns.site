# Google Sign-In Setup Guide

This guide explains how to enable Google Sign-In for your MUN Tracker application using Firebase Authentication.

## Prerequisites

- Firebase project already set up (see `FIREBASE_SETUP.md`)
- Firebase Authentication enabled
- Access to Firebase Console
- `env.js` created from `env.example.js` with your Firebase credentials

## Step 1: Enable Google Sign-In in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`seamuns-8d050`)
3. Click on **Authentication** in the left sidebar
4. Click on the **Sign-in method** tab
5. Find **Google** in the list of providers
6. Click on **Google** to open the configuration dialog
7. Toggle the **Enable** switch to ON
8. Enter a **Project support email** (your email address)
9. Click **Save**

That's it! Google Sign-In is now enabled for your project.

## Step 2: Test Google Sign-In

1. Open your MUN Tracker website
2. Click the **Login** or **Sign Up** button
3. You should see a "Sign in with Google" button below the email/password form
4. Click the Google button
5. A popup will appear asking you to select a Google account
6. After selecting an account, you'll be signed in automatically

## How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"**
   - The app calls `FirebaseAuth.signInWithGoogle()`
   - Firebase opens a popup window with Google's sign-in page

2. **User selects Google account**
   - Google authenticates the user
   - Google returns user information to Firebase

3. **Firebase processes the sign-in**
   - If it's a new user, a profile is automatically created in Firestore
   - If it's an existing user, they're simply logged in

4. **User is redirected back to the app**
   - The app receives the user's information
   - User is shown as logged in with their Google profile picture and name

### Data Stored

When a user signs in with Google, the following data is stored in Firestore:

```javascript
{
  email: "user@gmail.com",
  name: "John Doe",
  pronouns: "",
  profilePicture: "https://lh3.googleusercontent.com/...",
  banner: "",
  awards: [],
  authProvider: "google",
  createdAt: [timestamp]
}
```

### Security

- Google Sign-In uses OAuth 2.0 for secure authentication
- No passwords are stored in your database
- Users authenticate directly with Google
- Firebase handles all security tokens and session management

## Features

### Automatic Profile Creation

- First-time Google users get a profile automatically created
- Profile includes their Google display name and profile picture
- No additional setup required from the user

### Seamless Integration

- Works alongside email/password authentication
- Users can use either method to sign in
- Same user interface and experience

### Profile Pictures

- Google profile pictures are automatically imported
- Users can change their profile picture later if desired
- High-quality images from Google accounts

## Troubleshooting

### Popup Blocked

If the Google Sign-In popup is blocked by the browser:
- The app will show an error message
- User needs to allow popups for your site
- Try signing in again after enabling popups

### "Sign-in popup was closed"

This happens when the user closes the popup before completing sign-in:
- Simply try again
- Make sure to complete the Google sign-in process

### "Google Sign-In is not available"

This error appears if Firebase is not properly initialized:
- Check that Firebase SDK scripts are loaded
- Verify `firebase-config.js` is included
- Check browser console for Firebase initialization errors

## Fallback to Local Authentication

The app includes fallback support:
- If Firebase is unavailable, email/password still works with local storage
- Users can always sign in with email/password
- Google Sign-In gracefully degrades if Firebase is down

## Additional Configuration (Optional)

### Customize OAuth Scopes

To request additional permissions from Google, edit `firebase-config.js`:

```javascript
async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // Add custom scopes
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    
    // ... rest of the code
}
```

### Force Account Selection

To always show the account picker (even if user has one Google account):

```javascript
provider.setCustomParameters({
    prompt: 'select_account'
});
```

## Testing

### Test with Multiple Accounts

1. Sign in with one Google account
2. Log out
3. Sign in with a different Google account
4. Verify both accounts work correctly

### Test New vs Existing Users

1. Sign in with a new Google account (first time)
   - Verify profile is created
   - Check Firestore for new user document
2. Log out and sign in again with same account
   - Verify existing profile is loaded
   - No duplicate profiles created

### Test Profile Pictures

1. Sign in with Google
2. Go to Profile page
3. Verify Google profile picture is displayed
4. Try uploading a custom profile picture
5. Verify custom picture replaces Google picture

## Support

If you encounter issues:
1. Check Firebase Console for authentication logs
2. Check browser console for error messages
3. Verify Google Sign-In is enabled in Firebase Console
4. Ensure your domain is authorized in Firebase settings

## Next Steps

- Consider adding other sign-in providers (Facebook, Twitter, etc.)
- Implement email verification for email/password sign-ups
- Add password reset functionality
- Set up Firebase Security Rules for Firestore

---

**Note:** Google Sign-In requires HTTPS in production. For local development, `localhost` is automatically allowed.










