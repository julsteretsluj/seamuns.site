/**
 * Archive page: load shared items from Firestore, filter by category, upload (Storage + Firestore).
 * Data is shared: all users read the same Firestore "archive" collection and Storage files.
 */
(function () {
    const ARCHIVE_TYPES = [
        { value: 'position-papers', label: 'Position papers', icon: 'fa-file-word' },
        { value: 'chair-reports', label: 'Chair reports', icon: 'fa-gavel' },
        { value: 'slides', label: 'Slides (ceremony or crisis)', icon: 'fa-presentation-screen' },
        { value: 'speeches', label: 'Speeches', icon: 'fa-microphone' },
        { value: 'prep', label: 'Prep document', icon: 'fa-clipboard-list' }
    ];

    let archiveItems = [];
    let currentFilter = 'all';
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    function getTypeLabel(value) {
        const t = ARCHIVE_TYPES.find(x => x.value === value);
        return t ? t.label : value;
    }

    function getTypeIcon(value) {
        const t = ARCHIVE_TYPES.find(x => x.value === value);
        return t ? t.icon : 'fa-file';
    }

    function renderList() {
        const listEl = document.getElementById('archiveList');
        const emptyEl = document.getElementById('archiveEmpty');
        const loadingEl = document.getElementById('archiveLoading');
        if (!listEl) return;

        if (loadingEl) loadingEl.style.display = 'none';

        const filtered = currentFilter === 'all'
            ? archiveItems
            : archiveItems.filter(item => item.type === currentFilter);

        // Remove existing cards (keep empty/loading messages for toggling)
        const cards = listEl.querySelectorAll('.archive-card');
        cards.forEach(c => c.remove());

        if (filtered.length === 0) {
            if (emptyEl) {
                emptyEl.style.display = 'block';
                emptyEl.textContent = currentFilter === 'all'
                    ? 'No items yet. Log in and upload to share your work.'
                    : 'No items in this category yet.';
            }
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'archive-card content-section';
            card.style.cssText = 'padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-glass);';
            const dateStr = item.createdAt && (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt.seconds * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--accent-blue); opacity: 0.2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas ${getTypeIcon(item.type)}" style="color: var(--accent-blue);"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${escapeHtml(item.title || 'Untitled')}</h3>
                        <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">${getTypeLabel(item.type)}</p>
                        ${item.description ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(item.description)}</p>` : ''}
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: var(--text-tertiary);">${escapeHtml(item.authorName || 'Anonymous')} · ${dateStr}</p>
                        <a href="${escapeHtml(item.fileUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            `;
            listEl.appendChild(card);
        });
    }

    function escapeHtml(s) {
        if (!s) return '';
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    async function loadArchive() {
        if (typeof FirebaseArchive === 'undefined' || !FirebaseArchive.getArchiveItems) {
            document.getElementById('archiveLoading').textContent = 'Firebase not configured. Archive uses a shared Firestore collection and Storage.';
            return;
        }
        const result = await FirebaseArchive.getArchiveItems();
        archiveItems = result.data || [];
        renderList();
    }

    function setupFilters() {
        document.querySelectorAll('.archive-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.getAttribute('data-type') || 'all';
                document.querySelectorAll('.archive-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderList();
            });
        });
    }

    function showUploadButton() {
        const user = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        const btn = document.getElementById('archiveUploadBtn');
        if (btn) btn.style.display = user ? 'inline-flex' : 'none';
    }

    function openUploadModal() {
        const modal = document.getElementById('archiveUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    function closeUploadModal() {
        const modal = document.getElementById('archiveUploadModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
        const form = document.getElementById('archiveUploadForm');
        if (form) form.reset();
    }

    async function handleUpload(e) {
        e.preventDefault();
        const typeEl = document.getElementById('archiveType');
        const titleEl = document.getElementById('archiveTitle');
        const descEl = document.getElementById('archiveDescription');
        const fileEl = document.getElementById('archiveFile');
        const submitBtn = document.getElementById('archiveUploadSubmit');
        if (!typeEl || !titleEl || !fileEl || !submitBtn) return;

        const file = fileEl.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert('File must be 10 MB or smaller.');
            return;
        }

        const user = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading…';

        try {
            const result = await FirebaseArchive.addArchiveItem(file, {
                type: typeEl.value,
                title: titleEl.value.trim(),
                description: (descEl && descEl.value) ? descEl.value.trim() : '',
                authorName: user ? (user.name || user.email || '') : '',
                authorId: user ? (user.id || user.uid || '') : ''
            });
            if (result.success) {
                closeUploadModal();
                await loadArchive();
                alert('Uploaded successfully.');
            } else {
                alert(result.error || 'Upload failed.');
            }
        } catch (err) {
            alert(err.message || 'Upload failed.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-upload"></i> Upload';
        }
    }

    function init() {
        loadArchive();
        setupFilters();
        showUploadButton();

        document.getElementById('archiveUploadBtn') && document.getElementById('archiveUploadBtn').addEventListener('click', openUploadModal);
        document.getElementById('archiveUploadModalClose') && document.getElementById('archiveUploadModalClose').addEventListener('click', closeUploadModal);
        document.getElementById('archiveUploadCancel') && document.getElementById('archiveUploadCancel').addEventListener('click', closeUploadModal);
        document.getElementById('archiveUploadModal') && document.getElementById('archiveUploadModal').addEventListener('click', function (e) {
            if (e.target === this) closeUploadModal();
        });
        document.getElementById('archiveUploadForm') && document.getElementById('archiveUploadForm').addEventListener('submit', handleUpload);

        window.addEventListener('munAuthStateReady', showUploadButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
