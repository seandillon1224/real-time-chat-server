import { ResolverMap } from "types";
import { IMessage } from "db/models/message";

const Mutations: ResolverMap = {
  async makeMessage(_, { user, content, chatroom }, { Message }) {
    try {
      const createdAt = new Date();
      const res: IMessage = await Message.create({
        content,
        user,
        chatroom,
        createdAt,
      });
      return res;
    } catch (err) {
      throw new Error("An error occurred creating message!");
    }
  },
  // async createUser (_, {name}, {users, subscribers}) {
  //     const id = users.length;
  //     users.push({id, name});
  //     subscribers.forEach(fn => fn());
  //     return initialArr;
  // }
};

export default Mutations;
