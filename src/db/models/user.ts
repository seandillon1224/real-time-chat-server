import mongoose, { Schema, Document, model, Model } from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

export interface IUser extends Document {
  name: string;
  password: string;
  email: string;
  createdAt: Date;
  refreshTokens: {
    hash: string;
    expiry: Date;
  }[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  createdAt: { type: Date },
  refreshTokens: [{ hash: { type: String }, expiry: { type: Date } }],
});

const User: Model<IUser> = mongoose.models.User || model("User", UserSchema);

export default User;
