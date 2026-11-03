interface EnvBindings {
  API_KEY: string;
}

interface Env extends EnvBindings {}

declare namespace Cloudflare {
  interface Env extends EnvBindings {}
}
