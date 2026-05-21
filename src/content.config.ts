import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const songs = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/songs' }),
	schema: z.object({
		title: z.string(),
		key: z.string().optional(),
		occasion: z.string(),
		pdf: z.string().optional(),
		audio_soprano: z.string().optional(),
		audio_alto: z.string().optional(),
		audio_tenor: z.string().optional(),
		audio_basse: z.string().optional()
	})
});

const events = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		time: z.string(),
		location: z.string(),
		description: z.string().nullish().transform(v => v ?? undefined),
		type: z.enum(['messe', 'autre']).optional(),
		animateur: z.string().optional(),
		chef_choeur: z.string().optional(),
		program_accueil: z.string().optional(),
		program_kyrie: z.string().optional(),
		program_gloria: z.string().optional(),
		program_psaume: z.string().optional(),
		program_alleluia: z.string().optional(),
		program_priere_universelle: z.string().optional(),
		program_offertoire: z.string().optional(),
		program_sanctus: z.string().optional(),
		program_agnus: z.string().optional(),
		program_communion: z.string().optional(),
		program_action_grace: z.string().optional(),
		program_envoi: z.string().optional(),
		program_en_plus: z.string().optional(),
	})
});

export const collections = { songs, events };
