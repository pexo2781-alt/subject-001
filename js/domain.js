/**
 * domain.js — Domain + Degree navigation.
 */

const state = {
  activeTab: 'domain', // 'domain' | 'degree'
  activeView: 'select' // 'select' | 'mental' | 'degree-bio'
};

const els = {};

export function initDomain({ onExit } = {}) {
  Object.assign(els, {
    topbar: document.getElementById('labTopbar'),
    tabs: Array.from(document.querySelectorAll('.domain-tab')),
    
    viewDomain: document.getElementById('view-domain'),
    viewDegree: document.getElementById('view-degree'),
    
    drillsMental: document.getElementById('drills-mental'),
    drillsDegree: document.getElementById('drills-degree'),
    
    backMental: document.getElementById('back-mental'),
    backDegree: document.getElementById('back-degree'),
    
    choices: Array.from(document.querySelectorAll('.domain-choice')),
    drillCards: Array.from(document.querySelectorAll('.drill-card')),
  });

  els.tabs.forEach(tab => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });

  els.choices.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const domain = btn.dataset.domain;
      const degree = btn.dataset.degree;
      
      if (domain === 'mental') setView('mental');
      if (degree === 'biology') setView('degree-bio');
    });
  });

  if (els.backMental) els.backMental.addEventListener('click', () => setView('select'));
  if (els.backDegree) els.backDegree.addEventListener('click', () => setView('select'));

  els.drillCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-locked')) return;
      const id = card.dataset.drill;
      if (id) openDrill(id);
    });
  });
}

export function showDomainView() {
  if (els.topbar) els.topbar.style.display = 'flex';
  setTab('domain');
}

function setTab(tabName) {
  state.activeTab = tabName;
  
  els.tabs.forEach(t => {
    t.classList.toggle('is-active', t.dataset.tab === tabName);
  });

  if (tabName === 'domain') {
    setView('select');
    if (els.viewDomain) els.viewDomain.classList.add('is-active');
    if (els.viewDegree) els.viewDegree.classList.remove('is-active');
  } else if (tabName === 'degree') {
    setView('select');
    if (els.viewDomain) els.viewDomain.classList.remove('is-active');
    if (els.viewDegree) els.viewDegree.classList.add('is-active');
  }
}

function setView(viewName) {
  state.activeView = viewName;

  if (els.viewDomain) els.viewDomain.classList.remove('is-active');
  if (els.viewDegree) els.viewDegree.classList.remove('is-active');
  if (els.drillsMental) els.drillsMental.classList.remove('is-active');
  if (els.drillsDegree) els.drillsDegree.classList.remove('is-active');
  document.querySelectorAll('.drill-view').forEach(el => el.classList.remove('is-active'));

  if (viewName === 'select') {
    if (state.activeTab === 'domain' && els.viewDomain) els.viewDomain.classList.add('is-active');
    if (state.activeTab === 'degree' && els.viewDegree) els.viewDegree.classList.add('is-active');
  } else if (viewName === 'mental') {
    if (els.drillsMental) els.drillsMental.classList.add('is-active');
  } else if (viewName === 'degree-bio') {
    if (els.drillsDegree) els.drillsDegree.classList.add('is-active');
  }
}

function openDrill(id) {
  if (els.topbar) els.topbar.style.display = 'none';
  
  if (els.drillsMental) els.drillsMental.classList.remove('is-active');
  if (els.drillsDegree) els.drillsDegree.classList.remove('is-active');

  if (id === 'number-memory') {
    if (typeof window.__nmReset === 'function') window.__nmReset();
    const view = document.querySelector('[data-drill-view="number-memory"]');
    if (view) view.classList.add('is-active');
  } else if (id === 'sequence-memory') {
    if (typeof window.__smReset === 'function') window.__smReset();
    const view = document.querySelector('[data-drill-view="sequence-memory"]');
    if (view) view.classList.add('is-active');
  } else if (id === 'visual-memory') {
    if (typeof window.__vmReset === 'function') window.__vmReset();
    const view = document.querySelector('[data-drill-view="visual-memory"]');
    if (view) view.classList.add('is-active');
  } else if (id === 'chimp-test') {
    if (typeof window.__ctReset === 'function') window.__ctReset();
    const view = document.querySelector('[data-drill-view="chimp-test"]');
    if (view) view.classList.add('is-active');
  } else if (id === 'biology-test') {
    if (typeof window.__btReset === 'function') window.__btReset();
    const view = document.querySelector('[data-drill-view="biology-test"]');
    if (view) view.classList.add('is-active');
  }
}

export function closeDrill() {
  if (els.topbar) els.topbar.style.display = 'flex';
  document.querySelectorAll('.drill-view').forEach(el => el.classList.remove('is-active'));
  
  if (state.activeView === 'mental') {
    if (els.drillsMental) els.drillsMental.classList.add('is-active');
  } else if (state.activeView === 'degree-bio') {
    if (els.drillsDegree) els.drillsDegree.classList.add('is-active');
  } else {
    setView('select');
  }
}
