import { ResolverSubscriptionMap } from "types";
import pubsub from "./resolverUtils/pubsub";
import { withFilter } from "apollo-server";
import { MESSAGE_ADDED, CHATROOM_ADDED } from "./resolverUtils/constants";
import { IUser } from "db/models/user";

const Subscriptions: ResolverSubscriptionMap = {
  messageAdded: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(MESSAGE_ADDED),
      (payload, args) =>
        payload.messageAdded.chatroom.toString() === args.chatroomId.toString()
    ),
  },
  chatrooms: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(CHATROOM_ADDED),
      (payload, __, ctx) => {
        const getsMessage = payload.chatrooms.users.find(
          (z: IUser) => z._id.toString() === ctx.user._id.toString()
        );
        if (getsMessage) {
          return true;
        }
        return false;
      }
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
