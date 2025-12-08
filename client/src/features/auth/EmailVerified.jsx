import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const EmailVerified = ({ darkMode }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const success = searchParams.get("success");
    const msg = searchParams.get("message");

    if (success === "true") {
      setStatus("success");
      setMessage(msg || "Your email has been successfully verified.");
    } else {
      setStatus("error");
      setMessage(
        msg || "Email verification failed. The link may be invalid or expired."
      );
    }
  }, [searchParams]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        darkMode
          ? "bg-[#18181b] text-white"
          : "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl text-center transition-colors duration-300 ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        }`}
      >
        <div className="mb-6 flex justify-center">
          {status === "success" ? (
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold mb-4">
          {status === "success" ? "Email Verified!" : "Verification Failed"}
        </h1>

        <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {message}
        </p>

        <button
          onClick={() => navigate("/signin")}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center space-x-2"
        >
          <span>Continue to Sign In</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
