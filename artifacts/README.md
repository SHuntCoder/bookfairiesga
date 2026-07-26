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
3. Enter the password

Once authenticated you can:

- **Upload photos** to the community gallery (stored in `localStorage`)
- **Update the book counter** displayed on the What We Do page
- **Delete photos** from the gallery

> **Note:** Content is stored in the visitor's browser `localStorage`. The dev panel is intended to be used by an admin on the production site to populate content that then persists for that browser session. For persistent shared content, photos and the book count would need to be migrated to a backend or CMS.

**localStorage keys used:**
| Key | Default | Description |
|-----|---------|-------------|
| `bookfairies_book_count` | `4000` | Number shown in the animated counter |
| `bookfairies_gallery_photos` | `[]` | Array of uploaded gallery photos (base64) |

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
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── what-we-do.tsx   # Animated book counter
│   │   ├── photos.tsx       # Photo gallery + dev upload panel
│   │   ├── book-club.tsx
│   │   ├── volunteer.tsx
│   │   ├── donate.tsx
│   │   └── contact.tsx
│   ├── App.tsx              # Router + providers
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Contact

- **Email:** [bookfairiesgeorgia@gmail.com](mailto:bookfairiesgeorgia@gmail.com)
- **Instagram:** [@bookfairiesgeorgia](https://www.instagram.com/bookfairiesgeorgia)
- **Facebook:** [@bookfairiesgeorgia](https://www.facebook.com/bookfairiesgeorgia)

---

*© Book Fairies · Fulton County, Georgia*
