# Infinite Automationz

Git-controlled production source for the Infinite Automationz website.

## Production site

- Netlify site: `infinite-automationz-site`
- Public URL: `https://infinite-automationz-site.netlify.app/`
- Production source directory: `public/`
- Netlify Functions directory: `functions/`

## Deployment model

This repository currently publishes a static site from `public/` with Netlify Functions from `functions/`.

`netlify.toml`:

```toml
[build]
  publish = "public"
  functions = "functions"

[functions]
  directory = "functions"
```

No frontend build step is required for the production static site.

## Key routes

- `/` — main Infinite Automationz landing page
- `/individual-pricing/` — individual pricing page
- `/.netlify/functions/ghl-lead` — GoHighLevel lead capture function
- `/.netlify/functions/site-config` — public runtime config endpoint

## Local preview

```bash
python3 -m http.server 8080 --directory public
```

Then open `http://127.0.0.1:8080`.

## Notes

The repo also contains older Next.js app/source experiments, templates, and client-project work. The current Netlify production path is intentionally the static `public/` tree unless/until the site is migrated into a maintained app build.
