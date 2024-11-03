import React from "react";

interface MemoryCardProps {
  item: string;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (index: number) => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  item,
  index,
  isFlipped,
  isMatched,
  onClick,
}) => {
  return (
    <div
      key={index}
      className={`card rounded w-20 h-20 flex items-center justify-center text-2xl cursor-pointer transition-transform transform ${
        (isFlipped || isMatched) && "flipped"
      }`}
      onClick={() => onClick(index)}
    >
      <div className="card-inner">
        {isFlipped || isMatched ? (
          <div className="card-back card-flipped">
            {item}
          </div>
        ) : (
          <div className="card-front card-unflipped">
            {/* Front content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryCard;
