// ============================================================
// js/question-editor.js — Full question editor
//
// Tabs:
//   - Questions: list / add / edit / delete / reorder questions
//   - Feedback:  per-lecture feedback settings
// ============================================================

import { getContent, mutateContent } from './content.js';

const els = {};
let currentModuleId = null;
let currentLectureId = null;
let selectedQuestionId = null;   // for select-then-swap reorder
let activeTab = 'questions';     // 'questions' | 'feedback'

const QUESTION_TYPES = [
  { value: 'typed',    label: 'Typed answer' },
  { value: 'fill',     label: 'Fill in the blank' },
  { value: 'mcq',      label: 'Multiple choice' },
  { value: 'tf',       label: 'True / False' },
  { value: 'sequence', label: 'Sequence ordering' },
  { value: 'match',    label: 'Matching pairs' }
];

export function initQuestionEditor() {
  Object.assign(els, {
    view: document.getElementById('view-questions'),
    title: document.getElementById('qeTitle'),
    kicker: document.getElementById('qeKicker'),
    backBtn: document.getElementById('qeBackBtn'),
    addBtn: document.getElementById('qeAddBtn'),
    tabs: Array.from(document.querySelectorAll('.qe-tab')),
    panelQuestions: document.getElementById('qePanelQuestions'),
    panelFeedback: document.getElementById('qePanelFeedback'),
    list: document.getElementById('qeList'),
    reorderBar: document.getElementById('qeReorderBar'),
    reorderHint: document.getElementById('qeReorderHint'),
    reorderDone: document.getElementById('qeReorderDone'),
    toast: document.getElementById('cmsToast'),
    feedbackForm: document.getElementById('qeFeedbackForm')
  });

  if (!els.view) return;

  els.backBtn.addEventListener('click', backToLectures);
  els.addBtn.addEventListener('click', () => openEditorModal({ mode: 'add' }));
  els.tabs.forEach(tab => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });
  els.reorderDone.addEventListener('click', clearSelection);
}

export function openQuestionEditor(moduleId, lectureId) {
  currentModuleId = moduleId;
  currentLectureId = lectureId;
  selectedQuestionId = null;
  activeTab = 'questions';

  // Hide other views
  document.getElementById('view-lectures')?.classList.remove('is-active');
  document.getElementById('view-modules')?.classList.remove('is-active');
  document.getElementById('view-degree')?.classList.remove('is-active');
  els.view.classList.add('is-active');

  render();
}

function backToLectures() {
  els.view.classList.remove('is-active');
  document.getElementById('view-lectures')?.classList.add('is-active');
}

function setTab(name) {
  activeTab = name;
  els.tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === name));
  els.panelQuestions.classList.toggle('is-active', name === 'questions');
  els.panelFeedback.classList.toggle('is-active', name === 'feedback');
  if (name === 'feedback') renderFeedbackForm();
}

// ============================================================
// RENDER
// ============================================================

function getLecture() {
  const { modules } = getContent();
  const mod = modules.find(m => m.id === currentModuleId);
  const lec = mod?.lectures?.find(l => l.id === currentLectureId);
  return lec || null;
}

function render() {
  const lec = getLecture();
  if (!lec) { backToLectures(); return; }

  els.title.textContent = lec.name;
  els.kicker.textContent = '// QUESTIONS';

  renderQuestionList(lec);
  renderReorderBar();
  if (activeTab === 'feedback') renderFeedbackForm();
}

function renderQuestionList(lec) {
  const questions = [...(lec.questions || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  els.list.innerHTML = '';

  if (questions.length === 0) {
    els.list.innerHTML = `
      <div class="qe-empty">
        <div class="qe-empty-title">No questions yet</div>
        <div>Click <strong>+ New</strong> to add your first question.</div>
      </div>`;
    return;
  }

  questions.forEach((q, idx) => {
    const item = document.createElement('div');
    item.className = 'qe-item';
    if (q.id === selectedQuestionId) item.classList.add('is-selected');
    item.dataset.questionId = q.id;

    item.innerHTML = `
      <span class="qe-item-num">${String(idx + 1).padStart(2, '0')}</span>
      <div class="qe-item-body">
        <span class="qe-item-type">${escapeHtml(q.type)}</span>
        <span class="qe-item-prompt">${escapeHtml(q.prompt || '(no prompt)')}</span>
      </div>
      <div class="qe-item-actions">
        <button class="cms-icon-btn" data-action="edit" title="Edit">✎</button>
        <button class="cms-icon-btn is-danger" data-action="delete" title="Delete">🗑</button>
      </div>
    `;

    item.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]')?.dataset.action;
      if (action === 'edit')   { e.stopPropagation(); openEditorModal({ mode: 'edit', question: q }); return; }
      if (action === 'delete') { e.stopPropagation(); openDeleteConfirm(q); return; }
      handleBodyClick(q.id);
    });

    els.list.appendChild(item);
  });
}

// ============================================================
// Select-then-swap reorder
// ============================================================

function handleBodyClick(questionId) {
  if (!selectedQuestionId) {
    selectQuestion(questionId);
    return;
  }
  if (selectedQuestionId === questionId) {
    clearSelection();
    return;
  }
  swapQuestions(selectedQuestionId, questionId);
}

function selectQuestion(id) {
  selectedQuestionId = id;
  render();
  renderReorderBar();
}

function clearSelection() {
  selectedQuestionId = null;
  els.reorderBar.classList.remove('is-active');
  render();
}

function renderReorderBar() {
  if (!selectedQuestionId) {
    els.reorderBar.classList.remove('is-active');
    return;
  }
  els.reorderBar.classList.add('is-active');
  els.reorderHint.textContent = 'Selected — tap another question to swap';
}

function swapQuestions(idA, idB) {
  mutateContent((draft) => {
    const lec = findLectureInDraft(draft);
    if (!lec) return draft;
    const sorted = [...lec.questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const idxA = sorted.findIndex(q => q.id === idA);
    const idxB = sorted.findIndex(q => q.id === idB);
    if (idxA === -1 || idxB === -1) return draft;
    [sorted[idxA], sorted[idxB]] = [sorted[idxB], sorted[idxA]];
    lec.questions = sorted.map((q, i) => ({ ...q, order: i }));
    return draft;
  }, { label: 'Reorder questions (swap)' })
    .then(() => { clearSelection(); showToast('Questions swapped'); })
    .catch(showError);
}

function findLectureInDraft(draft) {
  const mod = draft.modules.find(m => m.id === currentModuleId);
  return mod?.lectures?.find(l => l.id === currentLectureId);
}

// ============================================================
// QUESTION EDITOR MODAL
// ============================================================

function openEditorModal({ mode, question }) {
  const isEdit = mode === 'edit';
  const q = isEdit ? deepClone(question) : defaultQuestion();

  const overlay = document.createElement('div');
  overlay.className = 'qe-modal-overlay is-open';
  overlay.innerHTML = renderModalHtml(q, isEdit);

  document.body.appendChild(overlay);
  wireModalEvents(overlay, q, isEdit);

  // Initial render of type-specific section
  syncTypeSection(overlay, q.type);
}

function defaultQuestion() {
  return {
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: 'mcq',
    prompt: '',
    options: ['', '', '', ''],
    answer: 0,
    accept: [],
    reason: '',
    wrong_reasons: ['', ''],
    steps: ['', '', ''],
    pairs: [{ left: '', right: '' }, { left: '', right: '' }],
    explanation: '',
    feedbackTitle: '',
    order: nextOrder()
  };
}

function nextOrder() {
  const lec = getLecture();
  if (!lec?.questions?.length) return 0;
  return Math.max(...lec.questions.map(q => q.order ?? 0)) + 1;
}

function renderModalHtml(q, isEdit) {
  return `
    <div class="qe-modal">
      <div class="qe-modal-header">
        <div class="qe-modal-title">${isEdit ? 'Edit question' : 'New question'}</div>
        <button class="cms-icon-btn" data-action="close">✕</button>
      </div>
      <div class="qe-modal-body">
        <div class="qe-field">
          <label for="qeType">Question type</label>
          <select id="qeType">
            ${QUESTION_TYPES.map(t => `<option value="${t.value}" ${q.type === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
          </select>
        </div>

        <div class="qe-field">
          <label for="qePrompt">Prompt</label>
          <textarea id="qePrompt" placeholder="Question prompt shown to the user...">${escapeHtml(q.prompt)}</textarea>
        </div>

        <!-- MCQ -->
        <div class="qe-type-section" data-type-section="mcq">
          <div class="qe-type-heading">Options (select the correct answer)</div>
          <div class="qe-list-rows" id="qeMcqRows"></div>
          <button class="qe-add-row-btn" data-add="mcq">+ Add option</button>
        </div>

        <!-- TF -->
        <div class="qe-type-section" data-type-section="tf">
          <div class="qe-field">
            <label for="qeTfAnswer">Correct answer</label>
            <select id="qeTfAnswer">
              <option value="true" ${q.answer === true ? 'selected' : ''}>True</option>
              <option value="false" ${q.answer === false ? 'selected' : ''}>False</option>
            </select>
          </div>
          <div class="qe-field">
            <label for="qeTfReason">Correct reason (shown after picking True)</label>
            <textarea id="qeTfReason" placeholder="Why the statement is true...">${escapeHtml(q.reason || '')}</textarea>
          </div>
          <div class="qe-type-heading">Wrong reasons (as distractors)</div>
          <div class="qe-list-rows" id="qeTfWrongRows"></div>
          <button class="qe-add-row-btn" data-add="tf-wrong">+ Add wrong reason</button>
        </div>

        <!-- Typed / Fill -->
        <div class="qe-type-section" data-type-section="typed">
          <div class="qe-field">
            <label for="qeAnswer">Correct answer</label>
            <input id="qeAnswer" type="text" value="${escapeAttr(q.answer || '')}" placeholder="e.g. 3:1">
          </div>
          <div class="qe-type-heading">Alternative accepted answers</div>
          <div class="qe-list-rows" id="qeAcceptRows"></div>
          <button class="qe-add-row-btn" data-add="accept">+ Add alternative</button>
        </div>

        <!-- Sequence -->
        <div class="qe-type-section" data-type-section="sequence">
          <div class="qe-type-heading">Steps (in correct order)</div>
          <div class="qe-list-rows" id="qeStepRows"></div>
          <button class="qe-add-row-btn" data-add="step">+ Add step</button>
        </div>

        <!-- Match -->
        <div class="qe-type-section" data-type-section="match">
          <div class="qe-type-heading">Pairs</div>
          <div class="qe-list-rows" id="qePairRows"></div>
          <button class="qe-add-row-btn" data-add="pair">+ Add pair</button>
        </div>

        <!-- Explanation + feedback -->
        <div class="qe-field">
          <label for="qeExplanation">Explanation (shown on feedback screen)</label>
          <textarea id="qeExplanation" placeholder="Why the answer is what it is...">${escapeHtml(q.explanation || '')}</textarea>
        </div>

        <div class="qe-field">
          <label for="qeFeedbackTitle">Custom feedback headline (optional)</label>
          <input id="qeFeedbackTitle" type="text" value="${escapeAttr(q.feedbackTitle || '')}" placeholder="Leave blank to use lecture default">
          <div class="qe-field-help">Overrides the per-lecture title for this question only.</div>
        </div>
      </div>
      <div class="qe-modal-footer">
        <button class="lab-btn secondary" data-action="cancel">Cancel</button>
        <button class="lab-btn" data-action="save">${isEdit ? 'Save changes' : 'Create question'}</button>
      </div>
    </div>
  `;
}

function wireModalEvents(overlay, q, isEdit) {
  const close = () => overlay.remove();

  overlay.querySelector('[data-action="close"]').addEventListener('click', close);
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  // Type switch
  const typeSel = overlay.querySelector('#qeType');
  typeSel.addEventListener('change', () => {
    q.type = typeSel.value;
    syncTypeSection(overlay, q.type);
  });

  // Add-row buttons
  overlay.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => addRow(overlay, btn.dataset.add, q));
  });

  // Save
  overlay.querySelector('[data-action="save"]').addEventListener('click', () => {
    const result = collectFromModal(overlay, q);
    if (!result.ok) { showToast(result.error, true); return; }
    close();
    if (isEdit) updateQuestion(result.question);
    else createQuestion(result.question);
  });
}

function syncTypeSection(overlay, type) {
  overlay.querySelectorAll('.qe-type-section').forEach(sec => {
    const t = sec.dataset.typeSection;
    let active = false;
    if (type === 'mcq') active = t === 'mcq';
    else if (type === 'tf') active = t === 'tf';
    else if (type === 'typed' || type === 'fill') active = t === 'typed';
    else if (type === 'sequence') active = t === 'sequence';
    else if (type === 'match') active = t === 'match';
    sec.classList.toggle('is-active', active);
  });

  // Populate rows for the active section from current q
  const q = collectTransient(overlay);
  if (type === 'mcq')      renderMcqRows(overlay, q.options, q.answer);
  if (type === 'tf')       renderTfWrongRows(overlay, q.wrong_reasons);
  if (type === 'typed' || type === 'fill') renderAcceptRows(overlay, q.accept);
  if (type === 'sequence') renderStepRows(overlay, q.steps);
  if (type === 'match')    renderPairRows(overlay, q.pairs);
}

function collectTransient(overlay) {
  const type = overlay.querySelector('#qeType').value;
  const q = {
    type,
    prompt: overlay.querySelector('#qePrompt').value,
    answer: overlay.querySelector('#qeAnswer')?.value ?? '',
    explanation: overlay.querySelector('#qeExplanation').value,
    feedbackTitle: overlay.querySelector('#qeFeedbackTitle').value,
    options: readList(overlay, '#qeMcqRows', 'input'),
    accept: readList(overlay, '#qeAcceptRows', 'input'),
    steps: readList(overlay, '#qeStepRows', 'input'),
    wrong_reasons: readList(overlay, '#qeTfWrongRows', 'input'),
    reason: overlay.querySelector('#qeTfReason')?.value || '',
    pairs: readPairs(overlay)
  };
  if (type === 'tf') {
    q.answer = overlay.querySelector('#qeTfAnswer').value === 'true';
  }
  // MCQ answer index
  const checked = overlay.querySelector('#qeMcqRows input[type="radio"]:checked');
  if (checked) q.answer = parseInt(checked.value, 10);
  return q;
}

// ---- Row renderers ----

function renderMcqRows(overlay, options, answer) {
  const box = overlay.querySelector('#qeMcqRows');
  box.innerHTML = '';
  options.forEach((opt, i) => {
    const row = document.createElement('div');
    row.className = 'qe-mcq-row';
    row.innerHTML = `
      <input type="radio" name="qeMcqAnswer" value="${i}" ${i === answer ? 'checked' : ''}>
      <input type="text" value="${escapeAttr(opt)}" placeholder="Option ${i + 1}">
      <button class="cms-icon-btn is-danger" data-remove title="Remove">✕</button>
    `;
    row.querySelector('[data-remove]').addEventListener('click', () => {
      row.remove();
      // Re-number radio values
      Array.from(box.children).forEach((r, idx) => {
        const radio = r.querySelector('input[type="radio"]');
        radio.value = idx;
      });
    });
    box.appendChild(row);
  });
}

function renderTfWrongRows(overlay, wrongs) {
  const box = overlay.querySelector('#qeTfWrongRows');
  box.innerHTML = '';
  wrongs.forEach((w, i) => {
    const row = document.createElement('div');
    row.className = 'qe-list-row';
    row.innerHTML = `
      <input type="text" value="${escapeAttr(w)}" placeholder="Wrong reason ${i + 1}">
      <button class="cms-icon-btn is-danger" data-remove title="Remove">✕</button>
    `;
    row.querySelector('[data-remove]').addEventListener('click', () => row.remove());
    box.appendChild(row);
  });
}

function renderAcceptRows(overlay, accepts) {
  const box = overlay.querySelector('#qeAcceptRows');
  box.innerHTML = '';
  accepts.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'qe-list-row';
    row.innerHTML = `
      <input type="text" value="${escapeAttr(a)}" placeholder="Alternative ${i + 1}">
      <button class="cms-icon-btn is-danger" data-remove title="Remove">✕</button>
    `;
    row.querySelector('[data-remove]').addEventListener('click', () => row.remove());
    box.appendChild(row);
  });
}

function renderStepRows(overlay, steps) {
  const box = overlay.querySelector('#qeStepRows');
  box.innerHTML = '';
  steps.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'qe-list-row';
    row.innerHTML = `
      <input type="text" value="${escapeAttr(s)}" placeholder="Step ${i + 1}">
      <button class="cms-icon-btn is-danger" data-remove title="Remove">✕</button>
    `;
    row.querySelector('[data-remove]').addEventListener('click', () => row.remove());
    box.appendChild(row);
  });
}

function renderPairRows(overlay, pairs) {
  const box = overlay.querySelector('#qePairRows');
  box.innerHTML = '';
  pairs.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'qe-list-row';
    row.innerHTML = `
      <input type="text" value="${escapeAttr(p.left)}" placeholder="Left ${i + 1}">
      <input type="text" value="${escapeAttr(p.right)}" placeholder="Right ${i + 1}">
      <button class="cms-icon-btn is-danger" data-remove title="Remove">✕</button>
    `;
    row.querySelector('[data-remove]').addEventListener('click', () => row.remove());
    box.appendChild(row);
  });
}

function addRow(overlay, kind, q) {
  if (kind === 'mcq') {
    const box = overlay.querySelector('#qeMcqRows');
    const count = box.children.length;
    renderMcqRows(overlay, [...readList(overlay, '#qeMcqRows', 'input'), ''], -1);
    // Re-add radio selections preserved? Simpler: just append a row
    const rows = overlay.querySelectorAll('#qeMcqRows .qe-mcq-row');
    rows.forEach((r, idx) => {
      const radio = r.querySelector('input[type="radio"]');
      radio.value = idx;
    });
  } else if (kind === 'tf-wrong') {
    const cur = readList(overlay, '#qeTfWrongRows', 'input');
    renderTfWrongRows(overlay, [...cur, '']);
  } else if (kind === 'accept') {
    const cur = readList(overlay, '#qeAcceptRows', 'input');
    renderAcceptRows(overlay, [...cur, '']);
  } else if (kind === 'step') {
    const cur = readList(overlay, '#qeStepRows', 'input');
    renderStepRows(overlay, [...cur, '']);
  } else if (kind === 'pair') {
    const cur = readPairs(overlay);
    renderPairRows(overlay, [...cur, { left: '', right: '' }]);
  }
}

// ---- Collecting from modal ----

function collectFromModal(overlay, baseQ) {
  const type = overlay.querySelector('#qeType').value;
  const prompt = overlay.querySelector('#qePrompt').value.trim();
  const explanation = overlay.querySelector('#qeExplanation').value.trim();
  const feedbackTitle = overlay.querySelector('#qeFeedbackTitle').value.trim();

  if (!prompt) return { ok: false, error: 'Prompt is required' };

  const q = {
    ...baseQ,
    type,
    prompt,
    explanation,
    feedbackTitle: feedbackTitle || undefined
  };

  if (type === 'mcq') {
    const options = readList(overlay, '#qeMcqRows', 'input').map(s => s.trim());
    if (options.length < 2) return { ok: false, error: 'Need at least 2 options' };
    if (options.some(o => !o)) return { ok: false, error: 'All options must be filled' };
    const checked = overlay.querySelector('#qeMcqRows input[type="radio"]:checked');
    if (!checked) return { ok: false, error: 'Select a correct answer' };
    q.options = options;
    q.answer = parseInt(checked.value, 10);
    q.accept = undefined; q.steps = undefined; q.pairs = undefined;
    q.reason = undefined; q.wrong_reasons = undefined;
  } else if (type === 'tf') {
    q.answer = overlay.querySelector('#qeTfAnswer').value === 'true';
    q.reason = overlay.querySelector('#qeTfReason').value.trim();
    q.wrong_reasons = readList(overlay, '#qeTfWrongRows', 'input').map(s => s.trim()).filter(Boolean);
    if (!q.reason) return { ok: false, error: 'Correct reason is required' };
    q.options = undefined; q.accept = undefined; q.steps = undefined; q.pairs = undefined;
  } else if (type === 'typed' || type === 'fill') {
    const answer = overlay.querySelector('#qeAnswer').value.trim();
    if (!answer) return { ok: false, error: 'Correct answer is required' };
    q.answer = answer;
    q.accept = readList(overlay, '#qeAcceptRows', 'input').map(s => s.trim()).filter(Boolean);
    q.options = undefined; q.steps = undefined; q.pairs = undefined;
    q.reason = undefined; q.wrong_reasons = undefined;
  } else if (type === 'sequence') {
    const steps = readList(overlay, '#qeStepRows', 'input').map(s => s.trim()).filter(Boolean);
    if (steps.length < 2) return { ok: false, error: 'Need at least 2 steps' };
    q.steps = steps;
    q.options = undefined; q.accept = undefined; q.pairs = undefined;
    q.reason = undefined; q.wrong_reasons = undefined;
  } else if (type === 'match') {
    const pairs = readPairs(overlay).filter(p => p.left.trim() && p.right.trim());
    if (pairs.length < 2) return { ok: false, error: 'Need at least 2 pairs' };
    q.pairs = pairs.map(p => ({ left: p.left.trim(), right: p.right.trim() }));
    q.options = undefined; q.accept = undefined; q.steps = undefined;
    q.reason = undefined; q.wrong_reasons = undefined;
  }

  return { ok: true, question: q };
}

function readList(overlay, selector, tag) {
  const rows = overlay.querySelectorAll(`${selector} input[type="text"]`);
  return Array.from(rows).map(i => i.value);
}

function readPairs(overlay) {
  const rows = overlay.querySelectorAll('#qePairRows .qe-list-row');
  return Array.from(rows).map(row => {
    const inputs = row.querySelectorAll('input');
    return { left: inputs[0].value, right: inputs[1].value };
  });
}

// ============================================================
// CRUD — create / update / delete questions
// ============================================================

function createQuestion(q) {
  mutateContent((draft) => {
    const lec = findLectureInDraft(draft);
    if (!lec) return draft;
    if (!lec.questions) lec.questions = [];
    q.order = lec.questions.length;
    lec.questions.push(q);
    return draft;
  }, { label: 'Add question' })
    .then(() => { showToast('Question created'); render(); })
    .catch(showError);
}

function updateQuestion(q) {
  mutateContent((draft) => {
    const lec = findLectureInDraft(draft);
    if (!lec) return draft;
    const idx = lec.questions.findIndex(x => x.id === q.id);
    if (idx !== -1) lec.questions[idx] = q;
    return draft;
  }, { label: 'Edit question' })
    .then(() => { showToast('Question saved'); render(); })
    .catch(showError);
}

function openDeleteConfirm(q) {
  const overlay = document.createElement('div');
  overlay.className = 'qe-modal-overlay is-open';
  overlay.innerHTML = `
    <div class="qe-modal" style="max-width:420px;">
      <div class="qe-modal-header">
        <div class="qe-modal-title">Delete question?</div>
      </div>
      <div class="qe-modal-body">
        <p style="font-size:0.9rem;line-height:1.5;color:var(--text-muted);">
          You are about to delete:<br><strong style="color:var(--text);">${escapeHtml(q.prompt || '(no prompt)')}</strong>
        </p>
        <p style="font-size:0.8rem;line-height:1.5;color:var(--text-muted);">
          A version snapshot is saved automatically.
        </p>
      </div>
      <div class="qe-modal-footer">
        <button class="lab-btn secondary" data-action="cancel">Cancel</button>
        <button class="lab-btn" data-action="delete" style="border-color:#ff5555;color:#ff5555;">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
  overlay.querySelector('[data-action="delete"]').addEventListener('click', () => {
    overlay.remove();
    deleteQuestion(q);
  });
}

function deleteQuestion(q) {
  mutateContent((draft) => {
    const lec = findLectureInDraft(draft);
    if (!lec) return draft;
    lec.questions = lec.questions
      .filter(x => x.id !== q.id)
      .map((x, i) => ({ ...x, order: i }));
    return draft;
  }, { label: 'Delete question' })
    .then(() => {
      if (selectedQuestionId === q.id) selectedQuestionId = null;
      showToast('Question deleted');
      render();
    })
    .catch(showError);
}

// ============================================================
// FEEDBACK SETTINGS TAB
// ============================================================

function renderFeedbackForm() {
  const lec = getLecture();
  if (!lec || !els.feedbackForm) return;
  const fb = lec.feedback || {};

  els.feedbackForm.innerHTML = `
    <div class="qe-settings-group">
      <div class="qe-settings-heading">Feedback behaviour</div>
      <div class="qe-toggle-row">
        <label for="fbShowExplanation">Show explanation on feedback</label>
        <input class="qe-checkbox" type="checkbox" id="fbShowExplanation" ${fb.showExplanation !== false ? 'checked' : ''}>
      </div>
    </div>

    <div class="qe-settings-group">
      <div class="qe-settings-heading">Custom headlines</div>
      <div class="qe-field">
        <label for="fbCorrectTitle">Correct answer headline</label>
        <input id="fbCorrectTitle" type="text" value="${escapeAttr(fb.correctTitle || '')}" placeholder="Correct.">
      </div>
      <div class="qe-field">
        <label for="fbIncorrectTitle">Incorrect answer headline</label>
        <input id="fbIncorrectTitle" type="text" value="${escapeAttr(fb.incorrectTitle || '')}" placeholder="Incorrect.">
      </div>
      <div class="qe-field">
        <label for="fbWinTitle">Win screen headline</label>
        <input id="fbWinTitle" type="text" value="${escapeAttr(fb.winTitle || '')}" placeholder="LECTURE PASSED">
      </div>
      <div class="qe-field">
        <label for="fbFailTitle">Fail screen headline</label>
        <input id="fbFailTitle" type="text" value="${escapeAttr(fb.failTitle || '')}" placeholder="LECTURE FAILED">
      </div>
    </div>

    <button class="lab-btn" id="qeSaveFeedback">Save feedback settings</button>
  `;

  document.getElementById('qeSaveFeedback').addEventListener('click', saveFeedbackSettings);
}

function saveFeedbackSettings() {
  const showExplanation = document.getElementById('fbShowExplanation').checked;
  const correctTitle = document.getElementById('fbCorrectTitle').value.trim();
  const incorrectTitle = document.getElementById('fbIncorrectTitle').value.trim();
  const winTitle = document.getElementById('fbWinTitle').value.trim();
  const failTitle = document.getElementById('fbFailTitle').value.trim();

  mutateContent((draft) => {
    const lec = findLectureInDraft(draft);
    if (!lec) return draft;
    lec.feedback = {
      showExplanation,
      correctTitle: correctTitle || 'Correct.',
      incorrectTitle: incorrectTitle || 'Incorrect.',
      winTitle: winTitle || 'LECTURE PASSED',
      failTitle: failTitle || 'LECTURE FAILED'
    };
    return draft;
  }, { label: 'Update feedback settings' })
    .then(() => showToast('Feedback settings saved'))
    .catch(showError);
}

// ============================================================
// Utilities
// ============================================================

function showToast(msg, isError = false) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.classList.toggle('is-error', isError);
  els.toast.classList.add('is-visible');
  clearTimeout(els.toast._t);
  els.toast._t = setTimeout(() => els.toast.classList.remove('is-visible'), 2200);
}

function showError(err) {
  console.error('[question-editor]', err);
  showToast(err?.message || 'Something went wrong', true);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
function deepClone(o) { return JSON.parse(JSON.stringify(o)); }
