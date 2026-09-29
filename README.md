# MARRO GRAPHIX Portfolio

The complete source for the MARRO GRAPHIX graphic-design portfolio and CV website.

- Next.js 16 and React 19
- GSAP and Lenis interactions
- Professional work grouped by BusyBees, Clean Pro, and Nilfisk
- Student practice portfolio
- Six-page CV PDF and its Python generator

## Getting Started

Requirements: Node.js 22.13 or newer and npm.

```bash
git clone https://github.com/devbasestudio/marro-graphix-gsap.git
cd marro-graphix-gsap
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The main page is in `src/app/page.tsx`, global styles are in
`src/app/globals.css`, and portfolio assets are under `public/`.

## Quality checks

```bash
npm run lint
npm run build
```

## Link the transferred Vercel project

After accepting the Vercel project transfer, authenticate with the receiving
Vercel account and link this checkout to the existing project:

```bash
npx vercel login
npx vercel whoami
npx vercel link
npx vercel pull --yes
```

When prompted by `vercel link`, select the receiving Hobby account and the
existing `marro-graphix-gsap` project. The generated `.vercel/` directory is
local-only and intentionally ignored by Git.

Deploy a preview or production build:

```bash
npx vercel
npx vercel --prod
```

## Updating the CV PDF

The generated CV is available at `public/resume/ye-naing-thant-cv.pdf`.
Its source generator is `scripts/generate_resume.py`.
