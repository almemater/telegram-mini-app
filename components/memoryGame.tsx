import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp"; // Adjust the path as necessary
import { UserData } from "@/types";
import GameEndPopup from "@/components/GameEndPopup"; 

interface MemoryGameProps {
  userData: UserData | null;
  points: number;
  setPoints: (points: number) => void;
}

const stationeryItems = ["✏️", "🖊️", "📏", "📐", "📎", "🖇️", "📌", "🗑️"];

// List of cryptocurrency icons
const cryptoItems = [
  "/cryptoIcons/bitcoin.svg",
  "/cryptoIcons/dogecoin.svg",
  "/cryptoIcons/ethereum.svg",
  "/cryptoIcons/polygon.svg",
  "/cryptoIcons/solana.svg",
  "/cryptoIcons/tether.svg",
  "/cryptoIcons/toncoin.svg",
  "/cryptoIcons/chainlink.svg",
];
const initialCards = [...stationeryItems, ...stationeryItems];

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const MemoryGame = forwardRef<unknown, MemoryGameProps>(({
  userData,
  points,
  setPoints,
}, ref) => {
  const [cards, setCards] = useState<string[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showGameEndPopup, setShowGameEndPopup] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<{ isWin: boolean; finalScore: number }>({ isWin: false, finalScore: 0 });

  useEffect(() => {
    shuffleArray(initialCards);
    setCards([...initialCards]);
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval); // Clear any existing interval
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endGame(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  }, [timerInterval]);

  const startGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGameActive(true);
      setTimeLeft(60);
      setScore(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setMatchedCards([]);
      shuffleArray(initialCards);
      setCards([...initialCards]);
      startTimer();
      setIsLoading(false);
    }, 500); // Simulate loading time
  };

  useImperativeHandle(ref, () => ({
    startGame,
  }));

  const stopGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGameActive(false);
      if (timerInterval) clearInterval(timerInterval);
      setIsLoading(false);
    }, 500); // Simulate loading time
  };

  const flipCard = (index: number) => {
    if (!isGameActive || isLoading) return;
    if (
      flippedCards.length < 2 &&
      !flippedCards.includes(index) &&
      !matchedCards.includes(index)
    ) {
      setFlippedCards((prev) => [...prev, index]);
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      if (cards[firstIndex] === cards[secondIndex]) {
        setMatchedPairs((prev) => {
          const newMatchedPairs = prev + 1;
          if (newMatchedPairs === stationeryItems.length) {
            endGame(true);
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
  }, [flippedCards, cards]);

  const calculateFinalScore = async (isWin: boolean, tl: number): Promise<number> => {
    let finalScore = 0;
  
    await new Promise<void>((resolve) => {
      setScore((prev) => {
        finalScore = prev;
        if (isWin) {
          finalScore += tl * 2;
        }
        resolve();
        return finalScore;
      });
    });
  
    return finalScore;
  };

  const endGame = async (isWin: boolean) => {
    setIsGameActive(false);
    const finalScore = await calculateFinalScore(isWin, timeLeft);
    if (timerInterval) clearInterval(timerInterval);
  
    setGameResult({ isWin, finalScore });
    setShowGameEndPopup(true);
  
    if (userData) {
      const newPoints = points + finalScore;
      setPoints(newPoints);
  
      const userDocRef = doc(
        db,
        "users",
        userData.username || userData.id.toString()
      );
      await setDoc(
        userDocRef,
        {
          points: newPoints,
        },
        { merge: true }
      );
    }
  
    resetGame();
  };

  const resetGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsGameActive(false);
      setMatchedPairs(0);
      setTimeLeft(60);
      setScore(0);
      setFlippedCards([]);
      setMatchedCards([]);
      shuffleArray(initialCards);
      setCards([...initialCards]);
      if (timerInterval) clearInterval(timerInterval);
      setIsLoading(false);
    }, 500); // Simulate loading time
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="game-info mb-4 text-lg text-center">
        <div>
          Time: <span id="timer">{timeLeft}</span> seconds
        </div>
        <div>
          Score: <span id="score">{score}</span> points
        </div>
      </div>
      <div className="game-container grid grid-cols-4 gap-2">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`card w-20 h-20 flex items-center justify-center text-2xl cursor-pointer transition-transform transform ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? "rotate-y-180 bg-green-500"
                : "bg-blue-500"
            }`}
            onClick={() => flipCard(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(index) ? (
              item
              // <img src={item} alt="crypto icon" className="w-16 h-16" />
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="buttons mt-4">
        {!isGameActive ? (
          <button
            className={`button-start text-white py-2 px-4 rounded mr-2 transition-transform transform ${
              isLoading ? "scale-95" : "scale-100"
            } ${
              isGameActive || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-700"
            }`}
            onClick={startGame}
            disabled={isGameActive || isLoading}
          >
            {isLoading && isGameActive ? "Starting..." : "Start"}
          </button>
        ) : (
          <button
            className={`button-stop text-white py-2 px-4 rounded mr-2 transition-transform transform ${
              isLoading ? "scale-95" : "scale-100"
            } ${
              !isGameActive || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-700"
            }`}
            onClick={stopGame}
            disabled={!isGameActive || isLoading}
          >
            {isLoading && !isGameActive ? "Stopping..." : "Stop"}
          </button>
        )}
        <button
          className={`button-restart text-white py-2 px-4 rounded mr-2 transition-transform transform ${
            isLoading ? "scale-95" : "scale-100"
          } ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-700"
          }`}
          onClick={resetGame}
          disabled={isLoading}
        >
          {isLoading ? "Restarting..." : "Restart"}
        </button>
      </div>
      {showGameEndPopup && (
        <GameEndPopup
          isWin={gameResult.isWin}
          finalScore={gameResult.finalScore}
          onClose={() => setShowGameEndPopup(false)}
        />
      )}
    </div>
  );
});

export default MemoryGame;