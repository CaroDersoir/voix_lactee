import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const songs = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/songs' }),
	schema: z.object({
		title: z.string(),
		key: z.string().optional(),
		occasion: z.union([z.string(), z.array(z.string())]).transform(v => Array.isArray(v) ? v : [v]),
		pdf: z.string().optional(),
		pdfs: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
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
		date: z.coerce.date().optional(),
		time: z.string().optional(),
		location: z.string().optional(),
		description: z.string().nullish().transform(v => v ?? undefined),
		type: z.enum(['messe', 'messe_mariage', 'benediction', 'autre']).optional(),
		animateur: z.string().optional(),
		chef_choeur: z.string().optional(),
		organiste: z.string().optional(),
		program_esprit_saint: z.string().optional(),
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
		program_post_communion: z.string().optional(),
		program_action_grace: z.string().optional(),
		program_vierge: z.string().optional(),
		program_envoi: z.string().optional(),
		program_en_plus: z.string().optional(),
		program_en_plus_2: z.string().optional(),
		program_en_plus_3: z.string().optional(),
		program_procession_entree: z.string().optional(),
		program_benediction_alliances: z.string().optional(),
		program_signature_registres: z.string().optional(),
		program_sortie_maries: z.string().optional(),
		program_entree_maries: z.string().optional(),
		program_chant_entree: z.string().optional(),
		program_louange: z.string().optional(),
		program_notre_pere: z.string().optional(),
		program_chant_final: z.string().optional(),
		program_chant_sortie: z.string().optional(),
	}).passthrough()
});

export const collections = { songs, events };
