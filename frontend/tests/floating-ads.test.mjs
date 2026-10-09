// Unit tests for the rotating floating advertisement engine.
//
// Run from `frontend/`:  npm test
// (Node 22 strips the TypeScript types on load — no build step needed.)

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ROTATION_STORAGE_KEY,
  createRotationState,
  createVisitState,
  loadRotationState,
  markDismissed,
  pickNextAd,
  resetRotationState,
  saveRotationState,
} from '../src/lib/adRotation.ts';
import {
  advertiserToFloatingAd,
  resolveAdDelay,
  resolveFloatingAds,
  isExternalHref,
} from '../src/lib/floatingAds.ts';

const ad = (id, extra = {}) => ({ id, headline: `Ad ${id}`, active: true, ...extra });

const ads3 = () => [ad('a'), ad('b'), ad('c')];

/** Drive a full article visit: pick, show, dismiss, repeat until exhausted. */
function runVisit(ads, state, { dismissEach = true, max = 10 } = {}) {
  const visit = createVisitState();
  const shown = [];
  for (let i = 0; i < max; i += 1) {
    const result = pickNextAd(ads, state, visit);
    state = result.state;
    if (!result.ad) break;
    shown.push(result.ad.id);
    visit.shown.push(result.ad.id);
    if (dismissEach) {
      visit.dismissed.push(result.ad.id);
      state = markDismissed(state, result.ad.id);
    }
  }
  return { shown, state, visit };
}

function mockStorage(init = {}) {
  const map = new Map(Object.entries(init));
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => {
      map.set(key, String(value));
    },
    removeItem: (key) => {
      map.delete(key);
    },
    dump: () => Object.fromEntries(map),
  };
}

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

test('resolveAdDelay: fixed delays pass through', () => {
  assert.equal(resolveAdDelay(25000), 25000);
  assert.equal(resolveAdDelay(0), 0);
  assert.equal(resolveAdDelay(-5), 0, 'negative delays clamp to zero');
});

test('resolveAdDelay: ranged delays stay inside [min, max]', () => {
  assert.equal(resolveAdDelay([20000, 30000], () => 0), 20000);
  assert.equal(resolveAdDelay([20000, 30000], () => 1), 30000);
  assert.equal(resolveAdDelay([20000, 30000], () => 0.5), 25000);
  assert.equal(resolveAdDelay([30000, 20000], () => 0), 20000, 'inverted ranges normalise');
  for (let i = 0; i <= 20; i += 1) {
    const delay = resolveAdDelay([20000, 30000], () => i / 20);
    assert.ok(delay >= 20000 && delay <= 30000, `${delay} outside 20–30s`);
  }
});

// ---------------------------------------------------------------------------
// Eligibility
// ---------------------------------------------------------------------------

test('no active adverts → nothing is ever displayed', () => {
  const result = pickNextAd([], createRotationState(), createVisitState());
  assert.equal(result.ad, null);
  const allInactive = [ad('a', { active: false }), ad('b', { active: false })];
  assert.equal(pickNextAd(allInactive, createRotationState(), createVisitState()).ad, null);
});

test('inactive adverts are skipped, even as the only remaining entries', () => {
  const ads = [ad('a'), ad('b', { active: false }), ad('c')];
  let state = createRotationState();
  const visit = createVisitState();

  const first = pickNextAd(ads, state, visit);
  assert.equal(first.ad.id, 'a');
  state = first.state;
  visit.shown.push('a');

  const second = pickNextAd(ads, state, visit);
  assert.equal(second.ad.id, 'c', 'skips the inactive advert between them');
  state = second.state;
  visit.shown.push('c');

  assert.equal(pickNextAd(ads, state, visit).ad, null, 'never falls back to inactive adverts');
});

test('a single active advert displays once per visit without errors', () => {
  const ads = [ad('only')];
  const { shown, state } = runVisit(ads, createRotationState());
  assert.deepEqual(shown, ['only'], 'shown exactly once this visit');
  // New visit in the same session: the only advert may appear again.
  const again = runVisit(ads, state);
  assert.deepEqual(again.shown, ['only']);
});

// ---------------------------------------------------------------------------
// Rotation order and duplicates
// ---------------------------------------------------------------------------

test('rotates sequentially through every active advert, one per call', () => {
  let state = createRotationState();
  const visit = createVisitState();
  const order = [];
  for (let i = 0; i < 3; i += 1) {
    const result = pickNextAd(ads3(), state, visit);
    assert.ok(result.ad, `pick ${i + 1} returned an advert`);
    order.push(result.ad.id);
    state = result.state;
    visit.shown.push(result.ad.id);
  }
  assert.deepEqual(order, ['a', 'b', 'c'], 'predictable rotation order');
});

test('no duplicates until every eligible advert has been shown', () => {
  const { shown } = runVisit(ads3(), createRotationState());
  assert.deepEqual(shown, ['a', 'b', 'c']);
  assert.equal(new Set(shown).size, shown.length, 'no repeated ids in the pass');
});

test('an advert dismissed during the visit is never reopened that visit', () => {
  const ads = ads3();
  let state = createRotationState();
  const visit = createVisitState();

  // Show and dismiss a, then let b pass without dismissal (reader navigates on).
  let r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'a');
  state = markDismissed(r.state, 'a');
  visit.dismissed.push('a');
  visit.shown.push('a');

  r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'b');
  state = r.state;
  visit.shown.push('b');

  r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'c');
  state = r.state;
  visit.shown.push('c');
  visit.dismissed.push('c');
  state = markDismissed(state, 'c');

  // a and c were closed; b was only displayed. None may reappear this visit.
  assert.equal(pickNextAd(ads, state, visit).ad, null);
});

test('closing every advert ends the visit — nothing loops back immediately', () => {
  const { shown, state } = runVisit(ads3(), createRotationState());
  assert.deepEqual(shown, ['a', 'b', 'c']);
  const final = pickNextAd(ads3(), state, {
    shown: ['a', 'b', 'c'],
    dismissed: ['a', 'b', 'c'],
  });
  assert.equal(final.ad, null);
});

// ---------------------------------------------------------------------------
// Session persistence across article pages
// ---------------------------------------------------------------------------

test('session dismissals skip closed adverts on later article visits', () => {
  const ads = ads3();

  // Visit 1: reader closes the first advert, then leaves the article.
  let state = createRotationState();
  let visit = createVisitState();
  let r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'a');
  state = markDismissed(r.state, 'a');

  // Visit 2: the closed advert is skipped while alternatives remain.
  visit = createVisitState();
  r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'b', 'continues at the next advertiser, not a repeat');
  state = r.state;
  state = markDismissed(state, 'b');

  visit = createVisitState();
  r = pickNextAd(ads, state, visit);
  assert.equal(r.ad.id, 'c');
  state = markDismissed(r.state, 'c');

  // Visit 4: everything has been dismissed — appropriate moment to cycle back.
  visit = createVisitState();
  r = pickNextAd(ads, state, visit);
  assert.ok(r.ad, 'rotation cycles back once all advertisers were closed');
  assert.equal(r.ad.id, 'a');
});

test('rotation progress persists: later visits continue the pass, not restart', () => {
  const ads = ads3();

  // Visit 1: advert a is shown; the reader leaves before b appears.
  let state = createRotationState();
  let r = pickNextAd(ads, state, createVisitState());
  assert.equal(r.ad.id, 'a');
  state = r.state;

  // Visit 2: picks up at b — a is not repeated first.
  r = pickNextAd(ads, state, createVisitState());
  assert.equal(r.ad.id, 'b');
  state = r.state;

  // Visit 3: c.
  r = pickNextAd(ads, state, createVisitState());
  assert.equal(r.ad.id, 'c');
  state = r.state;

  // Visit 4: full pass complete — cycles back to the beginning.
  r = pickNextAd(ads, state, createVisitState());
  assert.equal(r.ad.id, 'a');
});

test('resetRotationState clears stored progress (fresh browsing session)', () => {
  const storage = mockStorage();
  const state = { cursor: 2, shown: ['a'], dismissed: ['b'] };
  saveRotationState(storage, state);
  assert.deepEqual(loadRotationState(storage), state);
  resetRotationState(storage);
  assert.deepEqual(loadRotationState(storage), createRotationState());
});

// ---------------------------------------------------------------------------
// Adding / removing / deactivating adverts mid-rotation
// ---------------------------------------------------------------------------

test('adding an advert mid-session joins the rotation without breaking it', () => {
  let state = createRotationState();
  let r = pickNextAd([ad('a'), ad('b')], state, createVisitState());
  assert.equal(r.ad.id, 'a');
  state = r.state;

  r = pickNextAd([ad('a'), ad('b'), ad('new')], state, createVisitState());
  assert.ok(r.ad, 'rotation continues');
  assert.notEqual(r.ad.id, 'a');
  state = r.state;

  r = pickNextAd([ad('a'), ad('b'), ad('new')], state, createVisitState());
  assert.ok(r.ad);
  state = r.state;

  r = pickNextAd([ad('a'), ad('b'), ad('new')], state, createVisitState());
  assert.ok(r.ad, 'every advert gets a turn even after the list changed');
});

test('removing or deactivating an advert never wedges the rotation', () => {
  let state = { cursor: 1, shown: ['b'], dismissed: ['gone'] };

  // 'gone' was removed from the list; stale progress entries are pruned.
  let r = pickNextAd([ad('a'), ad('b')], state, createVisitState());
  assert.ok(r.ad);
  state = r.state;
  assert.ok(!state.dismissed.includes('gone'), 'stale ids are pruned');
  assert.ok(!state.shown.includes('gone'));

  // A previously seen advert is deactivated: the others still rotate.
  state = { cursor: 0, shown: ['a'], dismissed: [] };
  r = pickNextAd([ad('a', { active: false }), ad('b'), ad('c')], state, createVisitState());
  assert.equal(r.ad.id, 'b', 'deactivated adverts are skipped');
});

// ---------------------------------------------------------------------------
// State shape / storage safety
// ---------------------------------------------------------------------------

test('markDismissed accumulates without duplicates and is pure', () => {
  const state = createRotationState();
  const once = markDismissed(state, 'a');
  const twice = markDismissed(once, 'a');
  assert.deepEqual(state.dismissed, [], 'original untouched');
  assert.deepEqual(once.dismissed, ['a']);
  assert.deepEqual(twice.dismissed, ['a']);
});

test('loadRotationState survives missing, corrupt, or hostile storage', () => {
  assert.deepEqual(loadRotationState(null), createRotationState());
  assert.deepEqual(loadRotationState(undefined), createRotationState());

  const corrupt = mockStorage({ [ROTATION_STORAGE_KEY]: '{not json' });
  assert.deepEqual(loadRotationState(corrupt), createRotationState());

  const wrongShape = mockStorage({ [ROTATION_STORAGE_KEY]: JSON.stringify({ cursor: 'x' }) });
  assert.deepEqual(loadRotationState(wrongShape), createRotationState());

  const throwing = {
    getItem() {
      throw new Error('denied');
    },
    setItem() {
      throw new Error('denied');
    },
    removeItem() {
      throw new Error('denied');
    },
  };
  assert.deepEqual(loadRotationState(throwing), createRotationState());
  saveRotationState(throwing, createRotationState()); // must not throw
  resetRotationState(throwing); // must not throw
});

test('save/load round-trips the rotation progress', () => {
  const storage = mockStorage();
  const state = { cursor: 3, shown: ['a', 'b'], dismissed: ['c'] };
  saveRotationState(storage, state);
  assert.deepEqual(JSON.parse(storage.dump()[ROTATION_STORAGE_KEY]), state);
  assert.deepEqual(loadRotationState(storage), state);
});

// ---------------------------------------------------------------------------
// Configured list + CMS mapping
// ---------------------------------------------------------------------------

test('advertiserToFloatingAd maps a CMS booking to the advert shape', () => {
  const mapped = advertiserToFloatingAd({
    _id: '42',
    businessName: 'Bezalel Hotel Meru',
    slug: 'bezalel-hotel-meru',
    category: 'Hotel',
    logo: 'https://res.cloudinary.com/demo/logo.png',
    description: 'Comfortable accommodation in Meru town.',
    contact: { phone: '0712 000005' },
    adPlacement: 'article-overlay',
    linkURL: 'https://bezalelhotel.co.ke',
    isActive: true,
  });
  assert.deepEqual(mapped, {
    id: 'cms:42',
    image: 'https://res.cloudinary.com/demo/logo.png',
    headline: 'Bezalel Hotel Meru',
    description: 'Comfortable accommodation in Meru town.',
    advertiserName: 'Bezalel Hotel Meru',
    href: 'https://bezalelhotel.co.ke',
    ctaLabel: 'Visit',
    active: true,
  });

  const inactive = advertiserToFloatingAd({
    _id: '43',
    businessName: 'Paused Ltd',
    slug: 'paused-ltd',
    category: 'Other',
    contact: {},
    adPlacement: 'article-overlay',
    isActive: false,
  });
  assert.equal(inactive.active, false);
});

test('resolveFloatingAds: CMS bookings first, then configured promos, inactive dropped', () => {
  const configured = [ad('cfg-1'), ad('cfg-2', { active: false }), ad('cfg-3')];
  const fromCms = [
    {
      _id: '1',
      businessName: 'One',
      slug: 'one',
      category: 'Other',
      contact: {},
      adPlacement: 'article-overlay',
      isActive: true,
    },
    {
      _id: '2',
      businessName: 'Two',
      slug: 'two',
      category: 'Other',
      contact: {},
      adPlacement: 'article-overlay',
      isActive: true,
    },
  ];

  const merged = resolveFloatingAds(fromCms, configured);
  assert.deepEqual(
    merged.map((entry) => entry.id),
    ['cms:1', 'cms:2', 'cfg-1', 'cfg-3'],
    'client bookings get first turn, inactive configured ads are skipped',
  );

  const noCms = resolveFloatingAds([], configured);
  assert.deepEqual(
    noCms.map((entry) => entry.id),
    ['cfg-1', 'cfg-3'],
  );

  const nothing = resolveFloatingAds([], [ad('x', { active: false })]);
  assert.deepEqual(nothing, [], 'an all-inactive list renders no overlay');
});

test('isExternalHref only flags http(s) destinations', () => {
  assert.equal(isExternalHref('https://example.com'), true);
  assert.equal(isExternalHref('http://example.com'), true);
  assert.equal(isExternalHref('/advertise'), false);
  assert.equal(isExternalHref('mailto:a@b.c'), false);
});
