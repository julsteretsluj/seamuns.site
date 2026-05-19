# Deploy on Vercel

This project is a **static site** (HTML/CSS/JS). No Node server is required at runtime. The optional `npm run build` step only generates `env.js` from environment variables so Firebase login works in production.

## 1. Push to GitHub

The repo should be on GitHub (e.g. `julsteretsluj/seamuns.site`). Commit and push your latest changes.

## 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub is easiest).
2. **Add New… → Project**.
3. Import **`seamuns.site`** (or your repo name).
4. Vercel should detect settings from `vercel.json`:
   - **Framework Preset:** Other
   - **Build Command:** `npm run build`
   - **Output Directory:** `public` (created by `npm run build` from the repo root)
   - **Install Command:** can stay as in `vercel.json` or blank

5. Click **Deploy** once without env vars if you only want to test the static site (login will be disabled).

## 3. Firebase environment variables (for login)

In Vercel: **Project → Settings → Environment Variables**. Add these for **Production** (and Preview if you want login on preview URLs):

| Name | Value (from Firebase Console → Project settings → Your apps) |
|------|----------------------------------------------------------------|
| `FIREBASE_API_KEY` | Web app API key |
| `FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Project ID |
| `FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Sender ID |
| `FIREBASE_APP_ID` | App ID |
| `FIREBASE_MEASUREMENT_ID` | Optional analytics ID |

Optional:

| Name | Example |
|------|---------|
| `PRIVACY_POLICY_URL` | `https://your-domain.com/pages/privacy.html` |
| `TERMS_URL` | Full URL to terms page |

After saving variables, **Redeploy** (Deployments → … → Redeploy) so the build runs `generate-env.js` and creates `env.js`.

## 4. Firebase authorized domains

In [Firebase Console](https://console.firebase.google.com) → **Authentication** → **Settings** → **Authorized domains**, add:

- `localhost` (local testing)
- Your Vercel URL, e.g. `seamuns-site.vercel.app` (check **Domains** in Vercel after first deploy)
- Any custom domain you attach in Vercel (e.g. `seamuns.site`)

Without this, Google sign-in will fail with `auth/unauthorized-domain`.

## 5. Custom domain (optional)

Vercel → **Project → Settings → Domains** → add `seamuns.site` (or your domain) and follow DNS instructions at your registrar.

## 6. Deploy from your machine (optional)

```bash
npm install -g vercel
cd /path/to/mun-tracker
vercel login
vercel          # first time: link project
vercel --prod   # production deploy
```

Set the same environment variables in the Vercel dashboard (CLI `vercel env add` also works).

## Notes

- **`api/*.php`** is not used by the front end and does not run on Vercel’s static hosting. Archive and conferences use Firebase / `conferences-data.js`.
- **`env.js`** remains gitignored; it is created only during the Vercel build when `FIREBASE_API_KEY` is set.
- Local dev: copy `env.example.js` to `env.js` as described in the main README.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 404 on pages | Ensure **Output Directory** is `public` and the build log shows `prepare-vercel: wrote public/`. |
| Login missing | Redeploy after setting env vars; check build logs for `wrote env.js`. |
| Google sign-in error | Add Vercel domain to Firebase authorized domains. |
| Firestore permission errors | Publish rules from `firestore.rules.example` in Firebase Console. |
