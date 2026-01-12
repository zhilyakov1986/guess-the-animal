import { defineConfig } from 'vite';

export default defineConfig({
    base: '/guess-the-animal/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    }
});
