"use client";
import Image from "next/image";

interface MindmintCoinProps {
  className?: string;
}

const MindmintCoin: React.FC<MindmintCoinProps> = ({ className }) => {
  return (
    <Image
      src="/coins/goldcoin.svg"
      alt="Coins"
      width={20}
      height={20}
      className={`${className}`}
    />
  );
};

export default MindmintCoin;