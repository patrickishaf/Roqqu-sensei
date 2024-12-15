import {UserDTO} from "../../auth/dto";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDTO
  }
}
