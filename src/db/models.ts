import mongoose from "mongoose";
import {chatSchema, messageSchema, userSchema} from "./schema";

export const User = mongoose.model("User", userSchema);

export const Message = mongoose.model("Message", messageSchema);

export const Chat = mongoose.model("Chat", chatSchema);