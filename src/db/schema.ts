import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
});

export const messageSchema = new mongoose.Schema({
  chatRoom: { type: String },
  senderEmail: { type: String },
  timestamp: { type: Date },
  isAutomated: { type: Boolean, default: false },
  labelText: { type: String },
  content: { type: String },
  attachmentPath: { type: String },
  attachmentType: { type: String },
});
messageSchema.pre('save', async function (next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  next();
});

export const chatSchema = new mongoose.Schema({
  chatRoom: { type: String },
  customerEmail: { type: String },
  status: { type: String },
  createdAt: { type: Date },
  country: { type: String },
  countryCode: { type: String },
  messages: [messageSchema]
});
chatSchema.pre('save', async function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  next();
})