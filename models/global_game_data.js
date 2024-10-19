import mongoose, { Schema } from "mongoose";

const globalGameDataSchema = new Schema(
  {
    highestScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GlobalGameData = mongoose.models.global_game_data || mongoose.model("global_game_data", globalGameDataSchema);

export default GlobalGameData;