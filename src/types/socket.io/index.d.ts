import {UserDTO} from "../../auth/dto";

declare module "socket.io" {
  interface Socket {
    user?: UserDTO
  }
}
