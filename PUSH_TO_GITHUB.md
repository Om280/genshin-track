# Publish this Genshin Track version

The accompanying `genshin-track-current.zip` contains the **current app**. It is not a Git checkout. It excludes Git metadata, dependencies, build output, uploaded screenshots, local account data, and credentials.

## Preserve the older GitHub version, then replace `main` safely

Use a terminal with Git and Node.js installed (Git Bash on Windows). Authenticate to GitHub in your terminal before pushing. **Do not paste access tokens or wish-history/authkey URLs into chat, scripts, or commits.**

1. Unzip the archive. It should create a folder named `genshin-track-current`.
2. In a separate directory, run:

```bash
git clone https://github.com/Om280/genshin-track.git
cd genshin-track
git fetch origin main
git branch archive/pre-current-app origin/main
git push origin archive/pre-current-app
```

Check that `archive/pre-current-app` appears under **Branches** on GitHub **before** proceeding. It preserves the old app and its files. If that name already exists, pick a different unused archive name and push that instead; never force-push the archive branch.

3. From inside the cloned `genshin-track` directory, remove only the old tracked files, then copy in this archive's contents. Replace `/path/to/genshin-track-current` with the folder created when you unzipped it:

```bash
git rm -r .
cp -R /path/to/genshin-track-current/. .
git add -A
git diff --cached --stat
```

`git rm -r .` affects the cloned **working tree**, not its Git history or the archived branch. Do not run it in an unrelated project directory. The copy must include the dotfile `.gitignore`; the command shown does.

4. Verify and push:

```bash
npm ci
npm test
npm run build
git commit -m "Publish current Genshin Track app"
git push origin main
```

The push must be a normal **fast-forward**. If Git refuses because `main` changed, **do not force-push**: fetch the new `main` and review/merge its changes first. Do not commit `.env` files, credentials, `node_modules`, `dist`, or the `uploads` folder.

The current app uses a Vite frontend and a server-side API for Enka; the GitHub repository alone does not host that API. For local development use `npm run dev`. If deploying, configure both the frontend and API routes appropriately, and read `README.md` and `GUIDE_STATUS.md` for capabilities and honest coverage limitations.
