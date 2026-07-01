## Why the logo is missing on Vercel

The logo is imported from `src/assets/devowise-logo.png.asset.json`, which points to a **Lovable-hosted CDN path**:

```
/__l5e/assets-v1/.../devowise-logo.png
```

That `/__l5e/...` URL is served only by Lovable's own hosting layer. When you deploy the exported code to Vercel, that path doesn't exist, so the `<img>` tag 404s and nothing renders.

Same thing applies to any other logos/images loaded via `*.asset.json` pointers (certification logos use logo.dev which is fine, but the Devowise brand mark is the Lovable-hosted one).

## Fix

1. Download the actual PNG from the Lovable asset URL into the repo as a real file: `src/assets/devowise-logo.png`.
2. Replace the JSON pointer import in `src/routes/index.tsx`:
   ```tsx
   // before
   import devowiseLogo from "@/assets/devowise-logo.png.asset.json";
   <img src={devowiseLogo.url} ... />

   // after
   import devowiseLogo from "@/assets/devowise-logo.png";
   <img src={devowiseLogo} ... />
   ```
   Vite will fingerprint and bundle it, so it works on Vercel (and everywhere else).
3. Delete `src/assets/devowise-logo.png.asset.json` since it's no longer used.

After redeploying to Vercel, the logo will show up.
