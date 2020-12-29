import User from "./user";
import Message from "./message";
import ChatRoom from "./chatroom";

export interface Context {
  User: typeof User;
  Message: typeof Message;
  ChatRoom: typeof ChatRoom
}

export default {
  User,
  Message,
  ChatRoom
};
