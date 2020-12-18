const Subscriptions = {
  messages: {
    subscribe: (_, __, { pubsub, initialArr, subscribers }) => {
      const channel = Math.random().toString(36).slice(2, 15);
      const onMessagesUpdate = (fn) => subscribers.push(fn);
      onMessagesUpdate(() => pubsub.publish(channel, { messages: initialArr }));
      setTimeout(() => pubsub.publish(channel, { messages: initialArr }), 0);
      return pubsub.asyncIterator(channel);
    },
  },
};

module.exports = Subscriptions;
