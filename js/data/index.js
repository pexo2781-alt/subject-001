// ============================================================
// js/data/index.js — static seed source only.
// After the first login, Supabase `content` table is the truth.
// The engine does NOT import this file directly.
// ============================================================

import { lecture1 as bio1 } from './biology-lecture1.js';
import { lecture2 as bio2 } from './biology-lecture2.js';
import { chemistryLecture1 as chem1 } from './chemistry-lecture1.js';

export const seed = {
  biology: { lecture1: bio1, lecture2: bio2 },
  chemistry: { lecture1: chem1 }
};
