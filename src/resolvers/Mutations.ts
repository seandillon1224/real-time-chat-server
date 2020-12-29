import { ResolverMap } from "types";
import { IMessage } from "../db/models/message";
import { createToken } from "../auth";
import { hash, compare } from "../utils/hash";
import { IUser } from "../db/models/user";
import pubsub from "./pubsub";
import { MESSAGE_ADDED } from "./constants";

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
      pubsub.publish(MESSAGE_ADDED, {
        messageAdded: res,
      });
      return res;
    } catch (err) {
      console.log(err);
      throw new Error("An error occurred creating message!");
    }
  },
  async createUser(_, { input }, { User }) {
    const alreadyExists = await User.findOne({ name: input.name });
    // if already exists throw error
    if (alreadyExists) throw new Error("A user already exists with that name!");
    try {
      const user: IUser = await User.create({
        ...input,
        password: hash(input.password),
        createdAt: new Date(),
      });
      const token = createToken({ id: user._id, name: user.name });
      return { user, token };
    } catch (err) {
      throw new Error("An error occurred creating a user!");
    }
  },
  async login(_, { input: { password, name } }, { User }) {
    try {
      // check user exists
      const user = await User.findOne({ name });
      if (!user) throw new Error("No User Exists With That Name");
      // if user exists check hashed password against inputted password
      const checkPass = compare(password, user.password);
      if (!checkPass) throw new Error("Password Does Not Match Records");
      //generate token
      const token = createToken({ id: user._id, name: user.name });
      // return user data and token
      return { token, user };
    } catch (err) {
      throw new Error(err);
    }
  },
};

export default Mutations;
