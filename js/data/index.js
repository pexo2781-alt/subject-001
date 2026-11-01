// ============================================================
// js/data/index.js — Lecture registry
// Add a line here for each new lecture data file.
// ============================================================

import { lecture1 } from './biology-lecture1.js';
// import { lecture2 } from './biology-lecture2.js';
// import { lecture3 } from './biology-lecture3.js';

export const lectures = {
  lecture1,
  // lecture2,
  // lecture3,
};

/**
 * Get the concept pool for a given lecture id.
 * - If lectureId is 'all' (or falsy), returns a flat pool of every concept
 *   across every lecture.
 * - If lectureId matches a known lecture, returns that lecture's concepts.
 * - Otherwise returns an empty array.
 */
export function getConceptPool(lectureId) {
  if (!lectureId || lectureId === 'all') {
    return Object.values(lectures).flatMap(l => l?.concepts ?? []);
  }
  return lectures[lectureId]?.concepts ?? [];
}

/**
 * Human-readable label for a lecture id (used on the win screen).
 */
export function getLectureLabel(lectureId) {
  if (!lectureId || lectureId === 'all') return 'All Lectures';
  const lec = lectures[lectureId];
  if (!lec) return lectureId;
  return lec.title || lectureId;
}
