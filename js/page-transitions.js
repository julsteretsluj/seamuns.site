/**
 * Apple-inspired motion: cross-document view transitions, page enter, staggered reveals.
 */
(function (global) {
    'use strict';

    var STAGGER_STEP_MS = 55;
    var STAGGER_BASE_MS = 40;

    function prefersReducedMotion() {
        return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        if (userMenu && userMenu.offsetParent !== null) {
            userMenu.classList.add('motion-chrome-auth');
        } else if (auth) {
            auth.classList.add('motion-chrome-auth');
        }
        var main = document.querySelector('main');
        if (main) main.classList.add('motion-page-main');
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
        runPageEnter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    global.addEventListener('mun-site-chrome-ready', markChrome);
    global.addEventListener('mun-dynamic-content-ready', reenterDynamicContent);

    global.MotionTransitions = {
        markChrome: markChrome,
        staggerChildren: staggerChildren,
        reenter: reenterDynamicContent
    };
})(typeof window !== 'undefined' ? window : this);
