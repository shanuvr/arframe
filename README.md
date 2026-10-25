# ARFRAME — Architectural Portfolio & Construction Web Application

A modern architectural portfolio and client showcase web application built with **React**, **Vite**, **Lenis Momentum Scroll**, and a **Cloudflare Workers / D1 / R2** backend.

---

## 🚀 Run Descriptions & Commands

Navigate to the `arframe` directory:
```bash
cd arframe
```

| Command | Description |
|---|---|
| `npm install` | Installs all required frontend dependencies (React, React Router, Axios, Lenis, etc.). |
| `npm run dev` | Launches the local Vite development server with Hot Module Replacement (HMR) at `http://localhost:5173`. |
| `npm run build` | Compiles and optimizes the production bundle into the `dist/` directory. |
| `npm run preview` | Locally serves and previews the built production bundle from `dist/`. |
| `npm run lint` | Runs ESLint to check for code quality and syntax issues. |

---

## ⚙️ Environment Variables

Configure environment variables in `.env.development` or `.env.production`:

```env
VITE_API_BASE_URL=https://my-api.ajoyjohnm.workers.dev
VITE_IMAGE_BASE_URL=https://pub-fbba380656084edda4d915551564adce.r2.dev/
```

- **`VITE_API_BASE_URL`**: Base URL of the Cloudflare Workers REST API.
- **`VITE_IMAGE_BASE_URL`**: Public Cloudflare R2 bucket CDN URL for streaming media.

---

## 🧭 Page Routes & Features

### Public Pages
- **`/` (Home)**: Hero slider with dynamic banner images, About Us summary, Expertise, Featured Projects (3 live projects linking to detail pages), Proposed & Ongoing Projects horizontal slider, Before & After transformation comparisons, and Contact section.
- **`/about`**: Company profile, vision, and team.
- **`/projects`**: Interactive project catalogue with pagination and category filtering.
- **`/projects/:id`**: Comprehensive project detail page featuring specs, client info, and full-resolution lightbox gallery.
- **`/contact`**: Contact form and office location details.

### Admin Dashboard (Protected by JWT)
- **`/admin`**: Secure login portal.
- **`/admin/projects`**: Create, edit, and delete architectural projects with multi-image R2 uploads.
- **`/admin/gallery`** *(or `/admin/proposed-projects`)*: Upload and manage proposed & ongoing project sketches and 3D renders with automatic R2 storage in `proposed/`.
- **`/admin/before-after`**: Manage before/after renovation transformation entries.
- **`/admin/hero-images`**: Update dynamic hero banners across pages.
