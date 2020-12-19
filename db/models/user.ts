import mongoose, { Schema, Document, model, Model } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

export interface IUser extends Document {
  name: string;
  password: string;
  messages: [string]
  chatRooms: [string]
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  messages: [{ type: ObjectId, ref: "Message" }],
  chatRooms: [{ type: ObjectId, ref: "ChatRoom" }],
  createdAt: { type: Date },
});

const User : Model<IUser> = mongoose.models.User || model("User", UserSchema);

export default User;