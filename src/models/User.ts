import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISavedAddress {
  id: string;
  name: string;
  phone: string;
  area: string;
  fullAddress: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string | null;
  role: 'admin' | 'customer';
  avatar_url?: string | null;
  provider?: 'credentials' | 'google' | string;
  addresses?: ISavedAddress[];
  created_at: Date;
  updated_at: Date;
}

const SavedAddressSchema = new Schema<ISavedAddress>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    area: { type: String, required: true, default: 'Inside Dhaka' },
    fullAddress: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: true },
    phone: { type: String, default: null },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    avatar_url: { type: String, default: null },
    provider: { type: String, default: 'credentials' },
    addresses: { type: [SavedAddressSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

if (process.env.NODE_ENV !== 'production') {
  delete (mongoose.models as Record<string, unknown>).User;
}

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

