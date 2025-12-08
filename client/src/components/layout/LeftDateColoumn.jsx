import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const LeftDateColoumn = ({ darkMode, events, setEvents }) => {
  const [date, setDate] = useState(new Date());

  // Custom navigation icons
  const formatShortWeekday = (locale, date) => {
    return date.toLocaleDateString(locale, { weekday: "narrow" });
  };

  return (
    <div
      className={`h-full w-80 border-r p-6 hidden xl:block overflow-y-auto transition-colors duration-300 ${
        darkMode
          ? "bg-slate-900/50 border-slate-800"
          : "bg-white/50 border-gray-200"
      }`}
    >
      <div className="mb-8">
        <h2
          className={`text-xl font-bold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Calendar
        </h2>

        <div
          className={`rounded-2xl p-4 shadow-lg border ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-100"
          }`}
        >
          <style>{`
            .react-calendar {
              background: transparent;
              border: none;
              width: 100%;
              font-family: inherit;
            }
            .react-calendar__navigation {
              margin-bottom: 1rem;
            }
            .react-calendar__navigation button {
              color: ${darkMode ? "#fff" : "#111827"};
              min-width: 30px;
              background: none;
              font-size: 1rem;
              font-weight: 600;
            }
            .react-calendar__navigation button:enabled:hover,
            .react-calendar__navigation button:enabled:focus {
              background-color: ${darkMode ? "#334155" : "#f3f4f6"};
              border-radius: 8px;
            }
            .react-calendar__month-view__weekdays {
              text-transform: uppercase;
              font-weight: 600;
              font-size: 0.75rem;
              color: ${darkMode ? "#94a3b8" : "#6b7280"};
            }
            .react-calendar__month-view__days__day {
              color: ${darkMode ? "#e2e8f0" : "#374151"};
              font-weight: 500;
            }
            .react-calendar__tile:enabled:hover,
            .react-calendar__tile:enabled:focus {
              background-color: ${darkMode ? "#334155" : "#f3f4f6"};
              border-radius: 8px;
              color: ${darkMode ? "#fff" : "#111827"};
            }
            .react-calendar__tile--now {
              background: transparent;
              color: #3b82f6;
              font-weight: bold;
            }
            .react-calendar__tile--now:enabled:hover,
            .react-calendar__tile--now:enabled:focus {
              background: ${darkMode ? "#334155" : "#f3f4f6"};
              color: #2563eb;
            }
            .react-calendar__tile--active {
              background: #3b82f6 !important;
              color: white !important;
              border-radius: 8px;
            }
          `}</style>

          <Calendar
            onChange={setDate}
            value={date}
            prevLabel={<FiChevronLeft className="w-5 h-5" />}
            nextLabel={<FiChevronRight className="w-5 h-5" />}
            formatShortWeekday={formatShortWeekday}
          />
        </div>
      </div>

      <div>
        <h3
          className={`text-lg font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Upcoming Events
        </h3>

        <div className="space-y-3">
          {events && events.length > 0 ? (
            events
              .filter((e) => new Date(e.start) >= new Date())
              .sort((a, b) => new Date(a.start) - new Date(b.start))
              .slice(0, 5)
              .map((event, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-1 h-8 rounded-full ${
                        event.category === "Class"
                          ? "bg-blue-500"
                          : event.category === "Assignment"
                          ? "bg-green-500"
                          : event.category === "Meeting"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-medium truncate ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {new Date(event.start).toLocaleDateString()} •{" "}
                        {new Date(event.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div
              className={`text-center py-8 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <p className="text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftDateColoumn;
