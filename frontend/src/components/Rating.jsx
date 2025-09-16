import React from "react";

const Rating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <span key={i} className="text-orange">
          ★
        </span>
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <span key={i} className="text-orange">
          ★
        </span>
      ); // Using full star for half star for simplicity
    } else {
      stars.push(
        <span key={i} className="text-gray-300">
          ★
        </span>
      );
    }
  }
  return <div>{stars}</div>;
};

export default Rating;
