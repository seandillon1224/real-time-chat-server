import { Context } from "./db/models";

export type ResolverFn = (
  parent: any,
  args: any,
  ctx: Context,
  info: any
) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

type SubscriptionFn = (payload: any, args: any, ctx: Context) => boolean;
type SubscriptionMap = (
  callback: (cb: any) => void,
  subFunction: SubscriptionFn
) => void;

export interface ResolverSubscriptionMap {
  [field: string]: {
    [field: string]: SubscriptionMap;
  };
}
