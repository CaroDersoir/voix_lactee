# Voix Lactée — Instructions pour l'agent

## Vue d'ensemble

Site web d'une chorale liturgique catholique. Répertoire de chants, agenda des célébrations, interface d'administration.

**Stack** : Astro 6.3 · Tailwind CSS 4 (via `@tailwindcss/vite`) · TypeScript · pdfjs-dist 4

**Déploiement** :
- GitHub Pages : `https://CaroDersoir.github.io/voix_lactee/`
- Netlify : base `/` si `NETLIFY=true`, sinon `/voix_lactee/` en prod et `/` en dev
- Branche principale : `main` — le site se rebuild automatiquement via Netlify Build Hook après chaque modification admin

## Commandes

```bash
npm run dev       # serveur local sur http://localhost:4321
npm run build     # build prod dans ./dist/
npm run preview   # prévisualise le build
```

Pas de suite de tests configurée.

## Structure du projet

```
src/
├── content/
│   ├── songs/      # fichiers Markdown — un par chant
│   └── events/     # fichiers Markdown — un par événement
├── pages/
│   ├── index.astro
│   ├── repertoire.astro
│   ├── agenda.astro
│   ├── contact.astro
│   └── admin/index.astro
├── layouts/Layout.astro
├── components/
│   ├── SiteHeader.astro
│   ├── SiteFooter.astro
│   └── SectionTitle.astro
├── styles/global.css
└── content.config.ts   # schémas Zod des deux collections
public/
└── uploads/            # PDF et MP3 hébergés dans le repo
```

## Collections de contenu

### `songs` — `src/content/songs/*.md`

Frontmatter Zod :
```yaml
title: string           # obligatoire
key: string             # optionnel — ex. "Ré majeur"
occasion: string | string[]  # ex. "Kyrie" ou ["Kyrie", "Gloria"]
pdf: string             # chemin relatif vers uploads/ (1 seul PDF)
pdfs:                   # plusieurs PDF (instruments différents)
  - label: string
    url: string
audio_soprano: string | [{label, url}]
audio_alto:    string | [{label, url}]
audio_tenor:   string | [{label, url}]
audio_basse:   string | [{label, url}]
audio_tutti:   string | [{label, url}]
```

Les URLs audio peuvent être un lien YouTube/externe ou un chemin `uploads/slug-voix.mp3`.
Le tutti est affiché avec les sopranos côté répertoire.

Occasions disponibles : `Accueil`, `Kyrie`, `Gloria`, `Psaume`, `Alléluia`, `Prière universelle`, `Offertoire`, `Sanctus`, `Agnus Dei`, `Communion`, `Post-communion`, `Action de grâce`, `Chant à la Vierge`, `Chant à l'Esprit Saint`, `Envoi`, `Procession d'entrée`, `Bénédiction des alliances`, `Signature des registres`, `Sortie des mariés`, `Entrée des mariés`, `Chant d'entrée`, `Louange`, `Notre Père`, `Chant final`, `Chant de sortie`, `Autre`

### `events` — `src/content/events/*.md`

Frontmatter Zod :
```yaml
title: string
date: date              # coercé — ex. "2026-05-24"
time: string            # ex. "10h30"
location: string
description: string
type: messe | messe_mariage | benediction | autre
animateur: string
chef_choeur: string
organiste: string
program_kyrie: string   # titre du chant (et autres slots program_*)
# slots messe : esprit_saint, accueil, kyrie, gloria, psaume, alleluia,
#   priere_universelle, offertoire, sanctus, agnus, communion,
#   post_communion, action_grace, vierge, envoi, en_plus, en_plus_2, en_plus_3
# slots supplémentaires mariage : procession_entree, benediction_alliances,
#   signature_registres, sortie_maries
# slots bénédiction : entree_maries, chant_entree, louange, notre_pere,
#   chant_final, chant_sortie
```

## Interface d'administration (`/admin`)

Page Astro statique dont toute la logique est en JavaScript client (`is:inline`).

**Authentification** : vérification locale de `{ user: 'admin', pass: '...' }` stockée en clair dans le script — session mémorisée via `sessionStorage`.

**GitHub API** : toutes les modifications (ajout/édition/suppression de chants et d'événements) passent directement par `https://api.github.com/repos/CaroDersoir/voix_lactee/` avec le token `GH_TOKEN` injecté au build via variable d'environnement.

**Flux de données** :
1. Lecture : `GET /contents/src/content/songs` → décode base64 → parse YAML manuel
2. Écriture : `PUT /contents/<path>` avec `{ message, content (base64), branch, sha }`
3. Suppression : `DELETE /contents/<path>`
4. Upload média : `PUT /contents/public/uploads/<fichier>`
5. Rebuild : `POST` sur `NETLIFY_BUILD_HOOK` après chaque écriture

**Modales** : modifier un chant, modifier un événement, chercher un chant pour un slot de programme, saisir un titre, confirmer une suppression.

## Visualisation PDF

Utilise `pdfjs-dist`. Le worker est chargé via :
```js
pdfjsLib.GlobalWorkerOptions.workerSrc = import.meta.env.BASE_URL + 'pdf.worker.min.mjs';
```
Le fichier `pdf.worker.min.mjs` doit être présent dans `public/`. Zoom via boutons +/− et pincement tactile (Pointer Events).

## Conventions

- **Slugs** : `slugify(title)` → minuscules, sans accents, tirets — utilisé comme nom de fichier `.md` et préfixe des médias dans `uploads/`
- **YAML** : la fonction `yamlStr()` échappe avec `JSON.stringify` si la valeur contient `:`, `#`, `[`, `{`, etc.
- **Base URL** : toujours reconstruire les URLs avec `import.meta.env.BASE_URL` ; en dev la base est `/`
- **Tailwind** : classes utilitaires directement dans les templates, couleurs `blue-900` / `stone-*` comme palette principale
- **Pas de framework JS front-end** : tout le JS interactif est en vanilla TypeScript/JS dans `<script>` Astro