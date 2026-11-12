// ============================================================
// js/backup.js — Backup & restore UI
//
// Features:
//   - Export current content as JSON file
//   - Import from previously exported JSON file
//   - Browse & restore version snapshots from Supabase
//   - Reset to seed (danger zone)
// ============================================================

import {
  exportContent,
  importContent,
  listVersions,
  restoreVersion,
  getContent,
  mutateContent
} from './content.js';

const els = {};
let versionsCache = [];

export function initBackup() {
  Object.assign(els, {
    exportBtn: document.getElementById('backupExportBtn'),
    importBtn: document.getElementById('backupImportBtn'),
    importFile: document.getElementById('backupImportFile'),
    refreshVersionsBtn: document.getElementById('backupRefreshVersionsBtn'),
    versionList: document.getElementById('backupVersionList'),
    resetBtn: document.getElementById('backupResetBtn'),
    toast: document.getElementById('cmsToast')
  });

  if (!els.exportBtn) return;

  els.exportBtn.addEventListener('click', handleExport);
  els.importBtn.addEventListener('click', () => els.importFile.click());
  els.importFile.addEventListener('change', handleImportFile);
  els.refreshVersionsBtn?.addEventListener('click', () => loadVersions(true));
  els.resetBtn?.addEventListener('click', handleReset);

  // Lazy-load versions when the data panel is first shown
  document.addEventListener('settings-data-shown', () => loadVersions(false));
}

// ---------- Export ----------

function handleExport() {
  try {
    exportContent();
    showToast('Content exported');
  } catch (e) {
    console.error('[backup] export failed', e);
    showToast('Export failed', true);
  }
}

// ---------- Import ----------

async function handleImportFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const ok = await confirmDialog(
    'Import content?',
    `This will replace all your current content with the contents of <strong>${escapeHtml(file.name)}</strong>. A version snapshot of your current content will be saved first.`,
    'Import'
  );
  if (!ok) { e.target.value = ''; return; }

  try {
    await importContent(file);
    showToast('Content imported');
    // Reload version list since a snapshot was taken
    loadVersions(false);
  } catch (err) {
    console.error('[backup] import failed', err);
    showToast(err?.message || 'Import failed', true);
  } finally {
    e.target.value = '';
  }
}

// ---------- Versions ----------

async function loadVersions(force) {
  if (!els.versionList) return;
  if (!force && versionsCache.length) { renderVersions(); return; }

  els.versionList.innerHTML = '<div class="backup-empty">Loading versions…</div>';

  try {
    versionsCache = await listVersions(50);
    renderVersions();
  } catch (e) {
    console.error('[backup] version list failed', e);
    els.versionList.innerHTML = '<div class="backup-empty">Could not load version history.</div>';
  }
}

function renderVersions() {
  els.versionList.innerHTML = '';

  if (!versionsCache.length) {
    els.versionList.innerHTML = '<div class="backup-empty">No versions yet. Versions are saved automatically on every change.</div>';
    return;
  }

  versionsCache.forEach(v => {
    const row = document.createElement('div');
    row.className = 'backup-version';
    row.innerHTML = `
      <div class="backup-version-info">
        <div class="backup-version-label">${escapeHtml(v.label || 'Untitled snapshot')}</div>
        <div class="backup-version-time">${formatTime(v.created_at)}</div>
      </div>
      <button class="backup-version-btn" data-version-id="${v.id}">Restore</button>
    `;
    row.querySelector('button').addEventListener('click', () => handleRestore(v));
    els.versionList.appendChild(row);
  });
}

async function handleRestore(version) {
  const ok = await confirmDialog(
    'Restore this version?',
    `Your current content will be replaced with the snapshot <strong>${escapeHtml(version.label || 'Untitled')}</strong> from <strong>${formatTime(version.created_at)}</strong>. Your current state will be snapshotted first, so this is reversible.`,
    'Restore'
  );
  if (!ok) return;

  try {
    await restoreVersion(version.id);
    showToast('Version restored');
    loadVersions(false);
  } catch (e) {
    console.error('[backup] restore failed', e);
    showToast(e?.message || 'Restore failed', true);
  }
}

// ---------- Danger zone: reset to seed ----------

async function handleReset() {
  const ok = await confirmDialog(
    'Reset to seed content?',
    `This will <strong>delete all your modules, lectures, and questions</strong> and replace them with the original seed (Biology L1, L2, Chemistry L1). A version snapshot will be saved first, so you can undo this.`,
    'Reset everything'
  );
  if (!ok) return;

  try {
    const seed = await buildSeedForReset();
    await mutateContent((draft) => {
      draft.modules = seed.modules;
      return draft;
    }, { label: 'Reset to seed' });
    showToast('Content reset to seed');
    loadVersions(false);
  } catch (e) {
    console.error('[backup] reset failed', e);
    showToast(e?.message || 'Reset failed', true);
  }
}

/** Re-run the same seed logic content.js uses on first login. */
async function buildSeedForReset() {
  const { lecture1 } = await import('./data/biology-lecture1.js');
  const { lecture2 } = await import('./data/biology-lecture2.js');
  const { chemistryLecture1 } = await import('./data/chemistry-lecture1.js');

  const flatten = (src) => {
    const out = [];
    let order = 0;
    (src?.concepts || []).forEach(concept => {
      (concept.questions || []).forEach(q => {
        out.push({
          id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${order}`,
          type: q.type,
          prompt: q.prompt || '',
          options: q.options || undefined,
          answer: q.answer,
          accept: q.accept || undefined,
          reason: q.reason || undefined,
          wrong_reasons: q.wrong_reasons || undefined,
          steps: q.steps || undefined,
          pairs: q.pairs || undefined,
          explanation: q.explanation || '',
          order: order++
        });
      });
    });
    return out;
  };

  const normalizeLecture = (src, id) => ({
    id,
    name: src.title || 'Untitled',
    order: 0,
    feedback: {
      showExplanation: true,
      correctTitle: 'Correct.',
      incorrectTitle: 'Incorrect.',
      winTitle: 'LECTURE PASSED',
      failTitle: 'LECTURE FAILED'
    },
    questions: flatten(src)
  });

  return {
    modules: [
      {
        id: 'mod_biology', name: 'Molecular Biology & Genetics', order: 0,
        lectures: [normalizeLecture(lecture1, 'lec_bio_1'), normalizeLecture(lecture2, 'lec_bio_2')]
      },
      {
        id: 'mod_chemistry', name: 'Chemistry for the Biosciences', order: 1,
        lectures: [normalizeLecture(chemistryLecture1, 'lec_chem_1')]
      }
    ]
  };
}

// ---------- Confirm dialog ----------

function confirmDialog(title, htmlBody, confirmLabel) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'cms-modal-overlay is-open';
    overlay.innerHTML = `
      <div class="cms-modal is-confirm">
        <div class="cms-modal-title">${escapeHtml(title)}</div>
        <div class="cms-confirm-text">${htmlBody}</div>
        <div class="cms-modal-actions">
          <button class="lab-btn secondary" data-action="cancel">Cancel</button>
          <button class="lab-btn" data-action="confirm">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    const close = (result) => {
      overlay.remove();
      resolve(result);
    };
    overlay.addEventListener('click', e => { if (e.target === overlay) close(false); });
    overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => close(false));
    overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => close(true));
  });
}

// ---------- Utils ----------

function formatTime(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffMin < 60 * 24) return `${Math.floor(diffMin / 60)}h ago`;
    return d.toLocaleString();
  } catch { return iso; }
}

function showToast(msg, isError = false) {
  if (!els.toast) return;
  els.toast.textContent = msg;
  els.toast.classList.toggle('is-error', isError);
  els.toast.classList.add('is-visible');
  clearTimeout(els.toast._t);
  els.toast._t = setTimeout(() => els.toast.classList.remove('is-visible'), 2400);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
