interface EnvBindings {
  API_URL: string;
  API_KEY: string;
}

interface Env extends EnvBindings {}

declare namespace Cloudflare {
  interface Env extends EnvBindings {}
}
