import bcrypt from "bcryptjs";
import { ResolverMap } from "types";
import { IMessage } from "../db/models/message";
import { IChatRoom } from "../db/models/chatroom";
import { createToken, authenticated, createCookie } from "../auth";
import { hash, compare } from "../utils/hash";
import User, { IUser } from "../db/models/user";
import pubsub from "./resolverUtils/pubsub";
import { MESSAGE_ADDED, CHATROOM_ADDED } from "./resolverUtils/constants";

const Mutations: ResolverMap = {
  createMessage: authenticated(
    async (
      _,
      { input: { user, content, chatroom } },
      { Message, ChatRoom }
    ) => {
      try {
        const createdAt = new Date();
        // create message
        const msg: IMessage = await Message.create({
          content,
          user,
          chatroom,
          createdAt,
        });
        // put message into chatroom mongo collection
        await ChatRoom.findByIdAndUpdate(chatroom, {
          $addToSet: { messages: msg._id },
        });
        // publish message
        console.log("here?");
        pubsub.publish(MESSAGE_ADDED, {
          messageAdded: msg,
        });
        return msg;
      } catch (err) {
        console.log(err);
        throw new Error("An error occurred creating message!");
      }
    }
  ),
  createChatRoom: authenticated(async (_, { input }, { ChatRoom, Message }) => {
    try {
      // current time
      const createdAt = new Date();
      // create chatroom
      const chatroom: IChatRoom = await ChatRoom.create({
        users: input.creator,
        createdAt,
      });
      // create message that initialized chatroom
      const msg: IMessage = await Message.create({
        chatroom: chatroom._id,
        content: input.message,
        user: input.creator,
        createdAt,
      });
      // push invitees into users array
      chatroom.users.push(...input.invitees);
      // push message into chatroom message array
      chatroom.messages?.push(msg._id);
      // exec chatroom model to get all info
      const updatedRoom = await chatroom
        .populate({ path: "messages", populate: { path: "user" } })
        .populate("users")
        .execPopulate();
      // publish message
      pubsub.publish(CHATROOM_ADDED, {
        chatrooms: updatedRoom,
      });
      return chatroom;
    } catch (err) {
      console.log(err);
      throw new Error("Error occurred creating chatroom!");
    }
  }),
  async createUser(_, { input }, { User, setCookies }) {
    const alreadyExists = await User.findOne({ name: input.name });
    // if already exists throw error
    if (alreadyExists) throw new Error("A user already exists with that name!");
    try {
      // create cookie / refresh token
      const {
        clientCookie,
        refreshTokenHash,
        refreshTokenExpiry,
      } = await createCookie();
      // create new user
      const user: IUser = await User.create({
        ...input,
        password: hash(input.password),
        createdAt: new Date(),
        refreshTokens: [{ hash: refreshTokenHash, expiry: refreshTokenExpiry }],
      });
      // set cookies to send
      setCookies.push(clientCookie);
      // create JWT Token
      const token = createToken({ id: user._id, name: user.name });
      return { user, token };
    } catch (err) {
      throw new Error("An error occurred creating a user!");
    }
  },
  async login(_, { input: { password, name } }, { User, setCookies }) {
    try {
      // check user exists
      const user = await User.findOne({ name });
      if (!user) throw new Error("No User Exists With That Name");
      // if user exists check hashed password against inputted password
      const checkPass = compare(password, user.password);
      if (!checkPass) throw new Error("Password Does Not Match Records");
      //generate token
      const token = createToken({ id: user._id, name: user.name });
      // create cookie / refresh token
      const {
        clientCookie,
        refreshTokenHash,
        refreshTokenExpiry,
      } = await createCookie();
      // add new refresh token to user object and save
      user.refreshTokens.push({
        hash: refreshTokenHash,
        expiry: refreshTokenExpiry,
      });
      await user.save();
      // set cookies to send
      setCookies.push(clientCookie);
      // return user data and token
      return { token, user };
    } catch (err) {
      throw new Error(err);
    }
  },
  async refreshUserToken(_, __, { req, setCookies, user }) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No Refresh Token !");

    const foundUser = await User.findById(user._id);
    if (!foundUser) throw new Error("No user found with that id");

    let isValidRefreshToken = false;

    foundUser.refreshTokens = foundUser.refreshTokens.filter((storedToken) => {
      const isMatch = bcrypt.compareSync(refreshToken, storedToken.hash);
      const isValid = storedToken.expiry > new Date(Date.now());
      if (isMatch && isValid) {
        isValidRefreshToken = true;
      }
      return !isMatch && isValid;
    });

    if (!isValidRefreshToken) throw new Error("Invalid Refresh Token!");

    // create cookie / refresh token
    const {
      clientCookie,
      refreshTokenHash,
      refreshTokenExpiry,
    } = await createCookie();
    // set cookie to send back
    setCookies.push(clientCookie);
    // add cookie to user object
    foundUser.refreshTokens.push({
      hash: refreshTokenHash,
      expiry: refreshTokenExpiry,
    });
    // save new tokens
    await foundUser.save();

    const token = createToken({ id: foundUser._id, name: foundUser.name });

    return { foundUser, token };
  },
};

export default Mutations;
