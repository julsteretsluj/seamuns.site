/**
 * Mobile navigation: hamburger toggle, accordion dropdowns, scroll lock.
 */
(function () {
    'use strict';

    var MOBILE_MQ = '(max-width: 1024px)';

    function isMobileNav() {
        return window.matchMedia(MOBILE_MQ).matches;
    }

    function initMobileNavigation() {
        var nav = document.querySelector('.main-nav');
        if (!nav || nav.dataset.mobileNavInit === 'true') return;
        nav.dataset.mobileNavInit = 'true';

        var container = nav.querySelector('.container');
        var wrapper = nav.querySelector('.nav-wrapper');
        if (!container || !wrapper) return;

        if (!wrapper.id) wrapper.id = 'mainNavPanel';

        var backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        nav.parentNode.insertBefore(backdrop, nav.nextSibling);

        var bar = document.createElement('div');
        bar.className = 'nav-mobile-bar';
        bar.innerHTML =
            '<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="' + wrapper.id + '" aria-label="Open navigation menu">' +
            '<span class="nav-toggle__icons" aria-hidden="true">' +
            '<i class="fas fa-bars nav-toggle__bars"></i>' +
            '<i class="fas fa-times nav-toggle__close"></i>' +
            '</span>' +
            '<span class="nav-toggle__label">Menu</span>' +
            '</button>';
        container.insertBefore(bar, wrapper);

        var toggle = bar.querySelector('.nav-toggle');
        var toggleLabel = bar.querySelector('.nav-toggle__label');
        var dropdowns = nav.querySelectorAll('.nav-item.dropdown');

        function setOpen(open) {
            nav.classList.toggle('is-open', open);
            document.body.classList.toggle('nav-menu-open', open);
            backdrop.classList.toggle('is-visible', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
            if (toggleLabel) toggleLabel.textContent = open ? 'Close' : 'Menu';
            if (!open) {
                dropdowns.forEach(function (item) {
                    item.classList.remove('active');
                });
            }
        }

        toggle.addEventListener('click', function () {
            setOpen(!nav.classList.contains('is-open'));
        });

        backdrop.addEventListener('click', function () {
            setOpen(false);
        });

        dropdowns.forEach(function (item) {
            var btn = item.querySelector('button.nav-link');
            if (!btn) return;
            btn.addEventListener('click', function (e) {
                if (!isMobileNav()) return;
                e.preventDefault();
                e.stopPropagation();
                var willOpen = !item.classList.contains('active');
                dropdowns.forEach(function (other) {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active', willOpen);
            });
        });

        nav.querySelectorAll('.dropdown-content a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (isMobileNav()) setOpen(false);
            });
        });

        nav.querySelectorAll('.nav-item:not(.dropdown) .nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (isMobileNav()) setOpen(false);
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setOpen(false);
            }
        });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (!isMobileNav()) setOpen(false);
            }, 120);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNavigation);
    } else {
        initMobileNavigation();
    }
})();
