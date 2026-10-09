import type { FloatingAd } from './floatingAds';

/**
 * Rotation engine for the floating article adverts.
 *
 * Pure, framework-free state transitions so the rules can be unit-tested and
 * reused anywhere: it only knows about plain objects plus an optional
 * sessionStorage-like store for persisting progress across article pages
 * within one browsing session.
 *
 * Rules implemented here:
 *   - only `active` adverts are ever picked;
 *   - rotation is sequential and predictable (the adverts array order, with a
 *     cursor that persists between pages so every advertiser gets a turn);
 *   - no advert is shown twice until every eligible advert has had its turn;
 *   - an advert dismissed during the current article visit is never reopened
 *     during that visit;
 *   - dismissals persist for the browsing session, so navigating between
 *     articles skips recently-closed adverts while alternatives remain;
 *   - only when the whole list has been dismissed does the rotation cycle back
 *     to the beginning ("only if appropriate"), avoiding excessive repetition.
 */

export interface FloatingAdRotationState {
  /** Index in the active list where the next scan starts. */
  cursor: number;
  /** Ids already displayed in the current pass. */
  shown: string[];
  /** Ids the reader closed during this browsing session. */
  dismissed: string[];
}

/** Per-article-visit tracking. Never persisted — resets on every navigation. */
export interface FloatingAdVisitState {
  /** Ids displayed during this article visit. */
  shown: string[];
  /** Ids dismissed during this article visit — never reopened here. */
  dismissed: string[];
}

/** Minimal sessionStorage surface used for persistence. */
export interface AdStorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const ROTATION_STORAGE_KEY = 'en:floating-ad-rotation:v1';

export function createRotationState(): FloatingAdRotationState {
  return { cursor: 0, shown: [], dismissed: [] };
}

export function createVisitState(): FloatingAdVisitState {
  return { shown: [], dismissed: [] };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidRotationState(value: unknown): value is FloatingAdRotationState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Record<string, unknown>;
  return (
    typeof state.cursor === 'number' &&
    Number.isFinite(state.cursor) &&
    isStringArray(state.shown) &&
    isStringArray(state.dismissed)
  );
}

/** Read persisted rotation progress; tolerates missing or corrupt storage. */
export function loadRotationState(storage?: AdStorageLike | null): FloatingAdRotationState {
  if (!storage) return createRotationState();
  try {
    const raw = storage.getItem(ROTATION_STORAGE_KEY);
    if (!raw) return createRotationState();
    const parsed: unknown = JSON.parse(raw);
    return isValidRotationState(parsed) ? parsed : createRotationState();
  } catch {
    return createRotationState();
  }
}

/** Persist rotation progress for the rest of the browsing session. */
export function saveRotationState(
  storage: AdStorageLike | null | undefined,
  state: FloatingAdRotationState,
): void {
  if (!storage) return;
  try {
    storage.setItem(ROTATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — rotation still works for this page.
  }
}

/** Clear persisted progress (a new browsing session starts fresh anyway). */
export function resetRotationState(storage?: AdStorageLike | null): void {
  if (!storage) return;
  try {
    storage.removeItem(ROTATION_STORAGE_KEY);
  } catch {
    // Nothing to do without storage.
  }
}

function unique(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

/** Record a dismissal (pure — returns a new state). */
export function markDismissed(
  state: FloatingAdRotationState,
  id: string,
): FloatingAdRotationState {
  return { ...state, dismissed: unique([...state.dismissed, id]) };
}

/**
 * Choose the next advert to display, advancing the rotation.
 *
 * `ads` is the configured list in its stable order; `state` carries the
 * session-persisted rotation progress; `visit` carries what has already been
 * shown/dismissed on the current article page. Returns the picked advert (or
 * null when nothing more should appear right now) plus the updated state —
 * inputs are never mutated.
 */
export function pickNextAd(
  ads: FloatingAd[],
  state: FloatingAdRotationState,
  visit: FloatingAdVisitState,
): { ad: FloatingAd | null; state: FloatingAdRotationState } {
  // Only active adverts, in their configured order, deduplicated by id.
  const seen = new Set<string>();
  const active: FloatingAd[] = [];
  for (const ad of ads) {
    if (!ad.active || !ad.id || seen.has(ad.id)) continue;
    seen.add(ad.id);
    active.push(ad);
  }

  if (active.length === 0) return { ad: null, state };

  const activeIds = new Set(active.map((ad) => ad.id));

  // Prune progress entries for adverts that no longer exist (added, removed or
  // deactivated bookings must not wedge the rotation).
  let shown = state.shown.filter((id) => activeIds.has(id));
  let dismissed = state.dismissed.filter((id) => activeIds.has(id));

  // Everyone has been dismissed this session — cycle back to the beginning,
  // but only at this natural boundary, so closed adverts are not hammered.
  let pool = active.filter((ad) => !dismissed.includes(ad.id));
  if (pool.length === 0) {
    dismissed = [];
    shown = [];
    pool = active;
  }

  const n = active.length;
  const cursor = ((Math.floor(state.cursor) % n) + n) % n;

  const scan = (ignoreShown: boolean): { ad: FloatingAd; index: number } | null => {
    for (let i = 0; i < n; i += 1) {
      const index = (cursor + i) % n;
      const ad = active[index];
      if (!pool.some((candidate) => candidate.id === ad.id)) continue;
      if (visit.dismissed.includes(ad.id)) continue;
      if (visit.shown.includes(ad.id)) continue;
      if (!ignoreShown && shown.includes(ad.id)) continue;
      return { ad, index };
    }
    return null;
  };

  let picked = scan(false);

  // Everything eligible has had its turn in the current pass — cycle back to
  // the beginning of the list. `scan` still refuses anything already shown or
  // dismissed during this article visit, so a visit never repeats an advert.
  if (!picked && pool.every((ad) => shown.includes(ad.id))) {
    shown = [];
    picked = scan(true);
  }

  if (!picked) return { ad: null, state: { cursor, shown, dismissed } };

  return {
    ad: picked.ad,
    state: {
      cursor: (picked.index + 1) % n,
      shown: unique([...shown, picked.ad.id]),
      dismissed,
    },
  };
}
