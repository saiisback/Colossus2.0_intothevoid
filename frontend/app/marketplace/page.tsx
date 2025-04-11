import React from "react";
import { Star } from "lucide-react";

type TokenCardProps = {
  title: string;
  description: string;
  priceEth: string;
  seller: string;
  rating: number;
  sustainability: number;
  impact: string;
  onBuy: () => void;
};

const TokenCard: React.FC<TokenCardProps> = ({
  title,
  description,
  priceEth,
  seller,
  rating,
  sustainability,
  impact,
  onBuy,
}) => (
  <div className="max-w-sm p-6 bg-white rounded-2xl shadow-md border border-gray-200 space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="bg-green-100 text-green-600 text-sm font-semibold px-2 py-1 rounded-full">
        {priceEth} ETH
      </div>
    </div>

    <div className="text-sm space-y-1">
      <div className="flex justify-between">
        <span className="text-gray-500">Seller</span>
        <span className="font-medium text-gray-800">{seller}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Seller Rating</span>
        <span className="flex items-center gap-1 text-yellow-500 font-semibold">
          {rating} <Star className="w-4 h-4 fill-yellow-500" />
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Sustainability</span>
        <span className="bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">
          {sustainability}/100
        </span>
      </div>
    </div>

    <hr />

    <div className="text-sm text-green-600 font-medium">
      Impact <span className="block font-semibold">{impact}</span>
    </div>

    <div className="flex gap-2">
      <button
        onClick={onBuy}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
      >
        Buy Token
      </button>
      <button className="bg-white border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
        Details
      </button>
    </div>
  </div>
);

export default TokenCard;
