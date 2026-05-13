// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://CaroDersoir.github.io',
    base: '/voix_lactee/',
    vite: {
        plugins: [tailwindcss()]
    }
});