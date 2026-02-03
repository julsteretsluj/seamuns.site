// MUN Conference Tracker Application
function getConferenceDetailPath() {
    return (typeof window !== 'undefined' && window.location && window.location.pathname.indexOf('pages') !== -1) ? '' : 'pages/';
}
class MUNTracker {
    constructor() {
        this.conferences = [];
        this.currentEditingId = null;
        this.isDarkMode = false;
        this.activeTab = 'all';
        this.currentUser = null;
        this.users = [];
        // Don't call init() here - wait for explicit init() call after DOM is ready
    }

    init() {
        try {
            console.log('MUNTracker.init() started');
            this.loadUsers();
            this.loadTheme();
            console.log('Loading conferences...');
            this.loadConferences();
            console.log('Conferences loaded, count:', this.conferences.length);
            this.bindEvents();
            this.bindDetailsModalEvents();
            this.updateStatistics();
            this.updateLocationFilter();
            this.populateCommitteeFilter();
            console.log('Rendering conferences...');
            this.renderConferences();
            this.checkAuthState();
            // Date/time display is initialized globally via initDateTimeDisplayStandalone()
            console.log('MUNTracker.init() completed');
        } catch (error) {
            console.error('Error in MUNTracker.init():', error);
            console.error('Error stack:', error.stack);
            // Don't throw - allow page to continue loading
        }
    }

    // Theme Management
    loadTheme() {
        // Load dark/light mode
        const savedTheme = localStorage.getItem('munTheme');
        if (savedTheme === 'dark') {
            this.isDarkMode = true;
            document.documentElement.setAttribute('data-theme', 'dark');
            this.updateThemeIcon();
        } else {
            this.isDarkMode = false;
            // Don't remove attribute if it's already set by standalone init
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
            }
            this.updateThemeIcon();
        }
        
        // Load color theme - if no saved color, use default blue-green theme (no data-color attribute)
        const savedColor = localStorage.getItem('munColorTheme');
        if (savedColor) {
            document.documentElement.setAttribute('data-color', savedColor);
            this.updateActiveColorSwatch(savedColor);
        }
        // If no saved color, default blue-green theme from :root will be used
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('munTheme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('munTheme', 'light');
        }
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
        if (this.isDarkMode) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    }

    setColorTheme(color) {
        document.documentElement.setAttribute('data-color', color);
        localStorage.setItem('munColorTheme', color);
        this.updateActiveColorSwatch(color);
    }

    updateActiveColorSwatch(color) {
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach(swatch => {
            if (swatch.getAttribute('data-color') === color) {
                swatch.classList.add('active');
            } else {
                swatch.classList.remove('active');
            }
        });
    }

    // Utility: Country flag from ISO code
    getCountryFlag(countryCode) {
        if (!countryCode || countryCode.length !== 2) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    // Utility: Generate default avatar from name
    getDefaultAvatar(name) {
        if (!name) return 'https://via.placeholder.com/150/4A90E2/ffffff?text=?';
        
        // Get initials (up to 2 characters)
        const initials = name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
        
        // Generate a consistent color based on the name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Convert hash to a nice color (avoiding too dark or too light colors)
        const hue = Math.abs(hash % 360);
        const saturation = 65; // Nice saturation
        const lightness = 50; // Medium lightness for good contrast
        
        const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        const textColor = 'ffffff'; // White text
        
        // Convert HSL to hex for the URL
        const h = hue / 360;
        const s = saturation / 100;
        const l = lightness / 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        if (h < 1/6) {
            r = c; g = x; b = 0;
        } else if (h < 2/6) {
            r = x; g = c; b = 0;
        } else if (h < 3/6) {
            r = 0; g = c; b = x;
        } else if (h < 4/6) {
            r = 0; g = x; b = c;
        } else if (h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return `https://via.placeholder.com/150/${r}${g}${b}/${textColor}?text=${initials}`;
    }

    loadUsers() {
        try {
            const saved = localStorage.getItem('munUsers');
            if (saved) {
                this.users = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading users from localStorage:', error);
            this.users = [];
            try {
                localStorage.removeItem('munUsers');
            } catch (_e) {
                // Ignore removal errors (e.g., storage disabled)
            }
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('munUsers', JSON.stringify(this.users));
        } catch (error) {
            console.error('Error saving users to localStorage:', error);
        }
    }

    async checkAuthState() {
        // Check Firebase auth first if available
        if (typeof FirebaseAuth !== 'undefined' && auth) {
            try {
                const user = auth.currentUser;
                if (user) {
                    const profileResult = await FirebaseDB.getUserProfile(user.uid);
                    if (profileResult.success) {
                        const d = profileResult.data;
                        this.currentUser = {
                            id: user.uid,
                            uid: user.uid,
                            email: user.email,
                            name: d.name || user.displayName || user.email?.split('@')[0],
                            profilePicture: d.profilePicture || user.photoURL || '',
                            pronouns: d.pronouns || '',
                            awards: d.awards || [],
                            bannerType: d.bannerType,
                            bannerPreset: d.bannerPreset,
                            bannerImage: d.bannerImage || d.banner,
                            authProvider: 'firebase'
                        };
                        localStorage.setItem('munCurrentUser', JSON.stringify(this.currentUser));
                        this.showUserMenu();
                        await this.loadUserAttendanceData();
                        this.updateStatistics();
                        this.renderConferences();
                        this.dispatchAuthStateReady();
                        return;
                    }
                }
            } catch (error) {
                console.error('Firebase auth check error:', error);
            }
        }
        
        // Fallback to local storage
        const saved = localStorage.getItem('munCurrentUser');
        if (saved) {
            try {
                this.currentUser = JSON.parse(saved);
                if (this.currentUser && !this.currentUser.id && this.currentUser.uid) {
                    this.currentUser.id = this.currentUser.uid;
                    localStorage.setItem('munCurrentUser', JSON.stringify(this.currentUser));
                }
                this.showUserMenu();
                await this.loadUserAttendanceData();
                this.updateStatistics();
                this.renderConferences();
            } catch (e) {
                console.error('Error loading user from localStorage:', e);
            }
        } else {
            this.showAuthButtons();
        }
        this.dispatchAuthStateReady();
    }

    dispatchAuthStateReady() {
        try {
            window.__munAuthReady = true;
            window.__munCurrentUser = this.currentUser || null;
            window.dispatchEvent(new CustomEvent('munAuthStateReady', { detail: { user: this.currentUser || null } }));
        } catch (e) { /* ignore */ }
    }

    showUserMenu() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        
        const userEmailElement = document.getElementById('userEmail');
        
        // Set user email/name
        if (userEmailElement) {
            const displayName = this.currentUser.name || this.currentUser.email;
            const pronouns = this.currentUser.pronouns;
            userEmailElement.textContent = displayName + pronouns;
        }
        
        // Set profile picture
        const userProfileImg = document.getElementById('userProfileImg');
        if (userProfileImg) {
            if (this.currentUser.profilePicture) {
                userProfileImg.src = this.currentUser.profilePicture;
            } else {
                // Use default avatar based on name
                userProfileImg.src = this.getDefaultAvatar(this.currentUser.name || this.currentUser.email);
            }
        }
    }

    showAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    }

    async login(email, password) {
        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return false;
        }

        // Try Firebase authentication first if available
        if (typeof FirebaseAuth !== 'undefined' && auth) {
            try {
                const result = await FirebaseAuth.login(email, password);
                if (result.success) {
                    // Get user profile from Firestore if available
                    if (typeof FirebaseDB !== 'undefined' && FirebaseDB.getUserProfile) {
                        try {
                            const profileResult = await FirebaseDB.getUserProfile(result.user.uid);
                            if (profileResult.success) {
                                const d = profileResult.data;
                                this.currentUser = {
                                    id: result.user.uid,
                                    uid: result.user.uid,
                                    email: result.user.email,
                                    name: d.name || result.user.displayName || result.user.email.split('@')[0],
                                    profilePicture: d.profilePicture || result.user.photoURL || '',
                                    pronouns: d.pronouns || '',
                                    awards: d.awards || [],
                                    bannerType: d.bannerType,
                                    bannerPreset: d.bannerPreset,
                                    bannerImage: d.bannerImage || d.banner,
                                    authProvider: 'firebase'
                                };
                            } else {
                                this.currentUser = {
                                    id: result.user.uid,
                                    uid: result.user.uid,
                                    email: result.user.email,
                                    name: result.user.displayName || result.user.email.split('@')[0],
                                    profilePicture: result.user.photoURL || '',
                                    pronouns: '',
                                    awards: [],
                                    authProvider: 'firebase'
                                };
                            }
                        } catch (profileError) {
                            console.error('Error getting user profile:', profileError);
                            this.currentUser = {
                                id: result.user.uid,
                                uid: result.user.uid,
                                email: result.user.email,
                                name: result.user.displayName || result.user.email.split('@')[0],
                                profilePicture: result.user.photoURL || '',
                                pronouns: '',
                                awards: [],
                                authProvider: 'firebase'
                            };
                        }
                    } else {
                        this.currentUser = {
                            id: result.user.uid,
                            uid: result.user.uid,
                            email: result.user.email,
                            name: result.user.displayName || result.user.email.split('@')[0],
                            profilePicture: result.user.photoURL || '',
                            pronouns: '',
                            awards: [],
                            authProvider: 'firebase'
                        };
                    }
                    
                    localStorage.setItem('munCurrentUser', JSON.stringify(this.currentUser));
                    this.showUserMenu();
                    // Load user's attendance data
                    await this.loadUserAttendanceData();
                    this.updateStatistics();
                    this.renderConferences();
                    this.closeModal('loginModal');
                    this.showMessage('Login successful!', 'success');
                    this.dispatchAuthStateReady();
                    try { window.dispatchEvent(new Event('userLoggedIn')); } catch (e) {}
                    return true;
                } else {
                    // Firebase login failed: show error, then try local auth as fallback
                    const errorMsg = result.error || 'Login failed';
                    console.error('Firebase login error:', errorMsg);
                    this.showMessage(errorMsg, 'error');
                    // Still try local auth below in case they have a local account
                }
            } catch (error) {
                console.error('Firebase login exception:', error);
                if (error.message && !error.message.includes('auth')) {
                    this.showMessage(error.message || 'Login failed.', 'error');
                }
                // Fall through to local auth
            }
        }
        
        // Fallback to local authentication (when Firebase not configured or user not in Firebase)
        if (!this.users || this.users.length === 0) {
            this.loadUsers(); // Make sure users are loaded
        }
        
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('munCurrentUser', JSON.stringify(user));
            this.showUserMenu();
            // Load user's attendance data
            await this.loadUserAttendanceData();
            this.updateStatistics();
            this.renderConferences();
            this.closeModal('loginModal');
            this.showMessage('Login successful!', 'success');
            this.dispatchAuthStateReady();
            try { window.dispatchEvent(new Event('userLoggedIn')); } catch (e) {}
            return true;
        } else {
            this.showMessage('Invalid email or password', 'error');
            return false;
        }
    }

    async signup(name, email, password) {
        if (!name || !email || !password) {
            this.showMessage('Please fill in all required fields', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return false;
        }

        // Try Firebase authentication first if available
        if (typeof FirebaseAuth !== 'undefined' && auth) {
            try {
                const result = await FirebaseAuth.signup(email, password, { name });
                if (result.success) {
                    this.currentUser = {
                        id: result.user.uid,
                        uid: result.user.uid,
                        email: result.user.email,
                        name: name,
                        profilePicture: result.user.photoURL || '',
                        pronouns: '',
                        awards: [],
                        authProvider: 'firebase'
                    };
                    localStorage.setItem('munCurrentUser', JSON.stringify(this.currentUser));
                    this.showUserMenu();
                    await this.loadUserAttendanceData();
                    this.updateStatistics();
                    this.renderConferences();
                    this.closeModal('signupModal');
                    this.showMessage('Signup successful!', 'success');
                    this.dispatchAuthStateReady();
                    try { window.dispatchEvent(new Event('userLoggedIn')); } catch (e) {}
                    return true;
                } else {
                    // Firebase signup failed, show error and try local auth
                    const errorMsg = result.error || 'Signup failed';
                    console.error('Firebase signup error:', errorMsg);
                    // Don't show error yet, try local auth first
                }
            } catch (error) {
                console.error('Firebase signup exception:', error);
                // Fall through to local auth
            }
        }
        
        // Fallback to local authentication
        if (!this.users || this.users.length === 0) {
            this.loadUsers(); // Make sure users are loaded
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showMessage('Email already registered', 'error');
            return false;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: password,
            conferences: []
        };
        
        this.users.push(newUser);
        this.saveUsers();
        this.currentUser = newUser;
        localStorage.setItem('munCurrentUser', JSON.stringify(newUser));
        this.showUserMenu();
        await this.loadUserAttendanceData();
        this.updateStatistics();
        this.renderConferences();
        this.closeModal('signupModal');
        this.showMessage('Signup successful!', 'success');
        this.dispatchAuthStateReady();
        try { window.dispatchEvent(new Event('userLoggedIn')); } catch (e) {}
        return true;
    }

    async signInWithGoogle() {
        if (typeof FirebaseAuth === 'undefined' || !auth) {
            this.showMessage('Google Sign-In is not available. Please use email/password.', 'error');
            return false;
        }
        
        try {
            const result = await FirebaseAuth.signInWithGoogle();
            if (result.success) {
                // Get or create user profile
                const profileResult = await FirebaseDB.getUserProfile(result.user.uid);
                let userProfile;
                
                if (profileResult.success) {
                    userProfile = profileResult.data;
                } else {
                    // Create new profile
                    const createResult = await FirebaseDB.createUserProfile(result.user.uid, {
                        name: result.user.displayName || result.user.email.split('@')[0],
                        email: result.user.email,
                        profilePicture: result.user.photoURL || ''
                    });
                    if (createResult.success) {
                        userProfile = createResult.data;
                    }
                }
                
                if (userProfile) {
                    this.currentUser = {
                        id: result.user.uid,
                        uid: result.user.uid,
                        email: result.user.email,
                        name: userProfile.name || result.user.displayName || result.user.email.split('@')[0],
                        profilePicture: userProfile.profilePicture || result.user.photoURL || '',
                        pronouns: userProfile.pronouns || '',
                        awards: userProfile.awards || [],
                        bannerType: userProfile.bannerType,
                        bannerPreset: userProfile.bannerPreset,
                        bannerImage: userProfile.bannerImage || userProfile.banner,
                        authProvider: 'google'
                    };
                    localStorage.setItem('munCurrentUser', JSON.stringify(this.currentUser));
                    this.showUserMenu();
                    await this.loadUserAttendanceData();
                    this.updateStatistics();
                    this.renderConferences();
                    
                    // Close any open modals
                    this.closeModal('loginModal');
                    this.closeModal('signupModal');
                    
                    this.showMessage('Signed in with Google successfully!', 'success');
                    this.dispatchAuthStateReady();
                    try { window.dispatchEvent(new Event('userLoggedIn')); } catch (e) {}
                    return true;
                }
            } else {
                this.showMessage(result.error || 'Google Sign-In failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Google Sign-In error:', error);
            this.showMessage('Google Sign-In failed. Please try again.', 'error');
            return false;
        }
        return false;
    }

    async logout() {
        // Logout from Firebase if available
        if (typeof FirebaseAuth !== 'undefined' && auth && this.currentUser?.authProvider === 'firebase') {
            try {
                await FirebaseAuth.logout();
            } catch (error) {
                console.error('Firebase logout error:', error);
            }
        }
        
        this.currentUser = null;
        localStorage.removeItem('munCurrentUser');
        this.showAuthButtons();
        this.updateStatistics();
        this.renderConferences();
        this.showMessage('Logged out successfully', 'success');
    }

    showMessage(message, type) {
        // Try to find or create message element
        let messageEl = document.getElementById('message');
        
        if (!messageEl) {
            // Create message element if it doesn't exist
            messageEl = document.createElement('div');
            messageEl.id = 'message';
            messageEl.style.cssText = `
                position: fixed;
                top: 100px;
                right: 24px;
                z-index: 10000;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(20px);
                font-weight: 500;
                font-size: 14px;
                max-width: 400px;
                animation: slideIn 0.3s ease-out;
            `;
            document.body.appendChild(messageEl);
        }
        
        // Set message content and styling
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        
        // Set colors based on type
        if (type === 'success') {
            messageEl.style.background = 'rgba(104, 211, 145, 0.95)';
            messageEl.style.color = '#1a5d2e';
            messageEl.style.border = '1px solid rgba(104, 211, 145, 0.5)';
        } else if (type === 'error') {
            messageEl.style.background = 'rgba(252, 129, 129, 0.95)';
            messageEl.style.color = '#7a1f1f';
            messageEl.style.border = '1px solid rgba(252, 129, 129, 0.5)';
        } else {
            messageEl.style.background = 'rgba(255, 255, 255, 0.95)';
            messageEl.style.color = 'var(--text-primary)';
            messageEl.style.border = '1px solid var(--border-color)';
        }
        
        messageEl.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }, 3000);
        
        // Also log to console for debugging
        if (type === 'error') {
            console.error('Error:', message);
        } else {
            console.log('Message:', message);
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        this.renderConferences();
    }

    bindEvents() {
        // Theme toggle - only bind if not already bound by standalone init
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle && !themeToggle.hasAttribute('data-theme-handler-attached')) {
            themeToggle.setAttribute('data-theme-handler-attached', 'true');
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.openModal('loginModal');
            });
        }

        // Signup button
        const signupBtn = document.getElementById('signupBtn');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                this.openModal('signupModal');
            });
        }

        // Color swatches
        const colorSwatches = document.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                const color = swatch.getAttribute('data-color');
                if (color) {
                    this.setColorTheme(color);
                }
            });
        });

        // Tab navigation
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.renderConferences());
        }

        // Filters
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', () => this.renderConferences());
        }

        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => this.renderConferences());
        }

        // Committee filter
        const committeeFilter = document.getElementById('committeeFilter');
        const committeeFilterHeader = committeeFilter?.querySelector('.committee-filter-header');
        const committeeFilterDropdown = document.getElementById('committeeFilterDropdown');
        const committeeSearchInput = document.getElementById('committeeSearchInput');
        const selectAllBtn = document.getElementById('selectAllCommittees');
        const clearAllBtn = document.getElementById('clearAllCommittees');

        if (committeeFilterHeader && committeeFilterDropdown) {
            // Toggle dropdown
            committeeFilterHeader.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = committeeFilterDropdown.style.display !== 'none';
                committeeFilterDropdown.style.display = isOpen ? 'none' : 'block';
                const chevron = committeeFilterHeader.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!committeeFilter.contains(e.target)) {
                    committeeFilterDropdown.style.display = 'none';
                    const chevron = committeeFilterHeader.querySelector('.fa-chevron-down');
                    if (chevron) {
                        chevron.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }

        // Committee search
        if (committeeSearchInput) {
            committeeSearchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const labels = document.querySelectorAll('.committee-checkbox-label');
                const categoryHeaders = document.querySelectorAll('.committee-category-header');
                
                // Track which categories have visible items
                const visibleCategories = new Set();
                
                labels.forEach(label => {
                    const text = label.textContent.toLowerCase();
                    const isVisible = text.includes(searchTerm);
                    label.style.display = isVisible ? 'flex' : 'none';
                    
                    // If visible, find its category header
                    if (isVisible) {
                        let prevSibling = label.previousElementSibling;
                        while (prevSibling) {
                            if (prevSibling.classList.contains('committee-category-header')) {
                                visibleCategories.add(prevSibling);
                                break;
                            }
                            prevSibling = prevSibling.previousElementSibling;
                        }
                    }
                });
                
                // Show/hide category headers based on whether they have visible items
                categoryHeaders.forEach(header => {
                    let hasVisibleItems = false;
                    let nextSibling = header.nextElementSibling;
                    while (nextSibling) {
                        if (nextSibling.classList.contains('committee-category-header')) {
                            break; // Reached next category
                        }
                        if (nextSibling.classList.contains('committee-checkbox-label') && 
                            nextSibling.style.display !== 'none') {
                            hasVisibleItems = true;
                            break;
                        }
                        nextSibling = nextSibling.nextElementSibling;
                    }
                    header.style.display = hasVisibleItems || searchTerm === '' ? 'block' : 'none';
                });
            });
        }

        // Select all committees
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('.committee-checkbox');
                checkboxes.forEach(cb => cb.checked = true);
                this.updateCommitteeFilterText();
                this.renderConferences();
            });
        }

        // Clear all committees
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                const checkboxes = document.querySelectorAll('.committee-checkbox');
                checkboxes.forEach(cb => cb.checked = false);
                this.updateCommitteeFilterText();
                this.renderConferences();
            });
        }

        // Committee checkbox change
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('committee-checkbox')) {
                this.updateCommitteeFilterText();
                this.renderConferences();
            }
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                if (emailInput && passwordInput) {
                    await this.login(emailInput.value, passwordInput.value);
                }
            });
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const nameInput = document.getElementById('signupName');
                const emailInput = document.getElementById('signupEmail');
                const passwordInput = document.getElementById('signupPassword');
                if (nameInput && emailInput && passwordInput) {
                    await this.signup(nameInput.value, emailInput.value, passwordInput.value);
                }
            });
        }

        // Google Sign-In button (login modal - ID: googleLoginBtn)
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        if (googleLoginBtn) {
            googleLoginBtn.addEventListener('click', async () => {
                await this.signInWithGoogle();
            });
        }

        // Google Sign-In button (signup modal - ID: googleSignupBtn)
        const googleSignupBtn = document.getElementById('googleSignupBtn');
        if (googleSignupBtn) {
            googleSignupBtn.addEventListener('click', async () => {
                await this.signInWithGoogle();
            });
        }

        // Legacy support for googleSignInBtn (if it exists anywhere)
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', async () => {
                await this.signInWithGoogle();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await this.logout();
            });
        }

        // Modal close buttons - handle all close button IDs
        const closeButtons = {
            'closeLoginModal': 'loginModal',
            'closeSignupModal': 'signupModal',
            'closeProfileModal': 'profileModal',
            'closeDetailsModal': 'detailsModal'
        };
        
        Object.keys(closeButtons).forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                // Remove existing listeners to prevent duplicates
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                newBtn.addEventListener('click', () => {
                    const modalId = closeButtons[btnId];
                    if (modalId === 'detailsModal') {
                        this.closeDetailsModal();
                    } else {
                        this.closeModal(modalId);
                    }
                });
            }
        });
        
        // Cancel buttons
        const cancelLoginBtn = document.getElementById('cancelLoginBtn');
        if (cancelLoginBtn) {
            cancelLoginBtn.addEventListener('click', () => {
                this.closeModal('loginModal');
            });
        }
        
        const cancelSignupBtn = document.getElementById('cancelSignupBtn');
        if (cancelSignupBtn) {
            cancelSignupBtn.addEventListener('click', () => {
                this.closeModal('signupModal');
            });
        }
        
        // Also handle generic .close-btn class
        document.querySelectorAll('.close-btn').forEach(btn => {
            if (!btn.hasAttribute('data-close-handler-attached')) {
                btn.setAttribute('data-close-handler-attached', 'true');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Try to find parent modal
                    const modal = btn.closest('.modal');
                    if (modal) {
                        const modalId = modal.id;
                        if (modalId === 'detailsModal') {
                            this.closeDetailsModal();
                        } else {
                            this.closeModal(modalId);
                        }
                    }
                });
            }
        });

        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            if (!modal.hasAttribute('data-outside-click-handler-attached')) {
                modal.setAttribute('data-outside-click-handler-attached', 'true');
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        const modalId = modal.id;
                        if (modalId === 'detailsModal') {
                            this.closeDetailsModal();
                        } else {
                            this.closeModal(modalId);
                        }
                    }
                });
            }
        });

        // Attendance toggle buttons (using event delegation for dynamically added buttons)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.attendance-toggle')) {
                const btn = e.target.closest('.attendance-toggle');
                const conferenceId = btn.getAttribute('data-id');
                if (conferenceId) {
                    this.toggleAttendance(conferenceId);
                }
            }
        });

        // View Details buttons (using event delegation) - navigate to detail page
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-details-btn')) {
                const btn = e.target.closest('.view-details-btn');
                const card = btn.closest('[data-conference-id]');
                if (card) {
                    const conferenceId = card.getAttribute('data-conference-id');
                    const conference = this.conferences.find(c => c.id === conferenceId);
                    if (conference) {
                        window.location.href = getConferenceDetailPath() + `conference-template.html?id=${conference.id}`;
                    }
                }
            }
        });
    }

    loadConferences() {
        console.log('loadConferences called');
        // Always load sample data first to ensure conferences are available
        this.loadSampleData();
        console.log('Sample data loaded, conferences count:', this.conferences.length);
        
        // Merge attendance from previously saved munConferences BEFORE overwriting (preserve guest/detail-page attendance)
        const saved = localStorage.getItem('munConferences');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    parsed.forEach(savedConf => {
                        const existing = this.conferences.find(c => c.id === savedConf.id);
                        if (existing && savedConf.attendanceStatus) {
                            existing.attendanceStatus = savedConf.attendanceStatus;
                        }
                    });
                }
            } catch (_e) {
                // Ignore corrupt data
            }
        }
        
        // Save to localStorage so conference detail pages and next load have latest data
        this.saveConferences();
        console.log('Conferences saved to localStorage');
    }

    saveConferences() {
        try {
            localStorage.setItem('munConferences', JSON.stringify(this.conferences));
        } catch (error) {
            console.error('Error saving conferences to localStorage:', error);
        }
    }

    loadSampleData() {
        // Use reference data file when available (js/conferences-data.js)
        if (typeof window.MUN_CONFERENCES_DATA !== 'undefined' && Array.isArray(window.MUN_CONFERENCES_DATA) && window.MUN_CONFERENCES_DATA.length > 0) {
            this.conferences = JSON.parse(JSON.stringify(window.MUN_CONFERENCES_DATA));
            this.saveConferences();
            return;
        }
        // Fallback: inline data
        this.conferences = [
            {
                id: 1,
                name: "MUN07 IV",
                organization: "St Andrews International School, Sukhumvit 107",
                location: "Bangkok, Thailand",
                countryCode: "TH",
                startDate: "2026-03-07",
                endDate: "2026-03-07",
                description: "The fourth annual MUN07 conference at St Andrews International School Sukhumvit 107, featuring 10 diverse committees including specialized bodies and regional organizations.",
                website: "https://mun07.org",
                registrationDeadline: "2026-02-07",
                positionPaperDeadline: "2026-02-14",
                status: "upcoming",
                size: "250+ attendees",
                generalEmail: "mun07sta@gmail.com",
                munAccount: "@mun07",
                advisorAccount: "mun07sta@gmail.com",
                secGenAccounts: "PJ (@janekij_) and Poon (@natthawit._)",
                parliamentarianAccounts: "Contact via mun07sta@gmail.com",
                pricePerDelegate: "900 THB",
                independentDelsWelcome: true,
                independentSignupLink: "https://forms.gle/cwyjPqszetrQGaNN8",
                advisorSignupLink: "https://forms.gle/xKSp8oSejzXDE6gV7",
                disabledSuitable: true,
                sensorySuitable: true,
                committees: [
                    "UNHRC - The Question of Human Rights Abuses in Detention Centres and Prisons in The United States | Head Chair: Tamara (@__.t.petrosyan.__), Deputy Chair: Anai (@anai._.ona)",
                    "UNSC - The Question of Preventing Escalation in the Taiwan Strait between Taiwan and China | Head Chair: Flo (@flo.walker.1), Deputy Chair: Agrim (@agrimdaga)",
                    "UNOOSA - The Question of Preventing the Weaponisation of Satellites in Outer Space | Head Chair: Rose (@roslyn.ry), Deputy Chair: Tenzin (@tenzinyangring)",
                    "SPECPOL - The Question of International Oversight in Yemen's Political Transition with an emphasis on the Houthi Terror Organisation | Head Chair: Kirill (@krlse23), Deputy Chair: Hayeon (@hayeonnkk)",
                    "DISEC - The Question of the Use of Drones in Modern Warfare with an emphasis on The Ukraine-Russia War | Head Chair: Vicka (@vicka.w), Deputy Chair: Myesha (@nidhika_s)",
                    "USCC - The Question of the Use of the National Guard as a Domestic Policing Force on US Soil | President: Aimie (@aimiea_), Vice President: Budh (@budhman1234)",
                    "INTERPOL - The Question of Combating Human Trafficking Networks Along Western Europe with an emphasis on Paris | President: Pund (@pundthepond), Vice President: Ryu (@kior.yu)",
                    "ICJ - The Question of the Jorge Glas Dispute in Ecuador v. Mexico | President: Celia (@thatburmesegal), Vice President: Veda (@v3dx_2204)",
                    "ASEAN - The Question of Solving the Conflict Between Thailand and Cambodia | Head Chair: Dominic (@dominic_mll), Deputy Chair: Sanvi (@sanvi_k30)",
                    "Press Corps - The Question of Combatting Fake News and Disinformation Internationally | Editor in Chief: Su Hyun (@vampyrculture or 28suhyun@regents.ac.th), Editor: Lineysha"
                ],
                uniqueTopics: ["Human Rights Abuses", "Taiwan Strait Conflict", "Space Weaponization", "Yemen Political Transition", "Drone Warfare", "National Guard Policing", "Human Trafficking", "Ecuador v. Mexico Dispute", "Thailand-Cambodia Conflict", "Fake News & Disinformation"],
                chairsPages: "<p>Chair applications contact: mun07sta@gmail.com</p>",
                allocations: ["Thailand", "Singapore", "Malaysia", "Vietnam", "Indonesia", "Philippines", "Brunei", "Myanmar", "Cambodia", "Laos"],
                availableAwards: ["Best Delegate", "Outstanding Delegate", "Honorable Mention", "Best Position Paper", "Best Chair"],
                previousWinners: [],
                schedule: "<p><strong>March 7, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at St Andrews International School, Sukhumvit 107 campus. Wheelchair accessible with access ramps available.</p>",
                extraNotes: "<p>Business attire required. 10 specialized committees including UNHRC, UNSC, UNOOSA, SPECPOL, DISEC, USCC, INTERPOL, ICJ, ASEAN, and Press Corps. <strong>Accessibility:</strong> Wheelchair accessible with ramps available. Sensory-friendly with break room available for delegates who need it. Delegate fee: 900 THB. Follow us on Instagram: @mun07 for updates. Secretary Generals: PJ (@janekij_) and Poon (@natthawit._)</p>"
            },
            {
                id: 2,
                name: "STAMUN XI",
                organization: "St Andrews International School, High School Campus",
                location: "Bangkok, Thailand",
                countryCode: "TH",
                startDate: "2025-11-16",
                endDate: "2025-11-16",
                description: "The eleventh annual STAMUN conference at St Andrews International School High School Campus, featuring 5 diverse committees covering global issues from drone warfare to mental health.",
                website: "",
                registrationDeadline: "",
                positionPaperDeadline: "",
                status: "previous",
                size: "130 attendees",
                generalEmail: "",
                munAccount: "@munstandrews",
                advisorAccount: "",
                secGenAccounts: "Sarina Luthra",
                parliamentarianAccounts: "",
                pricePerDelegate: "600 THB",
                independentDelsWelcome: false,
                independentSignupLink: "",
                advisorSignupLink: "",
                disabledSuitable: true,
                sensorySuitable: false,
                committees: [
                    "DISEC - The Question of Regulating the Use of Drone Weaponry in Modern Warfare | Florence (@flo.walker.1), Dipayan (@dipayanbose911)",
                    "WHO - The Question of Strengthening Global Mental Health Infrastructure Post-Pandemic | Meredith (@meredith.x31), Aashirya (@aashirya.2007)",
                    "UNESCO - The Question of the Preservation of Cultural Heritage During Armed Conflicts | Agrim (@agrimdaga), Anishka (@ani.nn27)",
                    "UNEP - The Question of Combating Ocean Plastic Pollution Through International Collaboration | Jazz (@jazz_atitcha), Fehmiya (@fehmiyaa)",
                    "UNHRC - The Question of Safeguarding the rights of refugees in conflict zones | Rosalind (@roslyn.ry), Rosalind (@rosalind.m.p)"
                ],
                uniqueTopics: ["Drone Weaponry Regulation", "Global Mental Health Infrastructure", "Cultural Heritage Preservation", "Ocean Plastic Pollution", "Refugee Rights in Conflict Zones"],
                chairsPages: "",
                allocations: ["United States of America", "United Kingdom", "India", "Thailand", "New Zealand"],
                availableAwards: ["Overall Best Delegate", "Overall Best Chair", "Committee Best Delegate", "Committee Honorable Mention", "Committee Best Position Paper"],
                previousWinners: [],
                schedule: "<p><strong>November 16, 2025:</strong> 8:00 AM - 5:30 PM</p>",
                venueGuide: "<p>Conference held at St Andrews International School, High School Campus. Wheelchair accessible.</p>",
                extraNotes: "<p>Delegate fee: 600 THB. Follow us on Instagram: @munstandrews for updates. Secretary General: Sarina Luthra. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly.</p>"
            },
            {
                id: 3,
                name: "THAIMUN XIII",
                organization: "Brighton College",
                location: "Bangkok, Thailand",
                countryCode: "TH",
                startDate: "2026-03-20",
                endDate: "2026-03-22",
                description: "The thirteenth annual THAIMUN conference at Brighton College, featuring 19 diverse committees covering international security, justice, health, and specialized organizations.",
                website: "",
                registrationDeadline: "November 9, 2026",
                positionPaperDeadline: "",
                status: "upcoming",
                size: "TBD",
                generalEmail: "john.bangkok@hotmail.com",
                munAccount: "@thailandmun",
                advisorAccount: "john.bangkok@hotmail.com",
                secGenAccounts: "John Wood (Founder)",
                parliamentarianAccounts: "Contact via john.bangkok@hotmail.com",
                pricePerDelegate: "3,400 THB",
                independentDelsWelcome: false,
                independentSignupLink: "N/A - Sign-up through school only",
                advisorSignupLink: "Advisors are mandatory - Contact John Wood at john.bangkok@hotmail.com",
                disabledSuitable: true,
                sensorySuitable: false,
                committees: [
                    "WHO (World Health Organization) - Topic 1: The Question of Human Challenge Trials as a Means of Accelerating Vaccine Development | Topic 2: The Question of Addressing the 2025 Cholera Outbreak | Chairs: A, B",
                    "UNHRC (United Nations Human Rights Council) - Topic 1: The Question of Systemic Racism in the Justice System | Topic 2: The Question of Predictive Policing Technologies | Chairs: A, B",
                    "ECOSOC (Economic and Social Committee) - Topic 1: The Question of Addressing the Consequences of the Global Shift Towards Cashless Economies | Topic 2: The Question of Addressing Aid Dependency in Developing States | Chairs: A, B",
                    "UNICEF (United Nations Children's Fund) - Topic 1: The Question of Protecting Children Amidst Conflict and Displacement | Topic 2: The Question of Education Access for Adolescent Girls in Afghanistan | Chairs: A, B",
                    "UNESCO (United Nations Educational, Scientific and Cultural Organization) - Topic 1: The Question of Regulating Cultural Appropriation in Creative Industries | Topic 2: The Question of Regulating Misinformation Amidst the Rise of 'Edutainment' Platforms | Chairs: A, B",
                    "DISEC (Disarmament and International Security Committee) - Topic 1: The Question of Addressing the Militarization of Humanitarian Aid Channels | Topic 2: The Question of Addressing Quantum Computing Arms Race in Military Intelligence | Chairs: A, B",
                    "UNODC (United Nations Office of Drugs and Crime) - Topic 1: The Question of Preventing Money Laundering Amidst the Rise of Cryptocurrency | Topic 2: The Question of Implementing International Regulation of Spyware and Surveillance Technology | Chairs: A, B",
                    "Arab League - Topic 1: The Question of Addressing the Geopolitical Consequences of New Trade Corridors in the Arab League | Topic 2: The Question of Addressing the US Military Presence in the Arab League | Chairs: A, B",
                    "UNSC (United Nations Security Council) - Topic 1: The Question of Addressing the Red Sea Crisis in Yemen | Topic 2: The Question of Addressing the Rise of Terrorist Insurgencies in West Africa | Chairs: A, B",
                    "IOC (International Olympic Committee) - Topic 1: The Question of Addressing the Participation of Transgender Athletes in International Sporting Events | Topic 2: The Question of Preventing the Politicization of the Olympic Games in Times of Global Conflict | Chairs: A, B",
                    "EP (European Parliament Committee) - Topic 1: The Question of Harmonizing Migration and Asylum Policies in the European Union | Topic 2: The Question of Addressing the Future of European Union Enlargement and Relations with Candidate Countries | Chairs: A, B",
                    "Press Corps - Topic 1: The Question of Addressing the Decline of Public Trust in Journalism in the 21st-Century | Chairs: A, B",
                    "UKPC (United Kingdom Parliamentary Committee) - Topic 1: The Question of Repealing the Online Safety Act of 2025 | Topic 2: The Question of Assisted Dying Legislation | Topic 3: The Question of Nationalizing British Railways | Chairs: A, B",
                    "USCC (United States Congress Committee) - Topic 1: The Question of Imposing Tariffs on Foreign States | Topic 2: The Question of Regulating Legal Immigration | Topic 3: The Question of Providing Military Aid to Foreign States | Chairs: A, B",
                    "HSOC (Historical Special Operations Committee) - Topic 1: The Korean War (1950-1953) | Topic 2: The Byzantine Sassanid (602-628 AD) | Chairs: A, B",
                    "HCC (Historical Crisis Committee) - Topic 1: The Wars of the Diadochi (321-275 BC) | Topic 2: The Wars of the Three Kingdoms (220-280 AD) | Topic 3: The First Opium War (1839-1842) | Chairs: A, B",
                    "ICJ (International Court of Justice) - Topic 1: The Land and Maritime Delimitation and Sovereignty over Islands (Gabon v. Equatorial Guinea, 2023, Advisory) | Topic 2: The Jurisdictional Immunities of the State (Germany v. Italy : Greece Intervening, 2012, Contentious) | Topic 3: The Obligation to Negotiate Access to the Pacific Ocean (Bolivia v. Chile, 2018, Contentious) | Chairs: A, B"
                ],
                uniqueTopics: ["Human Challenge Trials", "2025 Cholera Outbreak", "Systemic Racism in Justice", "Predictive Policing", "Cashless Economies", "Aid Dependency", "Children in Conflict", "Education Access in Afghanistan", "Cultural Appropriation", "Edutainment Misinformation", "Militarization of Aid", "Quantum Computing Arms Race", "Cryptocurrency Money Laundering", "Spyware Regulation", "Arab League Trade Corridors", "US Military Presence", "Red Sea Crisis", "Terrorist Insurgencies", "Transgender Athletes", "Olympic Politicization", "EU Migration Policies", "EU Enlargement", "Public Trust in Journalism", "Online Safety Act", "Assisted Dying", "British Railways", "Foreign Tariffs", "Legal Immigration", "Military Aid", "Korean War", "Byzantine Sassanid", "Wars of the Diadochi", "Three Kingdoms", "First Opium War", "Land Maritime Delimitation", "State Immunities", "Pacific Ocean Access"],
                chairsPages: "<p><strong>Chair Applications:</strong> <a href='https://docs.google.com/forms/d/e/1FAIpQLSe42Wuolo3Rfm2VAKqLEADBTC8ShuMn9gxNOONgw3j5hVqYHQ/viewform' target='_blank'>Apply Here</a> (Deadline: November 9, 2026)</p><p><strong>Photographer Applications:</strong> <a href='https://docs.google.com/forms/d/e/1FAIpQLSe9kwVbuqHHyHLtzz7TS2S13sj3F9Tt50I2IUXlO99nKZaA8w/viewform' target='_blank'>Apply Here</a> (Deadline: February 8, 2026)</p>",
                allocations: ["TBD - Contact conference for country assignments"],
                availableAwards: ["Best Delegate", "Outstanding Delegate", "Honorable Mention", "Best Position Paper"],
                previousWinners: [],
                schedule: "<p><strong>March 20-22, 2026:</strong> Three-day conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at Brighton College campus. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly.</p>",
                extraNotes: "<p>Three-day conference featuring 19 committees including traditional UN bodies and specialized organizations. <strong>Registration:</strong> Deadline November 9, 2026. <strong>Independent Delegates:</strong> No - Sign-up through school only. <strong>Advisors:</strong> Advisors are mandatory for all delegations. Contact John Wood at john.bangkok@hotmail.com for advisor registration. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly. Follow us on Instagram: @thailandmun for updates.</p>"
            },
            {
                id: 4,
                name: "TSIMUN 2026",
                organization: "TSI Bearing Primary Campus",
                location: "Bangkok, Thailand",
                countryCode: "TH",
                startDate: "2026-01-31",
                endDate: "2026-01-31",
                description: "TSIMUN 2026 at TSI Bearing Primary Campus, featuring 6 diverse committees covering environmental protection, education, health, human rights, technology, and economic development.",
                website: "",
                registrationDeadline: "",
                positionPaperDeadline: "",
                status: "upcoming",
                size: "150-200 attendees",
                generalEmail: "krishiv.sa.student@tsi.ac.th",
                munAccount: "@tsi.mun",
                advisorAccount: "anishka.na.student@tsi.ac.th",
                secGenAccounts: "Krishiv Savani, Anishka Nag",
                parliamentarianAccounts: "Contact via krishiv.sa.student@tsi.ac.th",
                pricePerDelegate: "600 THB",
                independentDelsWelcome: true,
                independentSignupLink: "",
                advisorSignupLink: "",
                disabledSuitable: false,
                sensorySuitable: false,
                committees: [
                    "UNEP - The Question of Addressing the Impact of Waste on Human Health and the Environment | Chairs: A, B",
                    "ECOSOC - The Question of Promoting Equal Access to Quality Education Worldwide | Chairs: A, B",
                    "WHO - The Question of Combatting Childhood Pneumonia Through Strengthened Health Services | Chairs: A, B",
                    "UNHRC - The Question of the Protection of Human Rights in Active Conflict Zones | Chairs: A, B",
                    "CSTD - The Question of Establishing Ethical Frameworks for the Global Use of Artificial Intelligence | Chairs: A, B",
                    "World Bank - The Question of Ensuring Consumer Protection and Data Privacy in the Expansion of Mobile Banking and Microfinance Services | Chairs: A, B"
                ],
                uniqueTopics: ["Waste Impact on Health", "Equal Access to Education", "Childhood Pneumonia Prevention", "Human Rights in Conflict", "AI Ethics Framework", "Mobile Banking Data Privacy"],
                chairsPages: "<p>Chair applications: <a href='https://docs.google.com/forms/d/e/1FAIpQLSeOKU8_c2gEiqdGmo4snxwNcAIzcXIQ_SyZ3JOLqDjjHExgeQ/viewform' target='_blank'>Apply Here</a></p>",
                allocations: ["TBD - Contact conference for country assignments"],
                availableAwards: ["Best Delegate", "Honorable Mention", "Best Position Paper", "Best Chair"],
                previousWinners: [],
                schedule: "<p><strong>January 31, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at TSI Bearing Primary Campus. <a href='https://maps.app.goo.gl/wP6S1sp1xcHtga3v9?g_st=ipc' target='_blank'>View on Google Maps</a></p>",
                extraNotes: "<p>Delegate fee: 600 THB (Chairs: Free). Follow us on Instagram: @tsi.mun for updates. Secretariat: Krishiv Savani (krishiv.sa.student@tsi.ac.th) & Anishka Nag (anishka.na.student@tsi.ac.th). <strong>Accessibility:</strong> Contact conference for accessibility information.</p>"
            },
            {
                id: 5,
                name: "KMIDSMUN II",
                organization: "King Mongkut's International Demonstration School",
                location: "KMIDS (King Mongkut's International Demonstration School), Bangkok, Thailand",
                countryCode: "TH",
                startDate: "2026-01-24",
                endDate: "2026-01-24",
                description: "The second annual KMIDSMUN conference at King Mongkut's International Demonstration School, featuring diverse committees and welcoming independent delegates.",
                website: "",
                registrationDeadline: "2025-10-25",
                positionPaperDeadline: "",
                status: "previous",
                size: "TBD",
                generalEmail: "rattanapetmattheus@gmail.com",
                munAccount: "@kmidsmun",
                advisorAccount: "rattanapetmattheus@gmail.com",
                secGenAccounts: "Mattheus (rattanapetmattheus@gmail.com) (@sushi_inhaler), Olan (olan.sinsuriya@gmail.com) (@olanbonk)",
                parliamentarianAccounts: "Peach (pidnapak.s@gmail.com) (@papoopi), Unna (sirikorn.kuna@gmail.com) (@unnii.k)",
                pricePerDelegate: "800 THB",
                independentDelsWelcome: true,
                independentSignupLink: "https://forms.gle/vTdnjhx5PhfqkAh59",
                advisorSignupLink: "https://docs.google.com/forms/d/e/1FAIpQLSdxL3s49nq-OjOyfj8QvXQv47SO1dEL1iVoYXsvxWuLl_T-FQ/viewform?fbclid=PAZnRzaANn8_lleHRuA2FlbQIxMQABpwjo4DVYbBSB_JNvacVk0o_xBTRXXGTi_Bme3U652v6O3JzYCepqYQKMxA-I_aem_Nf8AuCkQd1Cld2rNyzNLcA",
                disabledSuitable: true,
                sensorySuitable: true,
                committees: [
                    "WHO - The Question of Global Regulation and Access to Gender-Affirming Surgery | Head chair: Dhanwaras (@erng._), Deputy chair: Karn (@karnmightbephotogenic)",
                    "UNEP - The Question of the Conservation of Biodiversity and the Protection of Endangered Species | Head chair: Veda (@v3dx_2204), Deputy chair: Yama (@yama.leaung)",
                    "UNHRC - The Question of Human Rights Violations Against LGBTQIA+ Individuals | Head chair: Mitra (@luzzysaur), Deputy chair: Mishty (@misht_yy_)",
                    "DISEC - The Question of Preventing the Militarization of the Arctic | Head chair: Rosalind (@rosyln.ry), Deputy chair: Emily (@ememiiile)",
                    "Press Corps - The Question of Ensuring the Safety of Journalists in the Practice of Journalism | Editor in chief: Pakamol (@noeynw_), Deputy editor in chief: Navan (@n4vvs__)",
                    "SPECPOL - The Question of the Global Rise of Religious Nationalism | Head chair: Budh (@budhman1234), Deputy chair: Rawit/Louis (@larrymcchubby)",
                    "ICJ - The Question of Allegations of Genocide Against the Rohingya People | Head chair: Celia (@thatburmesegal), Deputy chair: Maprang (@fishy_mp)"
                ],
                uniqueTopics: [
                    "The Question of Global Regulation and Access to Gender-Affirming Surgery",
                    "The Question of the Conservation of Biodiversity and the Protection of Endangered Species",
                    "The Question of Human Rights Violations Against LGBTQIA+ Individuals",
                    "The Question of Preventing the Militarization of the Arctic",
                    "The Question of Ensuring the Safety of Journalists in the Practice of Journalism",
                    "The Question of the Global Rise of Religious Nationalism",
                    "The Question of Allegations of Genocide Against the Rohingya People"
                ],
                chairsPages: "<p>Chair applications: <a href='https://docs.google.com/forms/d/e/1FAIpQLSdxL3s49nq-OjOyfj8QvXQv47SO1dEL1iVoYXsvxWuLl_T-FQ/viewform?fbclid=PAZnRzaANn8_lleHRuA2FlbQIxMQABpwjo4DVYbBSB_JNvacVk0o_xBTRXXGTi_Bme3U652v6O3JzYCepqYQKMxA-I_aem_Nf8AuCkQd1Cld2rNyzNLcA' target='_blank'>Apply Here</a></p>",
                allocations: ["TBD - Contact conference for country assignments"],
                availableAwards: ["Best Chair", "Honorable Chair", "Best Delegate (per committee)", "Honorable Mention Delegate (per committee)"],
                previousWinners: [],
                schedule: "<p><strong>January 24, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at KMIDS (King Mongkut's International Demonstration School). Wheelchair accessible and sensory-friendly.</p>",
                extraNotes: "<p>KMIDSMUN II - The second annual MUN conference at King Mongkut's International Demonstration School. Delegate fee: 800 THB. Chair fee: Free. Registration deadline: October 25th, 2025. Independent delegates are welcome. <strong>Accessibility:</strong> Wheelchair accessible and sensory-friendly. Follow us on Instagram: @kmidsmun for updates. Secretary General: Mattheus (@sushi_inhaler). Deputy Secretary General: Olan (@olanbonk). Parliamentarians: Peach (@papoopi) and Unna (@unnii.k).</p>"
            },
            {
                id: 6,
                name: "HISMUN VI",
                organization: "Harrow International School Bangkok",
                location: "Harrow International School Bangkok",
                countryCode: "TH",
                startDate: "2026-01-31",
                endDate: "2026-01-31",
                description: "The sixth annual HISMUN conference at Harrow International School Bangkok, featuring 6 diverse committees covering topics from ageing global population to AI regulation in outer space.",
                website: "",
                registrationDeadline: "2025-11-30",
                positionPaperDeadline: "",
                status: "upcoming",
                size: "TBD",
                generalEmail: "",
                munAccount: "@his.mun",
                advisorAccount: "",
                secGenAccounts: "Venice (@vncesque), Noa (@noa.ksit), Tracy (@traacyou)",
                parliamentarianAccounts: "Kwankao (@kwankaochuaphanich), Emery (@ananas_antagonist), Bun (@bun_uthaisang)",
                pricePerDelegate: "800 THB until Nov 30th then 1000 THB",
                independentDelsWelcome: false,
                independentSignupLink: "",
                advisorSignupLink: "",
                disabledSuitable: true,
                sensorySuitable: false,
                committees: [
                    "ECOSOC (Beginner) - The Question of Addressing the Economic and Social Impacts of an Ageing Global Population | Chairs: TBD",
                    "WHO (Beginner) - The Question of Addressing Barriers to Universal Vaccination in the Post-Pandemic Era | Chairs: TBD",
                    "UN WOMEN (Beginner) - The Question of the Welfare and Treatment of Women in Conflict or War Zones | Chairs: TBD",
                    "SPECPOL (Intermediate) - The Question of Addressing the Regulation of Artificial Intelligence in Outer Space to Ensure Peaceful Exploration | Chairs: TBD",
                    "HSC (Intermediate) - The Question of Addressing the Threat of Nuclear Proliferation and the Establishment of a Hotline Between the United States and the Soviet Union | Chairs: TBD",
                    "UNEP (Advanced) - The Question of Addressing Sustainable Solutions for How the International Community can Develop to Combat Water Scarcity in Arid Regions Through Innovation and International Cooperation | Chairs: TBD (This committee will be present unless there are not enough delegates)"
                ],
                uniqueTopics: [
                    "Economic and Social Impacts of Ageing Global Population",
                    "Barriers to Universal Vaccination in Post-Pandemic Era",
                    "Welfare and Treatment of Women in Conflict Zones",
                    "Regulation of Artificial Intelligence in Outer Space",
                    "Nuclear Proliferation and US-Soviet Hotline",
                    "Sustainable Solutions for Water Scarcity in Arid Regions"
                ],
                chairsPages: "",
                allocations: ["TBD - Contact conference for country assignments"],
                availableAwards: [
                    "Best Chairs",
                    "Honourable Mention for Chairs",
                    "Overall Best Delegate",
                    "Best Delegate (per committee)",
                    "Honourable Mention (per committee)",
                    "Best Overall Position Paper"
                ],
                previousWinners: [],
                schedule: "<p><strong>January 31, 2026:</strong> Full Day Conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at Harrow International School Bangkok. Wheelchair accessible.</p>",
                extraNotes: "<p>HISMUN VI conference featuring 6 dynamic committees with varying difficulty levels. Delegate fee: 800 THB until November 30th, then 1000 THB. Chair fee: Free. <strong>Position Papers:</strong> Position papers are mandatory to be eligible for awards. <strong>Accessibility:</strong> Wheelchair accessible. Not sensory-friendly. The UNEP committee will be present unless there are not enough delegates. Follow us on Instagram: @his.mun for updates. Secretary Generals: Venice (@vncesque), Noa (@noa.ksit), Tracy (@traacyou). Parliamentarians: Kwankao (@kwankaochuaphanich), Emery (@ananas_antagonist), Bun (@bun_uthaisang).</p>"
            },
            {
                id: 7,
                name: "Newton MUN I",
                organization: "Newton Sixth Form",
                location: "Newton Sixth Form, Siamscape",
                countryCode: "TH",
                startDate: "2026-02-14",
                endDate: "2026-02-15",
                description: "The inaugural Newton MUN conference at Newton Sixth Form, Siamscape, featuring 5 diverse committees covering security, human rights, health, disarmament, and fantasy scenarios.",
                website: "",
                registrationDeadline: "2025-12-31",
                positionPaperDeadline: "",
                status: "upcoming",
                size: "TBD",
                generalEmail: "",
                munAccount: "@newtonsixthform.mun",
                advisorAccount: "",
                secGenAccounts: "TBD",
                parliamentarianAccounts: "TBD",
                pricePerDelegate: "1500 THB",
                independentDelsWelcome: true,
                independentSignupLink: "",
                advisorSignupLink: "",
                disabledSuitable: true,
                sensorySuitable: true,
                committees: [
                    "UNSC (Security Council) - The Question of Strengthening UN Measures to Address Border Disputes, Cultural Heritage Protection, and Civilian Safety in Post-Colonial Boundaries | Chairs: TBD",
                    "UNHRC (Human Rights Council) - The Question of Human Rights Legislation in Different Countries that Protects Sex Workers from Discrimination and Destigmatization | Chairs: TBD",
                    "WHO (World Health Organization) - The Question of Global Health Standards in Vulnerable and Undeveloped Regions | Chairs: TBD",
                    "DISEC (Disarmament and International Security Committee) - The Question of the Prevention of the Accessibility of Cyber Weapons to Terrorist Groups | Chairs: TBD",
                    "FWC (Fantasy World Committee) - The Question of Animal Deforestation in the Land of Oz while Settling Territory Disputes (The Wonderful Wizard of Oz) | Chairs: TBD"
                ],
                uniqueTopics: [
                    "Border Disputes and Post-Colonial Boundaries",
                    "Cultural Heritage Protection",
                    "Civilian Safety",
                    "Sex Worker Rights and Destigmatization",
                    "Global Health Standards",
                    "Cyber Weapons and Terrorism",
                    "Animal Deforestation in the Land of Oz"
                ],
                chairsPages: "",
                allocations: ["TBD - Contact conference for country assignments"],
                availableAwards: [
                    "Best Delegate (per committee)",
                    "Honorable Delegate (2 per committee)",
                    "Best Position Paper (per committee)",
                    "Best Overall Delegate",
                    "Best Committee",
                    "Honorable Chair",
                    "Best Chair"
                ],
                previousWinners: [],
                schedule: "<p><strong>February 14-15, 2026:</strong> Two-day conference - Opening Ceremony, Committee Sessions, Closing Ceremony</p>",
                venueGuide: "<p>Conference held at Newton Sixth Form, Siamscape. Wheelchair accessible and sensory-friendly.</p>",
                extraNotes: "<p>Newton MUN I - The inaugural MUN conference at Newton Sixth Form, Siamscape. Delegate fee: 1500 THB. Chair fee: Free. Delegate applications open from November 1 to December 31, 2025. <strong>Independent Delegates:</strong> Yes, independent delegates are welcome. <strong>Accessibility:</strong> Wheelchair accessible and sensory-friendly. Follow us on Instagram: @newtonsixthform.mun for updates.</p>"
            }
        ];
        this.saveConferences();
    }

    // Conference Management
    addConference(conferenceData) {
        const ownerId = this.getCurrentUserKey();
        const newConference = {
            id: Date.now(),
            ...conferenceData,
            status: this.getConferenceStatus(conferenceData.startDate),
            attendanceStatus: conferenceData.attendanceStatus || 'not-attending',
            userId: ownerId,
            createdAt: new Date().toISOString()
        };
        this.conferences.push(newConference);
        this.saveConferences();
        this.updateStatistics();
        this.updateLocationFilter();
        this.populateCommitteeFilter();
        this.renderConferences();
    }

    updateConference(id, conferenceData) {
        const index = this.conferences.findIndex(conf => conf.id === id);
        if (index !== -1) {
            this.conferences[index] = {
                ...this.conferences[index],
                ...conferenceData,
                status: this.getConferenceStatus(conferenceData.startDate),
                updatedAt: new Date().toISOString()
            };
            this.saveConferences();
            this.updateStatistics();
            this.updateLocationFilter();
            this.populateCommitteeFilter();
            this.renderConferences();
        }
    }

    async toggleAttendance(id) {
        if (!this.currentUser) {
            this.showMessage('Please log in to manage your attendance', 'error');
            return;
        }

        const conference = this.conferences.find(conf => conf.id === id);
        if (conference) {
            const currentStatus = await this.getUserAttendanceStatus(id);
            let newStatus;
            
            switch (currentStatus) {
                case 'not-attending':
                    newStatus = 'attending';
                    break;
                case 'attending':
                    newStatus = 'attended';
                    break;
                case 'attended':
                    newStatus = 'not-attending';
                    break;
                default:
                    newStatus = 'attending';
            }
            
            // Save to Firebase if available, otherwise save locally (userAttendance_ or munConferences)
            await this.saveUserAttendanceStatus(id, newStatus);
            
            // Update local conference data for immediate UI update
            conference.attendanceStatus = newStatus;
            
            // Persist to munConferences so detail page and next load see it (guests + backup)
            this.saveConferences();
            
            this.updateStatistics();
            this.renderConferences();
            
            // Update the details modal if it's open
            const detailsModal = document.getElementById('detailsModal');
            if (detailsModal && detailsModal.classList.contains('show')) {
                this.openDetailsModal(conference);
            }
            
            this.showMessage(`Marked as ${this.getAttendanceLabel(newStatus)}`, 'success');
        }
    }

    async getUserAttendanceStatus(conferenceId) {
        if (!this.currentUser) return 'not-attending';
        const localUserId = this.getCurrentUserKey();
        
        try {
            // Try Firebase first if available
            if (this.currentUser.authProvider === 'firebase' || this.currentUser.authProvider === 'google') {
                if (typeof FirebaseDB !== 'undefined') {
                    const result = await FirebaseDB.getUserAttendance(this.currentUser.uid, conferenceId);
                    if (result.success && result.data) {
                        return result.data.status || 'not-attending';
                    }
                }
            }
            
            // Fall back to localStorage
            if (!localUserId) return 'not-attending';
            const userAttendance = JSON.parse(localStorage.getItem(`userAttendance_${localUserId}`) || '{}');
            return userAttendance[conferenceId] || 'not-attending';
        } catch (error) {
            console.error('Error getting attendance status:', error);
            return 'not-attending';
        }
    }

    async saveUserAttendanceStatus(conferenceId, status) {
        if (!this.currentUser) return;
        const localUserId = this.getCurrentUserKey();
        if (!localUserId) return;
        
        try {
            // Try Firebase first if available
            if (this.currentUser.authProvider === 'firebase' || this.currentUser.authProvider === 'google') {
                if (typeof FirebaseDB !== 'undefined') {
                    const result = await FirebaseDB.saveUserAttendance(this.currentUser.uid, conferenceId, status);
                    if (result.success) {
                        console.log('Attendance saved to Firebase successfully');
                        return;
                    }
                }
            }
            
            // Fall back to localStorage
            const userAttendance = JSON.parse(localStorage.getItem(`userAttendance_${localUserId}`) || '{}');
            userAttendance[conferenceId] = status;
            localStorage.setItem(`userAttendance_${localUserId}`, JSON.stringify(userAttendance));
            console.log('Attendance saved to localStorage');
        } catch (error) {
            console.error('Error saving attendance status:', error);
            // Fall back to localStorage on error
            const userAttendance = JSON.parse(localStorage.getItem(`userAttendance_${localUserId}`) || '{}');
            userAttendance[conferenceId] = status;
            localStorage.setItem(`userAttendance_${localUserId}`, JSON.stringify(userAttendance));
        }
    }

    async loadUserAttendanceData() {
        if (!this.currentUser) return;
        const localUserId = this.getCurrentUserKey();
        
        try {
            // Try Firebase first if available
            if (this.currentUser.authProvider === 'firebase' || this.currentUser.authProvider === 'google') {
                if (typeof FirebaseDB !== 'undefined') {
                    const result = await FirebaseDB.getUserAttendanceData(this.currentUser.uid);
                    if (result.success && result.data) {
                        // Update local conference data with user's attendance
                        this.conferences.forEach(conference => {
                            const userStatus = result.data[conference.id];
                            if (userStatus) {
                                conference.attendanceStatus = userStatus;
                            }
                        });
                        this.saveConferences(); // so profile page and detail page see user attendance
                        console.log('User attendance loaded from Firebase');
                        return;
                    }
                }
            }
            
            // Fall back to localStorage
            if (localUserId) {
                const userAttendance = JSON.parse(localStorage.getItem(`userAttendance_${localUserId}`) || '{}');
                this.conferences.forEach(conference => {
                    const userStatus = userAttendance[conference.id];
                    if (userStatus) {
                        conference.attendanceStatus = userStatus;
                    }
                });
                this.saveConferences(); // so profile page and detail page see user attendance
                console.log('User attendance loaded from localStorage');
            }
        } catch (error) {
            console.error('Error loading attendance data:', error);
        }
    }

    deleteConference(id) {
        if (confirm('Are you sure you want to delete this conference?')) {
            this.conferences = this.conferences.filter(conf => conf.id !== id);
            this.saveConferences();
            this.updateStatistics();
            this.updateLocationFilter();
            this.populateCommitteeFilter();
            this.renderConferences();
            this.closeDetailsModal();
        }
    }

    getConferenceStatus(startDate) {
        const today = new Date();
        const conferenceDate = new Date(startDate);
        return conferenceDate >= today ? 'upcoming' : 'previous';
    }

    getCurrentUserKey() {
        if (!this.currentUser) return null;
        return this.currentUser.id || this.currentUser.uid || this.currentUser.email || null;
    }

    getAttendanceLabel(status) {
        switch (status) {
            case 'attending':
                return 'Attending';
            case 'attended':
                return 'Attended';
            case 'not-attending':
            default:
                return 'Not Attending';
        }
    }

    getAttendanceIcon(status) {
        switch (status) {
            case 'attending':
                return 'fa-user-check';
            case 'attended':
                return 'fa-trophy';
            case 'not-attending':
            default:
                return 'fa-calendar-plus';
        }
    }

    getStatusLabel(status) {
        switch (status) {
            case 'upcoming':
                return 'UPCOMING';
            case 'previous':
                return 'PREVIOUS';
            default:
                return status ? status.toUpperCase() : 'UPCOMING';
        }
    }

    getAttendanceToggleText(status) {
        switch (status) {
            case 'not-attending':
                return 'Mark as Attending';
            case 'attending':
                return 'Mark as Attended';
            case 'attended':
                return 'Mark as Not Attending';
            default:
                return 'Mark as Attending';
        }
    }

    // UI Management
    openModal(modalId, conference = null) {
        const modal = document.getElementById(modalId);
        const form = document.getElementById(modalId.replace('Modal', 'Form'));
        const title = modal.querySelector('h2');

        if (modalId === 'conferenceModal') {
            // Feature disabled; ignore open
            return;
        }

        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        modal.style.display = 'none';
        
        if (modalId === 'loginModal') {
            const loginForm = document.getElementById('loginForm');
            if (loginForm) loginForm.reset();
        } else if (modalId === 'signupModal') {
            const signupForm = document.getElementById('signupForm');
            if (signupForm) signupForm.reset();
        }
    }

    openDetailsModal(conference) {
        const modal = document.getElementById('detailsModal');
        const title = document.getElementById('detailsTitle');
        const details = document.getElementById('conferenceDetails');

        if (!modal || !title || !details) {
            console.error('Details modal elements not found');
            return;
        }

        this.currentDetailsConference = conference;
        title.textContent = conference.name;
        details.innerHTML = this.renderConferenceDetails(conference);

        // Update attendance toggle button text and re-attach handlers
        const toggleBtn = document.getElementById('toggleAttendanceBtn');
        const toggleText = document.getElementById('attendanceToggleText');
        if (toggleBtn && toggleText) {
            toggleText.textContent = this.getAttendanceToggleText(conference.attendanceStatus || 'not-attending');
            
            // Remove existing listeners and re-attach to ensure it works
            const newToggleBtn = toggleBtn.cloneNode(true);
            toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
            newToggleBtn.addEventListener('click', () => {
                if (this.currentDetailsConference) {
                    this.toggleAttendance(this.currentDetailsConference.id);
                }
            });
        }

        // Show/hide login prompt based on auth state
        const loginPrompt = document.getElementById('loginPrompt');
        if (loginPrompt) {
            loginPrompt.style.display = this.currentUser ? 'none' : 'block';
        }
        if (toggleBtn) {
            toggleBtn.style.display = this.currentUser ? 'block' : 'none';
        }

        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    closeDetailsModal() {
        const modal = document.getElementById('detailsModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    // populateForm removed (feature disabled)

    // saveConference removed (feature disabled)

    // editConference removed (feature disabled)

    deleteCurrentConference() {
        const conferenceId = this.getCurrentConferenceId();
        this.deleteConference(conferenceId);
    }

    getCurrentConferenceId() {
        const detailsTitleEl = document.getElementById('detailsTitle');
        if (!detailsTitleEl) return null;
        
        const detailsTitle = detailsTitleEl.textContent;
        const conference = this.conferences.find(conf => conf.name === detailsTitle);
        return conference ? conference.id : null;
    }

    // Rendering
    renderConferenceDetails(conference) {
        const startDate = new Date(conference.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const endDate = new Date(conference.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const registrationDeadline = conference.registrationDeadline ? 
            new Date(conference.registrationDeadline).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Not specified';

        return `
            <div class="conference-details">
                <div class="detail-item">
                    <h4>Organization</h4>
                    <p>${conference.organization}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Location</h4>
                    <p>${conference.location}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Conference Dates</h4>
                    <p>${startDate} - ${endDate}</p>
                </div>
                
                <div class="detail-item">
                    <h4>Registration Deadline</h4>
                    <p>${registrationDeadline}</p>
                </div>
                
                ${conference.description ? `
                    <div class="detail-item">
                        <h4>Description</h4>
                        <p>${conference.description}</p>
                    </div>
                ` : ''}
                
                ${conference.website ? `
                    <div class="detail-item">
                        <h4>Website</h4>
                        <p><a href="${conference.website}" target="_blank">${conference.website}</a></p>
                    </div>
                ` : ''}
                
                <div class="detail-item">
                    <h4>Status</h4>
                    <p><span class="conference-status ${conference.status}">${conference.status}</span></p>
                </div>
                
                <div class="detail-item">
                    <h4>Attendance</h4>
                    <p><span class="attendance-status ${conference.attendanceStatus || 'not-attending'}">${this.getAttendanceLabel(conference.attendanceStatus || 'not-attending')}</span></p>
                </div>
                
                ${conference.pricePerDelegate ? `
                    <div class="detail-item">
                        <h4>Delegate Fee</h4>
                        <p>${conference.pricePerDelegate}</p>
                    </div>
                ` : ''}
                
                ${conference.munAccount ? `
                    <div class="detail-item">
                        <h4>Instagram</h4>
                        <p>${conference.munAccount}</p>
                    </div>
                ` : ''}
                
                ${conference.secGenAccounts ? `
                    <div class="detail-item">
                        <h4>Secretary General(s)</h4>
                        <p>${conference.secGenAccounts}</p>
                    </div>
                ` : ''}
                
                ${conference.parliamentarianAccounts ? `
                    <div class="detail-item">
                        <h4>Parliamentarian(s)</h4>
                        <p>${conference.parliamentarianAccounts}</p>
                    </div>
                ` : ''}
                
                ${conference.availableAwards && conference.availableAwards.length > 0 ? `
                    <div class="detail-item">
                        <h4>Available Awards</h4>
                        <ul style="margin: 8px 0; padding-left: 20px;">
                            ${conference.availableAwards.map(award => `<li>${award}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
            ${conference.committees && conference.committees.length > 0 ? `
                <div class="detail-item">
                    <h4>Committees</h4>
                    <div class="committees-list">
                        ${conference.committees.map(committee => {
                            let committeeName, committeeTopic, chairInfo;
                            
                            // Handle both object format (from database) and string format (legacy)
                            if (typeof committee === 'object' && committee !== null) {
                                committeeName = committee.committee_name || committee.name || '';
                                committeeTopic = committee.topic || '';
                                chairInfo = committee.chairs_info || committee.chair_info || committee.chairInfo || '';
                            } else {
                                // Legacy string format
                                const parts = committee.split(' - ');
                                committeeName = parts[0];
                                committeeTopic = parts.slice(1).join(' - ');
                                chairInfo = '';
                            }
                            
                            return `
                                <div class="committee-card">
                                    <div class="committee-header">
                                        <h5>${committeeName}</h5>
                                    </div>
                                    <div class="topics-section">
                                        ${committeeTopic ? `<h6>Topic</h6><p>${committeeTopic}</p>` : '<h6>Details</h6><p>Information coming soon</p>'}
                                        ${chairInfo ? `
                                            <div style="margin-top: 8px;">
                                                <p style="color: var(--accent-green); margin-bottom: 4px;"><strong><i class="fas fa-user-tie"></i> Chairs:</strong> ${chairInfo}</p>
                                                ${this.formatChairInfoWithCopyButtonsForScript(chairInfo)}
                                            </div>
                                        ` : '<p style="margin-top: 8px; color: var(--text-tertiary);"><strong><i class="fas fa-user-tie"></i> Chairs:</strong> TBD</p>'}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Filtering and Search
    getFilteredConferences() {
        const searchInput = document.getElementById('searchInput');
        const statusFilterEl = document.getElementById('statusFilter');
        const locationFilterEl = document.getElementById('locationFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusFilter = statusFilterEl ? statusFilterEl.value : 'all';
        const locationFilter = locationFilterEl ? locationFilterEl.value : 'all';

        // All users can see all conferences (do not filter by user)
        return this.conferences.filter(conference => {
            const matchesSearch = !searchTerm || 
                conference.name.toLowerCase().includes(searchTerm) ||
                conference.organization.toLowerCase().includes(searchTerm) ||
                conference.location.toLowerCase().includes(searchTerm) ||
                (conference.description && conference.description.toLowerCase().includes(searchTerm));

            // Use active tab for filtering if status filter is set to 'all'
            let matchesStatus;
            if (statusFilter === 'all') {
                if (this.activeTab === 'attending') {
                    matchesStatus = conference.attendanceStatus === 'attending';
                } else if (this.activeTab === 'attended') {
                    matchesStatus = conference.attendanceStatus === 'attended';
                } else {
                    matchesStatus = this.activeTab === 'all' || conference.status === this.activeTab;
                }
            } else {
                matchesStatus = conference.status === statusFilter;
            }
            
            const matchesLocation = locationFilter === 'all' || conference.location === locationFilter;

            return matchesSearch && matchesStatus && matchesLocation;
        });
    }

    filterConferences() {
        this.renderConferences();
    }

    // Statistics
    updateStatistics() {
        // Show stats for all conferences (do not filter by user)
        const upcoming = this.conferences.filter(conf => conf.status === 'upcoming').length;
        const previous = this.conferences.filter(conf => conf.status === 'previous').length;
        const attending = this.conferences.filter(conf => conf.attendanceStatus === 'attending').length;
        const attended = this.conferences.filter(conf => conf.attendanceStatus === 'attended').length;
        const total = this.conferences.length;

        // Update main statistics (only if elements exist)
        const upcomingCountEl = document.getElementById('upcomingCount');
        const previousCountEl = document.getElementById('previousCount');
        const totalCountEl = document.getElementById('totalCount');
        
        if (upcomingCountEl) upcomingCountEl.textContent = upcoming;
        if (previousCountEl) previousCountEl.textContent = previous;
        if (totalCountEl) totalCountEl.textContent = total;
        
        // Update tab counts (only if elements exist)
        const allCountEl = document.getElementById('allCount');
        const upcomingTabCountEl = document.getElementById('upcomingTabCount');
        const previousTabCountEl = document.getElementById('previousTabCount');
        const attendingTabCountEl = document.getElementById('attendingTabCount');
        const attendedTabCountEl = document.getElementById('attendedTabCount');
        
        if (allCountEl) allCountEl.textContent = total;
        if (upcomingTabCountEl) upcomingTabCountEl.textContent = upcoming;
        if (previousTabCountEl) previousTabCountEl.textContent = previous;
        if (attendingTabCountEl) attendingTabCountEl.textContent = attending;
        if (attendedTabCountEl) attendedTabCountEl.textContent = attended;
    }

    updateLocationFilter() {
        const locationFilter = document.getElementById('locationFilter');
        if (!locationFilter) return; // Exit if not on the main page
        
        const locations = [...new Set(this.conferences.map(conf => conf.location))].sort();
        
        // Keep the first option (All Locations)
        const currentValue = locationFilter.value;
        locationFilter.innerHTML = '<option value="all">All Locations</option>';
        
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }

    // Extract unique committee names from all conferences
    getAllCommittees() {
        // Static list of committees organized by category
        const committeesByCategory = {
            'Regional': [
                'AL – Arab League',
                'ASEAN – Association of Southeastern Asian Nations',
                'AU – African Union',
                'EP – European Parliament',
                'NATO – North Atlantic Treaty Organization',
                'US Senate – Unites States Senate'
            ],
            'Crime & Weapons': [
                'CCPCJ – Commission on Crime Prevention and Criminal Justice',
                'CND – United Nations Commission on Narcotic Drugs',
                'DISEC – Disarmament and International Security Committee (UNGA 1st Committee)',
                'GA6 – Legal (UNGA 6th Committee)',
                'HSC – Historical Security Council',
                'ICC – International Criminal Court',
                'ICJ – International Court of Justice',
                'Interpol – International Criminal Police Organization',
                'UNODC – United Nations Office of Drugs and Crime'
            ],
            'Environment': [
                'CERN – European Organization for Nuclear Research',
                'FAO – Food and Agriculture Organization',
                'IAEA – International Atomic Energy Agency',
                'ICAO – International Civil Aviation Organisation',
                'IMO – International Maritime Organisation',
                'UNEP – United Nations Environmental Program',
                'UNESCO – UN Educational, Scientific, and Cultural Organization',
                'UNISDR – United Nations Office for Disaster Risk Reduction',
                'UNOOSA – United Nations Office for Outer Space Affairs',
                'UNWTO – World Tourism Organization',
                'WMO – World Meteorological Organization'
            ],
            'People': [
                'CPD – Commission on Population and Development',
                'DGC – United Nations Department of Global Communications (Formerly DPI)',
                'HRC / UNHRC – Human Rights Council',
                'ICRC – International Committee of the Red Cross',
                'ILO – International Labour Organization',
                'PBC – Peacebuilding Commission',
                'SCSHT – Special Conference on Slavery and Human Trafficking',
                'SOCHUM – Social, Cultural, and Humanitarian Committee (UNGA 3rd Committee)',
                'SPECPOL – Special Political and Decolonization (UNGA 4th Committee)',
                'UNHCR – UN High Commissioner for Refugees',
                'UNICEF – United Nations Children\'s Fund',
                'UNPFII – UN Permanent Forum on Indigenous Issues',
                'UN Women – United Nations Entity for Gender Equality and the Empowerment of Women',
                'WFP – World Food Program',
                'WHO – World Health Organization',
                'WIPO – World Intellectual Property Organization'
            ],
            'Economics': [
                'ECOFIN – Economic and Financial Committee (UNGA 2nd Committee)',
                'ECOSOC – Economic and Social Council',
                'ICC – International Chamber of Commerce',
                'IMF – International Monetary Fund',
                'UNCTAD – United Nations Conference on Trade and Development',
                'WB – World Bank',
                'WTO – World Trade Organization'
            ],
            'Technology': [
                'CSTD – Commission on Science and Technology for Development',
                'SC / UNSC – Security Council',
                'UNIDO – UN Industrial Development Organization'
            ],
            'Other': [
                'CoM – Council of Marvels (Fictional committee)',
                'FIFA – Fédération Internationale de Football Association',
                'IOPC – International Olympic and Paralympic Committee',
                'PC – Press Corps',
                'UNCSA – Commission on Superhuman Activities (Fictional committee)'
            ]
        };
        
        // Flatten into a single array for the filter
        const allCommittees = [];
        Object.keys(committeesByCategory).forEach(category => {
            committeesByCategory[category].forEach(committee => {
                allCommittees.push({
                    name: committee,
                    category: category
                });
            });
        });
        
        return { committees: allCommittees, byCategory: committeesByCategory };
    }

    // Populate committee filter dropdown
    populateCommitteeFilter() {
        const checkboxesContainer = document.getElementById('committeeCheckboxes');
        if (!checkboxesContainer) return;

        const committeeData = this.getAllCommittees();
        checkboxesContainer.innerHTML = '';

        // Group committees by category
        Object.keys(committeeData.byCategory).forEach(category => {
            // Create category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'committee-category-header';
            categoryHeader.textContent = category;
            checkboxesContainer.appendChild(categoryHeader);

            // Add committees in this category
            committeeData.byCategory[category].forEach(committee => {
                const label = document.createElement('label');
                label.className = 'committee-checkbox-label';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = committee;
                checkbox.className = 'committee-checkbox';
                // Create a safe ID from the committee name
                const safeId = committee.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
                checkbox.id = `committee-${safeId}`;
                
                const span = document.createElement('span');
                span.textContent = committee;
                
                label.appendChild(checkbox);
                label.appendChild(span);
                checkboxesContainer.appendChild(label);
            });
        });
    }

    // Get selected committees
    getSelectedCommittees() {
        const checkboxes = document.querySelectorAll('.committee-checkbox:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }

    // Update committee filter display text
    updateCommitteeFilterText() {
        const filterText = document.querySelector('.committee-filter-text');
        const selected = this.getSelectedCommittees();
        
        if (!filterText) return;
        
        if (selected.length === 0) {
            filterText.textContent = 'Select committees...';
        } else if (selected.length === 1) {
            filterText.textContent = selected[0];
        } else {
            filterText.textContent = `${selected.length} committees selected`;
        }
    }

    // Rendering
    renderConferences() {
        console.log('renderConferences called');
        console.log('Total conferences:', this.conferences.length);
        console.log('Conferences data:', this.conferences);
        
        const container = document.getElementById('conferencesList');
        if (!container) {
            // Expected on conference detail page; only log on pages that should have the list
            if (!document.getElementById('conferenceName') || !document.getElementById('location')) {
                console.warn('Container #conferencesList not found.');
            }
            setTimeout(() => {
                const retryContainer = document.getElementById('conferencesList');
                if (retryContainer) {
                    this.renderConferences();
                }
            }, 100);
            return;
        }
        
        // Ensure conferences are loaded
        if (this.conferences.length === 0) {
            console.warn('No conferences loaded, loading sample data...');
            this.loadConferences();
            // After loading, re-render
            if (this.conferences.length > 0) {
                console.log('Conferences loaded, re-rendering...');
                // Continue with rendering below
            } else {
                console.error('Failed to load conferences!');
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-calendar-times"></i>
                        <h3>No conferences found</h3>
                        <p>Unable to load conference data. Please refresh the page.</p>
                    </div>
                `;
                return;
            }
        }

        const conferences = this.getFilteredAndSortedConferences();
        console.log('Filtered conferences:', conferences.length);

        if (conferences.length === 0) {
            console.log('No conferences to display');
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No conferences found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            `;
            return;
        }

        console.log('Rendering', conferences.length, 'conference cards');
        const html = conferences.map(conf => this.renderConferenceCard(conf)).join('');
        console.log('Generated HTML length:', html.length);
        console.log('Generated HTML:', html.substring(0, 500)); // First 500 chars
        container.innerHTML = html;
        console.log('HTML inserted into container');
        console.log('Container now has', container.children.length, 'child elements');
        
        // Attach click handlers to conference cards
        this.attachConferenceCardHandlers();
    }
    
    attachConferenceCardHandlers() {
        const cards = document.querySelectorAll('.conference-card');
        cards.forEach(card => {
            // Get conference ID from data attribute
            const conferenceId = parseInt(card.getAttribute('data-conference-id'));
            if (!conferenceId) return;
            
            // Find the conference
            const conference = this.conferences.find(c => c.id === conferenceId);
            if (!conference) return;
            
            // Add click handler to the entire card to navigate to detail page
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on a link or button (they have their own handlers)
                if (e.target.closest('a') || e.target.closest('button')) {
                    return;
                }
                // Navigate to detail page
                window.location.href = getConferenceDetailPath() + `conference-template.html?id=${conference.id}`;
            });
        });
    }

    // Find which selected committees match a conference
    getMatchingCommittees(conference) {
        const selectedCommittees = this.getSelectedCommittees();
        if (selectedCommittees.length === 0) return [];
        
        const matchingCommittees = [];
        
        if (conference.committees && Array.isArray(conference.committees)) {
            selectedCommittees.forEach(selectedCommittee => {
                // Extract key identifiers from the selected committee name
                const selectedParts = selectedCommittee
                    .split(/[–—]/)[0] // Get part before em dash
                    .split('/') // Split on slash
                    .map(part => part.trim())
                    .filter(part => part.length > 0);
                
                // Check if any part of the selected committee matches any conference committee
                for (const committee of conference.committees) {
                    let foundMatch = false;
                    for (const part of selectedParts) {
                        // Extract acronym/abbreviation (usually at the start)
                        const acronym = part.match(/^([A-Z0-9]+)/)?.[1];
                        if (acronym) {
                            // Try exact acronym match first
                            const acronymRegex = new RegExp(`\\b${acronym.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                            if (acronymRegex.test(committee)) {
                                foundMatch = true;
                                break;
                            }
                        }
                        // Also try matching the full part
                        const partRegex = new RegExp(part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
                        if (partRegex.test(committee)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    if (foundMatch) {
                        matchingCommittees.push(selectedCommittee);
                        break; // Found a match, no need to check other conference committees for this selected committee
                    }
                }
            });
        }
        
        return matchingCommittees;
    }

    renderConferenceCard(conference) {
        console.log('Rendering card for:', conference.name);
        try {
            const startDate = new Date(conference.startDate).toLocaleDateString();
            const endDate = new Date(conference.endDate).toLocaleDateString();
            const registrationDeadline = conference.registrationDeadline ? 
                new Date(conference.registrationDeadline).toLocaleDateString() : 'Not specified';

            const cardClasses = `conference-card ${conference.status} ${conference.attendanceStatus || 'not-attending'}`;
            const flag = this.getCountryFlag(conference.countryCode);
            
            // Get matching committees if filter is active
            const matchingCommittees = this.getMatchingCommittees(conference);
            const matchingCommitteesHTML = matchingCommittees.length > 0 ? `
                <div class="matching-committees-badge" style="margin-top: 12px; padding: 10px 14px; background: rgba(30, 136, 229, 0.1); border-left: 3px solid var(--accent-color); border-radius: 6px;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; color: var(--accent-color); font-weight: 600; font-size: 13px;">
                        <i class="fas fa-filter"></i>
                        <span>Includes Selected Committee${matchingCommittees.length > 1 ? 's' : ''}:</span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${matchingCommittees.map(committee => {
                            // Extract short name (acronym) for display
                            const shortName = committee.split(/[–—]/)[0].trim().split('/')[0].trim();
                            return `<span style="display: inline-block; padding: 4px 10px; background: var(--accent-color); color: white; border-radius: 4px; font-size: 12px; font-weight: 500;">${shortName}</span>`;
                        }).join('')}
                    </div>
                </div>
            ` : '';
            
            console.log('Card data prepared, generating HTML...');

        return `
            <div class="${cardClasses}" data-conference-id="${conference.id}">
                <div class="conference-header">
                    <div>
                        <h3 class="conference-title">${conference.name}</h3>
                    </div>
                    <div class="status-badges">
                        <span class="conference-status ${conference.status}">${this.getStatusLabel(conference.status)}</span>
                        <span class="attendance-status ${conference.attendanceStatus || 'not-attending'}"><i class="fas ${this.getAttendanceIcon(conference.attendanceStatus || 'not-attending')}" aria-hidden="true"></i> ${this.getAttendanceLabel(conference.attendanceStatus || 'not-attending')}</span>
                    </div>
                </div>
                
                <div class="conference-info">
                    <div class="conference-info-item">
                        <i class="fas fa-university"></i>
                        <span>${conference.organization}</span>
                    </div>
                    <div class="conference-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${flag} ${conference.location}</span>
                    </div>
                    <div class="conference-info-item">
                        <i class="fas fa-calendar"></i>
                        <span>${startDate} - ${endDate}</span>
                    </div>
                    <div class="conference-info-item">
                        <i class="fas fa-clock"></i>
                        <span>Registration: ${registrationDeadline}</span>
                    </div>
                </div>
                
                ${conference.description ? `
                    <div class="conference-description">
                        ${conference.description}
                    </div>
                ` : ''}
                
                ${matchingCommitteesHTML}
                
                <div class="conference-actions">
                    <a href="${getConferenceDetailPath()}conference-template.html?id=${conference.id}" class="btn btn-primary">
                        <i class="fas fa-eye"></i> View Details
                    </a>
                </div>
            </div>
        `;
        } catch (error) {
            console.error('Error rendering conference card:', error);
            console.error('Conference data:', conference);
            return '<div class="conference-card error">Error rendering conference</div>';
        }
    }

    getFilteredAndSortedConferences() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const locationFilter = document.getElementById('locationFilter');

        const searchTerm = (searchInput?.value || '').toLowerCase();
        const statusValue = statusFilter?.value || 'all';
        const locationValue = locationFilter?.value || 'all';

        const filtered = this.conferences.filter(conf => {
            const matchesSearch = !searchTerm ||
                conf.name.toLowerCase().includes(searchTerm) ||
                conf.organization.toLowerCase().includes(searchTerm) ||
                conf.location.toLowerCase().includes(searchTerm) ||
                (conf.description && conf.description.toLowerCase().includes(searchTerm));

            let matchesStatus;
            if (statusValue === 'all') {
                if (this.activeTab === 'attending') {
                    matchesStatus = conf.attendanceStatus === 'attending';
                } else if (this.activeTab === 'attended') {
                    matchesStatus = conf.attendanceStatus === 'attended';
                } else if (this.activeTab === 'upcoming') {
                    // For upcoming tab, check both status and date
                    const endDate = new Date(conf.endDate || conf.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isDateUpcoming = endDate >= today;
                    matchesStatus = (conf.status === 'upcoming' || conf.status === 'ongoing') && isDateUpcoming;
                } else if (this.activeTab === 'previous') {
                    // For previous tab, check both status and date
                    const endDate = new Date(conf.endDate || conf.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isDatePast = endDate < today;
                    matchesStatus = conf.status === 'past' || (isDatePast && conf.status !== 'ongoing');
                } else {
                    matchesStatus = this.activeTab === 'all' || conf.status === this.activeTab;
                }
            } else {
                // When status filter is set, also check dates for accuracy
                if (statusValue === 'upcoming') {
                    const endDate = new Date(conf.endDate || conf.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isDateUpcoming = endDate >= today;
                    matchesStatus = (conf.status === 'upcoming' || conf.status === 'ongoing') && isDateUpcoming;
                } else if (statusValue === 'previous') {
                    const endDate = new Date(conf.endDate || conf.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const isDatePast = endDate < today;
                    matchesStatus = conf.status === 'past' || (isDatePast && conf.status !== 'ongoing');
                } else {
                    matchesStatus = conf.status === statusValue;
                }
            }

            const matchesLocation = locationValue === 'all' || conf.location === locationValue;
            
            // Committee filter - use helper function for consistency
            const selectedCommittees = this.getSelectedCommittees();
            const matchesCommittee = selectedCommittees.length === 0 || this.getMatchingCommittees(conf).length > 0;
            
            return matchesSearch && matchesStatus && matchesLocation && matchesCommittee;
        });

        // Sort upcoming first by soonest, then previous by most recent
        // Use endDate to determine if conference is past (more accurate than startDate)
        return filtered.sort((a, b) => {
            const endDateA = new Date(a.endDate || a.startDate);
            const endDateB = new Date(b.endDate || b.startDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

            // Check if conference is past based on endDate
            const aIsUpcoming = endDateA >= today;
            const bIsUpcoming = endDateB >= today;

            // Also check status field as fallback
            const aStatusUpcoming = a.status === 'upcoming' || a.status === 'ongoing';
            const bStatusUpcoming = b.status === 'upcoming' || b.status === 'ongoing';
            
            // Use status if date check is ambiguous
            const aIsActuallyUpcoming = aIsUpcoming && aStatusUpcoming;
            const bIsActuallyUpcoming = bIsUpcoming && bStatusUpcoming;

            // Upcoming conferences first, sorted by soonest date
            if (aIsActuallyUpcoming && !bIsActuallyUpcoming) return -1;
            if (!aIsActuallyUpcoming && bIsActuallyUpcoming) return 1;
            
            // Both same category - sort by date
            return aIsActuallyUpcoming ? (endDateA - endDateB) : (endDateB - endDateA);
        });
    }

    filterConferences() {
        this.renderConferences();
    }

    // Details modal event listeners
    bindDetailsModalEvents() {
        // Only bind if elements exist (conference management was removed)
        const editBtn = document.getElementById('editConferenceBtn');
        const toggleBtn = document.getElementById('toggleAttendanceBtn');
        const deleteBtn = document.getElementById('deleteConferenceBtn');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                const conference = this.currentDetailsConference;
                this.closeDetailsModal();
                this.openModal('conferenceModal', conference);
            });
        }

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
            const conference = this.currentDetailsConference;
            this.toggleAttendance(conference.id);
        });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                const conference = this.currentDetailsConference;
                this.deleteConference(conference.id);
        });
        }
    }

    // Format chair info with copy buttons for Instagram handles (for script.js)
    formatChairInfoWithCopyButtonsForScript(chairInfo) {
        if (!chairInfo) return '';
        
        // Remove "Chairs:" or "Chair:" prefix if present for processing
        let processedInfo = chairInfo.replace(/^(Chairs?:\s*)/i, '').trim();
        
        // First, find and mark all email addresses to exclude them
        // Email pattern: something@domain.com (or similar)
        const emailPattern = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}/g;
        const emailRanges = [];
        let emailMatch;
        while ((emailMatch = emailPattern.exec(processedInfo)) !== null) {
            emailRanges.push({
                start: emailMatch.index,
                end: emailMatch.index + emailMatch[0].length
            });
        }
        
        // Find all Instagram handles (exclude email addresses)
        const instagramPattern = /@([a-zA-Z0-9._]+)/g;
        const handles = [];
        let match;
        
        while ((match = instagramPattern.exec(processedInfo)) !== null) {
            // Check if this @ is inside an email address
            const atIndex = match.index;
            const isInEmail = emailRanges.some(range => atIndex >= range.start && atIndex < range.end);
            
            if (!isInEmail) {
                // Also check if it's followed by a domain (additional safety check)
                const afterAt = processedInfo.substring(atIndex + match[0].length, atIndex + match[0].length + 20);
                const hasDomainAfter = /^[a-zA-Z0-9._-]*\.[a-zA-Z]{2,}/.test(afterAt.trim()) ||
                                      /^gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|student\.[a-zA-Z]+\.ac\.[a-zA-Z]+/i.test(afterAt.trim());
                
                // If it's followed by a domain, it's likely an email (even if not caught by email pattern)
                if (!hasDomainAfter) {
                    handles.push({
                        full: match[0],
                        username: match[1],
                        index: match.index
                    });
                }
            }
        }
        
        if (handles.length === 0) {
            return '';
        }
        
        const buttons = handles.map((handle, idx) => {
            const buttonId = `copy-btn-script-${Date.now()}-${idx}`;
            return `
                <span style="display: inline-flex; align-items: center; gap: 4px; margin: 2px 4px 2px 0; padding: 2px 6px; background: var(--bg-glass); border: 1px solid var(--border-color); border-radius: 6px; font-size: 0.8em;">
                    <span style="color: var(--accent-green);">${handle.full}</span>
                    <button 
                        id="${buttonId}"
                        onclick="window.copyInstagramHandle('${handle.username}', '${buttonId}')"
                        style="
                            background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                            border: none;
                            color: white;
                            padding: 2px 6px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 0.75em;
                            display: inline-flex;
                            align-items: center;
                            gap: 3px;
                            transition: transform 0.2s ease;
                        "
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                        title="Copy ${handle.username}"
                    >
                        <i class="fas fa-copy" style="font-size: 0.7em;"></i>
                    </button>
                </span>
            `;
        }).join('');
        
        return `<div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">${buttons}</div>`;
    }
}

// Standalone date/time display function for pages without MUNTracker (outside class)
function initDateTimeDisplayStandalone() {
    console.log('initDateTimeDisplayStandalone called');
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    if (!dateTimeDisplay) {
        console.log('dateTimeDisplay element not found, retrying...');
        // Retry after a short delay in case DOM isn't ready
        setTimeout(() => {
            const retryDisplay = document.getElementById('dateTimeDisplay');
            if (retryDisplay) {
                console.log('dateTimeDisplay found on retry');
                initDateTimeDisplayStandalone();
            } else {
                console.error('dateTimeDisplay element still not found after retry');
            }
        }, 200);
        return;
    }
    
    console.log('dateTimeDisplay element found, initializing...');
    
    const updateDateTime = () => {
        try {
            const now = new Date();
            
            // Format date: Day, Month DD, YYYY
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const dateStr = now.toLocaleDateString('en-US', options);
            
            // Format time: HH:MM:SS AM/PM
            const timeStr = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
            });
            
            if (dateTimeDisplay) {
                dateTimeDisplay.textContent = `${dateStr} • ${timeStr}`;
            }
        } catch (error) {
            console.error('Error updating date/time:', error);
        }
    };
    
    // Update immediately
    updateDateTime();
    console.log('DateTime display initialized, starting interval...');
    
    // Update every second
    setInterval(updateDateTime, 1000);
}

// Global color swatch initialization (works on all pages)
function initColorSwatches() {
    console.log('initColorSwatches called');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    console.log('Found', colorSwatches.length, 'color swatches');
    
    if (colorSwatches.length === 0) {
        console.warn('No color swatches found!');
        return;
    }
    
    colorSwatches.forEach(swatch => {
        // Only attach handler if not already attached
        if (!swatch.hasAttribute('data-color-handler-attached')) {
            swatch.setAttribute('data-color-handler-attached', 'true');
            swatch.style.cursor = 'pointer';
            swatch.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const color = swatch.getAttribute('data-color');
                console.log('Color swatch clicked:', color);
                if (!color) {
                    console.warn('No color attribute found on swatch');
                    return;
                }
                
                // Update theme (works if MUNTracker exists, otherwise just update localStorage)
                if (typeof munTracker !== 'undefined' && munTracker && typeof munTracker.setColorTheme === 'function') {
                    console.log('Using MUNTracker.setColorTheme');
                    munTracker.setColorTheme(color);
                } else {
                    console.log('Using standalone color theme update');
                    document.documentElement.setAttribute('data-color', color);
                    localStorage.setItem('munColorTheme', color);
                    // Update active swatch
                    colorSwatches.forEach(s => {
                        if (s.getAttribute('data-color') === color) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                }
            });
            console.log('Handler attached to swatch:', swatch.getAttribute('data-color'));
        } else {
            console.log('Handler already attached to swatch:', swatch.getAttribute('data-color'));
        }
    });
    
    // Initialize active swatch from saved preference
    const currentColor = localStorage.getItem('munColorTheme') || 'blue';
    console.log('Setting active color to:', currentColor);
    colorSwatches.forEach(swatch => {
        if (swatch.getAttribute('data-color') === currentColor) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });
}


// Make copyInstagramHandle available globally if not already defined
if (typeof window.copyInstagramHandle === 'undefined') {
    window.copyInstagramHandle = function(username, buttonId) {
        const showSuccess = () => {
            const button = document.getElementById(buttonId);
            if (button) {
                const originalHTML = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check" style="font-size: 0.7em;"></i>';
                button.style.background = 'var(--accent-green)';
                button.style.opacity = '0.9';
                
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.style.background = 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)';
                    button.style.opacity = '1';
                }, 2000);
            }
            
            // Show notification
            const notification = document.createElement('div');
            notification.textContent = `Copied ${username} to clipboard!`;
            notification.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: var(--accent-green, #27ae60);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-size: 0.9em;
                font-weight: 500;
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        };
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(username).then(showSuccess).catch(() => {
                // Fallback
                const textArea = document.createElement('textarea');
                textArea.value = username;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    showSuccess();
                } catch (err) {
                    console.error('Copy failed:', err);
                } finally {
                    document.body.removeChild(textArea);
                }
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = username;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showSuccess();
            } catch (err) {
                console.error('Copy failed:', err);
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };
}

// Standalone theme initialization - runs on ALL pages
// This function applies theme immediately (can be called before DOM is ready)
function initThemeStandalone() {
    try {
        // Load dark/light mode theme - apply immediately to documentElement
        const savedTheme = localStorage.getItem('munTheme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Load color theme - apply immediately to documentElement
        const savedColor = localStorage.getItem('munColorTheme');
        if (savedColor) {
            document.documentElement.setAttribute('data-color', savedColor);
        } else {
            // Remove color attribute to use default theme
            document.documentElement.removeAttribute('data-color');
        }
        
        // Update UI elements (only if DOM is ready)
        if (document.readyState === 'loading') {
            // DOM not ready yet, wait for it
            document.addEventListener('DOMContentLoaded', updateThemeUI);
        } else {
            // DOM already ready, update immediately
            updateThemeUI();
        }
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}

// Update theme UI elements (icons, swatches) - only called when DOM is ready
function updateThemeUI() {
    try {
        // Update theme icon
        const savedTheme = localStorage.getItem('munTheme');
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            if (savedTheme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
        
        // Update active color swatch
        const savedColor = localStorage.getItem('munColorTheme');
        if (savedColor) {
            const swatches = document.querySelectorAll('.color-swatch');
            swatches.forEach(swatch => {
                if (swatch.getAttribute('data-color') === savedColor) {
                    swatch.classList.add('active');
                } else {
                    swatch.classList.remove('active');
                }
            });
        }
        
        // Set up theme toggle button (works even without MUNTracker)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle && !themeToggle.hasAttribute('data-theme-handler-attached')) {
            themeToggle.setAttribute('data-theme-handler-attached', 'true');
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === 'dark') {
                    document.documentElement.removeAttribute('data-theme');
                    localStorage.setItem('munTheme', 'light');
                    const themeIcon = document.getElementById('themeIcon');
                    if (themeIcon) {
                        themeIcon.className = 'fas fa-moon';
                    }
                } else {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('munTheme', 'dark');
                    const themeIcon = document.getElementById('themeIcon');
                    if (themeIcon) {
                        themeIcon.className = 'fas fa-sun';
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error updating theme UI:', error);
    }
}

// Initialize theme IMMEDIATELY when script loads (before DOMContentLoaded)
// This prevents flash of wrong theme
// Run immediately, don't wait for anything
(function() {
    try {
        // Load dark/light mode theme - apply immediately to documentElement
        const savedTheme = localStorage.getItem('munTheme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Load color theme - apply immediately to documentElement
        const savedColor = localStorage.getItem('munColorTheme');
        if (savedColor) {
            document.documentElement.setAttribute('data-color', savedColor);
        } else {
            // Remove color attribute to use default theme
            document.documentElement.removeAttribute('data-color');
        }
    } catch (error) {
        // Silently fail if localStorage is not available
    }
})();

// Also call the full initialization function for UI updates
initThemeStandalone();

// Initialize the application
let munTracker;
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Theme is already applied, but ensure UI elements are updated
        updateThemeUI();
        
        // Initialize date/time display
        console.log('Initializing date/time display...');
        if (typeof initDateTimeDisplayStandalone === 'function') {
            initDateTimeDisplayStandalone();
        } else {
            console.error('initDateTimeDisplayStandalone function not found!');
        }
        
        // Initialize color swatches on all pages (if function exists)
        console.log('Initializing color swatches...');
        if (typeof initColorSwatches === 'function') {
            initColorSwatches();
        } else {
            console.warn('initColorSwatches function not found, using fallback...');
            // Fallback: initialize color swatches manually
            const colorSwatches = document.querySelectorAll('.color-swatch');
            console.log('Fallback: Found', colorSwatches.length, 'color swatches');
            colorSwatches.forEach(swatch => {
                if (!swatch.hasAttribute('data-color-handler-attached')) {
                    swatch.setAttribute('data-color-handler-attached', 'true');
                    swatch.style.cursor = 'pointer';
                    swatch.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const color = this.getAttribute('data-color');
                        console.log('Fallback: Color swatch clicked:', color);
                        if (color) {
                            document.documentElement.setAttribute('data-color', color);
                            localStorage.setItem('munColorTheme', color);
                            
                            // Update active state
                            colorSwatches.forEach(s => s.classList.remove('active'));
                            this.classList.add('active');
                        }
                    });
                }
            });
        }
        
        // Initialize global Google Sign-In button handlers (works on all pages)
        function initGoogleSignInButtons() {
            // Handle login modal Google button
            const googleLoginBtn = document.getElementById('googleLoginBtn');
            if (googleLoginBtn && !googleLoginBtn.hasAttribute('data-google-handler-attached')) {
                googleLoginBtn.setAttribute('data-google-handler-attached', 'true');
                googleLoginBtn.addEventListener('click', async () => {
                    try {
                        // Check if Firebase is available
                        if (typeof firebase === 'undefined') {
                            alert('Firebase is not loaded. Please refresh the page and try again.');
                            console.error('Firebase SDK not loaded');
                            return;
                        }
                        
                        // Check if auth is available
                        if (typeof auth === 'undefined' || !auth) {
                            alert('Authentication is not initialized. Please check your Firebase configuration.');
                            console.error('Auth object is undefined');
                            return;
                        }
                        
                        // Try MUNTracker first if available
                        if (typeof munTracker !== 'undefined' && munTracker && typeof munTracker.signInWithGoogle === 'function') {
                            const success = await munTracker.signInWithGoogle();
                            if (success) {
                                return; // Success, MUNTracker handled it
                            }
                        }
                        
                        // Fallback: use FirebaseAuth directly
                        if (typeof FirebaseAuth !== 'undefined' && typeof FirebaseAuth.signInWithGoogle === 'function') {
                            const result = await FirebaseAuth.signInWithGoogle();
                            if (result.success) {
                                // Reload page to show logged-in state
                                window.location.reload();
                            } else {
                                alert(result.error || 'Google Sign-In failed. Please check the browser console for details.');
                                console.error('Google Sign-In failed:', result.error);
                            }
                        } else {
                            alert('Google Sign-In is not available. Please use email/password.');
                            console.error('FirebaseAuth.signInWithGoogle is not available');
                        }
                    } catch (error) {
                        console.error('Google Sign-In error:', error);
                        alert('Google Sign-In failed: ' + (error.message || 'Unknown error') + '. Please check the browser console for details.');
                    }
                });
            }

            // Handle signup modal Google button
            const googleSignupBtn = document.getElementById('googleSignupBtn');
            if (googleSignupBtn && !googleSignupBtn.hasAttribute('data-google-handler-attached')) {
                googleSignupBtn.setAttribute('data-google-handler-attached', 'true');
                googleSignupBtn.addEventListener('click', async () => {
                    try {
                        // Check if Firebase is available
                        if (typeof firebase === 'undefined') {
                            alert('Firebase is not loaded. Please refresh the page and try again.');
                            console.error('Firebase SDK not loaded');
                            return;
                        }
                        
                        // Check if auth is available
                        if (typeof auth === 'undefined' || !auth) {
                            alert('Authentication is not initialized. Please check your Firebase configuration.');
                            console.error('Auth object is undefined');
                            return;
                        }
                        
                        // Try MUNTracker first if available
                        if (typeof munTracker !== 'undefined' && munTracker && typeof munTracker.signInWithGoogle === 'function') {
                            const success = await munTracker.signInWithGoogle();
                            if (success) {
                                return; // Success, MUNTracker handled it
                            }
                        }
                        
                        // Fallback: use FirebaseAuth directly
                        if (typeof FirebaseAuth !== 'undefined' && typeof FirebaseAuth.signInWithGoogle === 'function') {
                            const result = await FirebaseAuth.signInWithGoogle();
                            if (result.success) {
                                // Reload page to show logged-in state
                                window.location.reload();
                            } else {
                                alert(result.error || 'Google Sign-In failed. Please check the browser console for details.');
                                console.error('Google Sign-In failed:', result.error);
                            }
                        } else {
                            alert('Google Sign-In is not available. Please use email/password.');
                            console.error('FirebaseAuth.signInWithGoogle is not available');
                        }
                    } catch (error) {
                        console.error('Google Sign-In error:', error);
                        alert('Google Sign-In failed: ' + (error.message || 'Unknown error') + '. Please check the browser console for details.');
                    }
                });
            }
        }
    
        // Initialize Google Sign-In buttons on all pages
        initGoogleSignInButtons();
        
        // Initialize MUNTracker if on index.html or conference detail pages
        // Check for various page indicators
        const isIndexPage = document.getElementById('conferencesList');
        const isConferenceDetailPage = document.getElementById('conferenceName') && document.getElementById('location');
        const isConferenceDetailPageAlt = document.getElementById('conferenceDetail');
        const isProfilePage = document.getElementById('profileContent') || document.getElementById('profileNotLoggedIn');
        
        if (isIndexPage || isConferenceDetailPage || isConferenceDetailPageAlt || isProfilePage) {
            try {
                console.log('Initializing MUNTracker...');
                munTracker = new MUNTracker();
                console.log('MUNTracker created, calling init()...');
                munTracker.init();
                console.log('MUNTracker initialized successfully');
            } catch (error) {
                console.error('Error initializing MUNTracker:', error);
                console.error('Error stack:', error.stack);
                // Don't block page load if MUNTracker fails
            }
        } else {
            console.log('MUNTracker not initialized - not on index or conference detail page');
        }
    } catch (error) {
        console.error('Error during page initialization:', error);
        // Ensure page still loads even if initialization fails
    }
});
