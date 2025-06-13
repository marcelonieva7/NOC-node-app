import { Schema, model } from "mongoose";
import { LogSecurityLevelEnum } from "../../../../domain/entities/log.entity";

const LogSchema = new Schema({
  createdAt: { type: Date, default: Date.now() },
  level: {
    type: String,
    required: true,
    enum: Object.values(LogSecurityLevelEnum)
  },
  message: { type: String, required: true },
  origin: { type: String, required: true }
});

export const LogModel = model('Log', LogSchema);
