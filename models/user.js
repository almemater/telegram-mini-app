import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String },
    username: { type: String, required: true, unique: true },
    language_code: { type: String },
    is_premium: { type: Boolean, default: false },
    completedTasks: [{ type: Number }],
    referralCode: { type: String, unique: true }, 
    referrals: { type: [{ type: String }], default: [] }, 
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;