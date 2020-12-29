import { ResolverSubscriptionMap } from "types";
import pubsub from "./pubsub";
import { withFilter } from "apollo-server";
import { MESSAGE_ADDED } from "./constants";

const Subscriptions: ResolverSubscriptionMap = {
  messageAdded: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(MESSAGE_ADDED),
      (payload, args) => args.chatroomId === 1
    ),
  },
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
