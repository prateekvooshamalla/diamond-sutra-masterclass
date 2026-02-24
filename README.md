# SIF / Palm Leaf Sutra — Diamond Sutra Masterclass (Next.js + shadcn + Tailwind)

## Features
- Multi-language landing page (English, Hindi, Malayalam, Kannada, Chinese) with a language switcher.
- Firebase Auth (email/password + Google).
- Firestore backend for users, enrollments, and course settings.
- Two-level app:
  - **Admin**: manage course settings (Zoom link, prices, recordings) + view users.
  - **User**: dashboard with Zoom access (enabled after registration) + embedded Google Drive recordings.

## Quick start
```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: http://localhost:3000 (auto-redirects to a locale like /en)

## Environment variables
See `.env.example`.

### Firestore Collections (suggested)
- `users/{uid}`: { name, email, phone, role: "user"|"admin", ... }
- `enrollments/{uid}_diamond-sutra`: { uid, courseId, status: "pending_payment"|"active", ... }
- `courses/diamond-sutra`: { title, zoomLink, priceOriginal, priceOffer, modules[], recordings[] }

## Admin setup
To make a user admin for demo:
- In Firestore: `users/{uid}.role = "admin"`

For production security:
- Use Firebase Custom Claims + server-side checks (middleware / API routes with Firebase Admin SDK).
