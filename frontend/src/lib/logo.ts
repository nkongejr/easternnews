/* ============================================================
   MASTHEAD ARTWORK

   The Eastern Newspaper logo is a supplied artwork file, not a
   piece of typography, so it lives in /public/brand and is
   referenced from here — one constant that every branding slot
   in the site reads (masthead, sticky bar, drawer, footer).

   TO INSTALL THE LOGO
   -------------------
   1. Drop the artwork into  frontend/public/brand/
      e.g.  frontend/public/brand/eastern-newspaper-logo.png
   2. Point LOGO_SRC at it:
        export const LOGO_SRC = '/brand/eastern-newspaper-logo.png';

   Supported: .png, .jpg, .jpeg, .webp, .svg, .avif — a plain
   <img> is used rather than next/image so SVG artwork is never
   rasterised and the mark always renders at its native crispness.

   The frame in globals.css (.en-logo-frame) fixes the *height*
   only; the image itself is width:auto / object-fit:contain, so
   the artwork's proportions are preserved exactly and it can
   never be stretched or squashed.

   While LOGO_SRC is null the sites falls back to the typographic
   lockup, so the masthead is never empty or broken.
   ============================================================ */

/**
 * Path to the logo artwork inside /public, or `null` to render the
 * typographic lockup instead.
 */
export const LOGO_SRC: string | null = null;

/** Rendered as the artwork's alt text and as the accessible name of the link. */
export const LOGO_ALT = 'The Eastern Newspaper';
