declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URI: string;
    JWT_TOKEN: string;
    JWT_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    BASE_URL: string;
  }
}
