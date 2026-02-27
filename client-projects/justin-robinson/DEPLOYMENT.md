# Justin Robinson Netlify Deployment

## Netlify setup
1. Set the project base directory to the repository root.
2. Use `netlify.toml` at the root:
   - publish directory: `Justin Robinson`
   - functions directory: `functions`
   - root path redirect to `/justin-robinson-website%20(2).html`

## Required environment variables
Set these in Netlify Site Settings > Environment Variables:

- `GHL_API_KEY`
- `GHL_LOCATION_ID`
- `GHL_BOOKING_WIDGET_URL`

Optional:

- `GHL_PIPELINE_ID`
- `GHL_PIPELINE_STAGE_ID`

## Booking widget source
- The page requests `/.netlify/functions/site-config` on load.
- That function reads `GHL_BOOKING_WIDGET_URL` and hydrates the booking iframe.

## Lead form submission path
- Both lead forms post to `POST /.netlify/functions/ghl-lead`.
- Expected success response: `{ "ok": true, "contactId": "..." }`

## Local smoke test
1. Run with Netlify CLI so functions + static page run together.
2. Open the page and test:
   - `#lead-capture` form submit
   - `#book-call` iframe load
   - `#contact` form submit
