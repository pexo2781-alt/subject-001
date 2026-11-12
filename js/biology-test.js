import { getContent } from './content.js';
import { closeDrill } from './domain.js';

const WRONG_LIMIT = 3;

const state = {
  running: false,
  moduleId: null,
  lectureId: null,
  lecture: null,
  questions: [],
  originalCount: 0,
  index: 0,
  wrongCount: 0,
  answeredThisRun: new Set(),
  isAnswered: false
};

const els = {};

export function initBiologyTest() {
  Object.assign(els, {
    stageQuestion: document.getElementById('btStageQuestion'),
    stageFeedback: document.getElementById('btStageFeedback'),

    prompt: document.getElementById('btPrompt'),
    content: document.getElementById('btContent'),
    actions: document.getElementById('btActions'),
    statStreak: document.getElementById('btStatStreak'),
    statCorrect: document.getElementById('btStatCorrect'),
    statWrong: document.getElementById('btStatWrong'),
    exitBtn: document.getElementById('btExitBtn'),

    feedbackTitle: document.getElementById('btFeedbackTitle'),
    feedbackText: document.getElementById('btFeedbackText'),
    continueBtn: document.getElementById('btContinueBtn')
  });

  if (!els.stageQuestion) return;

  els.exitBtn.addEventListener('click', () => {
    reset();
    closeDrill();
  });

  els.continueBtn.addEventListener('click', onContinue);

  reset();
}

export function setActiveLecture(moduleId, lectureId) {
  if (lectureId === undefined) {
    lectureId = moduleId;
    moduleId = null;
  }
  state.moduleId = moduleId;
  state.lectureId = lectureId;
}

export function reset() {
  state.running = false;
  state.questions = [];
  state.originalCount = 0;
  state.index = 0;
  state.wrongCount = 0;
  state.answeredThisRun = new Set();
  state.isAnswered = false;

  const view = document.getElementById('view-biology-test');
  if (view) view.classList.add('is-active');

  updateStats();
  showStage('question');
  startSession();
}

function startSession() {
  const lecture = findLecture(state.moduleId, state.lectureId);
  if (!lecture) {
    showFatal('Lecture not found', 'The lecture you tried to open does not exist.');
    return;
  }
  if (!lecture.questions?.length) {
    showFatal('No questions', 'This lecture has no questions yet.');
    return;
  }

  state.lecture = lecture;
  state.questions = shuffle([...lecture.questions]);
  state.originalCount = state.questions.length;
  state.index = 0;
  state.wrongCount = 0;
  state.answeredThisRun = new Set();
  state.running = true;

  updateStats();
  renderCurrent();
}

function findLecture(moduleId, lectureId) {
  const { modules } = getContent();
  for (const mod of modules) {
    if (moduleId && mod.id !== moduleId) continue;
    const lec = mod.lectures?.find(l => l.id === lectureId);
    if (lec) return lec;
  }
  for (const mod of modules) {
    const lec = mod.lectures?.find(l => l.id === lectureId);
    if (lec) return lec;
  }
  return null;
}

function renderCurrent() {
  if (!state.running) return;

  if (state.answeredThisRun.size >= state.originalCount) {
    showWin();
    return;
  }

  if (state.index >= state.questions.length) {
    const unanswered = state.questions.filter(q => !state.answeredThisRun.has(q.id));
    if (unanswered.length === 0) {
      showWin();
      return;
    }
    state.questions = shuffle(unanswered);
    state.index = 0;
  }

  state.isAnswered = false;
  const q = state.questions[state.index];
  els.prompt.textContent = q.prompt;
  els.content.innerHTML = '';
  els.actions.innerHTML = '';
  renderByType(q);
  showStage('question');
}

function renderByType(q) {
  switch (q.type) {
    case 'typed':
    case 'fill':     return renderTyped(q);
    case 'mcq':      return renderMCQ(q);
    case 'tf':       return renderTF(q);
    case 'sequence': return renderSequence(q);
    case 'match':    return renderMatch(q);
    default:         return renderTyped(q);
  }
}

function renderTyped(q) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'bt-input';
  input.placeholder = 'Type answer here...';
  input.autocomplete = 'off';

  const btn = document.createElement('button');
  btn.className = 'lab-btn bt-submit-btn';
  btn.textContent = 'Submit';
  btn.onclick = () => checkTyped(q, input.value);
  input.onkeydown = e => { if (e.key === 'Enter') checkTyped(q, input.value); };

  els.content.appendChild(input);
  els.actions.appendChild(btn);
  setTimeout(() => input.focus(), 60);
}

function renderMCQ(q) {
  const wrap = document.createElement('div');
  wrap.className = 'bt-options';
  q.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'bt-option-btn';
    b.textContent = opt;
    b.onclick = () => checkMCQ(q, i, wrap);
    wrap.appendChild(b);
  });
  els.content.appendChild(wrap);
}

function renderTF(q) {
  const wrap = document.createElement('div');
  wrap.className = 'bt-tf-row';
  const t = document.createElement('button');
  t.className = 'bt-option-btn'; t.textContent = 'True';
  t.onclick = () => handleTF(true, q, wrap);
  const f = document.createElement('button');
  f.className = 'bt-option-btn'; f.textContent = 'False';
  f.onclick = () => handleTF(false, q, wrap);
  wrap.appendChild(t); wrap.appendChild(f);
  els.content.appendChild(wrap);
}

function handleTF(val, q, wrap) {
  if (val !== q.answer) {
    finishAnswer(false, q.feedbackTitle || 'Incorrect. The statement is False.', q.explanation, q);
    return;
  }
  wrap.style.display = 'none';
  const box = document.createElement('div');
  box.className = 'bt-reason-box';
  const reasons = shuffle([q.reason, ...(q.wrong_reasons || [])]);
  reasons.forEach(r => {
    const b = document.createElement('button');
    b.className = 'bt-option-btn';
    b.textContent = r;
    b.onclick = () => {
      const ok = r === q.reason;
      finishAnswer(ok, ok ? (q.feedbackTitle || 'Correct.') : 'Incorrect reason.', q.explanation, q);
    };
    box.appendChild(b);
  });
  els.content.appendChild(box);
}

function renderSequence(q) {
  const items = shuffle([...q.steps]);
  const c = document.createElement('div');
  c.className = 'bt-seq-container';
  let selected = null;

  const renumber = () => {
    Array.from(c.children).forEach((el, i) => {
      el.querySelector('.bt-seq-num').textContent = `${i + 1}.`;
    });
  };
  const move = (item, dir) => {
    const p = item.parentNode;
    if (dir === 'up' && item.previousElementSibling) p.insertBefore(item, item.previousElementSibling);
    if (dir === 'down' && item.nextElementSibling) p.insertBefore(item.nextElementSibling, item);
    renumber();
  };

  items.forEach((step, idx) => {
    const item = document.createElement('div');
    item.className = 'bt-seq-item';
    item.innerHTML = `
      <span class="bt-seq-num">${idx + 1}.</span>
      <span class="bt-seq-text">${step}</span>
      <div class="bt-seq-arrows">
        <button class="bt-seq-arrow" data-dir="up">▲</button>
        <button class="bt-seq-arrow" data-dir="down">▼</button>
      </div>`;

    item.onclick = (e) => {
      if (e.target.classList.contains('bt-seq-arrow')) return;
      if (selected === item) { item.classList.remove('is-selected'); selected = null; }
      else if (selected) {
        selected.classList.remove('is-selected');
        const parent = item.parentNode;
        const itemNext = item.nextSibling;
        const selNext = selected.nextSibling;
        parent.insertBefore(selected, itemNext);
        parent.insertBefore(item, selNext);
        renumber();
        selected = null;
      } else { item.classList.add('is-selected'); selected = item; }
    };

    item.querySelectorAll('.bt-seq-arrow').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (selected) { selected.classList.remove('is-selected'); selected = null; }
        move(item, btn.dataset.dir);
      };
    });

    c.appendChild(item);
  });

  els.content.appendChild(c);

  const btn = document.createElement('button');
  btn.className = 'lab-btn bt-submit-btn';
  btn.textContent = 'Submit Order';
  btn.onclick = () => {
    const cur = Array.from(c.children).map(el => el.querySelector('.bt-seq-text').textContent.trim().toLowerCase());
    const exp = q.steps.map(s => String(s).trim().toLowerCase());
    const ok = cur.length === exp.length && cur.every((v, i) => v === exp[i]);
    finishAnswer(ok, ok ? (q.feedbackTitle || 'Correct.') : 'Incorrect order.', q.explanation, q);
  };
  els.actions.appendChild(btn);
}

function renderMatch(q) {
  const left = shuffle(q.pairs.map(p => p.left));
  const right = shuffle(q.pairs.map(p => p.right));
  const wrap = document.createElement('div');
  wrap.className = 'bt-match-container';
  const colL = document.createElement('div'); colL.className = 'bt-match-col';
  const colR = document.createElement('div'); colR.className = 'bt-match-col';
  let selLeft = null;

  left.forEach(text => {
    const b = document.createElement('button');
    b.className = 'bt-match-btn'; b.textContent = text;
    b.onclick = () => {
      if (b.classList.contains('is-matched')) return;
      colL.querySelectorAll('.bt-match-btn').forEach(x => x.classList.remove('is-selected'));
      b.classList.add('is-selected'); selLeft = b;
    };
    colL.appendChild(b);
  });

  right.forEach(text => {
    const b = document.createElement('button');
    b.className = 'bt-match-btn'; b.textContent = text;
    b.onclick = () => {
      if (b.classList.contains('is-matched')) return;
      if (!selLeft) return;
      const pair = q.pairs.find(p => p.left === selLeft.textContent && p.right === text);
      if (pair) {
        selLeft.classList.remove('is-selected');
        selLeft.classList.add('is-matched');
        b.classList.add('is-matched');
        selLeft = null;
        if (colL.querySelectorAll('.is-matched').length === q.pairs.length) {
          finishAnswer(true, q.feedbackTitle || 'Correct.', q.explanation, q);
        }
      } else {
        finishAnswer(false, 'Incorrect match.', q.explanation, q);
      }
    };
    colR.appendChild(b);
  });

  wrap.appendChild(colL); wrap.appendChild(colR);
  els.content.appendChild(wrap);
}

function checkTyped(q, val) {
  if (state.isAnswered) return;
  const clean = String(val).trim().toLowerCase();
  if (!clean) return;
  const valid = [q.answer, ...(q.accept || [])].filter(a => a != null).map(a => String(a).trim().toLowerCase());
  const ok = valid.includes(clean);
  finishAnswer(ok, ok ? (q.feedbackTitle || 'Correct.') : `Incorrect. Expected: ${q.answer}`, q.explanation, q);
}

function checkMCQ(q, idx, wrap) {
  if (state.isAnswered) return;
  const btns = wrap.querySelectorAll('.bt-option-btn');
  if (idx === q.answer) {
    btns[idx].classList.add('is-correct');
    finishAnswer(true, q.feedbackTitle || 'Correct.', q.explanation, q);
  } else {
    btns[idx].classList.add('is-wrong');
    if (btns[q.answer]) btns[q.answer].classList.add('is-correct');
    finishAnswer(false, `Incorrect. Correct answer: ${q.options[q.answer]}`, q.explanation, q);
  }
}

function finishAnswer(isCorrect, title, explanation, q) {
  if (state.isAnswered) return;
  state.isAnswered = true;

  if (isCorrect) {
    state.answeredThisRun.add(q.id);
  } else {
    state.wrongCount++;
    state.questions.push(q);
  }

  updateStats();

  const fb = state.lecture?.feedback || {};
  const showExplanation = fb.showExplanation !== false;
  const headline = title || (isCorrect ? (fb.correctTitle || 'Correct.') : (fb.incorrectTitle || 'Incorrect.'));

  els.feedbackTitle.textContent = headline;
  els.feedbackTitle.className = isCorrect ? 'bt-feedback-title is-correct' : 'bt-feedback-title is-wrong';

  if (showExplanation && explanation) {
    els.feedbackText.innerHTML = `<strong>Explanation:</strong> ${escapeHtml(explanation)}`;
  } else {
    els.feedbackText.innerHTML = '';
  }

  if (state.wrongCount >= WRONG_LIMIT) {
    els.continueBtn.textContent = 'See result';
  } else {
    els.continueBtn.textContent = 'Continue';
  }

  showStage('feedback');
}

function onContinue() {
  if (state.wrongCount >= WRONG_LIMIT) {
    showFail();
    return;
  }
  state.index++;
  renderCurrent();
}

function updateStats() {
  const total = state.originalCount || state.questions.length;
  const answeredCorrect = state.answeredThisRun.size;
  if (els.statStreak) els.statStreak.textContent = `${answeredCorrect} / ${total}`;
  if (els.statCorrect) els.statCorrect.textContent = answeredCorrect;
  if (els.statWrong) els.statWrong.textContent = `${state.wrongCount} / ${WRONG_LIMIT}`;
}

function showStage(name) {
  if (name === 'question') {
    els.stageQuestion.classList.add('is-active');
    els.stageFeedback.classList.remove('is-active');
  } else {
    els.stageQuestion.classList.remove('is-active');
    els.stageFeedback.classList.add('is-active');
  }
}

function showWin() {
  state.running = false;
  const fb = state.lecture?.feedback || {};
  els.feedbackTitle.textContent = fb.winTitle || 'LECTURE PASSED';
  els.feedbackTitle.className = 'bt-feedback-title is-correct';
  els.feedbackText.innerHTML =
    `All <strong>${state.originalCount}</strong> questions answered correctly` +
    (state.wrongCount ? ` with <strong>${state.wrongCount}</strong> wrong attempt${state.wrongCount === 1 ? '' : 's'}.` : '.');
  els.continueBtn.textContent = 'Return to Menu';
  els.continueBtn.onclick = () => { reset(); closeDrill(); };
  showStage('feedback');
}

function showFail() {
  state.running = false;
  const fb = state.lecture?.feedback || {};
  els.feedbackTitle.textContent = fb.failTitle || 'LECTURE FAILED';
  els.feedbackTitle.className = 'bt-feedback-title is-wrong';
  els.feedbackText.innerHTML =
    `You reached the limit of <strong>${WRONG_LIMIT}</strong> wrong answers. Try again.`;
  els.continueBtn.textContent = 'Retry';
  els.continueBtn.onclick = () => { reset(); };
  showStage('feedback');
}

function showFatal(title, msg) {
  state.running = false;
  els.feedbackTitle.textContent = title;
  els.feedbackTitle.className = 'bt-feedback-title is-wrong';
  els.feedbackText.textContent = msg;
  els.continueBtn.textContent = 'Return to Menu';
  els.continueBtn.onclick = () => { reset(); closeDrill(); };
  showStage('feedback');
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

window.__btReset = reset;
window.__btSetLecture = setActiveLecture;
