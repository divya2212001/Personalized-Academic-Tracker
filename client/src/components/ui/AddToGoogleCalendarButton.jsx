import React from "react";
import { SiGooglecalendar } from "react-icons/si";

const AddToGoogleCalendarButton = ({ event, small }) => {
  const handleAddToCalendar = (e) => {
    e.stopPropagation();

    if (!event) return;

    const title = encodeURIComponent(event.title || "New Event");
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    // Format dates for Google Calendar (YYYYMMDDTHHMMSSZ)
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatDate(event.start);
    const end = formatDate(event.end);

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;

    window.open(url, "_blank");
  };

  if (small) {
    return (
      <button
        onClick={handleAddToCalendar}
        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-all duration-200"
        title="Add to Google Calendar"
      >
        <SiGooglecalendar className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCalendar}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
    >
      <SiGooglecalendar className="w-5 h-5 text-blue-500" />
      <span>Add to Google Calendar</span>
    </button>
  );
};

export default AddToGoogleCalendarButton;
