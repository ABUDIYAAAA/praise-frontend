import React from "react";
import AutoCarousel from "../Components/Carousel";
import Glow from "../Components/Glow";
import FloatingBits from "../Components/FloatingBits";

const Signup = () => {
  // Replace with your actual GitHub OAuth URL
  const githubAuthUrl =
    "https</svg>://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID";

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <Glow />
      <FloatingBits />
      <div className="bg-gray-100 rounded-xl shadow-lg flex flex-col md:flex-row w-[90%] max-w-4xl overflow-hidden relative z-10">
        {/* Left Section - GitHub Signup Only */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-6">Welcome to PRaise!</h2>
          {/* GitHub Signup Button */}
          <a
            href={githubAuthUrl}
            className="w-1/2 h-1/2 flex flex-col items-center justify-center bg-gray-900 text-white py-2 rounded-md font-medium hover:bg-gray-800 transition mb-2"
          >
            <svg
              className="w-10 h-10 mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Sign up with GitHub
          </a>
        </div>
        {/* Right Section - Carousel */}
        <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-gray-100">
          <AutoCarousel />
        </div>
      </div>
    </div>
  );
};

export default Signup;
