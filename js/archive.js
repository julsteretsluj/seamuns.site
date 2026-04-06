/**
 * Archive page: load shared items from Firestore, filter by category, upload (Storage + Firestore).
 * Owners can edit or delete their own submissions (authorId match).
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
    let editingItem = null;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    function getCurrentUid() {
        const u = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        return u && (u.uid || u.id) ? String(u.uid || u.id) : '';
    }

    function findItemById(id) {
        return archiveItems.find(x => x.id === id);
    }

    function getTypeLabel(value) {
        const t = ARCHIVE_TYPES.find(x => x.value === value);
        return t ? t.label : value;
    }

    function getTypeIcon(value) {
        const t = ARCHIVE_TYPES.find(x => x.value === value);
        return t ? t.icon : 'fa-file';
    }

    function getPosPaperAwardBadgeHtml(award) {
        const a = award || 'none';
        if (a === 'committee') {
            return '<span class="pos-paper-badge pos-paper-badge--committee" title="Self-reported: Best Position Paper (committee)"><i class="fas fa-medal"></i> Best (committee)</span>';
        }
        if (a === 'overall') {
            return '<span class="pos-paper-badge pos-paper-badge--overall" title="Self-reported: Best Position Paper (overall)"><i class="fas fa-trophy"></i> Best (overall)</span>';
        }
        return '';
    }

    function escapeHtml(s) {
        if (!s) return '';
        const div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function escapeAttr(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function setArchiveAwardRadio(value) {
        const v = value || 'none';
        document.querySelectorAll('input[name="archivePosPaperAward"]').forEach(r => {
            r.checked = r.value === v;
        });
    }

    function setModalModeAdd() {
        editingItem = null;
        const eid = document.getElementById('archiveEditId');
        if (eid) eid.value = '';
        const titleEl = document.getElementById('archiveModalTitle');
        if (titleEl) titleEl.textContent = 'Upload to Archive';
        const typeSel = document.getElementById('archiveType');
        if (typeSel) typeSel.disabled = false;
        const owg = document.getElementById('archiveOwnWorkGroup');
        if (owg) owg.style.display = 'block';
        const owc = document.getElementById('archiveOwnWork');
        if (owc) owc.required = true;
        const ft = document.getElementById('archiveFileLabelText');
        if (ft) ft.textContent = 'File *';
        const fh = document.getElementById('archiveFileHint');
        if (fh) fh.textContent = 'PDF, Word, PowerPoint, or text. Max 10 MB.';
        const st = document.getElementById('archiveUploadSubmitText');
        if (st) st.textContent = 'Upload';
        const si = document.getElementById('archiveUploadSubmitIcon');
        if (si) si.className = 'fas fa-upload';
    }

    function openEditModal(item) {
        if (item.externalLink) {
            alert('This entry is a shared link. Edit or delete it from the Position Paper Archive page.');
            return;
        }
        editingItem = item;
        const eid = document.getElementById('archiveEditId');
        if (eid) eid.value = item.id;
        const titleEl = document.getElementById('archiveModalTitle');
        if (titleEl) titleEl.textContent = 'Edit archive item';
        const typeSel = document.getElementById('archiveType');
        if (typeSel) {
            typeSel.value = item.type || '';
            typeSel.disabled = true;
        }
        document.getElementById('archiveTitle').value = item.title || '';
        document.getElementById('archiveDescription').value = item.description || '';
        setArchiveAwardRadio(item.posPaperAward || 'none');
        syncArchivePosPaperAwardVisibility();
        const owg = document.getElementById('archiveOwnWorkGroup');
        if (owg) owg.style.display = 'none';
        const owc = document.getElementById('archiveOwnWork');
        if (owc) {
            owc.required = false;
            owc.checked = false;
        }
        const fileIn = document.getElementById('archiveFile');
        if (fileIn) fileIn.value = '';
        const ft = document.getElementById('archiveFileLabelText');
        if (ft) ft.textContent = 'Replace file (optional)';
        const fh = document.getElementById('archiveFileHint');
        if (fh) fh.textContent = 'Leave empty to keep the current file. Max 10 MB.';
        const st = document.getElementById('archiveUploadSubmitText');
        if (st) st.textContent = 'Save changes';
        const si = document.getElementById('archiveUploadSubmitIcon');
        if (si) si.className = 'fas fa-save';

        const modal = document.getElementById('archiveUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
    }

    async function confirmDeleteItem(id) {
        if (!confirm('Delete this submission permanently? This cannot be undone.')) return;
        const uid = getCurrentUid();
        if (!uid) {
            alert('You must be signed in.');
            return;
        }
        if (typeof FirebaseArchive.deleteArchiveItem !== 'function') {
            alert('Delete is not available.');
            return;
        }
        const result = await FirebaseArchive.deleteArchiveItem(id, uid);
        if (result.success) {
            await loadArchive();
        } else {
            alert(result.error || 'Could not delete.');
        }
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

        const uid = getCurrentUid();

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'archive-card content-section';
            card.style.cssText = 'padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-glass);';
            const dateStr = item.createdAt && (item.createdAt.toDate ? item.createdAt.toDate() : new Date(item.createdAt.seconds * 1000)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
            const isOwner = uid && item.authorId && String(item.authorId) === uid;
            const actionsHtml = isOwner
                ? `<div class="archive-card-actions" style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    <button type="button" class="btn btn-secondary btn-sm archive-edit-btn" data-item-id="${escapeAttr(item.id)}"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="btn btn-secondary btn-sm archive-delete-btn" data-item-id="${escapeAttr(item.id)}"><i class="fas fa-trash-alt"></i> Delete</button>
                </div>`
                : '';
            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--accent-blue); opacity: 0.2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas ${getTypeIcon(item.type)}" style="color: var(--accent-blue);"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${escapeHtml(item.title || 'Untitled')}</h3>
                        <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">${getTypeLabel(item.type)}</p>
                        ${item.type === 'position-papers' && getPosPaperAwardBadgeHtml(item.posPaperAward) ? `<div style="margin-top: 0.35rem; display: flex; flex-wrap: wrap; gap: 0.35rem;">${getPosPaperAwardBadgeHtml(item.posPaperAward)}</div>` : ''}
                        ${item.description ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(item.description)}</p>` : ''}
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.75rem; color: var(--text-tertiary);">${dateStr}</p>
                        <a href="${escapeHtml(item.fileUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-top: 0.75rem; display: inline-flex; align-items: center; gap: 0.5rem;">
                            <i class="fas ${item.externalLink ? 'fa-external-link-alt' : 'fa-download'}"></i> ${item.externalLink ? 'Open link' : 'Download'}
                        </a>
                        ${actionsHtml}
                    </div>
                </div>
            `;
            listEl.appendChild(card);
        });
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
        setModalModeAdd();
        const modal = document.getElementById('archiveUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
        syncArchivePosPaperAwardVisibility();
    }

    function closeUploadModal() {
        const modal = document.getElementById('archiveUploadModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
        const form = document.getElementById('archiveUploadForm');
        if (form) form.reset();
        const noneRadio = document.querySelector('input[name="archivePosPaperAward"][value="none"]');
        if (noneRadio) noneRadio.checked = true;
        setModalModeAdd();
        syncArchivePosPaperAwardVisibility();
    }

    async function handleUpload(e) {
        e.preventDefault();
        const typeEl = document.getElementById('archiveType');
        const titleEl = document.getElementById('archiveTitle');
        const descEl = document.getElementById('archiveDescription');
        const fileEl = document.getElementById('archiveFile');
        const submitBtn = document.getElementById('archiveUploadSubmit');
        const editIdEl = document.getElementById('archiveEditId');
        const editId = editIdEl && editIdEl.value ? editIdEl.value.trim() : '';

        if (!typeEl || !titleEl || !submitBtn) return;

        const user = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        const uid = user ? String(user.id || user.uid || '') : '';

        if (editId && editingItem) {
            if (!uid) {
                alert('You must be signed in.');
                return;
            }
            if (!titleEl.value.trim()) {
                alert('Please enter a title.');
                return;
            }
            if (typeof FirebaseArchive.updateArchiveItem !== 'function') {
                alert('Editing is not available.');
                return;
            }
            const file = fileEl && fileEl.files[0];
            if (file && file.size > MAX_FILE_SIZE) {
                alert('File must be 10 MB or smaller.');
                return;
            }
            const updates = {
                title: titleEl.value.trim(),
                description: (descEl && descEl.value) ? descEl.value.trim() : ''
            };
            if (editingItem.type === 'position-papers') {
                const awardEl = document.querySelector('input[name="archivePosPaperAward"]:checked');
                updates.posPaperAward = awardEl ? awardEl.value : 'none';
            }
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving…';
            try {
                const result = await FirebaseArchive.updateArchiveItem(editId, uid, updates, { file: file || undefined });
                if (result.success) {
                    closeUploadModal();
                    await loadArchive();
                    alert('Saved.');
                } else {
                    alert(result.error || 'Could not save.');
                }
            } catch (err) {
                alert(err.message || 'Could not save.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save" id="archiveUploadSubmitIcon"></i> <span id="archiveUploadSubmitText">Save changes</span>';
            }
            return;
        }

        const file = fileEl && fileEl.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            alert('File must be 10 MB or smaller.');
            return;
        }

        const ownWorkEl = document.getElementById('archiveOwnWork');
        if (!ownWorkEl || !ownWorkEl.checked) {
            alert('Please tick the box to confirm this is your own work (or that you have permission to share it).');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading…';

        const payload = {
            type: typeEl.value,
            title: titleEl.value.trim(),
            description: (descEl && descEl.value) ? descEl.value.trim() : '',
            confirmOwnWork: true,
            authorName: '',
            authorId: uid
        };
        if (typeEl.value === 'position-papers') {
            const awardEl = document.querySelector('input[name="archivePosPaperAward"]:checked');
            payload.posPaperAward = awardEl ? awardEl.value : 'none';
        }

        try {
            const result = await FirebaseArchive.addArchiveItem(file, payload);
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
            submitBtn.innerHTML = '<i class="fas fa-upload" id="archiveUploadSubmitIcon"></i> <span id="archiveUploadSubmitText">Upload</span>';
        }
    }

    function syncArchivePosPaperAwardVisibility() {
        const typeEl = document.getElementById('archiveType');
        const wrap = document.getElementById('archivePosPaperAwardWrap');
        if (!typeEl || !wrap) return;
        wrap.style.display = typeEl.value === 'position-papers' ? 'block' : 'none';
    }

    function onListClick(e) {
        const delBtn = e.target.closest('.archive-delete-btn');
        if (delBtn) {
            const id = delBtn.getAttribute('data-item-id');
            if (id) confirmDeleteItem(id);
            return;
        }
        const editBtn = e.target.closest('.archive-edit-btn');
        if (editBtn) {
            const id = editBtn.getAttribute('data-item-id');
            const item = id ? findItemById(id) : null;
            if (item) openEditModal(item);
        }
    }

    function init() {
        loadArchive();
        setupFilters();
        showUploadButton();

        const listEl = document.getElementById('archiveList');
        if (listEl) listEl.addEventListener('click', onListClick);

        const archiveTypeEl = document.getElementById('archiveType');
        if (archiveTypeEl) {
            archiveTypeEl.addEventListener('change', syncArchivePosPaperAwardVisibility);
        }

        document.getElementById('archiveUploadBtn') && document.getElementById('archiveUploadBtn').addEventListener('click', function () {
            openUploadModal();
            syncArchivePosPaperAwardVisibility();
        });
        document.getElementById('archiveUploadModalClose') && document.getElementById('archiveUploadModalClose').addEventListener('click', closeUploadModal);
        document.getElementById('archiveUploadCancel') && document.getElementById('archiveUploadCancel').addEventListener('click', closeUploadModal);
        document.getElementById('archiveUploadModal') && document.getElementById('archiveUploadModal').addEventListener('click', function (e) {
            if (e.target === this) closeUploadModal();
        });
        document.getElementById('archiveUploadForm') && document.getElementById('archiveUploadForm').addEventListener('submit', handleUpload);

        window.addEventListener('munAuthStateReady', function () {
            showUploadButton();
            renderList();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
