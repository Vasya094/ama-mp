import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  USER = 'user',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  googleId?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  googleId: { type: String },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
