// Firebase Configuration
// 
// Secrets are now loaded from an environment file (env.js)
// so that confidential information is not stored in the repo.
// Copy env.example.js to env.js and add your Firebase credentials.

function getEnvValue(keys) {
    const envSource = (typeof window !== 'undefined' && window.__ENV__) || {};
    const nodeEnv = (typeof process !== 'undefined' && process.env) || {};
    for (const key of keys) {
        if (envSource[key]) {
            return envSource[key];
        }
        if (nodeEnv[key]) {
            return nodeEnv[key];
        }
    }
    return '';
}

const firebaseConfig = {
    apiKey: getEnvValue(['FIREBASE_API_KEY', 'VITE_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY']),
    authDomain: getEnvValue(['FIREBASE_AUTH_DOMAIN']),
    projectId: getEnvValue(['FIREBASE_PROJECT_ID']),
    storageBucket: getEnvValue(['FIREBASE_STORAGE_BUCKET']),
    messagingSenderId: getEnvValue(['FIREBASE_MESSAGING_SENDER_ID']),
    appId: getEnvValue(['FIREBASE_APP_ID']),
    measurementId: getEnvValue(['FIREBASE_MEASUREMENT_ID'])
};

// Required for Auth + Firestore; measurementId is optional (Analytics)
const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
function validateFirebaseConfig(config) {
    const missing = REQUIRED_KEYS.filter((key) => !config[key]);
    if (missing.length) {
        console.warn('Firebase config missing (env.js not loaded or empty). Add env.js at your site root with Firebase credentials for login. See README.');
        return false;
    }
    return true;
}

// Initialize Firebase
let auth, db, storage;
try {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK not loaded. Using local storage fallback.');
    } else if (validateFirebaseConfig(firebaseConfig)) {
        const app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        if (typeof firebase.storage === 'function') {
            storage = firebase.storage();
        }
        console.log('✅ Firebase initialized successfully');
        console.log('📦 Project:', firebaseConfig.projectId);
        console.log('🔐 Auth ready:', !!auth);
        console.log('💾 Firestore ready:', !!db);
        if (typeof window !== 'undefined') window.auth = auth;
    }
} catch (error) {
    console.warn('Firebase init failed:', error.message);
}
if (typeof window !== 'undefined' && typeof window.auth === 'undefined') window.auth = null;

// Firebase Authentication Helper Functions
const FirebaseAuth = {
    // Sign up new user with email/password
    async signup(email, password, userData) {
        if (!auth) {
            console.warn('Auth not initialized (env.js missing or Firebase not configured).');
            return { success: false, error: 'Login is not available on this server. You can still browse without an account.' };
        }
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Store additional user data in Firestore
            await db.collection('users').doc(user.uid).set({
                email: email,
                name: userData.name || email.split('@')[0],
                pronouns: userData.pronouns || '',
                profilePicture: userData.profilePicture || user.photoURL || '',
                banner: userData.banner || '',
                awards: [],
                authProvider: 'email',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ User signed up:', user.uid);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Signup error:', error);
            return { success: false, error: error.message };
        }
    },

    // Log in existing user with email/password
    async login(email, password) {
        if (!auth) {
            console.warn('Auth not initialized (env.js missing or Firebase not configured).');
            return { success: false, error: 'Login is not available on this server. You can still browse without an account.' };
        }
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ User logged in:', userCredential.user.uid);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('❌ Login error:', error);
            const code = error.code || '';
            const msg = code === 'auth/user-not-found' ? 'No account found with this email.'
                : code === 'auth/wrong-password' || code === 'auth/invalid-credential' ? 'Incorrect password or email.'
                : code === 'auth/invalid-email' ? 'Please enter a valid email address.'
                : code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
                : error.message || 'Login failed.';
            return { success: false, error: msg };
        }
    },

    // Sign in with Google
    async signInWithGoogle() {
        console.log('🔵 FirebaseAuth.signInWithGoogle() called');
        
        try {
            // Check if Firebase SDK is loaded
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase SDK is not loaded');
                return { success: false, error: 'Firebase SDK is not loaded. Please refresh the page.' };
            }
            
            if (!auth) {
                console.warn('Auth not initialized (env.js missing or Firebase not configured).');
                return { success: false, error: 'Login is not available on this server. You can still browse without an account.' };
            }

            if (!db) {
                console.error('❌ Firestore object is null');
                return { success: false, error: 'Database not initialized' };
            }

            console.log('🔵 Creating GoogleAuthProvider...');
            const provider = new firebase.auth.GoogleAuthProvider();
            
            // Optional: Add scopes if needed
            // provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
            
            console.log('🔵 Opening Google sign-in popup...');
            console.log('💡 If popup is blocked, check browser popup settings');
            
            // Try popup first, with better error handling
            let result;
            try {
                result = await auth.signInWithPopup(provider);
            console.log('✅ Popup sign-in successful');
            } catch (popupError) {
                console.error('❌ Popup sign-in failed:', popupError);
                // Re-throw to be handled by outer catch
                throw popupError;
            }
            
            if (!result || !result.user) {
                throw new Error('Sign-in result is missing user data');
            }
            
            const user = result.user;
            console.log('🔵 User from Google:', {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            });
            
            // Check if this is a new user
            console.log('🔵 Checking if user exists in Firestore...');
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (!userDoc.exists) {
                console.log('🔵 Creating new user profile in Firestore...');
                // Create user profile for new Google sign-in users
                await db.collection('users').doc(user.uid).set({
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    pronouns: '',
                    profilePicture: user.photoURL || '',
                    banner: '',
                    awards: [],
                    authProvider: 'google',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ New Google user profile created:', user.uid);
            } else {
                console.log('✅ Existing Google user logged in:', user.uid);
            }
            
            return { success: true, user, isNewUser: !userDoc.exists };
        } catch (error) {
            console.error('❌ Google sign-in error:', error);
            console.error('❌ Error code:', error.code);
            console.error('❌ Error message:', error.message);
            
            // Handle specific error cases
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, error: 'Sign-in popup was closed. Please try again.' };
            } else if (error.code === 'auth/popup-blocked') {
                return { success: false, error: 'Pop-up was blocked by your browser. Please enable pop-ups and try again.' };
            } else if (error.code === 'auth/cancelled-popup-request') {
                return { success: false, error: 'Sign-in was cancelled.' };
            } else if (error.code === 'auth/unauthorized-domain') {
                return { success: false, error: 'This domain is not authorized for Google Sign-In. In Firebase Console go to Authentication → Settings → Authorized domains and add this site (e.g. localhost or your production domain).' };
            } else if (error.code === 'auth/operation-not-allowed') {
                return { success: false, error: 'Google Sign-In is not enabled. In Firebase Console go to Authentication → Sign-in method and enable Google.' };
            } else if (error.code === 'permission-denied' || (error.message && (error.message.indexOf('insufficient permissions') !== -1 || error.message.indexOf('Missing or insufficient permissions') !== -1))) {
                return { success: false, error: 'Sign-in succeeded but the app could not save your profile. In Firebase Console go to Firestore Database → Rules and add rules that allow users to read/write their own document in the "users" collection. See firestore.rules.example in the repo.' };
            }
            
            return { success: false, error: error.message || 'Unknown error occurred' };
        }
    },

    // Log out current user
    async logout() {
        if (!auth) return { success: true };
        try {
            await auth.signOut();
            console.log('✅ User logged out');
            return { success: true };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },

    // Listen for auth state changes
    onAuthStateChanged(callback) {
        if (!auth) return function () {};
        return auth.onAuthStateChanged(callback);
    }
};

// Firestore Database Helper Functions
const FirebaseDB = {
    // Get user profile data
    async getUserProfile(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return { success: true, data: { id: userId, ...doc.data() } };
            } else {
                return { success: false, error: 'User profile not found' };
            }
        } catch (error) {
            console.error('❌ Get profile error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update user profile data
    async updateUserProfile(userId, data) {
        try {
            await db.collection('users').doc(userId).update(data);
            console.log('✅ Profile updated');
            return { success: true };
        } catch (error) {
            console.error('❌ Update profile error:', error);
            return { success: false, error: error.message };
        }
    },

    // Save conference attendance for user
    async saveAttendance(userId, conferenceId, attendanceStatus) {
        try {
            await db.collection('attendance').doc(`${userId}_${conferenceId}`).set({
                userId,
                conferenceId,
                status: attendanceStatus,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log('✅ Attendance saved');
            return { success: true };
        } catch (error) {
            console.error('❌ Save attendance error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all attendance records for user
    async getUserAttendanceData(userId) {
        try {
            const snapshot = await db.collection('attendance')
                .where('userId', '==', userId)
                .get();
            
            const attendance = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                attendance[data.conferenceId] = data.status;
            });
            
            return { success: true, data: attendance };
        } catch (error) {
            console.error('❌ Get attendance error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get specific conference attendance for user
    async getUserAttendance(userId, conferenceId) {
        try {
            const snapshot = await db.collection('attendance')
                .where('userId', '==', userId)
                .where('conferenceId', '==', conferenceId)
                .get();
            
            if (snapshot.empty) {
                return { success: true, data: null };
            }
            
            const doc = snapshot.docs[0];
            return { success: true, data: doc.data() };
        } catch (error) {
            console.error('❌ Get specific attendance error:', error);
            return { success: false, error: error.message };
        }
    },

    // Save user attendance for specific conference
    async saveUserAttendance(userId, conferenceId, status) {
        try {
            const attendanceData = {
                userId: userId,
                conferenceId: conferenceId,
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('attendance')
                .doc(`${userId}_${conferenceId}`)
                .set(attendanceData, { merge: true });
            
            console.log('✅ Attendance saved to Firebase');
            return { success: true };
        } catch (error) {
            console.error('❌ Save attendance error:', error);
            return { success: false, error: error.message };
        }
    },

    // Add award to user profile
    async addAward(userId, award) {
        try {
            await db.collection('users').doc(userId).update({
                awards: firebase.firestore.FieldValue.arrayUnion(award)
            });
            console.log('✅ Award added');
            return { success: true };
        } catch (error) {
            console.error('❌ Add award error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update award in user profile
    async updateAward(userId, awards) {
        try {
            await db.collection('users').doc(userId).update({
                awards: awards
            });
            console.log('✅ Awards updated');
            return { success: true };
        } catch (error) {
            console.error('❌ Update award error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Archive: shared Firestore collection + Storage so all users see the same uploads
const FirebaseArchive = {
    async getArchiveItems() {
        try {
            if (!db) return { success: false, error: 'Firestore not available', data: [] };
            const snapshot = await db.collection('archive').orderBy('createdAt', 'desc').get();
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return { success: true, data: items };
        } catch (error) {
            console.error('❌ Get archive error:', error);
            return { success: false, error: error.message, data: [] };
        }
    },
    async addArchiveItem(file, metadata) {
        try {
            if (!db) return { success: false, error: 'Firestore not available' };
            if (!storage) return { success: false, error: 'Storage not available. Enable Firebase Storage and add firebase-storage-compat.js to the page.' };
            const docRef = db.collection('archive').doc();
            const id = docRef.id;
            const ext = (file.name.match(/\.[^.]+$/) || [])[0] || '';
            const path = `archive/${id}/${encodeURIComponent(file.name)}`;
            const ref = storage.ref(path);
            await ref.put(file);
            const fileUrl = await ref.getDownloadURL();
            const doc = {
                type: metadata.type,
                title: metadata.title,
                description: metadata.description || '',
                fileName: file.name,
                fileUrl,
                authorName: metadata.authorName || '',
                authorId: metadata.authorId || '',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            await docRef.set(doc);
            return { success: true, id };
        } catch (error) {
            console.error('❌ Add archive error:', error);
            return { success: false, error: error.message };
        }
    }
};
