"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export function StarRating({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  const handleMouseMove = (starIndex, isHalfStar) => {
    setHover(isHalfStar ? starIndex + 0.5 : starIndex + 1);
  };

  const handleMouseLeave = () => setHover(0);

  const handleClick = () => setRating(hover);

  const renderStar = (starIndex) => {
    const isHalfStar = (hover || rating) === starIndex + 0.5;
    const isFullStar = (hover || rating) >= starIndex + 1;

    return (
      <div
        key={starIndex}
        className="relative inline-block w-8 h-8 cursor-pointer"
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Star
          className="w-8 h-8 text-gray-300"
          fill={isFullStar ? "#FFD700" : "none"}
        />
        {isHalfStar && (
          <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
            <Star className="w-8 h-8 text-gray-300" fill="#FFD700" />
          </div>
        )}
        <div
          className="absolute top-0 left-0 w-1/2 h-full"
          onMouseEnter={() => handleMouseMove(starIndex, true)}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full"
          onMouseEnter={() => handleMouseMove(starIndex, false)}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="text-md font-semibold">Calificación: {rating}</p>
      <div className="flex">{[0, 1, 2, 3, 4].map(renderStar)}</div>
    </div>
  );
}
