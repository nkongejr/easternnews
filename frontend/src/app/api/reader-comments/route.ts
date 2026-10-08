/**
 * Same-origin comment endpoint for the reader's browser.
 *
 * Why this exists separately from the `/api/:path*` rewrite: a rewrite has no
 * error handling, so when the Express API is restarting (or unreachable) the
 * browser receives a plain-text "Internal Server Error" and the comment form
 * has nothing useful to tell the reader. This route always answers in JSON —
 * validation messages pass straight through, and a missing API becomes a clear
 * "try again in a moment" instead of a dead form.
 *
 * It lives on a static path (`/api/reader-comments`) on purpose: with an
 * array-style `rewrites()` config, Next serves non-dynamic routes *before* the
 * rewrite, while a dynamic route such as `/api/articles/[id]/comments` would be
 * shadowed by the API proxy. URLs also stay stable if the API moves.
 *
 * GET  /api/reader-comments?articleId=…&page=1&limit=10
 * POST /api/reader-comments?articleId=…   { name, email?, body }
 */
const API_BASE = (
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:5000/api'
).replace(/\/+$/, '');

const NO_STORE = { 'Cache-Control': 'no-store' } as const;

function json(payload: unknown, status: number) {
  return Response.json(payload, { status, headers: NO_STORE });
}

function unavailable() {
  return json(
    {
      message:
        'The comment service is unavailable right now. Please try again in a moment — the comment you typed has not been lost.',
    },
    503,
  );
}

const NOT_ENABLED_MESSAGE =
  'Comments are still being switched on for this site. Please try again a little later.';

async function forward(path: string, init: RequestInit) {
  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE}${path}`, {
      ...init,
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return unavailable();
  }

  const body = await upstream.text();

  // A 404 can mean two very different things:
  //   1. the API build predates the comment routes — its global handler answers
  //      "Not Found - /api/articles/<id>/comments" (what a lagging deployment
  //      looks like);
  //   2. the routes exist and the article really is not there — the controller
  //      answers {"message":"Article not found"}.
  // Only the first is "comments are not switched on yet"; the second is passed
  // through so it is never misreported.
  if (upstream.status === 404) {
    let message = '';
    try {
      message = String((JSON.parse(body) as { message?: string })?.message || '');
    } catch {
      // Not JSON at all — fall through to the generic handling below.
    }

    if (/^Not Found - \/api\//i.test(message)) {
      console.warn(
        `[reader-comments] ${API_BASE}${path} answered 404 — the API deployment looks older than this website (the comment routes ship with the frontend release), so comments cannot be saved yet.`,
      );
      return json({ message: NOT_ENABLED_MESSAGE }, 503);
    }

    if (message) return json({ message }, 404);
  }

  try {
    // A JSON response is passed through untouched, including validation errors.
    return json(JSON.parse(body), upstream.status);
  } catch {
    // Upstream answered with HTML (an error page, a proxy) — translate it.
    return unavailable();
  }
}

function articleIdFrom(req: Request) {
  return new URL(req.url).searchParams.get('articleId')?.trim() || '';
}

export async function GET(req: Request) {
  const articleId = articleIdFrom(req);
  if (!articleId) return json({ message: 'Missing articleId' }, 400);

  const params = new URL(req.url).searchParams;
  const page = params.get('page') || '1';
  const limit = params.get('limit') || '10';

  return forward(
    `/articles/${encodeURIComponent(articleId)}/comments?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`,
    { method: 'GET' },
  );
}

export async function POST(req: Request) {
  const articleId = articleIdFrom(req);
  if (!articleId) return json({ message: 'Missing articleId' }, 400);

  let body = '';
  try {
    body = await req.text();
  } catch {
    return json({ message: 'Please write a comment before posting.' }, 400);
  }

  return forward(`/articles/${encodeURIComponent(articleId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}
