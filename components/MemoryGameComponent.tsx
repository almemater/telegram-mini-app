import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { UserData, MemoryGameRecord } from "@/libs/types";
import { useUser } from "@/context/UserContext";
import { generateGameId } from "@/libs/generators";
import { FaClock, FaStar, FaSyncAlt, FaPlay, FaStop } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import MindmintCoin from "./MindmintCoin";

const stationeryItems = ["✏️", "🖊️", "📏", "📐", "📎", "🖇️", "📌", "🗑️"];
const initialCards = [...stationeryItems, ...stationeryItems];

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const MemoryGameComponent = forwardRef<unknown>((props, ref) => {
  const { userData, setUserData, pointsData, setPointsData } = useUser();

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
  const [flips, setFlips] = useState<number>(0);
  const [gameId, setGameId] = useState<string | null>(null);
  const { setShowPointsUpdatePopup } = useUser();

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

  const initializeGame = (isStart: boolean) => {
    setIsLoading(true);
    setTimeout(() => {
      if (isStart) {
        setIsGameActive(true);
        setGameId(
          generateGameId(
            userData?.id.toString() || "",
            userData?.username || ""
          )
        );
        startTimer();
      } else {
        setIsGameActive(false);
        if (timerInterval) clearInterval(timerInterval);
      }
      setTimeLeft(60);
      setScore(0);
      setMatchedPairs(0);
      setFlippedCards([]);
      setMatchedCards([]);
      setFlips(0);
      shuffleArray(initialCards);
      setCards([...initialCards]);
      setIsLoading(false);
    }, 500); // Simulate loading time
  };

  useImperativeHandle(ref, () => ({
    startGame: () => initializeGame(true),
  }));

  const stopGame = () => {
    initializeGame(false);
  };

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

  const calculateFinalScore = async (
    isWin: boolean,
    tl: number
  ): Promise<number> => {
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

    if (userData && gameId) {
      const gameRecord: MemoryGameRecord = {
        gameId,
        userId: userData.id.toString(),
        score: finalScore,
        timeTaken: 60 - timeLeft,
        flips,
        isWin,
      };

      // Save game record
      await fetch("/api/memoryGames/saveGameRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameRecord),
      });

      // Update user points
      const response = await fetch("/api/points/updatePoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userData.id,
          points: finalScore,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setPointsData(updatedUser.pointsdata);
        setShowPointsUpdatePopup({
          message: isWin ? "Congratulations!" : "Time's up!",
          points: finalScore,
          buttonText: isWin ? "Yaay!" : "Close",
          onClose: () => setShowPointsUpdatePopup(null),
          positive: isWin,
        });
      } else {
        console.error("Error updating user data");
      }
    }

    if (timerInterval) await clearInterval(timerInterval);
    setTimeout(() => initializeGame(false), 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex glassmorphic px-4 py-2 gap-6 game-info mb-4 text-xl text-center">
        <div className="flex items-center">
          <FaClock className="mr-2" /> <span id="timer">{timeLeft}</span> s
        </div>
        <div className="flex items-center">
          {/* <FaStar className="mr-2 text-primary shadow-xl" />{" "} */}
          <MindmintCoin className="mr-2 shadow-xl" />{" "}
          <span id="score">{score}</span>
        </div>
        <div className="flex items-center">
          <FaRepeat className="mr-2" /> <span id="flips">{flips}</span>
        </div>
      </div>
      <div className="game-container grid grid-cols-4 gap-2">
        {cards.map((item, index) => (
          <div
            key={index}
            className={`card rounded w-20 h-20 flex items-center justify-center text-2xl cursor-pointer transition-transform transform ${
              flippedCards.includes(index) || matchedCards.includes(index)
                ? "rotate-y-180 bg-green-500"
                : "bg-dark-100"
            }`}
            onClick={() => flipCard(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(index)
              ? item
              : ""}
          </div>
        ))}
      </div>
      <div className="buttons mt-4">
        {!isGameActive ? (
          <button
            className={`button-start text-white py-2 px-6 rounded mr-2 transition-transform transform ${
              isLoading ? "scale-95" : "scale-100"
            } ${
              isGameActive || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "btn-primary"
            }`}
            onClick={() => initializeGame(true)}
            disabled={isGameActive || isLoading}
          >
            {isLoading && isGameActive ? "Starting..." : "Start 🚀"}
          </button>
        ) : (
          <button
            className={`button-stop text-white py-2 px-4 rounded mr-2 transition-transform transform ${
              isLoading ? "scale-95" : "scale-100"
            } ${
              !isGameActive || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "btn-secondary"
            }`}
            onClick={stopGame}
            disabled={!isGameActive || isLoading}
          >
            {isLoading && !isGameActive ? "Stopping..." : "Stop"}
          </button>
        )}
      </div>
    </div>
  );
});

export default MemoryGameComponent;
