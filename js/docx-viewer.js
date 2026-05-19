/**
 * Generic DOCX in-browser viewer using Mammoth.js.
 * Usage: mountDocxViewer({ url, viewerId, statusId, loadingMessage, errorMessage })
 */
(function (global) {
    'use strict';

    function mountDocxViewer(options) {
        options = options || {};
        var url = options.url;
        var viewer = document.getElementById(options.viewerId || 'docxViewer');
        var statusEl = document.getElementById(options.statusId || 'docxViewerStatus');
        var loadingMessage = options.loadingMessage || 'Loading document…';
        var errorMessage = options.errorMessage || 'Could not display the document in your browser. Please download the file instead.';

        if (!url || !viewer) return;

        function setStatus(message, isError) {
            if (!statusEl) return;
            statusEl.textContent = message;
            statusEl.hidden = !message;
            statusEl.classList.toggle('docx-viewer-status--error', !!isError);
        }

        if (typeof mammoth === 'undefined') {
            setStatus(errorMessage, true);
            return;
        }

        setStatus(loadingMessage, false);
        viewer.hidden = true;
        viewer.innerHTML = '';

        fetch(url)
            .then(function (response) {
                if (!response.ok) throw new Error('Failed to fetch document');
                return response.arrayBuffer();
            })
            .then(function (buffer) {
                return mammoth.convertToHtml({ arrayBuffer: buffer });
            })
            .then(function (result) {
                if (!result.value || !result.value.trim()) throw new Error('Empty document');
                viewer.innerHTML = result.value;
                viewer.hidden = false;
                viewer.classList.add('docx-rendered');
                setStatus('', false);
            })
            .catch(function (err) {
                if (typeof console !== 'undefined' && console.warn) console.warn('docx-viewer:', err);
                setStatus(errorMessage, true);
            });
    }

    global.mountDocxViewer = mountDocxViewer;
})(typeof window !== 'undefined' ? window : this);
