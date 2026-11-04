# cloudflare-relay

## TypeScript setup

- Type-check with:

```bash
npm run type-check
```

## Cloudflare bindings and secrets

This worker expects:

- `API_URL` string
- `API_KEY` secret

Set the webhook secret in each environment (including production):

```bash
wrangler secret put API_KEY
```
