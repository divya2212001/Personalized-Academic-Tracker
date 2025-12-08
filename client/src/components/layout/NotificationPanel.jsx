import React from "react";
import { FiBell } from "react-icons/fi";

const NotificationPanel = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 overflow-hidden ${
        darkMode
          ? "bg-slate-800/95 border-slate-700/50"
          : "bg-white/95 border-gray-200/50"
      }`}
    >
      <div
        className={`p-4 border-b ${
          darkMode ? "border-slate-700/50" : "border-gray-200/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Notifications
          </h3>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              darkMode
                ? "bg-slate-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            0 New
          </span>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto p-4">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className={`p-3 rounded-full mb-3 ${
              darkMode
                ? "bg-slate-700/50 text-gray-500"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            <FiBell className="w-6 h-6" />
          </div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No new notifications
          </p>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-500" : "text-gray-500"
            }`}
          >
            We'll let you know when something important happens.
          </p>
        </div>
      </div>

      <div
        className={`p-3 border-t text-center ${
          darkMode ? "border-slate-700/50" : "border-gray-200/50"
        }`}
      >
        <button
          onClick={onClose}
          className={`text-xs font-medium hover:underline ${
            darkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
