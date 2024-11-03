import {
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useUser } from "@/context/UserContext";
import { generateGameId } from "@/libs/generators";
import { FaClock } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import MindmintCoin from "./MindmintCoin";
import GameGrid from "./memory_game/GameGrid";
import { ReactSVG } from "react-svg";
import Image from "next/image";

const stationeryItems = ["✏️", "🖊️", "📏", "📐", "📎", "🖇️", "📌", "🗑️"];
const initialCards = [...stationeryItems, ...stationeryItems];
const GAME_TIME_SECONDS = 60;

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const MemoryGameComponent = forwardRef<unknown>((props, ref) => {
  const { userData, setPointsData } = useUser();

  const [cards, setCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_TIME_SECONDS);
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
          console.log("Time's up!");
          endGame(false);
          clearInterval(interval);
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
      setTimeLeft(GAME_TIME_SECONDS);
      setScore(0);
      setMatchedPairs(0);
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
    setIsLoading(true);
    const finalScore = await calculateFinalScore(isWin, timeLeft);

    if (userData && gameId) {
      const gameRecord = {
        gameId,
        userId: userData.id.toString(),
        score: finalScore,
        timeTaken: GAME_TIME_SECONDS - timeLeft,
        flips,
        isWin,
      };

      console.log("Game Record: ", gameRecord);

      // Save game record
      const response = await fetch("/api/memoryGames/saveGameRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameRecord),
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
          highScore: updatedUser.globalGameData.highestScore,
        });
      } else {
        console.error("Error updating user data");
      }
    }

    if (timerInterval) await clearInterval(timerInterval);
    setTimeout(() => {
      initializeGame(false);
      setIsGameActive(false);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full justify-center">
      <div className="px-2 w-full">
      <div className="flex glassmorphic justify-evenly px-2 py-4 gap-6 game-info mb-4 text-3xl text-center font-mono">
        <div className="flex items-center gap-2">
          <Image
          src={"/icons/TimerIcon.svg"}
          alt="Timer"
          height={40}
          width={40}
          />
          {/* <ReactSVG src="/icons/TimerIcon.svg" className={`w-6 h-6 `} /> */}
          <span id="timer">{timeLeft===60 ? "01:00" : `${timeLeft}`}</span>
          {/* <FaClock className="mr-2" />  s */}
        </div>
        <div className="flex items-center border border-zinc-500 rounded " />
        <div className="flex items-center gap-2">
          <MindmintCoin className=" shadow-xl" height={40} width={40} />{" "}
          <span id="score">{score}P</span>
        </div>
        {/* <div className="flex items-center">
          <FaRepeat className="mr-2" /> <span id="flips">{flips}</span>
        </div> */}
      </div>
      </div>
        
      <GameGrid
        cards={cards}
        onEndGame={endGame}
        isGameActive={isGameActive}
        isLoading={isLoading}
        setFlips={setFlips}
        setScore={setScore}
        setMatchedPairs={setMatchedPairs}
        stationeryItems={stationeryItems}
      />
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
