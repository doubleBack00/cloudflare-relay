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
wrangler secret put GEO_RELAY_SECRET
```

## Original-client geographic attribution

Set the Wrangler secret `GEO_RELAY_SECRET` to the same random secret configured in
moneyspreadapi. The relay signs the Cloudflare-provided original client IP with
HMAC-SHA256 and a timestamp. The API accepts these signatures for 60 seconds and
resolves the IP with its local geographic database. Incoming client location
headers are stripped before signing. Without this binding, forwarding
continues normally without a relay signature; the API then uses its request IP resolved
through Traefik, which may locate the relay's egress instead of the original client.
Valid signed relay IPs take priority over that fallback, even if their location
cannot be resolved. Invalid or incomplete signatures are excluded from geographic
statistics without falling back.
Do not place this secret in the committed Wrangler variables. Deploy the relay and
configure the API together when enabling this feature.

The signed headers are `X-Client-IP`, `X-Client-Timestamp`, and
`X-Client-Signature`; the API verifies the same names.
