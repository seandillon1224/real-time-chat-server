import { ResolverMap } from "types";
import { IMessage } from "db/models/message";

const Queries: ResolverMap = {
  async messages(_, __, { Message }) {
    try {
      const messages: IMessage[] | null = await Message.find();
      return messages;
    } catch (err) {
      throw new Error("An error occurred fetching messages!");
    }
  },
};

export default Queries;
