import React, { useEffect, useState } from "react";
import { MemoryGameRecord } from "@/libs/types";
import { useUser } from "@/context/UserContext";


const CognitiveAssessment: React.FC = () => {
  const { userData } = useUser();
  const [averageFlips, setAverageFlips] = useState<number | null>(null);
  const [averageTime, setAverageTime] = useState<number | null>(null);
  const [averagePoints, setAveragePoints] = useState<number | null>(null);

  useEffect(() => {
    const fetchGameRecords = async () => {
      try {
        const response = await fetch(`/api/memoryGames?userId=${userData?.id}`);
        if (response.ok) {
          const data = await response.json();
          const gameRecords: MemoryGameRecord[] = data.gameRecords;

          const totalFlips = gameRecords.reduce(
            (acc, record) => acc + record.flips,
            0
          );
          const totalTime = gameRecords.reduce(
            (acc, record) => acc + record.timeTaken,
            0
          );
          const totalPoints = gameRecords.reduce(
            (acc, record) => acc + record.score,
            0
          );

          setAverageFlips(totalFlips / gameRecords.length);
          setAverageTime(totalTime / gameRecords.length);
          setAveragePoints(totalPoints / gameRecords.length);
        } else {
          console.error("Error fetching game records");
        }
      } catch (error) {
        console.error("Error fetching game records:", error);
      }
    };

    fetchGameRecords();
  }, [userData]);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-4">Cognitive Assessment</h2>
      <p className="text-lg mb-2">Average Flips: {averageFlips?.toFixed(2)}</p>
      <p className="text-lg mb-2">
        Average Time: {averageTime?.toFixed(2)} seconds
      </p>
      <p className="text-lg mb-2">
        Average Points: {averagePoints?.toFixed(2)}
      </p>
    </div>
  );
};

export default CognitiveAssessment;
