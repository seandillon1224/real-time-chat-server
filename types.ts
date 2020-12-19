import {Context} from 'db/models'

export type ResolverFn = (parent: any, args: any, ctx: Context, info: any) => any;

export interface ResolverMap {
  [field: string]: ResolverFn;
}

export interface ResolverSubscriptionMap {
    [field: string]: ResolverMap
}
