# 🦋 Book Fairies — bookfairiesga.com

> *Creating Passion One Page at a Time*

Official website for **Book Fairies**, a community literacy nonprofit serving Fulton County, Georgia. We collect and distribute books to underserved students and families so every child can experience the joy of reading.

**Live site:** [bookfairiesga.com](https://bookfairiesga.com)

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero, mission statement, founders' story |
| What We Do | `/what-we-do` | Programs, animated book counter |
| Photos | `/photos` | Community gallery with lightbox viewer |
| Book Club | `/book-club` | Monthly reading program info |
| Volunteer | `/volunteer` | How to get involved |
| Donate | `/donate` | How and where to donate books |
| Contact | `/contact` | Email, Instagram, Facebook |

---

## Tech Stack

| | |
|---|---|
| **Framework** | [React 19](https://react.dev) + [Vite 7](https://vitejs.dev) |
| **Routing** | [Wouter](https://github.com/molefrog/wouter) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **UI components** | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Language** | TypeScript |
| **Package manager** | pnpm (workspace monorepo) |
| **Hosting** | GitHub Pages (custom domain) |
| **CI/CD** | GitHub Actions |

---

## Developer Features

The site includes a hidden developer panel for content management — no backend or CMS required.

### Accessing the Developer Panel

1. Scroll to the footer on any page
2. Click the small **Developer Login** link (bottom center)
3. Enter the password: `BookFairiesGA123`

Once authenticated you can:

- **Upload photos** to the community gallery — committed directly to GitHub, visible to everyone within ~2 minutes
- **Delete photos** from the gallery — removes the entry from `gallery.json` and deletes the image file
- **Update the book counter** displayed on the What We Do page

### How content is stored

Photos and the book counter are stored directly in the GitHub repo via the GitHub API — no backend required.

| File | Purpose |
|------|---------|
| `artifacts/book-fairies/src/gallery.json` | List of gallery photos (src URL + caption) |
| `artifacts/book-fairies/src/book-count.json` | Current book counter value |
| `artifacts/book-fairies/public/gallery/` | Uploaded image files |

Changes appear on the live site within 1–5 minutes (GitHub CDN propagation).

---

## Local Development

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [pnpm 10+](https://pnpm.io) — `npm install -g pnpm`

### Setup

```bash
git clone https://github.com/SHuntCoder/bookfairiesga.git
cd bookfairiesga
pnpm install
```

### Run dev server

```bash
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/book-fairies run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
PORT=3000 BASE_PATH=/ pnpm --filter @workspace/book-fairies run build
```

Output goes to `artifacts/book-fairies/dist/public/`.

---

## Deployment

The site deploys automatically to GitHub Pages via **GitHub Actions** on every push to `main`.

The workflow (`.github/workflows/deploy.yml`):

1. Builds the site with `BASE_PATH=/`
2. Copies `index.html` → `404.html` for client-side routing support
3. Adds a `CNAME` file containing `bookfairiesga.com`
4. Force-pushes the `dist/public/` directory to the `gh-pages` branch

**DNS:** The custom domain points to GitHub Pages IPs. HTTPS is enforced via GitHub's Let's Encrypt integration.

To trigger a manual deploy, push any change to `main` — or go to **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

---

## Project Structure

```
artifacts/book-fairies/
├── public/                  # Static assets (logos, photos, favicon)
│   ├── favicon.png          # Butterfly favicon
│   ├── logo-transparent.png # Nav/footer logo
│   ├── founders.jpg         # Founders photo (home page)
│   └── opengraph.jpg        # Social share image
├── src/
│   ├── components/
│   │   ├── Nav.tsx          # Fixed nav bar + mobile hamburger drawer
│   │   ├── Footer.tsx       # Footer + contact links + dev panel trigger
│   │   └── ScrollToTop.tsx  # Scrolls to top on every route change
│   ├── lib/
│   │   └── errors.ts        # BF error code definitions
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── what-we-do.tsx   # Animated book counter (fetches book-count.json)
│   │   ├── photos.tsx       # Photo gallery + dev upload/delete panel
│   │   ├── book-club.tsx
│   │   ├── volunteer.tsx
│   │   ├── donate.tsx
│   │   └── contact.tsx
│   ├── gallery.json         # Live gallery photo list
│   ├── book-count.json      # Live book counter value
│   ├── App.tsx              # Router + providers
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Error Codes

All errors shown in the dev panel follow the format **BF-XXX** (Book Fairies). When someone reports a code, look it up here.

| Code | Meaning | Fix |
|------|---------|-----|
| **BF-101** | Incorrect password | Password is `Top Secret` |
| **BF-201** | Gallery photos won't load | Check [githubstatus.com](https://githubstatus.com); verify `gallery.json` is valid JSON |
| **BF-202** | Photo upload failed | Token may be expired — check `VITE_GITHUB_TOKEN` in Replit secrets |
| **BF-203** | Photo delete failed | Wait 30 sec and retry; check token if recurring |
| **BF-204** | Gallery list update failed | Rare race condition — wait a minute and retry |
| **BF-301** | Book count won't load | Verify `book-count.json` exists in the repo |
| **BF-302** | Book count save failed | Token likely expired — check Replit secrets |
| **BF-401** | GitHub API error | Read the detail shown — "Bad credentials" means renew the token |
| **BF-402** | Conflict, all retries failed | Only one person should use the dev panel at a time |
| **BF-403** | Network unreachable | Check internet connection |

Full reference with step-by-step troubleshooting: [`ERROR_CODES.md`](./ERROR_CODES.md)

---

## Contact

- **Email:** [bookfairiesgeorgia@gmail.com](mailto:bookfairiesgeorgia@gmail.com)
- **Instagram:** [@bookfairiesgeorgia](https://www.instagram.com/bookfairiesgeorgia)
- **Facebook:** [@bookfairiesgeorgia](https://www.facebook.com/bookfairiesgeorgia)

---

*© Book Fairies · Fulton County, Georgia*
