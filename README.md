# Product Design Portfolio

Scaffold foundation for a product design portfolio built with Next.js and
TypeScript.

## Current Phase

Step 1 scaffolding only:

- project structure
- baseline tooling
- content schema contracts

Homepage sections are intentionally not implemented yet.

## Scripts

- `npm run dev` - start local development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix ESLint issues
- `npm run format` - format files with Prettier
- `npm run format:check` - verify formatting

## Project Structure

- `app` - App Router routes and global styles
- `src/components` - reusable components (future)
- `src/content` - local MDX content source
- `src/lib` - shared utilities and schema validation
- `docs` - architecture and content model notes
- `public` - static assets

## Local Setup

1. Install dependencies:
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open:
   - [http://localhost:3000](http://localhost:3000)

## Deployment

Deployment target is Vercel. Environment variables are documented in
`.env.example`.
