import {decrypt} from "./encryption";
import {User} from "../db";
import {isNodeEnvDevelopment} from "../config/environments";

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

  const userDetailsJSON = decrypt(token);
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
