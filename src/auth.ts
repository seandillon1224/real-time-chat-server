import { AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import REFRESH_TOKEN_COOKIE_OPTIONS from "./refreshToken";
import models from "./db/models";
import { ResolverFn, ContextWithAuth } from "./types";

const secret = "beeblebrox";

interface TokenParameters {
  id: string;
  name: string;
}

const createToken = ({ id, name }: TokenParameters) =>
  jwt.sign({ id, name }, process.env.JWT_TOKEN || secret, {
    expiresIn: Number(process.env.JWT_EXPIRY),
  });

const createCookie = async () => {
  const refreshToken = uuidv4();
  const refreshTokenExpiry = new Date(
    Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY || "60") * 1000
  );
  const refreshTokenSalt = await bcrypt.genSalt(10);
  const refreshTokenHash = await bcrypt.hash(refreshToken, refreshTokenSalt);
  return {
    clientCookie: {
      name: "refreshToken",
      value: refreshToken,
      options: {
        ...REFRESH_TOKEN_COOKIE_OPTIONS,
        expires: refreshTokenExpiry,
      },
    },
    refreshTokenHash,
    refreshTokenExpiry,
  };
};

const getUserFromToken = async (token: string) => {
  try {
    const user = <TokenParameters>jwt.verify(token, secret);
    const userData = await models.User.findOne({ _id: user.id });
    return userData;
  } catch (e) {
    return null;
  }
};

const authenticated = (next: ResolverFn) => (
  root: any,
  args: any,
  context: ContextWithAuth,
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
  context: ContextWithAuth,
  info: any
) => {
  // if (context.User.role !== role) {
  //   throw new AuthenticationError(`you must have ${role} role`)
  // }

  return next(root, args, context, info);
};

export {
  getUserFromToken,
  authenticated,
  authorized,
  createToken,
  createCookie,
};
