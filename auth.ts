import {AuthenticationError} from 'apollo-server';
import jwt from 'jsonwebtoken';
import models, {Context} from 'db/models'
import {ResolverFn} from 'types'
import { IUser } from 'db/models/user';

const secret = 'catpack'


interface TokenParameters {
  id: string
  role: string
}

const createToken = ({id, role}: TokenParameters) => jwt.sign({id, role }, secret)

const getUserFromToken = (token: string) => {
  try {
    const user = <TokenParameters>jwt.verify(token, secret)
    return models.User.findOne({id: user.id})
  } catch (e) {
    return null
  }

}

const authenticated = (next: ResolverFn) => (root: any, args: any, context: Context, info: any) => {
  // if (!context.User) {
  //   throw new AuthenticationError('must authenticate')
  // }

  return next(root, args, context, info)
}

const authorized = (role: string, next: ResolverFn) => (root: any, args: any, context: Context, info: any) => {
  // if (context.User.role !== role) {
  //   throw new AuthenticationError(`you must have ${role} role`)
  // }

  return next(root, args, context, info)
}

export {
  getUserFromToken,
  authenticated,
  authorized,
  createToken
};