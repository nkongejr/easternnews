# Adding Issues 31-33 to Publications — What I found and how to do it

## 1) What was in Gmail (forwarded yesterday, Oct 7 2026)

All from `themasharikinewspaper@gmail.com` to `nicholuskiriinya7@gmail.com`:

| Gmail ID | Subject | Date | Content | Size |
|---|---|---|---|---|
| `1a116e4610cb5c42` | **Fwd: Eastern 31 draft 1** | Oct 7 18:03 +0300 | Attachment `Eastern Issue 31-compressed.pdf` | 5.0 MB, 36 pages, ModDate 2025-12-18 |
| `1a116e5446c618f1` | **Fwd: Eastern 32 draft 2** | Oct 7 18:04 +0300 | Attachment `THE EASTERN issue32-compressed-1.pdf` | 6.8 MB, 40 pages, ModDate 2026-04-21 |
| `1a116f2ec08162d4` | **THE EASTERN ISSUE 33** | Oct 7 18:19 +0300 | Drive link `https://drive.google.com/file/d/1HeoYu4DqdHO8KX8ajFLoAHkdlJ4CtN8r/view?usp=drive_web` — title `THE EASTERN issue33.pdf` — **no Gmail attachment**, only a Drive chip |

Related Issue 33 assets also forwarded:

- `1a116de2940d0d0f` — **Fwd: FRONT PAGE PHOTOS- EASTERN 33** — 2 JPEGs:
  - `Deputy President Professor Kithure Kindiki greets residents of Meru County during a development tour.jpg` (808 KB)
  - `Former Deputy President Rigathi Gachagua and other leaders... Sipili area in Laikipia West recently.jpg` (616 KB)
- `1a10d7bfcc43cf56` — **Fwd: EASTERN 33 HEADLINE** — `EASTERN 33 FINAL HEADLINE.docx`

I've already downloaded the 2 PDFs + 2 cover photos + headline docx to:

```
/home/user/easternnews/gmail/
  Eastern Issue 31-compressed.pdf
  THE EASTERN issue32-compressed-1.pdf
  Deputy President Professor Kithure Kindiki greets residents of Meru County  during a development tour.jpg
  Former Deputy President Rigathi Gachagua and other leaders of the opposition adressing residents of Sipili area in Laikipia West recently.jpg
  EASTERN 33 FINAL HEADLINE.docx
```

**Issue 33 PDF could NOT be auto-downloaded** — this sandbox can only reach `github.com, api.github.com, registry.npmjs.org, pypi.org, files.pythonhosted.org` outbound, so `drive.google.com` is blocked. You need to manually open that Drive link and download `THE EASTERN issue33.pdf` to your machine (or to this folder).

### Extracted metadata from PDFs / docx

**Issue 31:**
- First page text: `Issue 31, December 2025` + headline `Alarm in counties amid looming hunger` + deck `There is now a 90% chance of a drought in Kenya - Kenya Red Cross`
- Suggested fields: `issueNumber=31, title="Issue 31, December 2025", month="December", year=2025, coverHeadline="Alarm in counties amid looming hunger"`

**Issue 32:**
- First page text: `Issue 32  May - June 2026` + headline `Counties chocking in massive debts` + deck `Weak revenue collection streams and corruption responsible for collapse of service delivery`
- Suggested: `issueNumber=32, title="Issue 32, May-June 2026" (seed currently says April-May 2026), month="May-June", year=2026, coverHeadline="Counties chocking in massive debts"`
- Note: seedData.js already has Issue 32 as current — if prod DB already has it, you’ll be **updating** its PDF, not creating.

**Issue 33:**
- From docx `EASTERN 33 FINAL HEADLINE.docx`: headline `Mt Kenya and Ukambani at political crossroads` + deck `New battlegrounds of succession, loyalty, and development politics`
- From email dates Sep 22-29 2026: month likely `September` or `September-October`, year 2026
- Suggested: `issueNumber=33, title="Issue 33, September 2026", month="September", year=2026, coverHeadline="Mt Kenya and Ukambani at political crossroads"`
- Cover image: use one of the 2 front-page photos (Kindiki tour photo is best for cover)

---

## 2) Where publications live in code

- **Model:** `backend/src/models/Issue.js`
  ```js
  issueNumber (unique, required), title, month, year, coverImage, coverHeadline, articles[], pdfUrl, isCurrent
  ```
- **Controller:** `backend/src/controllers/issueController.js` — whitelist `EDITABLE_FIELDS`, validates `pdfUrl` must be `https://…` or site path `/…`
- **Routes:** `backend/src/routes/issueRoutes.js`
  - `GET /api/issues` — public list (used by `/publications`)
  - `GET /api/issues/current`
  - `GET /api/issues/:issueNumber`
  - `POST /api/issues` (admin/editor) — create
  - `PUT /api/issues/:id` (admin/editor) — update
  - `DELETE /api/issues/:id` (admin)
  - `GET /api/issues/id/:id` — admin edit fetch
- **Uploads:** `backend/src/controllers/uploadController.js`
  - `POST /api/upload/pdf` field `file` ≤30MB → streams to Cloudinary `eastern-newspaper/publications` as `raw`, returns `{url: secure_url}`
  - `POST /api/upload` field `image` → Cloudinary `eastern-newspaper`
  - Cloudinary **must** have “Allow delivery of PDF and ZIP files” enabled in Settings → Security, else PDF URL returns 401.
- **Admin UI:** `frontend/src/app/admin/publications/`
  - List: `/admin/publications`
  - New: `/admin/publications/new` → `PublicationForm.tsx`
  - Edit: `/admin/publications/[id]/edit`
  - Form fields: Edition number, Month(s), Year, Title (auto-suggests `Issue ${n}, ${month} ${year}`), Cover headline, Cover image (ImageUploader), PDF link + PdfUploader, isCurrent checkbox.
- **Public page:** `frontend/src/app/publications/page.tsx` — renders cards 3:4 aspect, download button only if `pdfUrl` exists.

---

## 3) How to add them — Manual (recommended for prod)

### Prerequisites
- You need admin credentials from `backend/.env`: `ADMIN_EMAIL=admin@easternnewspaper.co.ke`, `ADMIN_PASSWORD=ChangeMe123!` (or your prod password)
- Backend API running (`npm run dev` on :5000) + Frontend (`npm run dev` on :3000) OR use production URLs (Vercel frontend + Render API)
- Download Issue 33 PDF manually from Drive link above.

### Steps per issue

1. **Login to newsroom:** open `https://easternnewspaper.co.ke/admin/login` (prod) or `http://localhost:3000/admin/login` (local), sign in.

2. **Go to Publications → New publication:** `/admin/publications/new`

3. **Fill form:**
   - **Edition number:** `31` (then `32`, `33`)
   - **Month(s):** `December` for 31, `May-June` for 32, `September` for 33
   - **Year:** `2025` for 31, `2026` for 32 & 33
   - **Title:** will auto-fill, e.g. `Issue 31, December 2025` — keep or edit
   - **Cover headline:** copy from above
   - **Cover image:** click upload. For 31/32: open PDF, screenshot first page cover, crop to portrait 3:4, upload. For 33: upload `Deputy President Professor Kithure Kindiki...jpg` (already in `gmail/` folder). The uploader calls `POST /api/upload` and returns a Cloudinary URL.
   - **Downloadable PDF:** click upload PDF → select your local `Eastern Issue 31-compressed.pdf` etc. It calls `POST /api/upload/pdf` → Cloudinary raw URL. You can also paste a public `https://...` link or site path `/pdfs/issue-31.pdf` if you host elsewhere.
   - **Current issue:** check only for the newest (33) — it will clear the flag from others.

4. **Save:** Publish. It does `POST /api/issues` with payload like:
   ```json
   {
     "issueNumber": 31,
     "title": "Issue 31, December 2025",
     "month": "December",
     "year": 2025,
     "coverHeadline": "Alarm in counties amid looming hunger",
     "coverImage": "https://res.cloudinary.com/.../eastern-newspaper/...jpg",
     "pdfUrl": "https://res.cloudinary.com/.../eastern-newspaper/publications/...pdf",
     "isCurrent": false
   }
   ```

5. **Verify:** visit `/publications` — new cards appear newest first, Download button active.

### If Issue 32 already exists (it does in seed)
- Go to `/admin/publications`, search `32`, click Edit
- Re-upload PDF and cover, update month/year if needed, save (`PUT /api/issues/:id`)

---

## 4) How to add them via API / script (for automation)

### Using curl (after login)

```bash
# 1. login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@easternnewspaper.co.ke","password":"ChangeMe123!"}' | jq -r .token)

# 2. upload PDF
PDF_URL=$(curl -s -X POST http://localhost:5000/api/upload/pdf \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@gmail/Eastern Issue 31-compressed.pdf" | jq -r .url)

# 3. upload cover image (screenshot or front photo)
COVER_URL=$(curl -s -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@gmail/Deputy\ President\ Professor\ Kithure\ Kindiki\ greets\ residents\ of\ Meru\ County\ \ during\ a\ development\ tour.jpg" | jq -r .url)

# 4. create issue
curl -X POST http://localhost:5000/api/issues \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"issueNumber\": 31,
    \"title\": \"Issue 31, December 2025\",
    \"month\": \"December\",
    \"year\": 2025,
    \"coverHeadline\": \"Alarm in counties amid looming hunger\",
    \"coverImage\": \"$COVER_URL\",
    \"pdfUrl\": \"$PDF_URL\",
    \"isCurrent\": false
  }"
```

### Node script (included as `backend/scripts/add-issues-31-33.js` in this branch)

I’ve drafted a script that does login → upload PDFs from `gmail/` → create/update issues. Run with:

```bash
cd backend
node scripts/add-issues-31-33.js --dry-run   # shows what would be done
node scripts/add-issues-31-33.js             # actually uploads to Cloudinary and hits Mongo (needs MONGO_URI reachable)
# For preview-server (in-memory, no Mongo/Cloudinary needed):
API_URL=http://localhost:5000/api node scripts/add-issues-31-33.js --preview
```

Preview mode uses the in-memory `preview-server.js` (run `npm run preview` in another terminal) — good for testing UI without touching prod DB.

---

## 5) Checklist for you

- [ ] Manually download Issue 33 PDF from Drive: https://drive.google.com/file/d/1HeoYu4DqdHO8KX8ajFLoAHkdlJ4CtN8r/view?usp=drive_web → save as `gmail/THE EASTERN issue33.pdf`
- [ ] Screenshot covers for 31 & 32 or use placeholder logo `frontend/public/eastern-newspaper-logo.jpg`
- [ ] Upload PDFs via admin UI → get Cloudinary URLs (check Cloudinary Security setting for PDF delivery)
- [ ] Create Issue 31 (new), update Issue 32 (existing), create Issue 33 (new, mark as current)
- [ ] Verify on `/publications` and test Download buttons
- [ ] Optional: also add the detailed county stories from the other forwarded emails (TNC, Embu, Meru, etc.) as Articles linked to each Issue — those docx + images are in the other forwarded threads from Oct 5.

Let me know if you want me to run the preview server and actually create the 3 editions in-memory so you can see them on a live preview link.
