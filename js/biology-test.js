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
  isAnswered: false
};

const els = {};

export function initBiologyTest() {
  Object.assign(els, {
    // Stages
    stageQuestion: document.getElementById('btStageQuestion'),
    stageFeedback: document.getElementById('btStageFeedback'),
    
    // Question Elements
    prompt: document.getElementById('btPrompt'),
    content: document.getElementById('btContent'),
    actions: document.getElementById('btActions'),
    statStreak: document.getElementById('btStatStreak'),
    statCorrect: document.getElementById('btStatCorrect'),
    statWrong: document.getElementById('btStatWrong'),
    exitBtn: document.getElementById('btExitBtn'),

    // Feedback Elements
    feedbackTitle: document.getElementById('btFeedbackTitle'),
    feedbackText: document.getElementById('btFeedbackText'),
    continueBtn: document.getElementById('btContinueBtn')
  });

  if (!els.stageQuestion) return;

  els.exitBtn.addEventListener('click', () => {
    resetToIntro();
    closeDrill();
  });

  els.continueBtn.addEventListener('click', () => {
    showStage('question');
    nextQuestion();
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

  // Make sure the view is active
  const view = document.getElementById('view-biology-test');
  if (view) view.classList.add('is-active');
  
  updateStats();
  showStage('question');
  nextQuestion();
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

function updateStats() {
  if (els.statStreak) els.statStreak.textContent = `${state.streak} / ${TARGET_STREAK}`;
  if (els.statCorrect) els.statCorrect.textContent = state.correctCount;
  if (els.statWrong) els.statWrong.textContent = state.wrongCount;
}

function nextQuestion() {
  if (state.streak >= TARGET_STREAK) {
    // WIN STATE
    els.feedbackTitle.textContent = "TEST PASSED";
    els.feedbackTitle.className = "bt-feedback-title is-correct";
    els.feedbackText.innerHTML = `You achieved a perfect streak of <strong>${TARGET_STREAK}</strong>.`;
    els.continueBtn.textContent = "Return to Menu";
    els.continueBtn.onclick = () => {
      resetToIntro();
      closeDrill();
    };
    showStage('feedback');
    return;
  }

  state.isAnswered = false;
  els.continueBtn.onclick = () => {
    showStage('question');
    nextQuestion();
  };
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

// --- RENDERERS (Unchanged mechanics, just call handleResult now) ---

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
    handleResult(false, "Incorrect. The statement is False.", q.explanation);
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
        handleResult(true, "Correct.", q.explanation);
      } else {
        handleResult(false, "Incorrect reason.", q.explanation);
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
  
  let selectedItem = null;

  const refreshNumbers = () => {
    Array.from(container.children).forEach((el, i) => {
      el.querySelector('.bt-seq-num').textContent = `${i + 1}.`;
    });
  };

  const moveItem = (item, direction) => {
    const parent = item.parentNode;
    if (direction === 'up' && item.previousElementSibling) {
      parent.insertBefore(item, item.previousElementSibling);
    } else if (direction === 'down' && item.nextElementSibling) {
      parent.insertBefore(item.nextElementSibling, item);
    }
    refreshNumbers();
  };

  shuffled.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'bt-seq-item';
    item.innerHTML = `
      <span class="bt-seq-num">${index + 1}.</span>
      <span class="bt-seq-text">${step}</span>
      <div class="bt-seq-arrows">
        <button class="bt-seq-arrow" data-dir="up">▲</button>
        <button class="bt-seq-arrow" data-dir="down">▼</button>
      </div>
    `;

    item.onclick = (e) => {
      if (e.target.classList.contains('bt-seq-arrow')) return;

      if (selectedItem === item) {
        item.classList.remove('is-selected');
        selectedItem = null;
      } else if (selectedItem) {
        selectedItem.classList.remove('is-selected');
        const parent = item.parentNode;
        const itemNext = item.nextSibling;
        const selNext = selectedItem.nextSibling;
        
        parent.insertBefore(selectedItem, itemNext);
        parent.insertBefore(item, selNext);
        
        refreshNumbers();
        selectedItem = null;
      } else {
        item.classList.add('is-selected');
        selectedItem = item;
      }
    };

    item.querySelectorAll('.bt-seq-arrow').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        if (selectedItem) {
          selectedItem.classList.remove('is-selected');
          selectedItem = null;
        }
        moveItem(item, btn.dataset.dir);
      };
    });
    
    container.appendChild(item);
  });

  els.content.appendChild(container);

  const btn = document.createElement('button');
  btn.className = 'lab-btn bt-submit-btn';
  btn.textContent = 'Submit Order';
  btn.onclick = () => {
    const currentOrder = Array.from(container.children).map(el => el.querySelector('.bt-seq-text').textContent);
    const isCorrect = currentOrder.every((val, index) => val === q.steps[index]);
    if (isCorrect) {
      handleResult(true, "Correct.", q.explanation);
    } else {
      handleResult(false, "Incorrect order.", q.explanation);
    }
  };
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
          handleResult(true, "Correct.", q.explanation);
        }
      } else {
        handleResult(false, "Incorrect match.", q.explanation);
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
    handleResult(true, "Correct.", q.explanation);
  } else {
    handleResult(false, `Incorrect. The expected answer was: ${q.answer}`, q.explanation);
  }
}

function checkMCQ(q, selectedIdx, wrapper) {
  if (state.isAnswered) return;
  const btns = wrapper.querySelectorAll('.bt-option-btn');
  
  if (selectedIdx === q.answer) {
    btns[selectedIdx].classList.add('is-correct');
    handleResult(true, "Correct.", q.explanation);
  } else {
    btns[selectedIdx].classList.add('is-wrong');
    btns[q.answer].classList.add('is-correct');
    handleResult(false, `Incorrect. The correct answer was: ${q.options[q.answer]}`, q.explanation);
  }
}

function handleResult(isCorrect, title, explanation) {
  if (state.isAnswered) return;
  state.isAnswered = true;
  
  if (isCorrect) {
    state.streak++;
    state.correctCount++;
  } else {
    state.streak = 0;
    state.wrongCount++;
    state.reviewQueue.push(state.currentConcept);
  }
  
  updateStats();

  // Populate and show feedback screen
  els.feedbackTitle.textContent = title;
  els.feedbackTitle.className = isCorrect ? "bt-feedback-title is-correct" : "bt-feedback-title is-wrong";
  els.feedbackText.innerHTML = `<strong>Explanation:</strong> ${explanation || 'No explanation provided.'}`;
  els.continueBtn.textContent = "Continue";
  
  showStage('feedback');
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

window.__btReset = resetToIntro;
