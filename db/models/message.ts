import mongoose, { Schema, Document, model, Model } from "mongoose";
import { IUser } from "./user";
import { IChatRoom } from "./chatroom";

const { ObjectId } = mongoose.Schema.Types;

export interface IMessage extends Document {
  content: string
  user: IUser
  chatroom: IChatRoom
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  content: {type: String},
  user: { type: ObjectId, ref: "User" },
  chatroom: { type: ObjectId, ref: "ChatRoom" },
  createdAt: { type: Date },
});

const Message : Model<IMessage> = mongoose.models.Message || model("Message", MessageSchema);

export default Message;