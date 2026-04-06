/**
 * Position Paper Archive: community uploads (Firestore `archive`, type position-papers).
 * Owners can edit or delete their own submissions (authorId match).
 */
(function () {
    let archiveItems = [];
    let currentFilter = 'all';
    let editingItem = null;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    function posPapersOnly() {
        return archiveItems.filter(item => item.type === 'position-papers');
    }

    function getCurrentUid() {
        const u = window.__munCurrentUser !== undefined ? window.__munCurrentUser : JSON.parse(localStorage.getItem('munCurrentUser') || 'null');
        return u && (u.uid || u.id) ? String(u.uid || u.id) : '';
    }

    function findItemById(id) {
        return archiveItems.find(x => x.id === id);
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

    function getPreviewForItem(item) {
        const url = (item.fileUrl || '').trim();
        if (!url) return { kind: 'open', href: '' };

        if (/docs\.google\.com\/document\//.test(url)) {
            const m = url.match(/document\/d\/([a-zA-Z0-9-_]+)/);
            if (m) {
                return { kind: 'iframe', src: 'https://docs.google.com/document/d/' + m[1] + '/preview' };
            }
        }

        const name = item.fileName || '';
        const looksPdf = /\.pdf(\?|$)/i.test(url) || /\.pdf$/i.test(name);
        if (looksPdf) {
            return {
                kind: 'iframe',
                src: 'https://docs.google.com/viewer?url=' + encodeURIComponent(url) + '&embedded=true'
            };
        }

        return { kind: 'open', href: url };
    }

    function buildPreviewHtml(item) {
        const url = (item.fileUrl || '').trim();
        if (!url) return '';

        const preview = getPreviewForItem(item);
        const safeUrl = escapeHtml(url);

        if (preview.kind === 'iframe' && preview.src) {
            return `
                <div class="pos-paper-embed-wrap">
                    <iframe class="pos-paper-embed-frame" src="${escapeAttr(preview.src)}" title="Document preview"></iframe>
                </div>
                <p class="pos-paper-embed-open"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Open original in new tab</a></p>
            `;
        }

        return `
            <p style="margin-top: 0.75rem;">
                <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-external-link-alt"></i> Open document
                </a>
            </p>
        `;
    }

    function setAwardRadio(value) {
        const v = value || 'none';
        document.querySelectorAll('input[name="posPaperAward"]').forEach(r => {
            r.checked = r.value === v;
        });
    }

    function setModalModeAdd() {
        editingItem = null;
        const eid = document.getElementById('posPaperEditId');
        if (eid) eid.value = '';
        const titleEl = document.getElementById('posPaperModalTitle');
        if (titleEl) titleEl.textContent = 'Add position paper';
        const sg = document.getElementById('posPaperSourceGroup');
        if (sg) sg.style.display = 'block';
        const ow = document.getElementById('posPaperOwnWorkGroup');
        if (ow) ow.style.display = 'block';
        const owc = document.getElementById('posPaperOwnWork');
        if (owc) owc.required = true;
        const ft = document.getElementById('posPaperFileLabelText');
        if (ft) ft.textContent = 'File *';
        const fh = document.getElementById('posPaperFileHint');
        if (fh) fh.textContent = 'PDF or Word preferred. Max 10 MB.';
        const st = document.getElementById('posPaperUploadSubmitText');
        if (st) st.textContent = 'Add';
        const si = document.getElementById('posPaperUploadSubmitIcon');
        if (si) si.className = 'fas fa-upload';
    }

    function openEditModal(item) {
        editingItem = item;
        const eid = document.getElementById('posPaperEditId');
        if (eid) eid.value = item.id;
        const titleEl = document.getElementById('posPaperModalTitle');
        if (titleEl) titleEl.textContent = 'Edit position paper';
        const sg = document.getElementById('posPaperSourceGroup');
        if (sg) sg.style.display = 'none';
        const owg = document.getElementById('posPaperOwnWorkGroup');
        if (owg) owg.style.display = 'none';
        const owc = document.getElementById('posPaperOwnWork');
        if (owc) {
            owc.required = false;
            owc.checked = false;
        }
        document.getElementById('posPaperTitle').value = item.title || '';
        document.getElementById('posPaperDescription').value = item.description || '';
        setAwardRadio(item.posPaperAward || 'none');

        const fileG = document.getElementById('posPaperFileGroup');
        const linkG = document.getElementById('posPaperLinkGroup');
        const linkIn = document.getElementById('posPaperLinkUrl');
        const fileIn = document.getElementById('posPaperFile');

        if (item.externalLink) {
            if (fileG) fileG.style.display = 'none';
            if (linkG) linkG.style.display = 'block';
            if (linkIn) linkIn.value = item.fileUrl || '';
            if (fileIn) fileIn.value = '';
        } else {
            if (fileG) fileG.style.display = 'block';
            if (linkG) linkG.style.display = 'none';
            if (linkIn) linkIn.value = '';
            if (fileIn) fileIn.value = '';
            const ft = document.getElementById('posPaperFileLabelText');
            if (ft) ft.textContent = 'Replace file (optional)';
            const fh = document.getElementById('posPaperFileHint');
            if (fh) fh.textContent = 'Leave empty to keep the current file. PDF or Word. Max 10 MB.';
        }

        const st = document.getElementById('posPaperUploadSubmitText');
        if (st) st.textContent = 'Save changes';
        const si = document.getElementById('posPaperUploadSubmitIcon');
        if (si) si.className = 'fas fa-save';

        const modal = document.getElementById('posPaperUploadModal');
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
                    ? 'No position papers yet. Log in and add a file or link to share your work.'
                    : 'No papers match this filter.';
            }
            return;
        }

        if (emptyEl) emptyEl.style.display = 'none';

        const uid = getCurrentUid();

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pos-paper-archive-card content-section';
            card.style.cssText = 'padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-glass);';
            const badges = getAwardBadgeHtml(item.posPaperAward);
            const isOwner = uid && item.authorId && String(item.authorId) === uid;
            const actionsHtml = isOwner
                ? `<div class="pos-paper-card-actions" style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
                    <button type="button" class="btn btn-secondary btn-sm pos-paper-edit-btn" data-item-id="${escapeAttr(item.id)}"><i class="fas fa-edit"></i> Edit</button>
                    <button type="button" class="btn btn-secondary btn-sm pos-paper-delete-btn" data-item-id="${escapeAttr(item.id)}"><i class="fas fa-trash-alt"></i> Delete</button>
                </div>`
                : '';
            card.innerHTML = `
                <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--accent-blue); opacity: 0.2; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fas fa-file-word" style="color: var(--accent-blue);"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <h3 style="margin: 0 0 0.25rem 0; font-size: 1rem;">${escapeHtml(item.title || 'Untitled')}</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-bottom: 0.25rem;">
                            ${badges ? badges : '<span style="font-size: 0.75rem; color: var(--text-tertiary);">Community example</span>'}
                        </div>
                        ${item.description ? `<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary);">${escapeHtml(item.description)}</p>` : ''}
                        ${buildPreviewHtml(item)}
                        ${actionsHtml}
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

    function getSourceMode() {
        const el = document.querySelector('input[name="posPaperSource"]:checked');
        return el ? el.value : 'file';
    }

    function syncPosPaperSourceUi() {
        const fileGroup = document.getElementById('posPaperFileGroup');
        const linkGroup = document.getElementById('posPaperLinkGroup');
        const fileInput = document.getElementById('posPaperFile');
        const linkInput = document.getElementById('posPaperLinkUrl');
        const mode = getSourceMode();
        if (fileGroup) fileGroup.style.display = mode === 'file' ? 'block' : 'none';
        if (linkGroup) linkGroup.style.display = mode === 'link' ? 'block' : 'none';
        if (fileInput && mode === 'link') fileInput.value = '';
        if (linkInput && mode === 'file') linkInput.value = '';
    }

    function openUploadModal() {
        setModalModeAdd();
        const modal = document.getElementById('posPaperUploadModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('show');
        }
        syncPosPaperSourceUi();
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
        const fileSource = document.querySelector('input[name="posPaperSource"][value="file"]');
        if (fileSource) fileSource.checked = true;
        setModalModeAdd();
        syncPosPaperSourceUi();
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
        const linkEl = document.getElementById('posPaperLinkUrl');
        const submitBtn = document.getElementById('posPaperUploadSubmit');
        const editIdEl = document.getElementById('posPaperEditId');
        const editId = editIdEl && editIdEl.value ? editIdEl.value.trim() : '';

        if (!titleEl || !submitBtn) return;

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
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving…';
            try {
                let result;
                if (editingItem.externalLink) {
                    const linkUrl = (linkEl && linkEl.value) ? linkEl.value.trim() : '';
                    if (!linkUrl) {
                        alert('Please enter the HTTPS link.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-save" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Save changes</span>';
                        return;
                    }
                    result = await FirebaseArchive.updateArchiveItem(editId, uid, {
                        title: titleEl.value.trim(),
                        description: (descEl && descEl.value) ? descEl.value.trim() : '',
                        posPaperAward: getSelectedAward(),
                        linkUrl: linkUrl
                    }, {});
                } else {
                    const file = fileEl && fileEl.files[0];
                    if (file && file.size > MAX_FILE_SIZE) {
                        alert('File must be 10 MB or smaller.');
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-save" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Save changes</span>';
                        return;
                    }
                    result = await FirebaseArchive.updateArchiveItem(editId, uid, {
                        title: titleEl.value.trim(),
                        description: (descEl && descEl.value) ? descEl.value.trim() : '',
                        posPaperAward: getSelectedAward()
                    }, { file: file || undefined });
                }
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
                const si = document.getElementById('posPaperUploadSubmitIcon');
                const st = document.getElementById('posPaperUploadSubmitText');
                if (si) si.className = 'fas fa-save';
                if (st) st.textContent = 'Save changes';
            }
            return;
        }

        const ownWorkEl = document.getElementById('posPaperOwnWork');
        if (!ownWorkEl || !ownWorkEl.checked) {
            alert('Please tick the box to confirm this is your own work (or that you have permission to share it).');
            return;
        }

        const basePayload = {
            type: 'position-papers',
            title: titleEl.value.trim(),
            description: (descEl && descEl.value) ? descEl.value.trim() : '',
            posPaperAward: getSelectedAward(),
            confirmOwnWork: true,
            authorName: '',
            authorId: uid
        };

        if (!basePayload.title) {
            alert('Please enter a title.');
            return;
        }

        const mode = getSourceMode();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving…';

        try {
            let result;
            if (mode === 'link') {
                const linkUrl = (linkEl && linkEl.value) ? linkEl.value.trim() : '';
                if (!linkUrl) {
                    alert('Please paste a Google Doc or PDF link.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Add</span>';
                    return;
                }
                if (typeof FirebaseArchive.addArchiveLink !== 'function') {
                    alert('Link uploads are not available.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Add</span>';
                    return;
                }
                let hint = 'Link';
                if (/\.pdf(\?|$)/i.test(linkUrl)) hint = 'document.pdf';
                result = await FirebaseArchive.addArchiveLink(Object.assign({}, basePayload, {
                    linkUrl: linkUrl,
                    fileNameHint: hint
                }));
            } else {
                const file = fileEl && fileEl.files[0];
                if (!file) {
                    alert('Please select a file.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Add</span>';
                    return;
                }
                if (file.size > MAX_FILE_SIZE) {
                    alert('File must be 10 MB or smaller.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-upload" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Add</span>';
                    return;
                }
                result = await FirebaseArchive.addArchiveItem(file, basePayload);
            }

            if (result.success) {
                closeUploadModal();
                await loadArchive();
                alert('Added successfully.');
            } else {
                alert(result.error || 'Could not add item.');
            }
        } catch (err) {
            alert(err.message || 'Could not add item.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-upload" id="posPaperUploadSubmitIcon"></i> <span id="posPaperUploadSubmitText">Add</span>';
        }
    }

    function onListClick(e) {
        const delBtn = e.target.closest('.pos-paper-delete-btn');
        if (delBtn) {
            const id = delBtn.getAttribute('data-item-id');
            if (id) confirmDeleteItem(id);
            return;
        }
        const editBtn = e.target.closest('.pos-paper-edit-btn');
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

        const listEl = document.getElementById('posPaperArchiveList');
        if (listEl) listEl.addEventListener('click', onListClick);

        document.querySelectorAll('input[name="posPaperSource"]').forEach(r => {
            r.addEventListener('change', syncPosPaperSourceUi);
        });

        document.getElementById('posPaperUploadBtn') && document.getElementById('posPaperUploadBtn').addEventListener('click', openUploadModal);
        document.getElementById('posPaperUploadModalClose') && document.getElementById('posPaperUploadModalClose').addEventListener('click', closeUploadModal);
        document.getElementById('posPaperUploadCancel') && document.getElementById('posPaperUploadCancel').addEventListener('click', closeUploadModal);
        document.getElementById('posPaperUploadModal') && document.getElementById('posPaperUploadModal').addEventListener('click', function (e) {
            if (e.target === this) closeUploadModal();
        });
        document.getElementById('posPaperUploadForm') && document.getElementById('posPaperUploadForm').addEventListener('submit', handleUpload);

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
