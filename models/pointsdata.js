import mongoose, { Schema } from "mongoose";

const pointsdataSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true }, // Allow null and ensure uniqueness
    points: { type: Number, default: 0 },
    daily_points: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

pointsdataSchema.index({ points: -1 });

const PointsData = mongoose.models.PointsData || mongoose.model("PointsData", pointsdataSchema);

export default PointsData;