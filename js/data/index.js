// ============================================================
// js/data/index.js — Lecture registry (Bio + Chem modules)
// ============================================================

import { lecture1 as bio1 } from './biology-lecture1.js';
import { lecture2 as bio2 } from './biology-lecture2.js';
import { chemistryLecture1 as chem1 } from './chemistry-lecture1.js';
// import { lecture3 as bio3 } from './biology-lecture3.js';

// Biology module (Molecular Biology & Genetics)
export const lectures = {
  lecture1: bio1,
  lecture2: bio2,
  // lecture3: bio3,
};

// Chemistry module (Chemistry for the Biosciences)
export const chemistryLectures = {
  lecture1: chem1,
};

/**
 * Master registry: module → lectureId → lectureData
 * The bio engine uses this to resolve whichever lecture is passed.
 */
export const registry = {
  biology: lectures,
  chemistry: chemistryLectures,
};

/**
 * Resolve a lecture by module + lectureId.
 * If moduleId is omitted, searches all modules.
 */
export function resolveLecture(moduleId, lectureId) {
  if (moduleId && registry[moduleId]) {
    return registry[moduleId][lectureId] ?? null;
  }
  for (const mod of Object.values(registry)) {
    if (mod[lectureId]) return mod[lectureId];
  }
  return null;
}

/**
 * Get the concept pool for a given module + lecture id.
 * lectureId === 'all' → flat pool across every lecture in the module.
 */
export function getConceptPool(moduleId, lectureId) {
  const moduleRegistry = registry[moduleId] ?? lectures;

  if (!lectureId || lectureId === 'all') {
    return Object.values(moduleRegistry).flatMap(l => l?.concepts ?? []);
  }
  return moduleRegistry[lectureId]?.concepts ?? [];
}

/**
 * Human-readable label for a lecture id (used on the win screen).
 */
export function getLectureLabel(moduleId, lectureId) {
  const lecture = resolveLecture(moduleId, lectureId);
  if (!lecture) return lectureId || 'Unknown Lecture';
  return lecture.title || lectureId;
}
