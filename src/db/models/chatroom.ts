import mongoose, { Schema, Document, model, Model } from "mongoose";
import { IUser } from "./user";
import { IMessage } from "./message";

const { ObjectId } = mongoose.Schema.Types;

export interface IChatRoom extends Document {
  messages?: [IMessage];
  users: [IUser];
  createdAt: Date;
}

const ChatRoomSchema: Schema = new Schema({
  messages: [{ type: ObjectId, ref: "Message", default: [] }],
  users: [{ type: ObjectId, ref: "User" }],
  createdAt: { type: Date },
});

const ChatRoom: Model<IChatRoom> =
  mongoose.models.ChatRoom || model("ChatRoom", ChatRoomSchema);

export default ChatRoom;
