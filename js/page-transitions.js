/**
 * Apple-inspired motion: cross-document view transitions, page enter, staggered reveals.
 */
(function (global) {
    'use strict';

    var STAGGER_STEP_MS = 55;
    var STAGGER_BASE_MS = 40;
    var headerCompact = false;

    function prefersReducedMotion() {
        return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function isVisible(el) {
        if (!el) return false;
        return global.getComputedStyle(el).display !== 'none' && global.getComputedStyle(el).visibility !== 'hidden';
    }

    function visibleAuthElement() {
        var userMenu = document.getElementById('userMenu');
        var auth = document.getElementById('authButtons');
        if (isVisible(userMenu)) return userMenu;
        if (isVisible(auth)) return auth;
        return null;
    }

    function updatePinnedLayout() {
        var root = document.documentElement;
        var theme = document.querySelector('.theme-controls');
        var auth = visibleAuthElement();
        var chromeBottom = 0;

        if (theme) {
            var themeRect = theme.getBoundingClientRect();
            chromeBottom = Math.max(chromeBottom, themeRect.bottom);
        }
        if (auth) {
            var authRect = auth.getBoundingClientRect();
            chromeBottom = Math.max(chromeBottom, authRect.bottom);
        }

        var currentChrome = parseFloat(global.getComputedStyle(root).getPropertyValue('--site-chrome-h')) || 88;
        if (!(chromeBottom > 0)) chromeBottom = currentChrome;

        root.style.setProperty('--site-chrome-h', Math.ceil(chromeBottom + 8) + 'px');

        var header = document.querySelector('.header');
        if (header) {
            root.style.setProperty('--header-sticky-h', Math.ceil(header.getBoundingClientRect().height) + 'px');
        }
    }

    var pinnedLayoutQueued = false;
    function schedulePinnedLayout() {
        if (pinnedLayoutQueued) return;
        pinnedLayoutQueued = true;
        requestAnimationFrame(function () {
            pinnedLayoutQueued = false;
            markChrome();
            updatePinnedLayout();
        });
    }

    function observePinnedChrome() {
        // Intentionally no ResizeObserver: observing measured fixed chrome created
        // feedback loops on narrow screens and caused sticky jitter while scrolling.
    }

    function markChrome() {
        var header = document.querySelector('.header');
        if (header) header.classList.add('motion-chrome-header');
        var nav = document.querySelector('.main-nav');
        if (nav) nav.classList.add('motion-chrome-nav');
        var theme = document.querySelector('.theme-controls');
        if (theme) theme.classList.add('motion-chrome-theme');
        var auth = document.getElementById('authButtons');
        var userMenu = document.getElementById('userMenu');
        if (auth) auth.classList.remove('motion-chrome-auth');
        if (userMenu) userMenu.classList.remove('motion-chrome-auth');
        if (isVisible(userMenu)) {
            userMenu.classList.add('motion-chrome-auth');
        } else if (auth) {
            auth.classList.add('motion-chrome-auth');
        }
        var main = document.querySelector('main');
        if (main) main.classList.add('motion-page-main');
    }

    function compactThreshold() {
        return global.matchMedia && global.matchMedia('(max-width: 768px)').matches ? 12 : 28;
    }

    function syncHeaderCompactOnScroll() {
        var header = document.querySelector('.header');
        if (!header) return;

        var shouldCompact = (global.scrollY || global.pageYOffset || 0) > compactThreshold();
        if (shouldCompact === headerCompact) return;

        headerCompact = shouldCompact;
        header.classList.toggle('is-scrolled', shouldCompact);
        schedulePinnedLayout();
    }

    function staggerChildren(root, selector) {
        if (!root || prefersReducedMotion()) return;
        var items = root.querySelectorAll(selector);
        items.forEach(function (el, index) {
            el.classList.add('motion-stagger-item');
            el.style.setProperty('--motion-i', String(index));
        });
    }

    function applyContentStagger() {
        staggerChildren(document, '.awards-cards-grid .award-card');
        staggerChildren(document, '.topic-card');
    }

    function runPageEnter() {
        var root = document.documentElement;
        root.classList.add('motion-preload');

        if (prefersReducedMotion()) {
            root.classList.add('motion-ready', 'motion-entered');
            root.classList.remove('motion-preload');
            return;
        }

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                applyContentStagger();
                root.classList.add('motion-ready');
                root.classList.remove('motion-preload');
                global.setTimeout(function () {
                    root.classList.add('motion-entered');
                }, 800);
            });
        });
    }

    function reenterDynamicContent() {
        markChrome();
        if (prefersReducedMotion()) return;

        var main = document.querySelector('main');
        if (!main) return;

        main.classList.remove('motion-reenter');
        void main.offsetWidth;
        main.classList.add('motion-reenter');
        applyContentStagger();
    }

    function init() {
        markChrome();
        syncHeaderCompactOnScroll();
        schedulePinnedLayout();
        observePinnedChrome();
        runPageEnter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    global.addEventListener('resize', schedulePinnedLayout, { passive: true });
    global.addEventListener('orientationchange', schedulePinnedLayout);
    global.addEventListener('scroll', syncHeaderCompactOnScroll, { passive: true });
    global.addEventListener('mun-site-chrome-ready', schedulePinnedLayout);
    global.addEventListener('mun-auth-state-ready', schedulePinnedLayout);
    global.addEventListener('mun-dynamic-content-ready', function () {
        reenterDynamicContent();
        syncHeaderCompactOnScroll();
        schedulePinnedLayout();
    });

    global.MotionTransitions = {
        markChrome: markChrome,
        staggerChildren: staggerChildren,
        reenter: reenterDynamicContent,
        updatePinnedLayout: schedulePinnedLayout
    };
})(typeof window !== 'undefined' ? window : this);
