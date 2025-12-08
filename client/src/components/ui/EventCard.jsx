import React from "react";
import { FiClock, FiMapPin, FiUser } from "react-icons/fi";

const categoryColors = {
  Class: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  Assignment:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  Meeting:
    "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  Masterclass:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  Quiz: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  Contest: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  Practice: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-200",
  Other: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
};

const EventCard = ({ event, onClick, darkMode }) => {
  const startTime = new Date(event.start).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(event.end).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => onClick(event)}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
        darkMode
          ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
          : "bg-white border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`font-semibold text-lg truncate ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {event.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            categoryColors[event.category] || categoryColors.Other
          }`}
        >
          {event.category}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <FiClock className="w-4 h-4" />
          <span>
            {startTime} - {endTime}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <FiMapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
