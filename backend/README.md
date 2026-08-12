# The Eastern Newspaper — Backend API

Node.js/Express + MongoDB (Mongoose) API powering The Eastern Newspaper website.

## 1. Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Postman (for testing)

## 2. Setup

\`\`\`bash
git clone <repo-url> eastern-newspaper-api
cd eastern-newspaper-api
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, SMTP creds, etc.
\`\`\`

## 3. Run locally

\`\`\`bash
npm run dev      # starts with nodemon on http://localhost:5000
\`\`\`

Health check: `GET http://localhost:5000/api/health`

## 4. Seed the database (Issue 32 content)

\`\`\`bash
npm run seed          # populates categories, authors, articles, advertisers, issue, admin user
npm run seed:destroy  # wipes content collections (does not delete Users)
\`\`\`

After seeding, an admin user is created using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`.

## 5. API Overview

| Resource | Base path |
|---|---|
| Auth | `/api/auth` |
| Categories/Counties | `/api/categories` |
| Authors | `/api/authors` |
| Articles | `/api/articles` |
| Advertisers | `/api/advertisers` |
| Issues | `/api/issues` |
| Contact / Newsletter | `/api/contact` |
| Image upload | `/api/upload` |

Full endpoint list is in the Postman collection (`postman/Eastern-Newspaper-API.postman_collection.json`).

## 6. Testing with Postman

1. Import `postman/Eastern-Newspaper-API.postman_collection.json`.
2. Create a Postman **Environment** with:
   - `baseUrl` = `http://localhost:5000/api`
   - `token` = *(leave blank, filled after login)*
3. Run **Auth → Login** with the seeded admin credentials. Copy the `token` from the response into your environment variable `token`.
4. All protected requests use `Authorization: Bearer {{token}}` automatically via the collection's auth settings.
5. Try:
   - `GET {{baseUrl}}/articles?category=Meru`
   - `GET {{baseUrl}}/articles/counties-chocking-in-massive-debts`
   - `POST {{baseUrl}}/articles` (with token) to create a new article
   - `POST {{baseUrl}}/upload` (form-data, key `image`, type File) to upload a photo

## 7. Deployment

- **Database:** MongoDB Atlas — create a cluster, whitelist `0.0.0.0/0` (or Render's IPs), copy connection string into `MONGO_URI`.
- **API:** Render — create a new Web Service pointing at this repo, build command `npm install`, start command `npm start`, add all `.env` variables in Render's dashboard.
  - Note: local disk image uploads are **ephemeral on Render**. For production, swap `src/middleware/upload.js` to upload to Cloudinary/S3 instead.
- **Frontend:** Vercel (Next.js) — set `NEXT_PUBLIC_API_URL` to your Render API URL.

## 8. Content Model Summary

- **Article** — title, slug, deck, body, category, author, bylineCredit, featuredImage {url, caption, credit}, gallery, publishDate, issue, isFeatured, isHero, tags, relatedArticles, status, viewCount, commentCount.
- **Category** — name (county or section), slug, description, heroImage, colorAccent, type.
- **Author** — name, slug, title, bio, photo.
- **Advertiser** — businessName, slug, category, logo, description, contact, adPlacement, linkURL, isActive.
- **Issue** — issueNumber, title, month, year, coverImage, coverHeadline, articles[], pdfUrl, isCurrent.
- **User** — name, email, password (hashed), role (admin/editor).