import React, { useState, useEffect } from "react";
import MemoryCard from "./MemoryCard";

interface GameGridProps {
  cards: string[];
  onEndGame: (isWin: boolean) => void;
  isGameActive: boolean;
  isLoading: boolean;
  setFlips: React.Dispatch<React.SetStateAction<number>>;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setMatchedPairs: React.Dispatch<React.SetStateAction<number>>;
  stationeryItems: string[];
}

const GameGrid: React.FC<GameGridProps> = ({
  cards,
  onEndGame,
  isGameActive,
  isLoading,
  setFlips,
  setScore,
  setMatchedPairs,
  stationeryItems,
}) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);

  const flipCard = (index: number) => {
    if (!isGameActive || isLoading) return;
    if (
      flippedCards.length < 2 &&
      !flippedCards.includes(index) &&
      !matchedCards.includes(index)
    ) {
      setFlippedCards((prev) => [...prev, index]);
      setFlips((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedPairs((prev) => {
          const newMatchedPairs = prev + 1;
          if (newMatchedPairs === stationeryItems.length) {
            onEndGame(true);
          }
          return newMatchedPairs;
        });
        setScore((prev) => prev + 10);
        setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
      }
    }
  }, [flippedCards, cards, onEndGame, setMatchedPairs, setScore, stationeryItems]);

  useEffect(() => {
    if (!isGameActive) {
      setFlippedCards([]);
      setMatchedCards([]);
    }
  }, [isGameActive]);

  return (
    <div className="game-container grid grid-cols-4 gap-2">
      {cards.map((item, index) => (
        <MemoryCard
          key={index}
          item={item}
          index={index}
          isFlipped={flippedCards.includes(index)}
          isMatched={matchedCards.includes(index)}
          onClick={flipCard}
        />
      ))}
    </div>
  );
};

export default GameGrid;