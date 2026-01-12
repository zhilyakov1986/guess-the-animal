import { defineConfig } from 'vite';

export default defineConfig({
    // base: '/guess-the-animal/', // Uncomment this if deploying to GitHub Pages at https://<USERNAME>.github.io/guess-the-animal/
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false
    }
});
