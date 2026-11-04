import { Router, type Context } from "cloudworker-router";

const router = new Router<Env>();

const apiHandler = async (ctx: Context<Env>): Promise<Response> => {
  return Response.json({ message: "Hello World" }, { status: 200 });
};

router.post("/api/delivery", apiHandler);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return router.handle(request, env, ctx);
  },
};
