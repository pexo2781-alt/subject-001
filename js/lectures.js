// ============================================================
// js/lectures.js — Lecture manager (per module)
// ============================================================

import { getContent, mutateContent, onContentChange } from './content.js';
import { openQuestionEditor } from './question-editor.js';

const els = {};
let currentModuleId = null;
let selectedLectureId = null;
let unsubscribe = null;

export function initLectures() {
  Object.assign(els, {
    view: document.getElementById('view-lectures'),
    title: document.getElementById('lecturesTitle'),
    kicker: document.getElementById('lecturesKicker'),
    list: document.getElementById('lecturesList'),
    addBtn: document.getElementById('lecturesAddBtn'),
    backBtn: document.getElementById('lecturesBackBtn'),
    reorderBar: document.getElementById('lecturesReorderBar'),
    reorderHint: document.getElementById('lecturesReorderHint'),
    reorderUp: document.getElementById('lecturesReorderUp'),
    reorderDown: document.getElementById('lecturesReorderDown'),
    reorderDone: document.getElementById('lecturesReorderDone'),
    toast: document.getElementById('cmsToast')
  });

  if (!els.view) return;

  els.addBtn.addEventListener('click', openAddModal);
  els.backBtn.addEventListener('click', backToModules);
  els.reorderDone.addEventListener('click', clearSelection);
  els.reorderUp?.addEventListener('click', () => moveSelected(-1));
  els.reorderDown?.addEventListener('click', () => moveSelected(1));

  render();
}

export function openLectureManager(moduleId) {
  currentModuleId = moduleId;
  selectedLectureId = null;

  document.getElementById('view-modules')?.classList.remove('is-active');
  document.getElementById('view-questions')?.classList.remove('is-active');
  els.view.classList.add('is-active');

  render();

  if (unsubscribe) unsubscribe();
  unsubscribe = onContentChange(() => render());
}

function backToModules() {
  if (unsubscribe) { unsubscribe(); unsubscribe = null; }
  els.view.classList.remove('is-active');
  document.getElementById('view-modules')?.classList.add('is-active');
}

function getCurrentModule() {
  const { modules } = getContent();
  return modules.find(m => m.id === currentModuleId) || null;
}

function render() {
  const mod = getCurrentModule();
  if (!mod) { backToModules(); return; }

  els.title.textContent = mod.name;
  els.kicker.textContent = '// LECTURES';

  const lectures = [...(mod.lectures || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  els.list.innerHTML = '';

  if (lectures.length === 0) {
    els.list.innerHTML = `
      <div class="cms-empty">
        <div class="cms-empty-title">No lectures yet</div>
        <div>Click <strong>+ New</strong> above to add your first lecture.</div>
      </div>`;
    els.reorderBar.style.display = 'none';
    return;
  }

  lectures.forEach((lec, idx) => {
    const item = document.createElement('div');
    item.className = 'cms-item';
    if (lec.id === selectedLectureId) item.classList.add('is-selected');
    item.dataset.lectureId = lec.id;

    const qCount = lec.questions?.length ?? 0;

    item.innerHTML = `
      <span class="cms-item-num">${String(idx + 1).padStart(2, '0')}</span>
      <div style="min-width:0;">
        <div class="cms-item-name">${escapeHtml(lec.name)}</div>
        <div class="cms-item-sub">${qCount} question${qCount === 1 ? '' : 's'}</div>
      </div>
      <div class="cms-item-actions">
        <button class="cms-icon-btn" data-action="edit" title="Rename">✎</button>
        <button class="cms-icon-btn is-danger" data-action="delete" title="Delete">🗑</button>
      </div>
      <div class="cms-item-actions">
        <button class="cms-icon-btn" data-action="questions" title="Edit questions">✎✎</button>
        <button class="cms-icon-btn" data-action="play" title="Play">▶</button>
      </div>
    `;

    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'edit')      { e.stopPropagation(); openEditModal(lec); return; }
      if (action === 'delete')    { e.stopPropagation(); openDeleteConfirm(lec); return; }
      if (action === 'play')      { e.stopPropagation(); playLecture(lec); return; }
      if (action === 'questions') { e.stopPropagation(); openQuestionEditor(currentModuleId, lec.id); return; }

      if (selectedLectureId === lec.id) clearSelection();
      else selectLecture(lec.id);
    });

    els.list.appendChild(item);
  });
}

function selectLecture(lectureId) {
  selectedLectureId = lectureId;
  els.reorderBar.style.display = 'flex';
  els.reorderHint.textContent = '↑↓ to move · Done to exit';
  els.reorderHint.classList.add('is-active');
  render();
  updateReorderButtons();
}

function clearSelection() {
  selectedLectureId = null;
  els.reorderBar.style.display = 'none';
  els.reorderHint.classList.remove('is-active');
  render();
}

function updateReorderButtons() {
  const mod = getCurrentModule();
  if (!mod) return;
  const sorted = [...(mod.lectures || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(l => l.id === selectedLectureId);
  els.reorderUp.disabled = idx <= 0;
  els.reorderDown.disabled = idx === -1 || idx >= sorted.length - 1;
}

function moveSelected(direction) {
  if (!selectedLectureId || !currentModuleId) return;
  const mod = getCurrentModule();
  if (!mod) return;

  const sorted = [...mod.lectures].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const idx = sorted.findIndex(l => l.id === selectedLectureId);
  if (idx === -1) return;
  const target = idx + direction;
  if (target < 0 || target >= sorted.length) return;

  const [moved] = sorted.splice(idx, 1);
  sorted.splice(target, 0, moved);

  mutateContent((draft) => {
    const m = draft.modules.find(x => x.id === currentModuleId);
    if (m) m.lectures = sorted.map((l, i) => ({ ...l, order: i }));
    return draft;
  }, { label: `Reorder lecture: ${moved.name}` })
    .then(render)
    .catch(showError);
}

function playLecture(lec) {
  if (!lec.questions?.length) {
    showToast('This lecture has no questions yet', true);
    return;
  }
  document.getElementById('view-lectures')?.classList.remove('is-active');
  document.getElementById('view-modules')?.classList.remove('is-active');
  document.getElementById('view-degree')?.classList.remove('is-active');

  if (typeof window.__btSetLecture === 'function') {
    window.__btSetLecture(currentModuleId, lec.id);
  }
  if (typeof window.__btReset === 'function') window.__btReset();
  const view = document.querySelector('[data-drill-view="biology-test"]');
  if (view) view.classList.add('is-active');
  const topbar = document.getElementById('labTopbar');
  if (topbar) topbar.style.display = 'none';
}

function openAddModal() { openModal({ mode: 'add' }); }
function openEditModal(lec) { openModal({ mode: 'edit', lecture: lec }); }

function openModal({ mode, lecture }) {
  const overlay = document.createElement('div');
  overlay.className = 'cms-modal-overlay is-open';
  const isEdit = mode === 'edit';

  overlay.innerHTML = `
    <div class="cms-modal">
      <div class="cms-modal-title">${isEdit ? 'Rename lecture' : 'New lecture'}</div>
      <div class="cms-modal-field">
        <label for="cmsLectureName">Lecture name</label>
        <input id="cmsLectureName" type="text" value="${isEdit ? escapeAttr(lecture.name) : ''}" placeholder="e.g. Lecture 3: Gene Expression" autocomplete="off">
      </div>
      <div class="cms-modal-actions">
        <button class="lab-btn secondary" data-action="cancel">Cancel</button>
        <button class="lab-btn" data-action="confirm">${isEdit ? 'Save' : 'Create'}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const input = overlay.querySelector('#cmsLectureName');
  input.focus();
  input.select();

  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    close();
    if (isEdit) renameLecture(lecture, name);
    else createLecture(name);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') overlay.querySelector('[data-action="confirm"]').click();
    if (e.key === 'Escape') close();
  });
}

function createLecture(name) {
  mutateContent((draft) => {
    const m = draft.modules.find(x => x.id === currentModuleId);
    if (!m) return draft;
    if (!m.lectures) m.lectures = [];
    const maxOrder = m.lectures.reduce((mx, l) => Math.max(mx, l.order ?? 0), -1);
    m.lectures.push({
      id: `lec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      order: maxOrder + 1,
      feedback: {
        showExplanation: true,
        correctTitle: 'Correct.',
        incorrectTitle: 'Incorrect.',
        winTitle: 'LECTURE PASSED',
        failTitle: 'LECTURE FAILED'
      },
      questions: []
    });
    return draft;
  }, { label: `Add lecture: ${name}` })
    .then(() => { showToast('Lecture created'); render(); })
    .catch(showError);
}

function renameLecture(lec, name) {
  mutateContent((draft) => {
    const m = draft.modules.find(x => x.id === currentModuleId);
    const target = m?.lectures?.find(l => l.id === lec.id);
    if (target) target.name = name;
    return draft;
  }, { label: `Rename lecture: ${lec.name} → ${name}` })
    .then(() => { showToast('Lecture renamed'); render(); })
    .catch(showError);
}

function openDeleteConfirm(lec) {
  const overlay = document.createElement('div');
  overlay.className = 'cms-modal-overlay is-open';
  const qCount = lec.questions?.length ?? 0;

  overlay.innerHTML = `
    <div class="cms-modal is-confirm">
      <div class="cms-modal-title">Delete lecture?</div>
      <div class="cms-confirm-text">
        <p>You are about to delete <strong>${escapeHtml(lec.name)}</strong> and its <strong>${qCount}</strong> question${qCount === 1 ? '' : 's'}.</p>
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
    deleteLecture(lec);
  });
}

function deleteLecture(lec) {
  mutateContent((draft) => {
    const m = draft.modules.find(x => x.id === currentModuleId);
    if (m) {
      m.lectures = m.lectures
        .filter(l => l.id !== lec.id)
        .map((l, i) => ({ ...l, order: i }));
    }
    return draft;
  }, { label: `Delete lecture: ${lec.name}` })
    .then(() => {
      if (selectedLectureId === lec.id) selectedLectureId = null;
      showToast('Lecture deleted');
      render();
    })
    .catch(showError);
}

function showToast(msg, isError = false) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.classList.toggle('is-error', isError);
  els.toast.classList.add('is-visible');
  clearTimeout(els.toast._t);
  els.toast._t = setTimeout(() => els.toast.classList.remove('is-visible'), 2200);
}

function showError(err) {
  console.error('[lectures]', err);
  showToast(err?.message || 'Something went wrong', true);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
