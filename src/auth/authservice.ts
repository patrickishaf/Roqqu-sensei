import {decryptWithAES} from "./encryption";
import {User} from "../db";
import {isNodeEnvDevelopment} from "../config/environments";
import config from "../config";

export const getUserFromToken = async (token: string) => {
  if (isNodeEnvDevelopment()) {
    if (token === "demo") {
      const existingUser = await User.findOne({ email: 'demo@email.com' }).exec();
      if (!existingUser) {
        const userModel = new User({
          firstName: 'Demo',
          lastName: 'Developer',
          email: 'demo@email.com',
          password: 'demo@password',
        });
        const user = await userModel.save();
        return user;
      }
      return existingUser;
    }
  }

  const userDetailsJSON = await decryptWithAES(config.encryptionKey, token);
  const userDetailsObject = JSON.parse(userDetailsJSON);
  const existingUser = await User.findOne({ email: userDetailsObject.email }).exec();
  if (!existingUser) {
    const payload: any = {
      firstName: userDetailsObject.firstName,
      lastName: userDetailsObject.lastName,
      email: userDetailsObject.email,
    }
    if (userDetailsObject.password) {
      payload.password = userDetailsObject.password;
    }
    const userModel = new User(payload);
    const user = await userModel.save();
    return user;
  }
  return existingUser;
}

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).exec();
  if (!user) throw new Error('user not found');
  return user?.toJSON();
}