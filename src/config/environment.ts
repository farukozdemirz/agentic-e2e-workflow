export type Environment = "dev" | "stage" | "prod";

export function getEnvironment(): Environment {
  const env = process.env.ENV as Environment | undefined;

  if (!env) {
    throw new Error("ENV is not defined (dev | stage | prod)");
  }

  if (!["dev", "stage", "prod"].includes(env)) {
    throw new Error(`Invalid ENV value: ${env}`);
  }

  return env;
}

export function getBaseUrl(): string {
  const env = getEnvironment();

  const map = {
    dev: process.env.BASE_URL_DEV,
    stage: process.env.BASE_URL_STAGE,
    prod: process.env.BASE_URL_PROD,
  };

  const baseUrl = map[env];

  if (!baseUrl) {
    throw new Error(`Base URL not defined for environment: ${env}`);
  }

  return baseUrl.replace(/\/$/, "");
}
