// Theme initialization script - Load this in <head> to prevent flash of wrong theme
// This runs immediately when the script loads, before DOM is ready
(function() {
    'use strict';
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
        console.error('Error initializing theme:', error);
    }
})();

