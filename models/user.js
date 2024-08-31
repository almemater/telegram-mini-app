import mongoose, { Schema } from "mongoose";

/*
id: user.id,
name: `${user.first_name} ${user.last_name || ''}`,
username: user.username || '',
points: 0,
completedTasks: []
*/

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 },
    completedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

const User = mongoose.model.User || mongoose.model("User", userSchema);

export default User;
