# Eastern Newspaper — brand artwork

Drop the supplied logo artwork into this folder, then point `LOGO_SRC`
at it in `src/lib/logo.ts`:

```ts
export const LOGO_SRC = '/brand/eastern-newspaper-logo.png';
```

Guidelines

- Keep the artwork's original file and proportions. The masthead frame
  fixes only the **height**; the image itself is `width: auto` with
  `object-fit: contain`, so the mark is never stretched or squashed.
- Use a transparent-background PNG or an SVG so the logo sits cleanly on
  the white masthead, the navy sticky bar and the navy footer.
- A plain `<img>` is used (not `next/image`) so SVG artwork stays
  vector-crisp and no build-time file is required.
- Heights: masthead 60/72/84 px (mobile/tablet/desktop), sticky bar and
  drawer 32 px, footer 44/48 px — see `.en-logo-frame` in
  `src/app/globals.css`.

Until a file is installed, the site renders the typographic lockup
("EN" monogram + two-colour name) in the same slots.
