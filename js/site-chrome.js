/**
 * Injects shared site chrome (theme controls, auth UI, header, nav) on pages that omit it.
 */
(function (global) {
    'use strict';

    function isPagesDir() {
        return /\/pages\//.test(global.location.pathname);
    }

    function jsPrefix() {
        return isPagesDir() ? '../js/' : 'js/';
    }

    function rootPrefix() {
        return isPagesDir() ? '../' : '';
    }

    function pageHref(path) {
        return isPagesDir() ? path : 'pages/' + path;
    }

    function ensureThemeControls() {
        if (document.querySelector('.theme-controls')) return;
        var wrap = document.createElement('div');
        wrap.className = 'theme-controls';
        wrap.innerHTML =
            '<button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode" title="Toggle dark mode" type="button">' +
            '<i class="fas fa-moon" id="themeIcon"></i></button>' +
            '<div class="theme-selector" id="themeSelector">' +
            '<span class="theme-selector-label">Theme</span>' +
            '<div class="color-swatch" data-color="red" title="Red Theme"></div>' +
            '<div class="color-swatch" data-color="orange" title="Orange Theme"></div>' +
            '<div class="color-swatch" data-color="yellow" title="Yellow Theme"></div>' +
            '<div class="color-swatch" data-color="green" title="Green Theme"></div>' +
            '<div class="color-swatch active" data-color="blue" title="Blue Theme"></div>' +
            '<div class="color-swatch" data-color="purple" title="Purple Theme"></div>' +
            '<div class="color-swatch" data-color="pink" title="Pink Theme"></div>' +
            '<div class="color-swatch" data-color="grey" title="Grey Theme"></div>' +
            '<div class="color-swatch" data-color="mono" title="Monochrome Theme"></div>' +
            '</div>';
        document.body.insertBefore(wrap, document.body.firstChild);
    }

    function ensureAuthChrome() {
        if (!document.getElementById('userMenu')) {
            var userMenu = document.createElement('div');
            userMenu.className = 'user-menu';
            userMenu.id = 'userMenu';
            userMenu.style.display = 'none';
            userMenu.innerHTML =
                '<div class="user-info">' +
                '<img id="userProfileImg" src="" alt="Profile" style="width: 36px; height: 36px; border-radius: 50%; margin-right: 8px; object-fit: cover;">' +
                '<span id="userEmail"></span></div>' +
                '<button class="edit-profile-btn" id="editProfileBtn" title="Edit Profile"><i class="fas fa-user-edit"></i></button>' +
                '<button class="logout-btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>';
            document.body.insertBefore(userMenu, document.body.firstChild);
        }
        if (!document.getElementById('authButtons')) {
            var auth = document.createElement('div');
            auth.className = 'auth-buttons';
            auth.id = 'authButtons';
            auth.innerHTML =
                '<button class="btn btn-secondary" id="loginBtn"><i class="fas fa-sign-in-alt"></i> Login</button>' +
                '<button class="btn btn-primary" id="signupBtn"><i class="fas fa-user-plus"></i> Sign Up</button>';
            document.body.insertBefore(auth, document.body.firstChild);
        }
    }

    function ensureHeader() {
        if (document.querySelector('.header')) return;
        var header = document.createElement('header');
        header.className = 'header';
        header.innerHTML =
            '<div class="container">' +
            '<h1 style="display: flex; align-items: center; justify-content: center; gap: 12px;">' +
            '<a href="' + rootPrefix() + 'index.html" style="display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none;">' +
            '<img src="' + rootPrefix() + 'assets/logo.png" alt="SEAMUNs Logo" class="site-logo"><span>SEAMUNs</span></a></h1>' +
            '<p>Track upcoming and previous Model United Nations conferences across South East Asia 🌏</p>' +
            '<div class="current-datetime" id="currentDateTime"><i class="fas fa-clock"></i><span id="dateTimeDisplay"></span></div>' +
            '</div>';
        var main = document.querySelector('main');
        if (main) main.parentNode.insertBefore(header, main);
        else document.body.appendChild(header);
    }

    function buildNavHtml() {
        var p = pageHref;
        var r = rootPrefix();
        return (
            '<div class="container"><div class="nav-wrapper">' +
            '<div class="nav-item dropdown"><button class="nav-link">📅 Conferences <i class="fas fa-chevron-down"></i></button>' +
            '<div class="dropdown-content">' +
            '<a href="' + r + 'index.html"><i class="fas fa-check-circle"></i> ✅ Upcoming &amp; Previous MUNs</a>' +
            '<a href="' + p('prospective-muns.html') + '"><i class="fas fa-hourglass-half"></i> ⏳ Prospective MUNs</a>' +
            '<a href="' + p('how-to-host.html') + '"><i class="fas fa-building"></i> 🏢 How to Host an MUN</a></div></div>' +
            '<div class="nav-item dropdown"><button class="nav-link">🏫 Schools &amp; Advisors <i class="fas fa-chevron-down"></i></button>' +
            '<div class="dropdown-content">' +
            '<a href="' + p('participating-schools.html') + '"><i class="fas fa-graduation-cap"></i> 🎓 Participating Schools</a>' +
            '<a href="' + p('become-participating-school.html') + '"><i class="fas fa-handshake"></i> 🤝 How to Become a Participating School</a>' +
            '<a href="' + p('advisor-guide.html') + '"><i class="fas fa-chalkboard-teacher"></i> 👩‍🏫 Advisor Guide</a></div></div>' +
            '<div class="nav-item dropdown"><button class="nav-link">👥 Delegates &amp; Chairs <i class="fas fa-chevron-down"></i></button>' +
            '<div class="dropdown-content">' +
            '<a href="' + p('delegate-signup.html') + '"><i class="fas fa-user-plus"></i> How to Sign Up (Delegate Guide)</a>' +
            '<a href="' + p('individual-delegates.html') + '"><i class="fas fa-user"></i> Individual Delegates</a>' +
            '<a href="' + p('chair-guide.html') + '"><i class="fas fa-gavel"></i> Chair Guide</a>' +
            '<a href="' + p('chair-superlatives.html') + '"><i class="fas fa-award"></i> Chair Superlatives</a>' +
            '<a href="' + p('mun-guide.html') + '"><i class="fas fa-book"></i> MUN Guide</a>' +
            '<a href="' + p('how-to-prep.html') + '"><i class="fas fa-clipboard-list"></i> How to Prep</a>' +
            '<a href="' + p('stand-out.html') + '"><i class="fas fa-star"></i> How to Stand Out</a>' +
            '<a href="' + p('confidence.html') + '"><i class="fas fa-heart"></i> Confidence Building</a>' +
            '<a href="' + p('support.html') + '"><i class="fas fa-hands-helping"></i> Support at Conferences</a></div></div>' +
            '<div class="nav-item dropdown"><button class="nav-link">📚 Resources <i class="fas fa-chevron-down"></i></button>' +
            '<div class="dropdown-content">' +
            '<a href="' + p('points.html') + '"><i class="fas fa-gavel"></i> Points &amp; Motions</a>' +
            '<a href="' + p('rop-2027.html') + '"><i class="fas fa-file-alt"></i> Rules of Procedure (RoP) 2027</a>' +
            '<a href="' + p('awards-seamun-2027.html') + '"><i class="fas fa-trophy"></i> SEAMUN I 2027 Awards &amp; Rubrics</a>' +
            '<a href="' + p('committees.html') + '"><i class="fas fa-users-cog"></i> Committees</a>' +
            '<a href="' + p('committees.html#traditional') + '" class="sub-item"><i class="fas fa-landmark"></i> Traditional Committees</a>' +
            '<a href="' + p('committees.html#special') + '" class="sub-item"><i class="fas fa-star"></i> Special Committees</a>' +
            '<a href="' + p('conduct.html') + '"><i class="fas fa-balance-scale"></i> Conduct</a>' +
            '<a href="' + p('speeches.html') + '"><i class="fas fa-microphone"></i> Speeches</a>' +
            '<a href="' + p('resolutions.html') + '"><i class="fas fa-file-alt"></i> Resolutions</a>' +
            '<a href="' + p('crisis.html') + '"><i class="fas fa-exclamation-triangle"></i> Crisis</a>' +
            '<a href="' + p('ga.html') + '"><i class="fas fa-globe-americas"></i> General Assembly</a>' +
            '<a href="' + p('position-papers.html') + '"><i class="fas fa-file-word"></i> Position Papers</a>' +
            '<a href="' + p('position-paper-archive.html') + '"><i class="fas fa-folder-open"></i> Position Paper Archive</a>' +
            '<a href="' + p('examples.html') + '"><i class="fas fa-lightbulb"></i> Examples</a>' +
            '<a href="' + p('awards.html') + '"><i class="fas fa-trophy"></i> Awards</a>' +
            '<a href="' + p('templates.html') + '"><i class="fas fa-file-download"></i> Templates</a>' +
            '<a href="' + p('archive.html') + '"><i class="fas fa-archive"></i> Archive</a>' +
            '<a href="' + r + 'munsimulation/" target="_blank" rel="noopener noreferrer"><i class="fas fa-gamepad"></i> MUN Simulation Game</a></div></div>' +
            '<div class="nav-item"><a href="' + r + 'munsimulation/" target="_blank" rel="noopener noreferrer" class="nav-link"><i class="fas fa-gamepad"></i> MUN Simulation</a></div>' +
            '<div class="nav-item"><a href="https://thedashboard.seamun.com" target="_blank" rel="noopener noreferrer" class="nav-link"><i class="fas fa-tachometer-alt"></i> Dashboard</a></div>' +
            '<div class="nav-item"><a href="' + p('profile.html') + '" class="nav-link"><i class="fas fa-user"></i> 👤 My Profile</a></div>' +
            '<div class="nav-item"><a href="' + p('announcements.html') + '" class="nav-link"><i class="fas fa-bullhorn"></i> 📢 Announcements</a></div>' +
            '<div class="nav-item"><a href="' + p('about.html') + '" class="nav-link"><i class="fas fa-info-circle"></i> ℹ️ About &amp; Contact</a></div>' +
            '</div></div>'
        );
    }

    function ensureMainNav() {
        if (document.querySelector('.main-nav')) return false;
        var nav = document.createElement('nav');
        nav.className = 'main-nav';
        nav.innerHTML = buildNavHtml();
        var main = document.querySelector('main');
        if (main) main.parentNode.insertBefore(nav, main);
        else document.body.appendChild(nav);
        return true;
    }

    function ensureBodyTag() {
        if (document.body) return;
        var main = document.querySelector('main');
        if (!main) return;
        var body = document.createElement('body');
        while (document.documentElement.lastChild && document.documentElement.lastChild !== document.head) {
            body.appendChild(document.documentElement.lastChild);
        }
        document.documentElement.appendChild(body);
    }

    function ensureSiteChrome() {
        ensureBodyTag();
        if (!document.body) return false;
        ensureThemeControls();
        ensureAuthChrome();
        var addedHeader = !document.querySelector('.header');
        if (addedHeader) ensureHeader();
        var addedNav = ensureMainNav();
        return addedHeader || addedNav;
    }

    global.ensureSiteChrome = ensureSiteChrome;
    global.__munJsPrefix = jsPrefix;

    function bootSiteChrome() {
        if (!document.body) return;
        var changed = ensureSiteChrome();
        if (changed && typeof global.initMobileNavigation === 'function') {
            global.initMobileNavigation();
        }
        global.dispatchEvent(new CustomEvent('mun-site-chrome-ready', { detail: { changed: changed } }));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootSiteChrome);
    } else {
        bootSiteChrome();
    }
})(typeof window !== 'undefined' ? window : this);
