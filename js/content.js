// ============================================================
// js/content.js — Content data layer
//
// Source of truth: Supabase `content` table (one row per user).
// Version history:  Supabase `content_versions` table (append-only).
// Local cache:      localStorage (fallback if offline).
// Emergency backup: JSON export / import via the settings overlay.
// ============================================================

const CACHE_KEY = 'lab_content_cache_v1';
const CONTENT_VERSION_LABEL_MAX = 80;

/** In-memory current content. Shape: { modules: [...] } */
let current = { modules: [] };
let loaded = false;
const listeners = new Set();

// ---------------- Public API ----------------

export function getContent() {
  return deepClone(current);
}

export function isLoaded() {
  return loaded;
}

export function onContentChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emitChange() {
  const snapshot = getContent();
  listeners.forEach(fn => {
    try { fn(snapshot); } catch (e) { console.warn('[content] listener error', e); }
  });
}

/**
 * Load content from Supabase for the signed-in user.
 * If no row exists yet, seed it from js/data/index.js and save.
 * Falls back to localStorage cache if the network fails.
 */
export async function loadContent() {
  const user = await window.SB.getUser();
  if (!user) throw new Error('Not signed in');

  // 1) Try Supabase
  try {
    const { data, error } = await window.SB.client
      .from('content')
      .select('data, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;

    if (data?.data?.modules) {
      current = data.data;
      loaded = true;
      writeCache();
      emitChange();
      return current;
    }

    // No row yet → seed from static data
    const seed = await buildSeed();
    current = seed;
    loaded = true;
    await saveContent({ label: 'Initial seed', skipVersion: true });
    return current;
  } catch (err) {
    console.warn('[content] Supabase load failed, using cache', err);
    const cached = readCache();
    if (cached?.modules) {
      current = cached;
      loaded = true;
      emitChange();
      return current;
    }
    throw err;
  }
}

/**
 * Save the current content to Supabase.
 * Writes a version snapshot first (unless skipVersion is true).
 * Also refreshes the local cache.
 */
export async function saveContent({ label = 'Save', skipVersion = false } = {}) {
  const user = await window.SB.getUser();
  if (!user) throw new Error('Not signed in');

  // Snapshot the CURRENT (pre-save) content into versions
  if (!skipVersion && loaded) {
    try {
      await window.SB.client
        .from('content_versions')
        .insert({
          user_id: user.id,
          data: current,
          label: String(label).slice(0, CONTENT_VERSION_LABEL_MAX)
        });
    } catch (e) {
      console.warn('[content] version snapshot failed (continuing)', e);
    }
  }

  const { error } = await window.SB.client
    .from('content')
    .upsert(
      {
        user_id: user.id,
        data: current,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );
  if (error) throw error;

  writeCache();
  emitChange();
  return current;
}

/**
 * Mutate the in-memory content, then persist.
 * Always takes a version snapshot before the change hits Supabase.
 */
export async function mutateContent(mutator, { label = 'Edit' } = {}) {
  const before = current;
  const next = mutator(deepClone(before));
  current = next;
  await saveContent({ label });   // snapshot uses `before` via version history
  return current;
}

/**
 * Roll back to a previous version.
 */
export async function restoreVersion(versionId) {
  const user = await window.SB.getUser();
  if (!user) throw new Error('Not signed in');

  const { data, error } = await window.SB.client
    .from('content_versions')
    .select('data, label, created_at')
    .eq('user_id', user.id)
    .eq('id', versionId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.data?.modules) throw new Error('Version not found or empty');

  current = data.data;
  await saveContent({ label: `Restored from version #${versionId}`, skipVersion: false });
  return current;
}

/**
 * List version history (newest first).
 */
export async function listVersions(limit = 50) {
  const user = await window.SB.getUser();
  if (!user) return [];
  const { data, error } = await window.SB.client
    .from('content_versions')
    .select('id, label, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

/**
 * Export the entire content as a downloadable JSON file.
 */
export function exportContent() {
  const payload = {
    _format: 'subject001-content-v1',
    _exportedAt: new Date().toISOString(),
    data: current
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `subject001-content-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import content from a JSON file (from exportContent).
 */
export async function importContent(file) {
  const text = await file.text();
  let parsed;
  try { parsed = JSON.parse(text); } catch { throw new Error('File is not valid JSON.'); }

  const data = parsed?.data ?? parsed;   // accept either wrapped or raw
  if (!data || !Array.isArray(data.modules)) {
    throw new Error('File does not contain a valid { modules: [...] } tree.');
  }

  current = data;
  await saveContent({ label: `Import: ${file.name}` });
  return current;
}

// ---------------- Seed / cache / utils ----------------

async function buildSeed() {
  // Lazy-import the static data so the seed is only built once.
  const bio = await import('./data/biology-lecture1.js');
  const bio2 = await import('./data/biology-lecture2.js');
  const chem = await import('./data/chemistry-lecture1.js');

  const biologyLectures = [
    normalizeLecture(bio.lecture1, 'lec_bio_1'),
    normalizeLecture(bio2.lecture2, 'lec_bio_2')
  ];

  const chemistryLectures = [
    normalizeLecture(chem.chemistryLecture1, 'lec_chem_1')
  ];

  return {
    modules: [
      {
        id: 'mod_biology',
        name: 'Molecular Biology & Genetics',
        order: 0,
        lectures: biologyLectures
      },
      {
        id: 'mod_chemistry',
        name: 'Chemistry for the Biosciences',
        order: 1,
        lectures: chemistryLectures
      }
    ]
  };
}

function normalizeLecture(src, fallbackId) {
  const questions = flattenConcepts(src);
  return {
    id: fallbackId || src.id || `lec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: src.title || 'Untitled Lecture',
    order: 0,
    feedback: {
      showExplanation: true,
      correctTitle: 'Correct.',
      incorrectTitle: 'Incorrect.',
      winTitle: 'LECTURE PASSED',
      failTitle: 'LECTURE FAILED'
    },
    questions
  };
}

/**
 * The old data shape groups questions under `concepts`.
 * The new shape is a flat list. This flattens while preserving order.
 */
function flattenConcepts(src) {
  const out = [];
  const concepts = src?.concepts || [];
  let order = 0;
  for (const concept of concepts) {
    for (const q of (concept.questions || [])) {
      out.push(normalizeQuestion(q, order++, concept));
    }
  }
  return out;
}

function normalizeQuestion(q, order, concept) {
  return {
    id: q.id || `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
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
    feedbackTitle: undefined,        // optional per-question override
    order,
    conceptName: concept?.name       // kept for reference, not used by engine
  };
}

function writeCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(current)); } catch {}
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
