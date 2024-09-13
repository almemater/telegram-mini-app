import mongoose, { Schema } from "mongoose";

const memoryGameSchema = new Schema(
  {
    gameId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    score: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    flips: { type: Number, required: true },
    isWin: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const MemoryGame = mongoose.models.MemoryGame || mongoose.model("MemoryGame", memoryGameSchema);

export default MemoryGame;