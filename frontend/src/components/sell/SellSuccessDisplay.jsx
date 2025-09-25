import React from "react";

const SellSuccessDisplay = ({ submissionSuccess }) => {
  if (!submissionSuccess) return null;

  return (
    <div
      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong className="font-bold">Success!</strong>
      <span className="block sm:inline">
        {" "}
        Your item has been listed for sale.
      </span>
    </div>
  );
};

export default SellSuccessDisplay;
