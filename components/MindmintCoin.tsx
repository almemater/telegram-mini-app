"use client";
import Image from "next/image";

interface MindmintCoinProps {
  className?: string;
  height?: number;
  width?: number;
}

const MindmintCoin: React.FC<MindmintCoinProps> = ({ className, height, width }) => {
  return (
    <Image
      src="/coins/goldcoin.svg"
      alt="Coins"
      width={width || 20}
      height={height || 20}
      className={`${className}`}
    />
  );
};

export default MindmintCoin;