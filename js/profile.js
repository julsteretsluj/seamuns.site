// Profile Page JavaScript
async function updateProfileUIFromAuth(user) {
    const profileNotLoggedIn = document.getElementById('profileNotLoggedIn');
    const profileContent = document.getElementById('profileContent');
    if (!profileNotLoggedIn || !profileContent) return;

    if (!user) {
        profileNotLoggedIn.style.display = 'block';
        profileContent.style.display = 'none';
    } else {
        profileNotLoggedIn.style.display = 'none';
        profileContent.style.display = 'block';
        ensureUserMenuShown(user);
        // Fetch latest profile from Firestore so we show current name, pronouns, awards
        if ((user.authProvider === 'firebase' || user.authProvider === 'google') && user.uid && typeof FirebaseDB !== 'undefined' && FirebaseDB.getUserProfile) {
            try {
                const res = await FirebaseDB.getUserProfile(user.uid);
                if (res.success && res.data) {
                    const d = res.data;
                    user.name = d.name || user.name;
                    user.pronouns = d.pronouns != null ? d.pronouns : user.pronouns;
                    user.awards = d.awards || user.awards || [];
                    user.profilePicture = d.profilePicture || user.profilePicture;
                    user.bannerType = d.bannerType;
                    user.bannerPreset = d.bannerPreset;
                    user.bannerImage = d.bannerImage || d.banner;
                    user.school = d.school != null ? d.school : user.school;
                    localStorage.setItem('munCurrentUser', JSON.stringify(user));
                    if (window.__munCurrentUser) window.__munCurrentUser = user;
                }
            } catch (e) { console.warn('Profile fetch failed:', e); }
        }
        loadUserProfile(user);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Use auth state from MUNTracker when it's ready (profile page now runs MUNTracker)
    function applyAuthState() {
        const user = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        updateProfileUIFromAuth(user);
    }

    if (window.__munAuthReady && window.__munCurrentUser !== undefined) {
        applyAuthState();
    }
    window.addEventListener('munAuthStateReady', (e) => {
        window.__munCurrentUser = e.detail && e.detail.user !== undefined ? e.detail.user : null;
        applyAuthState();
    });
    // Fallback: run after short delay in case MUNTracker init is still in progress
    setTimeout(applyAuthState, 400);

    // In-content Login/Sign Up buttons (open same modals as header buttons)
    const profileLoginBtn = document.getElementById('profileLoginBtn');
    const profileSignupBtn = document.getElementById('profileSignupBtn');
    if (profileLoginBtn) {
        profileLoginBtn.addEventListener('click', () => {
            if (typeof munTracker !== 'undefined' && munTracker && typeof munTracker.openModal === 'function') {
                munTracker.openModal('loginModal');
            } else {
                const m = document.getElementById('loginModal');
                if (m) { m.classList.add('show'); m.style.display = 'flex'; }
            }
        });
    }
    if (profileSignupBtn) {
        profileSignupBtn.addEventListener('click', () => {
            if (typeof munTracker !== 'undefined' && munTracker && typeof munTracker.openModal === 'function') {
                munTracker.openModal('signupModal');
            } else {
                const m = document.getElementById('signupModal');
                if (m) { m.classList.add('show'); m.style.display = 'flex'; }
            }
        });
    }

    // Listen for successful login/signup to reload profile (so data is fresh)
    window.addEventListener('userLoggedIn', () => {
        location.reload();
    });
    
    // Handle logout on profile page - redirect to home
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            setTimeout(() => {
                // After logout completes, redirect to home (profile is in pages/)
                window.location.href = document.querySelector('a[href="../index.html"]') ? '../index.html' : 'index.html';
            }, 500);
        });
    }
    
    // Handle edit profile button in user menu
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            openEditProfileModal();
        });
    }
    
    // Handle close profile modal
    const closeProfileModal = document.getElementById('closeProfileModal');
    if (closeProfileModal) {
        closeProfileModal.addEventListener('click', () => {
            closeEditProfileModal();
        });
    }
    
    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfileChanges();
        });
    }
    
    // Handle profile picture upload
    const editProfilePicture = document.getElementById('editProfilePicture');
    if (editProfilePicture) {
        editProfilePicture.addEventListener('change', (e) => {
            handleProfilePictureUpload(e);
        });
    }
    
    // Handle banner picture upload
    const editBannerPicture = document.getElementById('editBannerPicture');
    if (editBannerPicture) {
        editBannerPicture.addEventListener('change', (e) => {
            handleBannerPictureUpload(e);
        });
    }
});

function ensureUserMenuShown(user) {
    // Make sure the user menu is displayed
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userEmail = document.getElementById('userEmail');
    const userProfileImg = document.getElementById('userProfileImg');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    
    if (userEmail && user) {
        const displayName = user.name + (user.pronouns ? ` (${user.pronouns})` : '');
        userEmail.textContent = displayName;
    }
    
    if (userProfileImg && user) {
        userProfileImg.src = user.profilePicture || getDefaultAvatar(user.name);
    }
}

function loadUserProfile(user) {
    // Set profile banner
    const profileBanner = document.querySelector('.profile-banner');
    if (user.bannerType === 'custom' && user.bannerImage) {
        profileBanner.classList.add('custom-image');
        profileBanner.innerHTML = `<img src="${user.bannerImage}" alt="Profile Banner">`;
    } else if (user.bannerType === 'preset' && user.bannerPreset) {
        profileBanner.classList.remove('custom-image');
        profileBanner.className = `profile-banner preset-banner-${user.bannerPreset}`;
        profileBanner.innerHTML = '';
    } else {
        // Default banner
        profileBanner.classList.remove('custom-image');
        profileBanner.className = 'profile-banner preset-banner-1';
        profileBanner.innerHTML = '';
    }

    // Set profile avatar
    const profileAvatar = document.getElementById('profileAvatar');
    if (profileAvatar) {
        const src = user.profilePicture || getDefaultAvatar(user.name);
        profileAvatar.src = src;
        profileAvatar.alt = user.name ? `${user.name}'s avatar` : 'Profile';
        profileAvatar.style.display = 'block';
    }

    // Set profile name
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = user.name || 'Delegate';

    // Set pronouns
    const pronounsElement = document.getElementById('profilePronouns');
    if (user.pronouns) {
        pronounsElement.textContent = user.pronouns;
        pronounsElement.style.display = 'block';
    } else {
        pronounsElement.style.display = 'none';
    }
    
    // Set email
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        const span = profileEmail.querySelector('span');
        if (span) span.textContent = user.email;
    }

    // Set school
    const profileSchoolEl = document.getElementById('profileSchool');
    if (profileSchoolEl) {
        const span = profileSchoolEl.querySelector('span');
        if (span) span.textContent = user.school || '';
        profileSchoolEl.style.display = user.school ? 'block' : 'none';
    }
    
    // Load conference data
    const conferences = JSON.parse(localStorage.getItem('munConferences')) || [];
    
    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison
    
    // Filter user's conferences based on attendance status
    const userConferences = conferences.filter(conf => 
        (conf.attendanceStatus === 'attending' || conf.attendanceStatus === 'attended') &&
        (conf.userId === user.id || !conf.userId) // Show all for now
    );
    
    // Automatically categorize based on date
    const attendedConferences = userConferences.filter(conf => {
        const confDate = new Date(conf.endDate); // Use end date to determine if conference has ended
        confDate.setHours(0, 0, 0, 0);
        return confDate < today; // Conference has ended
    });
    
    const attendingConferences = userConferences.filter(conf => {
        const confDate = new Date(conf.endDate);
        confDate.setHours(0, 0, 0, 0);
        return confDate >= today; // Conference is upcoming or happening today
    });
    
    // Update stats
    const totalConferences = attendedConferences.length + attendingConferences.length;
    const totalConferencesCount = document.getElementById('totalConferencesCount');
    const attendingConferencesCount = document.getElementById('attendingConferencesCount');
    const attendedConferencesCount = document.getElementById('attendedConferencesCount');
    if (totalConferencesCount) totalConferencesCount.textContent = totalConferences;
    if (attendingConferencesCount) attendingConferencesCount.textContent = attendingConferences.length;
    if (attendedConferencesCount) attendedConferencesCount.textContent = attendedConferences.length;
    
    // Load awards
    const userAwards = user.awards || [];
    const totalAwardsCount = document.getElementById('totalAwardsCount');
    if (totalAwardsCount) totalAwardsCount.textContent = userAwards.length;
    displayAwards(userAwards);
    
    // Display conferences
    displayConferences('attendedConferencesContainer', attendedConferences);
    displayConferences('attendingConferencesContainer', attendingConferences);
}

function displayAwards(awards) {
    const container = document.getElementById('awardsContainer');
    
    if (!awards || awards.length === 0) {
        container.innerHTML = `
            <div class="empty-awards">
                <i class="fas fa-award"></i>
                <p>No awards yet. Keep participating in conferences!</p>
            </div>
        `;
        return;
    }
    
    // Sort awards by date (most recent first)
    const sortedAwards = [...awards].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sortedAwards.map(award => {
        const awardTypeClass = getAwardTypeClass(award.type);
        const formattedDate = new Date(award.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        return `
            <div class="award-card" data-type="${awardTypeClass}">
                <div class="award-icon">
                    ${getAwardIcon(award.type)}
                </div>
                <div class="award-details">
                    <h3 class="award-name">${award.type}</h3>
                    <p class="award-conference"><i class="fas fa-map-marker-alt"></i> ${award.conference}</p>
                    <p class="award-committee"><i class="fas fa-gavel"></i> ${award.committee}</p>
                    <p class="award-date"><i class="fas fa-calendar"></i> ${formattedDate}</p>
                    ${award.notes ? `<p class="award-notes">${award.notes}</p>` : ''}
                </div>
                <div class="award-actions">
                    <button class="award-action-btn edit-btn" onclick="openEditAwardModal('${award.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="award-action-btn delete-btn" onclick="deleteAward('${award.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getAwardTypeClass(type) {
    const typeLower = type.toLowerCase();
    if (typeLower.includes('best delegate')) return 'best';
    if (typeLower.includes('outstanding delegate')) return 'outstanding';
    if (typeLower.includes('honorable mention')) return 'honorable';
    if (typeLower.includes('verbal commendation')) return 'verbal';
    if (typeLower.includes('position paper')) return 'position-paper';
    if (typeLower.includes('delegation')) return 'delegation';
    return 'best';
}

function getAwardIcon(type) {
    const typeLower = type.toLowerCase();
    
    // Best Delegate variations - use crown
    if (typeLower.includes('best delegate') && (typeLower.includes('overall') || typeLower.includes('conference'))) {
        return '<i class="fas fa-trophy" style="color: #FFD700;"></i>';
    }
    if (typeLower.includes('best delegate') && typeLower.includes('per committee')) {
        return '<i class="fas fa-medal" style="color: #FFD700;"></i>';
    }
    if (typeLower.includes('best delegate')) {
        return '<i class="fas fa-crown" style="color: #FFD700;"></i>';
    }
    
    // Honorable variations - use medal/award
    if (typeLower.includes('honorable delegate') && typeLower.includes('2 per committee')) {
        return '<i class="fas fa-medal" style="color: #C0C0C0;"></i>';
    }
    if (typeLower.includes('honorable') && typeLower.includes('per committee')) {
        return '<i class="fas fa-ribbon" style="color: #E67E22;"></i>';
    }
    if (typeLower.includes('honorable mention') || typeLower.includes('honorable delegate')) {
        return '<i class="fas fa-award" style="color: #E67E22;"></i>';
    }
    
    // Outstanding Delegate
    if (typeLower.includes('outstanding delegate')) {
        return '<i class="fas fa-medal" style="color: #E74C3C;"></i>';
    }
    
    // Position Paper variations - use file icons
    if (typeLower.includes('best position paper') && (typeLower.includes('overall') || typeLower.includes('conference'))) {
        return '<i class="fas fa-file-alt" style="color: #4169E1;"></i>';
    }
    if (typeLower.includes('position paper') && typeLower.includes('per committee')) {
        return '<i class="fas fa-file-word" style="color: #27AE60;"></i>';
    }
    if (typeLower.includes('position paper')) {
        return '<i class="fas fa-file-alt" style="color: #4169E1;"></i>';
    }
    
    // Chair variations - use gavel/scales
    if (typeLower.includes('best chair') && (typeLower.includes('overall') || typeLower.includes('conference'))) {
        return '<i class="fas fa-star" style="color: #9B59B6;"></i>';
    }
    if (typeLower.includes('honorable') && typeLower.includes('chair')) {
        return '<i class="fas fa-graduation-cap" style="color: #9B59B6;"></i>';
    }
    if (typeLower.includes('best chair') || typeLower.includes('best chairs')) {
        return '<i class="fas fa-gavel" style="color: #9B59B6;"></i>';
    }
    
    // Best Committee
    if (typeLower.includes('best committee')) {
        return '<i class="fas fa-landmark" style="color: #FF6B6B;"></i>';
    }
    
    // Delegation variations - use users/flag
    if (typeLower.includes('best delegation')) {
        return '<i class="fas fa-flag" style="color: #FFD700;"></i>';
    }
    if (typeLower.includes('outstanding delegation')) {
        return '<i class="fas fa-star" style="color: #C0C0C0;"></i>';
    }
    if (typeLower.includes('delegation')) {
        return '<i class="fas fa-users" style="color: var(--accent-blue);"></i>';
    }
    
    // Verbal Commendation
    if (typeLower.includes('verbal commendation')) {
        return '<i class="fas fa-comments" style="color: #87CEEB;"></i>';
    }
    
    // Default fallback
    return '<i class="fas fa-trophy" style="color: #87CEEB;"></i>';
}

function displayConferences(containerId, conferences) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!conferences || conferences.length === 0) {
        container.innerHTML = '<p class="empty-message">No conferences in this category.</p>';
        return;
    }
    
    // Sort conferences by date
    const sortedConferences = conferences.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        
        // For attending (upcoming) conferences: sort ascending (soonest first)
        // For attended (past) conferences: sort descending (most recent first)
        if (containerId === 'attendingConferencesContainer') {
            return dateA - dateB; // Soonest upcoming first
        } else {
            return dateB - dateA; // Most recent past first
        }
    });
    
    container.innerHTML = sortedConferences.map(conf => {
        const flag = getCountryFlag(conf.countryCode || 'TH');
        const startDate = new Date(conf.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const endDate = new Date(conf.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        // Calculate days until/since conference
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const confStart = new Date(conf.startDate);
        const confEnd = new Date(conf.endDate);
        confEnd.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((confStart - today) / (1000 * 60 * 60 * 24));
        
        // Determine if conference is past or upcoming based on end date
        const isPast = confEnd < today;
        const actualStatus = isPast ? 'attended' : 'attending';
        
        let timeInfo = '';
        if (!isPast) {
            if (daysUntil > 0) {
                timeInfo = `<span class="conference-countdown"><i class="fas fa-clock"></i> ${daysUntil} day${daysUntil !== 1 ? 's' : ''} away</span>`;
            } else if (daysUntil === 0) {
                timeInfo = `<span class="conference-countdown today"><i class="fas fa-exclamation-circle"></i> Today!</span>`;
            }
        }
        
        return `
            <div class="profile-conference-card ${actualStatus}">
                <div class="conference-card-accent"></div>
                <div class="conference-card-content">
                    <div class="conference-card-header">
                        <div class="conference-header-top">
                            <h3 class="conference-title">${conf.name}</h3>
                            <span class="conference-badge ${conf.status}">${conf.status}</span>
                        </div>
                        ${timeInfo ? `<div class="conference-header-time">${timeInfo}</div>` : ''}
                    </div>
                    
                    <div class="conference-card-body">
                        <div class="conference-info-row">
                            <div class="conference-info-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${flag} ${conf.location}</span>
                            </div>
                            <div class="conference-info-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>${startDate}</span>
                            </div>
                        </div>
                        
                        ${conf.size ? `
                            <div class="conference-info-row">
                                <div class="conference-info-item">
                                    <i class="fas fa-users"></i>
                                    <span>${conf.size}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="conference-card-footer">
                        <span class="attendance-status">
                            <i class="fas ${actualStatus === 'attending' ? 'fa-user-check' : 'fa-trophy'}"></i>
                            ${actualStatus === 'attending' ? 'Attending' : 'Attended'}
                        </span>
                        <a href="conference-template.html?id=${conf.id}" class="btn btn-sm btn-primary">
                            <i class="fas fa-arrow-right"></i> View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

function getDefaultAvatar(name) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#2B5FA6', '#2D7D4D', '#4A9F6A', '#5B8FC4', '#C86464'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="50" fill="${bgColor}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" 
              fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>`;
    
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// Listen for auth state changes
window.addEventListener('storage', (e) => {
    if (e.key === 'munCurrentUser') {
        location.reload(); // Reload page when auth state changes
    }
});

// ========================================
// AWARD MANAGEMENT SYSTEM
// ========================================

let currentEditingAwardId = null;

// Event listeners for award management
document.addEventListener('DOMContentLoaded', () => {
    const awardModal = document.getElementById('awardModal');
    const closeAwardModal = document.getElementById('closeAwardModal');
    const cancelAwardBtn = document.getElementById('cancelAwardBtn');
    const awardForm = document.getElementById('awardForm');
    const awardTypeSelect = document.getElementById('awardType');
    const otherAwardTypeGroup = document.getElementById('otherAwardTypeGroup');
    
    // Use delegation so Add Award works even when button is inside #profileContent (shown after auth)
    document.body.addEventListener('click', (e) => {
        if (e.target.closest && e.target.closest('#addAwardBtn')) {
            e.preventDefault();
            openAddAwardModal();
        }
    });
    
    if (closeAwardModal) {
        closeAwardModal.addEventListener('click', closeAwardModalFunc);
    }
    
    if (cancelAwardBtn) {
        cancelAwardBtn.addEventListener('click', closeAwardModalFunc);
    }
    
    if (awardModal) {
        awardModal.addEventListener('click', (e) => {
            if (e.target === awardModal) {
                closeAwardModalFunc();
            }
        });
    }
    
    if (awardTypeSelect) {
        awardTypeSelect.addEventListener('change', () => {
            if (awardTypeSelect.value === 'Other') {
                otherAwardTypeGroup.style.display = 'block';
                document.getElementById('awardTypeOther').required = true;
            } else {
                otherAwardTypeGroup.style.display = 'none';
                document.getElementById('awardTypeOther').required = false;
            }
        });
    }
    
    if (awardForm) {
        awardForm.addEventListener('submit', handleAwardFormSubmit);
    }
});

function openAddAwardModal() {
    currentEditingAwardId = null;
    const awardModalTitle = document.getElementById('awardModalTitle');
    const awardForm = document.getElementById('awardForm');
    const otherAwardTypeGroup = document.getElementById('otherAwardTypeGroup');
    const awardModal = document.getElementById('awardModal');
    
    if (awardModalTitle) awardModalTitle.textContent = 'Add Award';
    if (awardForm) awardForm.reset();
    if (otherAwardTypeGroup) otherAwardTypeGroup.style.display = 'none';
    if (awardModal) {
        awardModal.classList.add('show');
        awardModal.style.display = 'flex';
    }
}

function openEditAwardModal(awardId) {
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser || !currentUser.awards) return;
    
    const award = currentUser.awards.find(a => a.id === awardId);
    if (!award) return;
    
    currentEditingAwardId = awardId;
    const awardModalTitle = document.getElementById('awardModalTitle');
    const awardConference = document.getElementById('awardConference');
    const awardCommittee = document.getElementById('awardCommittee');
    const awardDate = document.getElementById('awardDate');
    const awardNotes = document.getElementById('awardNotes');
    const awardTypeSelect = document.getElementById('awardType');
    const otherAwardTypeGroup = document.getElementById('otherAwardTypeGroup');
    const awardTypeOther = document.getElementById('awardTypeOther');
    const awardModal = document.getElementById('awardModal');
    
    if (awardModalTitle) awardModalTitle.textContent = 'Edit Award';
    if (awardConference) awardConference.value = award.conference;
    if (awardCommittee) awardCommittee.value = award.committee;
    if (awardDate) awardDate.value = award.date;
    if (awardNotes) awardNotes.value = award.notes || '';
    
    // Handle award type (must match preset options in profile.html)
    const standardTypes = [
        'Best Delegate (Overall)', 'Best Delegate (Committee)', 'Outstanding Delegate',
        'Honorable Delegate Mention', 'Honorable Mention', 'Verbal Commendation',
        'Best Position Paper', 'Best Position Paper (Committee)',
        'Best Chair', 'Best Chair (Overall)', 'Honorable Chair Mention',
        'Best Delegation', 'Outstanding Delegation', 'Best Committee'
    ];
    if (awardTypeSelect) {
        if (standardTypes.includes(award.type)) {
            awardTypeSelect.value = award.type;
            if (otherAwardTypeGroup) otherAwardTypeGroup.style.display = 'none';
        } else {
            awardTypeSelect.value = 'Other';
            if (awardTypeOther) awardTypeOther.value = award.type;
            if (otherAwardTypeGroup) otherAwardTypeGroup.style.display = 'block';
        }
    }
    if (awardModal) {
        awardModal.classList.add('show');
        awardModal.style.display = 'flex';
    }
}

function closeAwardModalFunc() {
    const awardModal = document.getElementById('awardModal');
    if (awardModal) {
        awardModal.classList.remove('show');
        awardModal.style.display = 'none';
    }
    currentEditingAwardId = null;
}

function handleAwardFormSubmit(e) {
    e.preventDefault();
    
    const awardConferenceEl = document.getElementById('awardConference');
    const awardTypeEl = document.getElementById('awardType');
    const awardTypeOtherEl = document.getElementById('awardTypeOther');
    const awardCommitteeEl = document.getElementById('awardCommittee');
    const awardDateEl = document.getElementById('awardDate');
    const awardNotesEl = document.getElementById('awardNotes');
    
    if (!awardConferenceEl || !awardTypeEl || !awardCommitteeEl || !awardDateEl) {
        console.error('Required award form elements not found');
        return;
    }
    
    const conference = awardConferenceEl.value.trim();
    const awardTypeSelect = awardTypeEl.value;
    const awardType = awardTypeSelect === 'Other' && awardTypeOtherEl ? awardTypeOtherEl.value.trim() : awardTypeSelect;
    const committee = awardCommitteeEl.value.trim();
    const date = awardDateEl.value;
    const notes = awardNotesEl ? awardNotesEl.value.trim() : '';
    
    if (!conference || !awardType || !committee || !date) {
        alert('Please fill in all required fields.');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser) return;
    
    // Initialize awards array if it doesn't exist
    if (!currentUser.awards) {
        currentUser.awards = [];
    }
    
    if (currentEditingAwardId) {
        // Edit existing award
        const awardIndex = currentUser.awards.findIndex(a => a.id === currentEditingAwardId);
        if (awardIndex !== -1) {
            currentUser.awards[awardIndex] = {
                ...currentUser.awards[awardIndex],
                conference,
                type: awardType,
                committee,
                date,
                notes
            };
        }
    } else {
        // Add new award
        const newAward = {
            id: Date.now().toString(),
            conference,
            type: awardType,
            committee,
            date,
            notes,
            createdAt: new Date().toISOString()
        };
        currentUser.awards.push(newAward);
    }
    
    // Save to Firebase if available
    if (typeof FirebaseDB !== 'undefined' && currentUser.firebaseId) {
        FirebaseDB.updateAward(currentUser.firebaseId, currentUser.awards);
    }
    
    // Save to localStorage
    localStorage.setItem('munCurrentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('munUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('munUsers', JSON.stringify(users));
    }
    
    // Reload profile to show updated awards
    closeAwardModalFunc();
    loadUserProfile(currentUser);
}

function deleteAward(awardId) {
    if (!confirm('Are you sure you want to delete this award?')) {
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser || !currentUser.awards) return;
    
    // Remove the award
    currentUser.awards = currentUser.awards.filter(a => a.id !== awardId);
    
    // Save to Firebase if available
    if (typeof FirebaseDB !== 'undefined' && currentUser.firebaseId) {
        FirebaseDB.updateAward(currentUser.firebaseId, currentUser.awards);
    }
    
    // Save to localStorage
    localStorage.setItem('munCurrentUser', JSON.stringify(currentUser));
    
    // Update users array
    const users = JSON.parse(localStorage.getItem('munUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('munUsers', JSON.stringify(users));
    }
    
    // Reload profile to show updated awards
    loadUserProfile(currentUser);
}

// Edit Profile Modal Functions
function populateSchoolSelect(selectEl) {
    if (!selectEl || selectEl.options.length > 1) return; // already populated
    var schools = window.MUN_PARTICIPATING_SCHOOLS;
    var list = window.MUN_UNIVERSITIES_THAILAND;
    if (Array.isArray(schools)) {
        var g1 = document.createElement('optgroup');
        g1.label = 'Participating schools';
        schools.forEach(function(s) {
            var o = document.createElement('option');
            o.value = s;
            o.textContent = s;
            g1.appendChild(o);
        });
        selectEl.appendChild(g1);
    }
    var g2 = document.createElement('optgroup');
    g2.label = 'Other options';
    [
        { value: '__other__', label: 'Other (specify below)' },
        { value: '__university__', label: 'University in Thailand (search)' },
        { value: 'Gap year', label: 'Gap year' },
        { value: 'GED', label: 'GED' }
    ].forEach(function(item) {
        var o = document.createElement('option');
        o.value = item.value;
        o.textContent = item.label;
        g2.appendChild(o);
    });
    selectEl.appendChild(g2);
    var datalist = document.getElementById('datalistUniversitiesThailand');
    if (datalist && Array.isArray(list)) {
        list.forEach(function(u) {
            var o = document.createElement('option');
            o.value = u;
            datalist.appendChild(o);
        });
    }
}

function syncProfileSchoolFields() {
    var sel = document.getElementById('editProfileSchool');
    var otherWrap = document.getElementById('profileSchoolOtherWrap');
    var uniWrap = document.getElementById('profileSchoolUniversityWrap');
    if (!sel || !otherWrap || !uniWrap) return;
    var v = sel.value;
    otherWrap.style.display = v === '__other__' ? 'block' : 'none';
    uniWrap.style.display = v === '__university__' ? 'block' : 'none';
}

function openEditProfileModal() {
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser) return;
    
    // Populate form with current user data
    const editProfileName = document.getElementById('editProfileName');
    const editProfilePronouns = document.getElementById('editProfilePronouns');
    const editProfileEmail = document.getElementById('editProfileEmail');
    
    if (editProfileName) editProfileName.value = currentUser.name || '';
    if (editProfilePronouns) editProfilePronouns.value = currentUser.pronouns || '';
    if (editProfileEmail) editProfileEmail.value = currentUser.email || '';
    
    // School: populate select once and set current value
    const editProfileSchool = document.getElementById('editProfileSchool');
    if (editProfileSchool) {
        if (editProfileSchool.options.length <= 1) populateSchoolSelect(editProfileSchool);
        var school = currentUser.school || '';
        if (school.startsWith('Other: ')) {
            editProfileSchool.value = '__other__';
            var otherInput = document.getElementById('editProfileSchoolOther');
            if (otherInput) otherInput.value = school.slice(7);
            var uniInput = document.getElementById('editProfileSchoolUniversity');
            if (uniInput) uniInput.value = '';
        } else if (school.startsWith('University: ')) {
            editProfileSchool.value = '__university__';
            var uniInput = document.getElementById('editProfileSchoolUniversity');
            if (uniInput) uniInput.value = school.slice(12);
            var otherInput = document.getElementById('editProfileSchoolOther');
            if (otherInput) otherInput.value = '';
        } else {
            editProfileSchool.value = school;
            var otherInput = document.getElementById('editProfileSchoolOther');
            var uniInput = document.getElementById('editProfileSchoolUniversity');
            if (otherInput) otherInput.value = '';
            if (uniInput) uniInput.value = '';
        }
        syncProfileSchoolFields();
        editProfileSchool.removeEventListener('change', syncProfileSchoolFields);
        editProfileSchool.addEventListener('change', syncProfileSchoolFields);
    }
    
    // Set profile picture preview
    const previewImg = document.getElementById('editProfilePreviewImg');
    if (previewImg) {
        previewImg.src = currentUser.profilePicture || getDefaultAvatar(currentUser.name);
    }
    
    // Show modal
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeEditProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
    }
}

function handleProfilePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Profile picture must be less than 5MB');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Read and preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
        const previewImg = document.getElementById('editProfilePreviewImg');
        if (previewImg) {
            previewImg.src = event.target.result;
        }
    };
    reader.readAsDataURL(file);
}

function handleBannerPictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Banner picture must be less than 5MB');
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
    }
    
    // Read the image (we'll save it when form is submitted)
    const reader = new FileReader();
    reader.onload = (event) => {
        // Store temporarily for form submission
        window.tempBannerImage = event.target.result;
    };
    reader.readAsDataURL(file);
}

function saveProfileChanges() {
    const currentUser = JSON.parse(localStorage.getItem('munCurrentUser'));
    if (!currentUser) return;
    
    // Get form values
    const editProfileNameEl = document.getElementById('editProfileName');
    const editProfilePronounsEl = document.getElementById('editProfilePronouns');
    
    if (!editProfileNameEl) {
        console.error('editProfileName element not found');
        return;
    }
    
    const name = editProfileNameEl.value.trim();
    const pronouns = editProfilePronounsEl ? editProfilePronounsEl.value.trim() : '';
    
    if (!name) {
        alert('Name is required');
        return;
    }
    
    // School: build value from form
    var schoolVal = '';
    var sel = document.getElementById('editProfileSchool');
    if (sel) {
        var v = sel.value;
        if (v === '__other__') {
            var otherInput = document.getElementById('editProfileSchoolOther');
            schoolVal = 'Other: ' + (otherInput ? otherInput.value.trim() : '');
        } else if (v === '__university__') {
            var uniInput = document.getElementById('editProfileSchoolUniversity');
            schoolVal = 'University: ' + (uniInput ? uniInput.value.trim() : '');
        } else if (v) {
            schoolVal = v;
        }
    }
    currentUser.school = schoolVal;

    // Update user object
    currentUser.name = name;
    currentUser.pronouns = pronouns;
    
    // Update profile picture if changed
    const previewImg = document.getElementById('editProfilePreviewImg');
    if (previewImg && previewImg.src && !previewImg.src.includes('placeholder')) {
        currentUser.profilePicture = previewImg.src;
    }
    
    // Update banner if changed
    if (window.tempBannerImage) {
        currentUser.bannerType = 'custom';
        currentUser.bannerImage = window.tempBannerImage;
        delete window.tempBannerImage;
    }
    
    // Save to Firebase if available
    if (typeof FirebaseDB !== 'undefined' && currentUser.uid) {
        FirebaseDB.updateUserProfile(currentUser.uid, {
            name: currentUser.name,
            pronouns: currentUser.pronouns,
            profilePicture: currentUser.profilePicture || '',
            banner: currentUser.bannerImage || '',
            school: currentUser.school || ''
        }).catch(err => {
            console.error('Error updating Firebase profile:', err);
        });
    }
    
    // Save to localStorage
    localStorage.setItem('munCurrentUser', JSON.stringify(currentUser));
    
    // Update users array in localStorage
    const users = JSON.parse(localStorage.getItem('munUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('munUsers', JSON.stringify(users));
    }
    
    // Close modal and reload profile
    closeEditProfileModal();
    
    // Update the user menu display
    ensureUserMenuShown(currentUser);
    
    // Reload profile display
    loadUserProfile(currentUser);
    
    // Show success message
    alert('Profile updated successfully!');
}

