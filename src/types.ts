import { Context } from "./db/models";
import { IUser } from "db/models/user";

interface ApolloRequest {
  headers: {
    authorization?: string;
  };
  cookies: {
    [key: string]: any;
  };
}
export interface ContextCallback {
  req: ApolloRequest;
  connection: any;
}

export interface ConnectionParams {
  authorization?: string;
}

export interface ContextWithAuth extends Context {
  user: IUser;
  setCookies: CookieInterface[];
  req: ApolloRequest;
}

export type ResolverFn = (
  parent: any,
  args: any,
  ctx: ContextWithAuth,
  info: any
) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

type SubscriptionFn = (
  payload: any,
  args: any,
  ctx: ContextWithAuth
) => boolean;
type SubscriptionMap = (
  callback: (cb: any) => void,
  subFunction: SubscriptionFn
) => void;

export interface ResolverSubscriptionMap {
  [field: string]: {
    [field: string]: SubscriptionMap;
  };
}

// cookies
export interface CookieInterface {
  name: string;
  value: string;
  options: {
    domain: string | null;
    httpOnly: boolean;
    secure: boolean;
    expires?: Date;
  };
}
[];
