import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import models, { Context } from "./db/models";
import { ResolverFn } from "./types";

const secret = "beeblebrox";

interface TokenParameters {
  id: string;
  name: string;
}

const createToken = ({ id, name }: TokenParameters) =>
  jwt.sign({ id, name }, secret);

const getUserFromToken = (token: string) => {
  try {
    const user = <TokenParameters>jwt.verify(token, secret);
    return models.User.findOne({ id: user.id });
  } catch (e) {
    return null;
  }
};

const authenticated = (next: ResolverFn) => (
  root: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.user) {
    throw new AuthenticationError("must authenticate");
  }

  return next(root, args, context, info);
};

const authorized = (role: string, next: ResolverFn) => (
  root: any,
  args: any,
  context: Context,
  info: any
) => {
  // if (context.User.role !== role) {
  //   throw new AuthenticationError(`you must have ${role} role`)
  // }

  return next(root, args, context, info);
};

export { getUserFromToken, authenticated, authorized, createToken };
