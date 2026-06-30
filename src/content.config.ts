import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx,markdown}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional().default(''),
			// Transform string to Date object
			pubDate: z.coerce.date().optional(),
			date: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			layout: z.string().optional(),
			categories: z.union([z.string(), z.array(z.string())]).optional(),
			comments: z.boolean().optional(),
		}),
});

export const collections = { blog };
