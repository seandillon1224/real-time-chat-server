import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

export const hash = (password: string) => bcrypt.hashSync(password, salt);

export const compare = (password: string, hash: string) =>
  bcrypt.compareSync(password, hash);
