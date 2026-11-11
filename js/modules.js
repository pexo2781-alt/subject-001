// ============================================================
// js/modules.js — Degree module manager
//
// Features:
//   - List modules (from content.js)
//   - Add / rename / delete modules
//   - Reorder via select-then-swap OR up/down arrows
//   - Click a module to open its lecture list
// ============================================================

import { getContent, mutateContent, onContentChange } from './content.js';
import { openLectureManager } from './lectures.js';

const els = {};
let selectedModuleId = null;

export function initModules() {
  Object.assign(els, {
    view: document.getElementById('view-modules'),
    list: document.getElementById('modulesList'),
    addBtn: document.getElementById('modulesAddBtn'),
    backBtn: document.getElementById('modulesBackBtn'),
    reorderBar: document.getElementById('modulesReorderBar'),
    reorderHint: document.getElementById('modulesReorderHint'),
    reorderUp: document.getElementById('modulesReorderUp'),
    reorderDown: document.getElementById('modulesReorderDown'),
    reorderDone: document.getElementById('modulesReorderDone'),
    toast: document.getElementById('cmsToast')
  });

  if (!els.view) return;

  els.addBtn.addEventListener('click', openAddModal);
  els.backBtn.addEventListener('click', () => {
    // Back to Degree picker
    document.getElementById('view-modules')?.classList.remove('is-active');
    document.getElementById('view-degree')?.classList.add('is-active');
  });

  els.reorderDone.addEventListener('click', clearSelection);
  els.reorderUp?.addEventListener('click', () => moveSelected(-1));
  els.reorderDown?.addEventListener('click', () => moveSelected(1));

  // React to external content changes (e.g., after seed)
  onContentChange(() => render());

  // Render initial
  render();
}

export function showModuleManager() {
  document.getElementById('view-degree')?.classList.remove('is-active');
  document.getElementById('view-modules')?.classList.add('is-active');
  render();
}

function render() {
  const { modules } = getContent();
  const sorted = [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  els.list.innerHTML = '';

  if (sorted.length === 0) {
    els.list.innerHTML = `
      <div class="cms-empty">
        <div class="cms-empty-title">No modules yet</div>
        <div>Click <strong>+ New</strong> above to create your first module.</div>
      </div>`;
    els.reorderBar.style.display = 'none';
    return;
  }

  sorted.forEach((mod, idx) => {
    const item = document.createElement('div');
    item.className = 'cms-item';
    if (mod.id === selectedModuleId) item.classList.add('is-selected');
    item.dataset.moduleId = mod.id;

    const lectureCount = mod.lectures?.length ?? 0;

    item.innerHTML = `
      <span class="cms-item-num">${String(idx + 1).padStart(2, '0')}</span>
      <div style="min-width:0;">
        <div class="cms-item-name">${escapeHtml(mod.name)}</div>
        <div class="cms-item-sub">${lectureCount} lecture${lectureCount === 1 ? '' : 's'}</div>
      </div>
      <div class="cms-item-actions">
        <button class="cms-icon-btn" data-action="edit" title="Rename">✎</button>
        <button class="cms-icon-btn is-danger" data-action="delete" title="Delete">🗑</button>
      </div>
      <div class="cms-item-actions">
        <button class="cms-icon-btn" data-action="open" title="Open lectures">→</button>
      </div>
    `;

    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'edit') { e.stopPropagation(); openEditModal(mod); return; }
      if (action === 'delete') { e.stopPropagation(); openDeleteConfirm(mod); return; }
      if (action === 'open') { e.stopPropagation(); openLectureManager(mod.id); return; }

      // Body click = select / deselect (for reorder)
      if (selectedModuleId === mod.id) {
        clearSelection();
      } else {
        selectModule(mod.id);
      }
    });

    els.list.appendChild(item);
  });
}

function selectModule(moduleId) {
  selectedModuleId = moduleId;
  els.reorderBar.style.display = 'flex';
  els.reorderHint.textContent = '↑↓ to move · Done to exit';
  els.reorderHint.classList.add('is-active');
  render();
  updateReorderButtons();
}

function clearSelection() {
  selectedModuleId = null;
  els.reorderBar.style.display = 'none';
  els.reorderHint.classList.remove('is-active');
  render();
}

function updateReorderButtons() {
  const { modules } = getContent();
  const sorted = [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(m => m.id === selectedModuleId);
  els.reorderUp.disabled = idx <= 0;
  els.reorderDown.disabled = idx === -1 || idx >= sorted.length - 1;
}

function moveSelected(direction) {
  if (!selectedModuleId) return;
  const { modules } = getContent();
  const sorted = [...modules].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(m => m.id === selectedModuleId);
  if (idx === -1) return;
  const target = idx + direction;
  if (target < 0 || target >= sorted.length) return;

  const [moved] = sorted.splice(idx, 1);
  sorted.splice(target, 0, moved);

  mutateContent((draft) => {
    draft.modules = sorted.map((m, i) => ({ ...m, order: i }));
    return draft;
  }, { label: `Reorder module: ${moved.name}` }).then(render).catch(showError);
}

// ---------- Add / Edit modal ----------

function openAddModal() { openModal({ mode: 'add' }); }
function openEditModal(mod) { openModal({ mode: 'edit', module: mod }); }

function openModal({ mode, module }) {
  const overlay = document.createElement('div');
  overlay.className = 'cms-modal-overlay is-open';

  const isEdit = mode === 'edit';
  overlay.innerHTML = `
    <div class="cms-modal">
      <div class="cms-modal-title">${isEdit ? 'Rename module' : 'New module'}</div>
      <div class="cms-modal-field">
        <label for="cmsModuleName">Module name</label>
        <input id="cmsModuleName" type="text" value="${isEdit ? escapeAttr(module.name) : ''}" placeholder="e.g. Molecular Biology & Genetics" autocomplete="off">
      </div>
      <div class="cms-modal-actions">
        <button class="lab-btn secondary" data-action="cancel">Cancel</button>
        <button class="lab-btn" data-action="confirm">${isEdit ? 'Save' : 'Create'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const input = overlay.querySelector('#cmsModuleName');
  input.focus();
  input.select();

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    close();
    if (isEdit) renameModule(module, name);
    else createModule(name);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') overlay.querySelector('[data-action="confirm"]').click();
    if (e.key === 'Escape') close();
  });
}

function createModule(name) {
  mutateContent((draft) => {
    const maxOrder = draft.modules.reduce((m, x) => Math.max(m, x.order ?? 0), -1);
    draft.modules.push({
      id: `mod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      order: maxOrder + 1,
      lectures: []
    });
    return draft;
  }, { label: `Add module: ${name}` })
    .then(() => { showToast('Module created'); render(); })
    .catch(showError);
}

function renameModule(mod, name) {
  mutateContent((draft) => {
    const target = draft.modules.find(m => m.id === mod.id);
    if (target) target.name = name;
    return draft;
  }, { label: `Rename module: ${mod.name} → ${name}` })
    .then(() => { showToast('Module renamed'); render(); })
    .catch(showError);
}

// ---------- Delete ----------

function openDeleteConfirm(mod) {
  const overlay = document.createElement('div');
  overlay.className = 'cms-modal-overlay is-open';
  const lectureCount = mod.lectures?.length ?? 0;

  overlay.innerHTML = `
    <div class="cms-modal is-confirm">
      <div class="cms-modal-title">Delete module?</div>
      <div class="cms-confirm-text">
        <p>You are about to delete <strong>${escapeHtml(mod.name)}</strong> and its <strong>${lectureCount}</strong> lecture${lectureCount === 1 ? '' : 's'}.</p>
        <p style="margin-top:0.5rem;font-size:0.85rem;">A version snapshot is saved automatically, so you can restore it later.</p>
      </div>
      <div class="cms-modal-actions">
        <button class="lab-btn secondary" data-action="cancel">Cancel</button>
        <button class="lab-btn" data-action="delete" style="border-color:#ff5555;color:#ff5555;">Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
  overlay.querySelector('[data-action="delete"]').addEventListener('click', () => {
    overlay.remove();
    deleteModule(mod);
  });
}

function deleteModule(mod) {
  mutateContent((draft) => {
    draft.modules = draft.modules
      .filter(m => m.id !== mod.id)
      .map((m, i) => ({ ...m, order: i }));
    return draft;
  }, { label: `Delete module: ${mod.name}` })
    .then(() => {
      if (selectedModuleId === mod.id) selectedModuleId = null;
      showToast('Module deleted');
      render();
    })
    .catch(showError);
}

// ---------- Helpers ----------

function showToast(msg, isError = false) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.classList.toggle('is-error', isError);
  els.toast.classList.add('is-visible');
  clearTimeout(els.toast._t);
  els.toast._t = setTimeout(() => els.toast.classList.remove('is-visible'), 2200);
}

function showError(err) {
  console.error('[modules]', err);
  showToast(err?.message || 'Something went wrong', true);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
