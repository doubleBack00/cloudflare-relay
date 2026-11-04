import { Router, type Context } from "cloudworker-router";

const router = new Router<Env>();

router.use(async (ctx, next) => {
  const ipAddress = ctx.request.headers.get("cf-connecting-ip") ?? "";
  const { success } = await ctx.env.API_RATE_LIMITER.limit({ key: ipAddress });
  if (!success) {
    return new Response(null, { status: 429 });
  }

  return await next();
});

const apiHandler = async (ctx: Context<Env>): Promise<Response> => {
  const requestUrl = new URL(ctx.request.url);
  const upstreamUrl = new URL(ctx.env.API_URL);

  const basePath = upstreamUrl.pathname.endsWith("/")
    ? upstreamUrl.pathname.slice(0, -1)
    : upstreamUrl.pathname;

  upstreamUrl.pathname = `${basePath}${requestUrl.pathname}`;
  upstreamUrl.search = requestUrl.search;

  const headers = new Headers(ctx.request.headers);
  headers.set("Authorization", `Bearer ${ctx.env.API_KEY}`);

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: ctx.request.method,
    headers,
    body: ctx.request.body,
  });

  return fetch(upstreamRequest);
};

router.post("/api/delivery", apiHandler);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return router.handle(request, env, ctx);
  },
};
