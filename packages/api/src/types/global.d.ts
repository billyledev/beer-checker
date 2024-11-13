import type Hapi from '@hapi/hapi';
import type Boom from '@hapi/boom';

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;

    HOST: string;
    PORT: string;

    BASE_URL: string;

    OPENAI_API_KEY: string;
  }
}

declare global {
  type APIResponse = Hapi.ResponseObject | Boom.Boom;
}
