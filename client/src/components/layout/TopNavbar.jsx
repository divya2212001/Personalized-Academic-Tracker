import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBell, FiMoon, FiSun } from "react-icons/fi";
import { FaUserCircle, FaSignOutAlt, FaUserCog, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchDropdown from "./SearchDropdown";
import EventDetailModal from "../ui/EventDetailModal";
import NotificationPanel from "./NotificationPanel";
import api from "../../utils/api";

function TopNavbar({ darkMode, setDarkMode, events, refreshEvents }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          sessionStorage.getItem("authToken");
        const userData =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        if (token && userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch notification count (mock for now)
      setNotificationCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchValue]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      // Client side search for now
      if (events) {
        const term = searchValue.toLowerCase();
        const results = events.filter(
          (e) =>
            e.title.toLowerCase().includes(term) ||
            e.description?.toLowerCase().includes(term) ||
            e.category?.toLowerCase().includes(term)
        );
        setSearchResults(results);
        setShowSearchDropdown(true);
      }
    } catch (error) {
      console.error(error);
      setHasSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("tokenExpiry");
    setUser(null);
    setShowDropdown(false);
    navigate("/signin");
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    setShowSearchDropdown(false);
  };

  const handleEditEvent = async (updatedEvent) => {
    try {
      const eventId = updatedEvent._id || updatedEvent.id;
      await api.put(`/api/events/${eventId}`, updatedEvent);
      if (refreshEvents) await refreshEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteEvent = async (event) => {
    try {
      const eventId = event._id || event.id;
      await api.delete(`/api/events/${eventId}`);
      if (refreshEvents) await refreshEvents();
      setShowEventModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-slate-900/95 border-slate-700/50"
            : "bg-white/95 border-gray-200/50"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex-1 max-w-md relative">
            <div
              className={`relative flex items-center rounded-2xl transition-all duration-200 ${
                darkMode
                  ? "bg-slate-800/50 border border-slate-700/50"
                  : "bg-gray-50 border border-gray-200/50"
              }`}
            >
              <FiSearch
                className={`absolute left-4 w-5 h-5 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search events..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-transparent rounded-2xl outline-none transition-all duration-200 ${
                  darkMode
                    ? "text-white placeholder-gray-400"
                    : "text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
            <SearchDropdown
              isOpen={showSearchDropdown}
              searchResults={searchResults}
              searchQuery={searchValue}
              darkMode={darkMode}
              onEventClick={handleEventClick}
              onClose={() => setShowSearchDropdown(false)}
              isSearching={isSearching}
              hasError={hasSearchError}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`p-3 rounded-2xl transition-all duration-200 ${
                darkMode
                  ? "bg-slate-800/50 text-yellow-400"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {darkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>

            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotificationPanel((prev) => !prev)}
                  className={`relative p-3 rounded-2xl transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-800/50 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FiBell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>
                <NotificationPanel
                  isOpen={showNotificationPanel}
                  onClose={() => setShowNotificationPanel(false)}
                  darkMode={darkMode}
                />
              </div>
            )}

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className={`flex items-center space-x-3 p-2 rounded-2xl transition-all duration-200 ${
                    darkMode ? "bg-slate-800/50" : "bg-gray-100"
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaUserCircle className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`font-medium text-sm max-w-[120px] truncate ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.firstName || user.email}
                  </span>
                </button>
                {showDropdown && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-64 rounded-2xl shadow-2xl border backdrop-blur-xl z-50 ${
                      darkMode
                        ? "bg-slate-800/95 border-slate-700/50"
                        : "bg-white/95 border-gray-200/50"
                    }`}
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/settings");
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode
                            ? "text-gray-300 hover:bg-slate-700/50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FaUserCog className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          darkMode
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <FaSignOutAlt className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/signin")}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        darkMode={darkMode}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </>
  );
}

export default TopNavbar;
