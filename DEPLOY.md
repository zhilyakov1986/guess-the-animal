# Deploying "Wild Quest"

Your app is built with **Vite** (Vanilla JS). It is a static site, meaning it can be hosted anywhere that serves static files.

Here are the free and easiest options:

## Option 1: Netlify (Recommended - Easiest)
*(No command line needed)*
1.  **Register/Login** at [netlify.com](https://www.netlify.com).
2.  Drag and drop the entire `dist` folder you just built onto their dashboard.
    - *Note: Run `npm run build` first to create the `dist` folder.*
3.  **Better Way (Continuous Deployment):**
    - Push this project to a GitHub repository.
    - Log into Netlify -> "Add new site" -> "Import an existing project".
    - Connect to GitHub and select your repository.
    - Netlify will auto-detect the settings (`npm run build` and `dist` directory).
    - Click **Deploy**.

## Option 2: Vercel
1.  **Register/Login** at [vercel.com](https://vercel.com).
2.  Install Vercel CLI: `npm i -g vercel` (or just drag-and-drop on their website like Netlify).
3.  Run `vercel` in your project folder and follow the prompts.

## Option 3: GitHub Pages
1.  Open `vite.config.js` and **uncomment** the `base` line:
    ```javascript
    export default defineConfig({
      base: '/your-repo-name/', // REPLACE WITH YOUR REPO NAME
      // ...
    });
    ```
2.  Run `npm run build`.
3.  Commit and push your code to GitHub.
4.  Go to your GitHub Repo -> **Settings** -> **Pages**.
5.  Select **GitHub Actions** as the source.
6.  GitHub will guide you to create a static site workflow, or you can manually deploy the `dist` folder to a `gh-pages` branch.
