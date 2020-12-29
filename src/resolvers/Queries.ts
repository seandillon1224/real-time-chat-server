import { ResolverMap } from "types";
import { IMessage } from "../db/models/message";
import { IUser } from "../db/models/user";
import { IChatRoom } from "../db/models/chatroom";
import { authenticated } from "../auth";

const Queries: ResolverMap = {
  async messages(_, __, { Message }) {
    try {
      const messages: IMessage[] | null = await Message.find();
      return messages;
    } catch (err) {
      throw new Error("An error occurred fetching messages!");
    }
  },
  users: authenticated(async (_, __, { User }) => {
    try {
      const users: IUser[] | null = await User.find()
        .populate("messages")
        .populate("chatRooms");
      return users;
    } catch (err) {
      throw new Error("An error occurred fetching Users!");
    }
  }),
  async chatrooms(_, __, { ChatRoom }) {
    try {
      const rooms: IChatRoom[] | null = await ChatRoom.find()
        .populate("messages")
        .populate("users");
      return rooms;
    } catch (err) {
      throw new Error("An error occurred fetching Chatroom!");
    }
  },
};

export default Queries;
