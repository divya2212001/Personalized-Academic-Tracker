import React, { useState } from "react";
import { SiGooglecalendar } from "react-icons/si";
import { Edit2, Trash2, ExternalLink, Check } from "lucide-react";

const AddToGoogleCalendarButton = ({ event, small, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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

    // Open Google Calendar with event details pre-filled
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;

    window.open(url, "_blank");
  };

  // Open event in Google Calendar for viewing/editing
  const handleViewInGoogleCalendar = (e) => {
    e.stopPropagation();
    if (!event) return;

    const title = encodeURIComponent(event.title || "New Event");
    const details = encodeURIComponent(event.description || "");
    const location = encodeURIComponent(event.location || "");

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const start = formatDate(event.start);
    const end = formatDate(event.end);

    // Use action=TOKEN to get an edit link (limited functionality)
    const url = `https://calendar.google.com/calendar/render?action=EDIT&text=${title}&details=${details}&location=${location}&dates=${start}/${end}`;

    window.open(url, "_blank");
    setShowMenu(false);
  };

  // Copy event details to clipboard for manual entry
  const handleCopyEventDetails = (e) => {
    e.stopPropagation();
    if (!event) return;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const details = `
Event: ${event.title}
Date: ${formatDate(event.start)} - ${formatDate(event.end)}
Location: ${event.location || "Not specified"}
Description: ${event.description || "Not specified"}

Edit/Delete in Google Calendar:
1. Open Google Calendar
2. Find this event
3. Click on the event to edit or delete

Alternatively, click "Open in Google Calendar" to open a pre-filled form.
    `.trim();

    navigator.clipboard.writeText(details);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setShowMenu(false);
  };

  if (small) {
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-slate-700 transition-all duration-200"
          title="Google Calendar Options"
        >
          <SiGooglecalendar className="w-4 h-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
            <button
              onClick={handleAddToCalendar}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Add to Calendar</span>
            </button>
            <button
              onClick={handleViewInGoogleCalendar}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit in Google</span>
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event);
                  setShowMenu(false);
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Event</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleAddToCalendar}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
      >
        <SiGooglecalendar className="w-5 h-5 text-blue-500" />
        <span>Add to Google Calendar</span>
      </button>

      {/* Dropdown menu for additional options */}
      <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Google Calendar Options
          </p>
        </div>
        <button
          onClick={handleAddToCalendar}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Add to Calendar</span>
        </button>
        <button
          onClick={handleViewInGoogleCalendar}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit in Google Calendar</span>
        </button>
        <button
          onClick={handleCopyEventDetails}
          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4" />
              <span>Copy Details</span>
            </>
          )}
        </button>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Event</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AddToGoogleCalendarButton;

