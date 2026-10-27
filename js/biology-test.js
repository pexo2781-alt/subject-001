import { lecture1 } from './data/biology-lecture1.js';
import { closeDrill } from './domain.js';

const TARGET_STREAK = 8;

const state = {
  running: false,
  streak: 0,
  correctCount: 0,
  wrongCount: 0,
  currentQuestion: null,
  currentConcept: null,
  reviewQueue: [],
  isAnswered: false,
  tempData: null
};

const els = {};

export function initBiologyTest() {
  Object.assign(els, {
    view: document.getElementById('view-biology-test'),
    header: document.getElementById('btHeader'),
    body: document.getElementById('btBody'),
    prompt: document.getElementById('btPrompt'),
    content: document.getElementById('btContent'),
    actions: document.getElementById('btActions'),
    feedback: document.getElementById('btFeedback'),
    feedbackRow: document.getElementById('btFeedbackRow'),
    statStreak: document.getElementById('btStatStreak'),
    statCorrect: document.getElementById('btStatCorrect'),
    statWrong: document.getElementById('btStatWrong'),
    exitBtn: document.getElementById('btExitBtn')
  });

  if (!els.view) return;

  els.exitBtn.addEventListener('click', () => {
    resetToIntro();
    closeDrill();
  });

  resetToIntro();
}

export function resetToIntro() {
  state.running = true;
  state.streak = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.reviewQueue = [];
  state.isAnswered = false;
  state.tempData = null;

  els.view.classList.add('is-active');
  updateStats();
  nextQuestion();
}

function updateStats() {
  if (els.statStreak) els.statStreak.textContent = `${state.streak} / ${TARGET_STREAK}`;
  if (els.statCorrect) els.statCorrect.textContent = state.correctCount;
  if (els.statWrong) els.statWrong.textContent = state.wrongCount;
}

function nextQuestion() {
  if (state.streak >= TARGET_STREAK) {
    els.prompt.textContent = "TEST PASSED";
    els.content.innerHTML = `<p style="font-size:1.2rem; color:var(--text-muted); text-align:center;">You achieved a perfect streak of ${TARGET_STREAK}.</p>`;
    els.feedback.textContent = "";
    els.feedbackRow.innerHTML = '';
    els.feedbackRow.style.display = 'none';
    
    els.actions.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'lab-btn bt-submit-btn';
    btn.textContent = 'Return to Menu';
    btn.addEventListener('click', () => {
      resetToIntro();
      closeDrill();
    });
    els.actions.appendChild(btn);
    return;
  }

  state.isAnswered = false;
  els.feedback.textContent = "";
  els.feedback.className = "bt-feedback";
  els.feedbackRow.innerHTML = ''; // Clear arrow
  els.feedbackRow.style.display = 'none'; // Hide row until needed
  els.actions.innerHTML = "";

  if (state.reviewQueue.length > 0) {
    state.currentConcept = state.reviewQueue.shift();
    state.currentQuestion = pickRandom(state.currentConcept.questions);
  } else {
    state.currentConcept = pickRandom(lecture1.concepts);
    state.currentQuestion = pickRandom(state.currentConcept.questions);
  }

  renderQuestion();
}

function renderQuestion() {
  const q = state.currentQuestion;
  els.prompt.textContent = q.prompt;
  els.content.innerHTML = '';
  
  if (q.type === 'typed' || q.type === 'fill') {
    renderTyped(q);
  } else if (q.type === 'mcq') {
    renderMCQ(q);
  } else if (q.type === 'tf') {
    renderTF(q);
  } else if (q.type === 'sequence') {
    renderSequence(q);
  } else if (q.type === 'match') {
    renderMatch(q);
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

  input.onkeydown = (e) => {
    if (e.key === 'Enter') checkTyped(q, input.value);
  };

  els.content.appendChild(input);
  els.actions.appendChild(btn);
  setTimeout(() => input.focus(), 100);
}

function renderMCQ(q) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bt-options';
  
  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'bt-option-btn';
    btn.textContent = opt;
    btn.onclick = () => checkMCQ(q, index, wrapper);
    wrapper.appendChild(btn);
  });

  els.content.appendChild(wrapper);
}

function renderTF(q) {
  const wrapper = document.createElement('div');
  wrapper.className = 'bt-tf-row';
  
  const tBtn = document.createElement('button');
  tBtn.className = 'bt-option-btn';
  tBtn.textContent = 'True';
  tBtn.onclick = () => handleTFSelection(true, q, wrapper);

  const fBtn = document.createElement('button');
  fBtn.className = 'bt-option-btn';
  fBtn.textContent = 'False';
  fBtn.onclick = () => handleTFSelection(false, q, wrapper);

  wrapper.appendChild(tBtn);
  wrapper.appendChild(fBtn);
  els.content.appendChild(wrapper);
}

function handleTFSelection(val, q, wrapper) {
  if (val !== q.answer) {
    markWrong(wrapper.querySelectorAll('.bt-option-btn')[val ? 0 : 1], "Incorrect. " + (q.reason || ""));
    return;
  }
  
  wrapper.style.display = 'none';
  
  const reasonBox = document.createElement('div');
  reasonBox.className = 'bt-reason-box';
  
  const reasons = [q.reason, ...q.wrong_reasons].sort(() => Math.random() - 0.5);
  
  reasons.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'bt-option-btn';
    btn.textContent = r;
    btn.onclick = () => {
      if (r === q.reason) {
        markCorrect();
      } else {
        markWrong(btn, "Incorrect reason.");
      }
    };
    reasonBox.appendChild(btn);
  });

  els.content.appendChild(reasonBox);
}

function renderSequence(q) {
  const shuffled = [...q.steps].sort(() => Math.random() - 0.5);
  const container = document.createElement('div');
  container.className = 'bt-seq-container';
  
  shuffled.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'bt-seq-item';
    item.draggable = true;
    item.innerHTML = `<span class="bt-seq-num">${index + 1}.</span> <span>${step}</span>`;
    
    item.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', index);
      item.classList.add('dragging');
    };
    item.ondragend = () => item.classList.remove('dragging');
    item.ondragover = (e) => e.preventDefault();
    
    item.ondrop = (e) => {
      e.preventDefault();
      const draggedIdx = parseInt(e.dataTransfer.getData('text/plain'));
      const items = Array.from(container.children);
      const draggedEl = items[draggedIdx];
      const targetIdx = Array.from(container.children).indexOf(item);
      
      if (draggedIdx < targetIdx) {
        container.insertBefore(draggedEl, item.nextSibling);
      } else {
        container.insertBefore(draggedEl, item);
      }
      
      Array.from(container.children).forEach((el, i) => {
        el.querySelector('.bt-seq-num').textContent = `${i + 1}.`;
      });
    };
    
    container.appendChild(item);
  });

  els.content.appendChild(container);

  const btn = document.createElement('button');
  btn.className = 'lab-btn bt-submit-btn';
  btn.textContent = 'Submit Order';
  btn.onclick = () => checkSequence(q, container);
  els.actions.appendChild(btn);
}

function renderMatch(q) {
  const leftItems = q.pairs.map(p => p.left).sort(() => Math.random() - 0.5);
  const rightItems = q.pairs.map(p => p.right).sort(() => Math.random() - 0.5);
  
  const wrapper = document.createElement('div');
  wrapper.className = 'bt-match-container';
  
  const colL = document.createElement('div');
  colL.className = 'bt-match-col';
  const colR = document.createElement('div');
  colR.className = 'bt-match-col';

  let selectedLeft = null;

  leftItems.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'bt-match-btn';
    btn.textContent = text;
    btn.onclick = () => {
      if (btn.classList.contains('is-matched')) return;
      colL.querySelectorAll('.bt-match-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedLeft = btn;
    };
    colL.appendChild(btn);
  });

  rightItems.forEach(text => {
    const btn = document.createElement('button');
    btn.className = 'bt-match-btn';
    btn.textContent = text;
    btn.onclick = () => {
      if (btn.classList.contains('is-matched')) return;
      if (!selectedLeft) return;
      
      const leftText = selectedLeft.textContent;
      const rightText = text;
      
      const pair = q.pairs.find(p => p.left === leftText && p.right === rightText);
      
      if (pair) {
        selectedLeft.classList.remove('is-selected');
        selectedLeft.classList.add('is-matched');
        btn.classList.add('is-matched');
        selectedLeft = null;
        
        if (colL.querySelectorAll('.is-matched').length === q.pairs.length) {
          markCorrect();
        }
      } else {
        markWrong(btn, "Incorrect match.");
      }
    };
    colR.appendChild(btn);
  });

  wrapper.appendChild(colL);
  wrapper.appendChild(colR);
  els.content.appendChild(wrapper);
}

function checkTyped(q, val) {
  if (state.isAnswered) return;
  const cleanVal = val.trim().toLowerCase();
  if (!cleanVal) return;
  
  const validAnswers = [q.answer, ...(q.accept || [])].map(a => a.toLowerCase());
  
  if (validAnswers.includes(cleanVal)) {
    markCorrect();
  } else {
    markWrong(null, `Incorrect. The expected answer was: ${q.answer}`);
  }
}

function checkMCQ(q, selectedIdx, wrapper) {
  if (state.isAnswered) return;
  const btns = wrapper.querySelectorAll('.bt-option-btn');
  
  if (selectedIdx === q.answer) {
    btns[selectedIdx].classList.add('is-correct');
    markCorrect();
  } else {
    btns[selectedIdx].classList.add('is-wrong');
    btns[q.answer].classList.add('is-correct');
    markWrong(null, `Incorrect. The correct answer was: ${q.options[q.answer]}`);
  }
}

function checkSequence(q, container) {
  if (state.isAnswered) return;
  const currentOrder = Array.from(container.children).map(el => el.querySelector('span:last-child').textContent);
  
  const isCorrect = currentOrder.every((val, index) => val === q.steps[index]);
  
  if (isCorrect) {
    markCorrect();
  } else {
    markWrong(null, "Incorrect order.");
  }
}

function markCorrect() {
  if (state.isAnswered) return;
  state.isAnswered = true;
  state.streak++;
  state.correctCount++;
  updateStats();
  
  els.feedbackRow.style.display = 'flex'; // Show row
  els.feedback.textContent = "Correct.";
  els.feedback.classList.add("is-success");
  
  setTimeout(() => {
    nextQuestion();
  }, 800);
}

function markWrong(element, msg) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  
  state.streak = 0;
  state.wrongCount++;
  updateStats();

  if (element) element.classList.add('is-wrong');
  
  els.feedbackRow.style.display = 'flex'; // Show row
  els.feedback.textContent = msg;
  els.feedback.classList.add("is-error");

  state.reviewQueue.push(state.currentConcept);

  els.actions.innerHTML = '';
  els.content.querySelectorAll('button, input').forEach(el => el.disabled = true);

  // Create the Arrow Next Button
  const arrowBtn = document.createElement('button');
  arrowBtn.className = 'bt-next-arrow';
  arrowBtn.innerHTML = '→';
  arrowBtn.title = 'Next Question';
  arrowBtn.onclick = nextQuestion;
  
  // Append to the feedback row
  els.feedbackRow.appendChild(arrowBtn);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

window.__btReset = resetToIntro;
