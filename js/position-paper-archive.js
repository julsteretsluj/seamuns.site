/**
 * Position Paper Archive: community uploads (same Firestore `archive` collection, type position-papers).
 * Optional self-reported awards: Best Position Paper (committee), Best Position Paper (overall), or none.
 */
(function () {
    let archiveItems = [];
    let currentFilter = 'all';
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    function posPapersOnly() {
        return archiveItems.filter(item => item.type === 'position-papers');
    }

    function escapeHtml(s) {
        if (!s) return '';
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function getAwardBadgeHtml(award) {
        const a = award || 'none';
        if (a === 'committee') {
            return '<span class="pos-paper-badge pos-paper-badge--committee" title="Self-reported: won Best Position Paper at committee level"><i class="fas fa-medal"></i> Best (committee)</span>';
        }
        if (a === 'overall') {
            return '<span class="pos-paper-badge pos-paper-badge--overall" title="Self-reported: won Best Position Paper overall"><i class="fas fa-trophy"></i> Best (overall)</span>';
        }
        return '';
    }

    function renderList() {
        const listEl = document.getElementById('posPaperArchiveList');
        const emptyEl = document.getElementById('posPaperArchiveEmpty');
        const loadingEl = document.getElementById('posPaperArchiveLoading');
        if (!listEl) return;

        if (loadingEl) loadingEl.style.display = 'none';

        let filtered = posPapersOnly();
        if (currentFilter === 'committee') {
            filtered = filtered.filter(item => (item.posPaperAward || 'none') === 'committee');
        } else if (currentFilter === 'overall') {
            filtered = filtered.filter(item => (item.posPaperAward || 'none') === 'overall');
        } else if (currentFilter === 'none') {
            filtered = filtered.filter(item => (item.posPaperAward || 'none') === 'none');
        }

        listEl.querySelectorAll('.pos-paper-archive-card').forEach(c => c.remove());

        if (filtered.length === 0) {
            if (emptyEl) {
                emptyEl.style.display = 'block';
                emptyEl.textContent = currentFilter === 'all'
                    ? 'No position papers yet. Log in and upload to share your work.'
                    : 'No papers match this filter.';
            }
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pos-paper-archive-card content-section';
            card.style.cssText = 'padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-glass);';
            const dateStr = item.createdAt && (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt.seconds * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const badges = getAwardBadgeHtml(item.posPaperAward);
            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--accent-blue); opacity: 0.2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-file-word" style="color: var(--accent-blue);"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${escapeHtml(item.title || 'Untitled')}</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-bottom: 0.25rem;">
                            ${badges ? badges : '<span style="font-size: 0.75rem; color: var(--text-tertiary);">Standard upload</span>'}
                        </div>
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

    async function loadArchive() {
        if (typeof FirebaseArchive === 'undefined' || !FirebaseArchive.getArchiveItems) {
            const loadingEl = document.getElementById('posPaperArchiveLoading');
            if (loadingEl) loadingEl.textContent = 'Firebase not configured.';
            return;
        }
        const result = await FirebaseArchive.getArchiveItems();
        archiveItems = result.data || [];
        renderList();
    }

    function setupFilters() {
        document.querySelectorAll('.pos-paper-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.getAttribute('data-filter') || 'all';
                document.querySelectorAll('.pos-paper-filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderList();
            });
        });
    }

    function showUploadButton() {
        const user = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        const btn = document.getElementById('posPaperUploadBtn');
        if (btn) btn.style.display = user ? 'inline-flex' : 'none';
    }

    function openUploadModal() {
        const modal = document.getElementById('posPaperUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    function closeUploadModal() {
        const modal = document.getElementById('posPaperUploadModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
        const form = document.getElementById('posPaperUploadForm');
        if (form) form.reset();
        const noneRadio = document.querySelector('input[name="posPaperAward"][value="none"]');
        if (noneRadio) noneRadio.checked = true;
    }

    function getSelectedAward() {
        const el = document.querySelector('input[name="posPaperAward"]:checked');
        return el ? el.value : 'none';
    }

    async function handleUpload(e) {
        e.preventDefault();
        const titleEl = document.getElementById('posPaperTitle');
        const descEl = document.getElementById('posPaperDescription');
        const fileEl = document.getElementById('posPaperFile');
        const submitBtn = document.getElementById('posPaperUploadSubmit');
        if (!titleEl || !fileEl || !submitBtn) return;

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
                type: 'position-papers',
                title: titleEl.value.trim(),
                description: (descEl && descEl.value) ? descEl.value.trim() : '',
                posPaperAward: getSelectedAward(),
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

        document.getElementById('posPaperUploadBtn') && document.getElementById('posPaperUploadBtn').addEventListener('click', openUploadModal);
        document.getElementById('posPaperUploadModalClose') && document.getElementById('posPaperUploadModalClose').addEventListener('click', closeUploadModal);
        document.getElementById('posPaperUploadCancel') && document.getElementById('posPaperUploadCancel').addEventListener('click', closeUploadModal);
        document.getElementById('posPaperUploadModal') && document.getElementById('posPaperUploadModal').addEventListener('click', function (e) {
            if (e.target === this) closeUploadModal();
        });
        document.getElementById('posPaperUploadForm') && document.getElementById('posPaperUploadForm').addEventListener('submit', handleUpload);

        window.addEventListener('munAuthStateReady', showUploadButton);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
