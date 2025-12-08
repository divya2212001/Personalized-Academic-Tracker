import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./features/auth/Signup.jsx";
import Signin from "./features/auth/Signin.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Landing from "./pages/Landing.jsx";
import EmailVerified from "./features/auth/EmailVerified.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route
          path="/landing"
          element={<Landing darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/*"
          element={<MainLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/signup"
          element={<Signup darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/signin"
          element={<Signin darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route path="/email-verified/:token" element={<EmailVerified />} />
      </Routes>
    </Router>
  );
}

export default App;
