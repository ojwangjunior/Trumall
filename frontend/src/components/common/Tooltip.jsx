import React from "react";

const Tooltip = ({ tooltip }) => {
  if (!tooltip.show) return null;

  return (
    <div
      className="fixed z-50 px-3 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }}
    >
      {tooltip.text}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
        <div className="border-4 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};

export default Tooltip;
