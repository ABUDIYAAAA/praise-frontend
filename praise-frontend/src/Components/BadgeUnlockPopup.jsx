import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { X, Award, Star, Trophy } from "lucide-react";

const BadgeUnlockPopup = ({ badges = [], onClose, onComplete }) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentBadge = badges[currentBadgeIndex];
  const hasMoreBadges = currentBadgeIndex < badges.length - 1;

  // Fire confetti effect
  const fireConfetti = () => {
    const colors = ["#FFD700", "#FF6B35", "#32CD32", "#8A2BE2", "#FF1493"];

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      shapes: ["star", "circle"],
      gravity: 0.8,
      drift: 0.1,
    });

    // Additional burst from different angles
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });
    }, 400);
  };

  // Show the popup with animation
  useEffect(() => {
    if (badges.length > 0 && currentBadge) {
      setIsVisible(true);
      setIsAnimating(true);

      // Fire confetti for the first badge
      if (currentBadgeIndex === 0) {
        setTimeout(() => {
          fireConfetti();
        }, 300);
      }

      // Remove animation class after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  }, [currentBadgeIndex, currentBadge, badges.length]);

  // Handle showing next badge
  const handleNext = () => {
    if (hasMoreBadges) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentBadgeIndex((prev) => prev + 1);
      }, 200);
    } else {
      handleClose();
    }
  };

  // Handle closing popup
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentBadgeIndex(0);
      if (onClose) onClose();
      if (onComplete) onComplete();
    }, 300);
  };

  // Handle outside click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  if (!currentBadge || badges.length === 0) return null;

  // Get badge icon based on criteria type or use provided icon
  const getBadgeIcon = (badge) => {
    if (badge.icon && badge.icon !== "🏆") {
      return badge.icon;
    }

    switch (badge.criteriaType) {
      case "prs":
        return "🚀";
      case "commits":
        return "💻";
      case "issues":
        return "🐛";
      case "reviews":
        return "👀";
      default:
        return "🏆";
    }
  };

  // Get difficulty-based styling
  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "from-green-400 to-emerald-600 border-green-300";
      case "medium":
        return "from-blue-400 to-blue-600 border-blue-300";
      case "hard":
        return "from-purple-400 to-purple-600 border-purple-300";
      case "legendary":
        return "from-yellow-400 via-orange-500 to-red-500 border-yellow-300";
      default:
        return "from-gray-400 to-gray-600 border-gray-300";
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        bg-black bg-opacity-60 backdrop-blur-sm
        transition-all duration-300 ease-out
        ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4
          transform transition-all duration-500 ease-out
          ${
            isAnimating
              ? "scale-95 opacity-80"
              : isVisible
              ? "scale-100 opacity-100"
              : "scale-90 opacity-0"
          }
        `}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Badge content */}
        <div className="p-8 text-center">
          {/* Badge unlock title */}
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-800">
                Badge Unlocked!
              </h2>
            </div>
            {hasMoreBadges && (
              <p className="text-sm text-gray-500">
                {currentBadgeIndex + 1} of {badges.length} badges
              </p>
            )}
          </div>

          {/* Badge display */}
          <div className="mb-6">
            <div
              className={`
                inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl
                bg-gradient-to-br ${getDifficultyStyle(currentBadge.difficulty)}
                border-4 shadow-lg mb-4
                transform transition-transform duration-300 hover:scale-105
              `}
            >
              {getBadgeIcon(currentBadge)}
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {currentBadge.name}
            </h3>

            <p className="text-gray-600 mb-4">{currentBadge.description}</p>

            {/* Badge criteria info */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              {currentBadge.actualValue} {currentBadge.criteriaType} completed
            </div>

            {/* Difficulty badge */}
            <div className="mt-3">
              <span
                className={`
                  inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide
                  ${
                    currentBadge.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : currentBadge.difficulty === "medium"
                      ? "bg-blue-100 text-blue-800"
                      : currentBadge.difficulty === "hard"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800"
                  }
                `}
              >
                {currentBadge.difficulty}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {hasMoreBadges ? (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Next Badge →
                </button>
              </>
            ) : (
              <button
                onClick={handleClose}
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-lg"
              >
                Awesome! 🎉
              </button>
            )}
          </div>
        </div>

        {/* Animated background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-50 animate-pulse"></div>
          <div className="absolute -top-2 -right-6 w-4 h-4 bg-blue-200 rounded-full opacity-40 animate-pulse animation-delay-300"></div>
          <div className="absolute -bottom-3 -left-2 w-6 h-6 bg-purple-200 rounded-full opacity-30 animate-pulse animation-delay-700"></div>
          <div className="absolute -bottom-4 -right-4 w-5 h-5 bg-green-200 rounded-full opacity-45 animate-pulse animation-delay-500"></div>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockPopup;
