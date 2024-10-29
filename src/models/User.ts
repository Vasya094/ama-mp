import mongoose, { Schema, Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SELLER = 'seller'
}

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  provider: 'google' | 'local';
  googleId?: string;
  role: UserRole;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    }
  },
  provider: {
    type: String,
    required: true,
    enum: ['google', 'local'],
    default: 'local'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
