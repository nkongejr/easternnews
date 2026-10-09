# SEO & Google News Implementation Report

**Site:** The Eastern Newspaper — https://www.easternnewspaper.com/
**Scope:** Technical SEO, Google News readiness, county local SEO, favicon/brand identity in Google Search.
**Date:** 9 October 2026
**Constraint honoured throughout:** existing Next.js App Router architecture, design, content, and the advertisement rotation system were preserved. No content was invented, rewritten, or re-categorised.

---

## 1. Issues found in the initial audit

| # | Severity | Issue | Evidence |
|---|----------|-------|----------|
| 1 | **Critical** | **Canonical domain mismatch.** The site is served on `www.easternnewspaper.com`, but `sitemap.ts` hardcoded `https://www.easternnewspaper.co.ke`, and the deployed robots.txt/sitemap.xml (fetched live) confirmed every canonical, OG URL, JSON-LD `@id` and sitemap entry pointed at the old `.co.ke` host — a legacy WordPress site that no longer responds. Google was being told the canonical copy of every article lives on a dead host. | Live `robots.txt` (`Host: …co.ke`, `Sitemap: …co.ke`), live `sitemap.xml` (all `.co.ke` URLs), `frontend/src/app/sitemap.ts:6`, `SITE.url` default |
| 2 | High | **No Google News sitemap.** Nothing told Google which stories are fresh news. | No news sitemap route existed |
| 3 | High | **`NewsArticle` JSON-LD lacked `publisher.logo`** — required for Article/Top Stories eligibility per Google's current Article structured-data guidance. | `frontend/src/app/articles/[slug]/page.tsx` publisher object |
| 4 | High | **County pages 404'd whenever the CMS category document was missing** (e.g. Laikipia, Kirinyaga), even though county coverage exists in published articles. County landing pages are the core of local SEO. | `counties/[slug]/page.tsx` depended solely on `GET /api/categories/:slug` |
| 5 | Moderate | **`/search` was indexable and listed in the sitemap** — a thin, query-dependent utility page competing with the archives. | live sitemap.xml, `search/page.tsx` metadata |
| 6 | Moderate | **Sitemap capped at 100 articles** (`limit: '100'`), no `lastmod` on articles, no author profiles, included noindex `/search`. | `sitemap.ts` |
| 7 | Moderate | **Legacy alias routes returned temporary 307 redirects** (`/category/*`, `/features`), so link equity from the old URL structure never consolidated. | `category/[slug]/page.tsx`, `features/page.tsx` |
| 8 | Moderate | **Favicon**: the brand assets themselves were already correct (the repo's `favicon.ico` 48/32/16, `icon.png` 512², `apple-icon.png` 180² are the official "E" monogram — verified by decoding the ICO and inspecting the pixels), but there was no SVG, no multiple-of-48 px PNG, and Google additionally reads explicit `<link rel="icon">` tags from the home page. The Vercel icon appearing in Google is consistent with Google's cached default from before these assets deployed (plus the canonical-domain mess); Google must recrawl to pick up the correct icon. | Decoded `favicon.ico`; rendered `icon.png`; measured monogram geometry |
| 9 | Minor | `robots.txt` carried the Yandex-only `host:` directive pointing at the wrong domain. | live robots.txt |
| 10 | Minor | Empty-state metadata fallbacks (`title: 'Article'`) existed for API-failure cases — left as-is (they only render if the API is down; not worth diverging from the existing error-handling pattern). | — |

**Already in good shape (verified, not changed):** SSR/ISR rendering of every public page with full content in HTML; unique per-article titles/descriptions from `seoTitle`/`seoDescription` CMS fields with backend auto-fill; self-canonicals everywhere; Open Graph + Twitter cards; single `h1` headlines; visible dates in `<time>` elements; author bylines linked to `/authors/[slug]` pages; breadcrumbs (visible + `BreadcrumbList`); related-article and "more from section" internal links; county rail/directory/footer interlinking of all 11 counties; pagination exposing older articles; labelled, layout-stable ads (`aria-label="Advertisement"`, reserved aspect-ratio frames); hero/lead images not lazy-loaded (`priority` on LCP images); responsive `next/image` delivery with fixed aspect frames (CLS-safe).

## 2. Files changed

**`frontend/src/lib/constants.ts`** — `SITE.url` default changed to `https://www.easternnewspaper.com` with a warning comment. Every canonical, sitemap URL, JSON-LD `@id` and OG URL derives from this one value.

**`frontend/src/app/sitemap.ts`** — rewritten: uses `SITE.url` (no more hardcoded `.co.ke`); walks **all** published articles (20 pages × 50) instead of 100; adds `lastmod` (publish date) and priorities; adds all 11 county pages, all author profile pages; drops `/search`; hourly revalidation. Verified output: 61 URLs, all on `.com`, valid XML.

**`frontend/src/app/news-sitemap.xml/route.ts`** *(new)* — Google News sitemap per Google's current requirements: only articles from the **last 48 hours** (window slides automatically), `news:publication` (name "The Eastern Newspaper", language `en`), `news:publication_date` (original publish time, ISO 8601), `news:title` (the real headline, XML-escaped), ≤1,000 entries, empty file when nothing is fresh (valid per Google). Refreshes every 30 min so new stories appear without a redeploy.

**`frontend/src/app/robots.ts`** — declares **both** sitemaps on the serving domain; dropped the non-standard `host:` line. Crawl access for Googlebot/Googlebot-News unchanged (`Allow: /`, only `/admin` disallowed; CSS/JS/images never blocked).

**`frontend/src/app/layout.tsx`** — explicit icon declarations added (see favicon section).

**`frontend/src/app/articles/[slug]/page.tsx`** — `NewsArticle` publisher now carries the official logo (`ImageObject`, absolute URL), the missing piece for Article rich result / Top Stories eligibility. All other existing schema (author, dates, breadcrumbs) preserved.

**`frontend/src/app/counties/[slug]/page.tsx`** — county pages now render from the site's own county register (`COUNTIES` in constants) with the CMS category document used only as an optional editorial description. All 11 counties therefore always have a working, populated landing page. Metadata upgraded to `Latest News in <County> County | The Eastern Newspaper` + honest generated description (used only when the newsroom hasn't written one) + county Open Graph tags. Unknown slugs still 404.

**`frontend/src/app/search/page.tsx`** — `noindex, follow` (utility page; also removed from the sitemap).

**`frontend/src/app/category/[slug]/page.tsx`, `frontend/src/app/features/page.tsx`** — legacy aliases now issue **permanent 308** redirects so old links/search listings consolidate onto `/politics`, `/business`, `/counties/*`, `/editorial`.

**`frontend/src/lib/api.ts`** — added `getAuthors()` (public API route already existed) to power author URLs in the sitemap.

**New favicon assets:** `frontend/public/favicon.svg` (vector of the official monogram — geometrically verified 99.8% pixel-identical to the official `app/icon.png`, the 0.2% being edge antialiasing) and `frontend/public/favicon-96x96.png` (downscaled from the official `app/icon.png`, not redrawn).

## 3. Sitemap & robots URLs (after deploy)

- `https://www.easternnewspaper.com/sitemap.xml` — full indexable map (homepage, 18 sections, 11 county pages, author profiles, every published article with lastmod)
- `https://www.easternnewspaper.com/news-sitemap.xml` — Google News sitemap (last-48h stories)
- `https://www.easternnewspaper.com/robots.txt` — lists both sitemaps

Both sitemap routes revalidate automatically (news: 30 min; evergreen: hourly), so publishing from the newsroom CMS updates them without a redeploy. **Deployment note:** on Vercel, any `NEXT_PUBLIC_SITE_URL` env var must be set to `https://www.easternnewspaper.com` (or removed so the new default applies) — if it still says `.co.ke`, canonicals will point at the old host again. This is a dashboard change only the owner can make.

## 4. Structured data implemented

| Type | Where | Notes |
|------|-------|-------|
| `NewsMediaOrganization` | every page (layout) | name, official logo, address, phone, email, `areaServed` = the 11 counties, `sameAs` socials |
| `NewsArticle` / `OpinionNewsArticle` | article pages | headline, description, image (absolute), `datePublished`/`dateModified` (ISO 8601), `author` Person with profile URL, publisher **with logo (new)**, `mainEntityOfPage`, `articleSection`, `inLanguage: en-KE`, keywords |
| `BreadcrumbList` | article pages | Home → section → story |

All values are generated from real article data — no invented authors, dates, or claims. Types were checked against Google's current Article/Organization/News-sitemap documentation (fetched during this session).

## 5. County pages — all 11 live

`/counties/meru`, `tharaka-nithi`, `isiolo`, `embu`, `samburu`, `kirinyaga`, `laikipia`, `kitui`, `machakos`, `makueni`, `marsabit`.

**Evidence of genuine coverage:** the site's own county register and category enum (11 counties, matching the paper's stated coverage), the seed corpus (county-named story files, e.g. `embu-roads.jpg`, `kitui-women.jpg`, `machakos-water.jpg`), and the live article archive where every county desk has published stories (verified in the production sitemap: meru, embu, tharaka-nithi, kitui, machakos, makueni, kirinyaga, laikipia, samburu, isiolo, marsabit articles). Each page lists that county's real stories via its category, links to every other county desk (rail + directory + footer) and to the section desks, has a unique title/description/canonical, and updates automatically as stories publish. Previously, any county without a CMS category document returned 404 — now none can. No thin doorway pages were created: every page is powered by the actual reporting archive.

## 6. Tests performed (production build + runtime)

Ran against a `next build` + `next start` production server with a fixture API mirroring the Express contract (28 stories across all categories incl. multi-author, agency credit, opinion/editorial types):

- **XML validity** — both sitemaps parse; every URL absolute on `.com`; news sitemap entries all within the 48h window with valid `name`/`language`/`publication_date`/`title`
- **robots.txt** — both `Sitemap:` lines present; `/admin` disallowed; nothing else blocked
- **Canonicals** — homepage, 5 section pages, article page, 3 county pages all self-canonical on `.com`
- **Icons** — `/favicon.ico` (15086 B, image/x-icon, contains 48/32/16), `/icon.png` (512²), `/favicon-96x96.png` (96²), `/favicon.svg`, `/apple-icon.png` (180²) all HTTP 200 with correct content-types; rendered head shows exactly three `rel="icon"` links (`.ico`, 96 px PNG, SVG) + apple-touch-icon — no duplicates, no Vercel references anywhere in the HTML
- **Structured data** — JSON-LD parsed on article pages: `NewsArticle` (incl. publisher logo, author URL, ISO dates), `BreadcrumbList`, `NewsMediaOrganization`; `<h1>` matches headline; visible `<time>` elements match `datePublished`
- **County pages** — 200 for CMS-backed (Meru) and CMS-missing (Laikipia, Kirinyaga — the new fallback) counties; unique titles; 404 for unknown slugs
- **Status codes** — deleted article → 404; `/search` → `noindex, follow`; `/category/meru`, `/category/national`, `/features` → 308 permanent
- **Build & lint** — `next build` clean (41 routes); ESLint 0 errors (2 pre-existing warnings in admin components, untouched); full test suite passes (20 node + 14 vitest, incl. the ad-rotation behaviour)
- **Favicon SVG fidelity** — rasterised vector diffed against the official 512 px icon: 99.8 % identical pixels

## 7. Favicon task — summary

- **Created:** `public/favicon.svg`, `public/favicon-96x96.png` (both derived from the existing official monogram; nothing redrawn or rebranded)
- **Kept (already official, URLs stable):** `/favicon.ico`, `/icon.png`, `/apple-icon.png`
- **Metadata:** `app/layout.tsx` now declares the two new icons explicitly; file-convention links cover the originals; no duplicate or dead references; header/footer branding untouched
- **Publisher identity:** `NewsArticle` + `NewsMediaOrganization` both reference the official masthead logo on the production domain
- **Verified:** all five icon URLs 200 in the production build; correct `<link>` tags on every public route (layout-level); no default/Vercel icon references anywhere in the codebase
- **Reality check:** Google re-crawls favicons on its own schedule (days to weeks). After deploy, the owner should request re-indexing of the home page in Search Console; Google retains discretion over the icon shown. No ranking or icon change is claimed until then.

## 8. Steps that require the owner's accounts

1. **Vercel:** set/remove `NEXT_PUBLIC_SITE_URL` → `https://www.easternnewspaper.com` (critical — see §3), then redeploy.
2. **Google Search Console:** verify the `https://www.easternnewspaper.com` property → submit `sitemap.xml` **and** `news-sitemap.xml` → URL-inspect the homepage and request indexing (also refreshes the favicon) → monitor Pages/Indexing, Core Web Vitals and the structured-data reports over the following weeks.
3. **Google Publisher Center** (optional, for Google News surface eligibility): register the publication with the name exactly as it appears on articles ("The Eastern Newspaper").
4. **Domain hygiene (recommended):** the legacy `easternnewspaper.co.ke` host is dead/unreachable. If that domain is still owned, serve a 301 redirect from it to the `.com` equivalent so any residual old links and search listings transfer.

## 9. Remaining recommendations (no code change made)

- **Article view-count forces `force-dynamic`** on article pages (uncached SSR so the counter stays accurate). HTML is fully crawlable, but TTFB depends on the API. If ever needed, an ISR + client-side count-ping refactor would enable edge caching — deliberately not attempted now because it changes view-count and ad-serving behaviour.
- **Article `<title>` length:** headlines are used verbatim (Google's guidance); editors should keep headlines ≲110 characters so nothing is truncated in results.
- **Author profiles:** bylines link to real profile pages; enriching bios/photos in the CMS strengthens E-E-A-T over time.
- **Pre-existing (not introduced, left alone):** the two ESLint `<img>` warnings in admin-only components; the incomplete desk email addresses in `CONTACT.deskEmails` (deliberately preserved verbatim pending client confirmation, per the existing code comment); `site.social.x` pointing at the generic `https://x.com` — should be replaced with the paper's real profile URL when available (it is currently emitted in `sameAs`; a placeholder profile link is worse than none, so leaving it for the owner to confirm).
