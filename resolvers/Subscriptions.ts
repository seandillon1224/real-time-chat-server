import { ResolverMap, ResolverSubscriptionMap } from "types";

import {withFilter, PubSub} from 'apollo-server';
// import {MESSAGE_ADDED} from 'constants';

const pubsub =  new PubSub()
const pubSubCallback = (name: string) => pubsub.asyncIterator(name);
const Subscriptions: ResolverSubscriptionMap  = {
  // messageAdded:  {
  //   // subscribe: withFilter(
  //   //   pubSubCallback(MESSAGE_ADDED),
  //   //   (payload, args) =>
  //   // )
  //   subscribe: (_, __, { pubsub, initialArr, subscribers }) => {
  //     const channel = Math.random().toString(36).slice(2, 15);
  //     const onMessagesUpdate = (fn) => subscribers.push(fn);
  //     onMessagesUpdate(() => pubsub.publish(channel, { messages: initialArr }));
  //     setTimeout(() => pubsub.publish(channel, { messages: initialArr }), 0);
  //     return pubsub.asyncIterator(channel);
  //   },
  // },
  // users: {
  //   subscribe: (_, __, { pubsub, users, subscribers }) => {
  //     const channel = Math.random().toString(36).slice(2, 15);
  //     const onUserUpdate = (fn) => subscribers.push(fn);
  //     onUserUpdate(() => pubsub.publish(channel, { users }));
  //     setTimeout(() => pubsub.publish(channel, { users }), 0);
  //     return pubsub.asyncIterator(channel);
  //   },
  // },
};

export default Subscriptions;
