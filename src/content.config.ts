import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const songs = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/songs' }),
	schema: z.object({
		title: z.string(),
		key: z.string().optional(),
		occasion: z.string(),
		pdf: z.string().optional()
	})
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		time: z.string(),
		location: z.string(),
		description: z.string()
	})
});

export const collections = { songs, events };
