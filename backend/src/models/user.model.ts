import { Document, Schema, Types } from 'mongoose';
import { compareValues, hashValue } from '../utils/bcrypt';
import mongoose from 'mongoose';
export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: true },
    profilePicture: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  return next();
});

userSchema.methods.comparePassword = async function (
  value: string,
): Promise<boolean> {
  return await compareValues(value, this.password);
};

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
