import React from "react";

const SignupErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start">
      <div className="w-5 h-5 text-red-500 mr-3 mt-0.5">⚠️</div>
      <div>
        <strong className="font-semibold">Error!</strong>
        <div className="text-sm mt-1">{error}</div>
      </div>
    </div>
  );
};

export default SignupErrorDisplay;
