import React, { useEffect, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

const Toast = ({
  message,
  type = "success",
  onClose,
  position = "bottom-right",
  duration = 4000,
}) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleClose = useCallback(() => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (message) {
      setIsLeaving(false);
      setProgress(100);

      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      // Auto close timer
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(progressTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [message, duration, handleClose]);

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-emerald-500",
        borderColor: "border-emerald-400",
        iconColor: "text-emerald-100",
      },
      error: {
        icon: AlertCircle,
        bgColor: "bg-red-500",
        borderColor: "border-red-400",
        iconColor: "text-red-100",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-amber-500",
        borderColor: "border-amber-400",
        iconColor: "text-amber-100",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-500",
        borderColor: "border-blue-400",
        iconColor: "text-blue-100",
      },
    };
    return configs[type] || configs.success;
  };

  const getPositionClasses = () => {
    const positions = {
      "top-left": "top-6 left-6",
      "top-right": "top-6 right-6",
      "bottom-left": "bottom-6 left-6",
      "bottom-right": "bottom-6 right-6",
      "top-center": "top-6 left-1/2 -translate-x-1/2",
      "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
    };
    return positions[position] || positions["bottom-right"];
  };

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-300 ease-in-out";

    if (isLeaving) {
      if (position.includes("right")) {
        return `${baseClasses} translate-x-full opacity-0`;
      } else if (position.includes("left")) {
        return `${baseClasses} -translate-x-full opacity-0`;
      } else if (position.includes("top")) {
        return `${baseClasses} -translate-y-full opacity-0`;
      } else {
        return `${baseClasses} translate-y-full opacity-0`;
      }
    }

    return `${baseClasses} translate-x-0 translate-y-0 opacity-100`;
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed ${getPositionClasses()} 
        ${getAnimationClasses()}
        ${config.bgColor} ${config.borderColor}
        backdrop-blur-sm bg-opacity-95
        border rounded-xl shadow-2xl
        px-4 py-3 pr-12
        max-w-sm min-w-80
        z-50
        hover:scale-105 hover:shadow-3xl
        transition-transform
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`}
          aria-hidden="true"
        />
        <div className="flex-1">
          <p className="text-white font-medium text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="
            absolute top-2 right-2
            text-white hover:text-gray-200
            transition-colors duration-200
            p-1 rounded-full
            hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-white/30
          "
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
        <div
          className="h-full bg-white/40 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default Toast;
