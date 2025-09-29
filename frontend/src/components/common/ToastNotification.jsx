import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const ToastNotification = ({ toast, setToast }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-lg ${
          toast.type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {toast.type === "success" ? (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
        )}
        <span className="font-medium text-sm sm:text-base flex-1">
          {toast.message}
        </span>
        <button
          onClick={() => setToast(null)}
          className="hover:opacity-80 flex-shrink-0"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
