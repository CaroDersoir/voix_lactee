// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    site: 'https://CaroDersoir.github.io',
    base: process.env.NODE_ENV === 'production' ? '/voix_lactee/' : '/',
    vite: {
        plugins: [tailwindcss()]
    }
});
