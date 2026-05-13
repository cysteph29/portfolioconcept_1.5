# Content Model

Content is managed as local MDX files committed to this repository.

## Project Entry Frontmatter Contract

Defined in `src/lib/content/types.ts` and validated by
`src/lib/content/schema.ts`.

Required fields:

- `title`: project name
- `slug`: URL-safe identifier
- `summary`: short teaser text
- `role`: your role on the project
- `year`: display year or range
- `status`: `concept` | `in-progress` | `launched`
- `tags`: category labels
- `coverImage`: relative image path
- `published`: include in public routes
- `featured`: include in featured lists

Optional fields:

- `sortOrder`: explicit ordering override

## Planned Content Paths

- `src/content/projects/*.mdx`: case studies
- `src/content/pages/*.mdx`: page-level narrative content
