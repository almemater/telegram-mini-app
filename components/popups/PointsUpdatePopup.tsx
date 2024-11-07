"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { PointsUpdatePopupProps } from "@/libs/types";

const PointsUpdatePopup: React.FC<PointsUpdatePopupProps> = ({
  message,
  points,
  buttonText,
  onClose,
  positive = false,
  highScore,
}) => {
  const { width, height } = useWindowSize();

  const drawCoin = (ctx: CanvasRenderingContext2D) => {
    const radius = 8;

    // Draw the base circle with gradient for 3D effect
    const gradient = ctx.createRadialGradient(0, 0, radius / 2, 0, 0, radius);
    gradient.addColorStop(0, "gold");
    gradient.addColorStop(1, "darkgoldenrod");
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "darkgoldenrod";
    ctx.stroke();
    ctx.closePath();

    // Add shading for 3D effect
    const shadingGradient = ctx.createRadialGradient(
      -radius / 2,
      -radius / 2,
      radius / 4,
      0,
      0,
      radius
    );
    shadingGradient.addColorStop(0, "rgba(255, 255, 255, 0.6)"); // Highlight
    shadingGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)"); // Shadow
    ctx.fillStyle = shadingGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    // Draw the coin symbol
    ctx.fillStyle = "darkgoldenrod";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AM", 0, 0);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      {positive && (
        <Confetti width={width} height={height} drawShape={drawCoin} />
      )}
      <div className="glassmorphic-tertiary text-white shadow-lg p-4 rounded-lg w-4/5 max-w-md">
        <h2 className="text-2xl font-bold mb-2">{message}</h2>
        <p className="mb-4">
          {highScore && points >= highScore
            ? `New High Score - ${points} coins`
            : `You have earned ${points} coins`}
        </p>
        {highScore &&
          (points >= highScore ? (
            <p className="text-xs text-gray-400">
              You've set the high score of {points} and you are the player to
              beat now. Keep playing to defend the title! 🏆
            </p>
          ) : (
            <p className="text-xs text-gray-400">
              Can you beat the all-time high score of {highScore}? Keep
              playing, sharpen your skills, and claim the top spot! 🏆
            </p>
          ))}
        <div className="flex justify-end">
          <button
            className={`py-2 px-4 rounded ${
              positive
                ? "bg-green-500 hover:bg-green-700"
                : "bg-gray-500 hover:bg-gray-700"
            } text-white`}
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsUpdatePopup;
