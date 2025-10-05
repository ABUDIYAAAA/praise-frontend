import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Linkedin, Twitter, Share2 } from "lucide-react";

const BadgeCelebration = ({
  badges,
  isOpen,
  onClose,
  userStats,
  repository,
}) => {
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  useEffect(() => {
    if (isOpen && badges.length > 0) {
      // Launch confetti celebration
      launchConfetti();

      // If multiple badges, show them sequentially
      if (badges.length > 1) {
        const timer = setInterval(() => {
          setCurrentBadgeIndex((prev) => {
            if (prev < badges.length - 1) {
              launchConfetti(); // Confetti for each badge
              return prev + 1;
            } else {
              clearInterval(timer);
              return prev;
            }
          });
        }, 3000); // Show each badge for 3 seconds

        return () => clearInterval(timer);
      }
    }
  }, [isOpen, badges]);

  const launchConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Launch from multiple points
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  const generateLinkedInPost = (badge) => {
    const text = `🎉 Just earned the "${badge.name}" badge on ${repository?.name}! 
    
${badge.description}

${userStats?.totalPRs} Pull Requests • ${userStats?.mergedPRs} Merged • ${userStats?.totalCommits} Commits

Building in public and celebrating every milestone! 💪

#GitHub #OpenSource #Development #Achievement`;

    return encodeURIComponent(text);
  };

  const shareToLinkedIn = (badge) => {
    const text = generateLinkedInPost(badge);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      window.location.origin
    )}&text=${text}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToTwitter = (badge) => {
    const text = `🎉 Just earned the "${badge.name}" badge! ${badge.description} 
    
${userStats?.totalPRs} PRs • ${userStats?.mergedPRs} merged • ${userStats?.totalCommits} commits
    
#GitHub #Achievement #BuildInPublic`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = async (badge) => {
    const text = `🎉 Just earned the "${badge.name}" badge on ${repository?.name}!

${badge.description}

${userStats?.totalPRs} Pull Requests • ${userStats?.mergedPRs} Merged • ${userStats?.totalCommits} Commits

Building in public! 💪`;

    try {
      await navigator.clipboard.writeText(text);
      // You could show a toast here
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  if (!isOpen || !badges || badges.length === 0) return null;

  const currentBadge = badges[currentBadgeIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Blurred Background */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(10px)" }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: -180 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative z-10 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-8 max-w-lg mx-4 text-white shadow-2xl border border-purple-500/30"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Badge Count Indicator */}
            {badges.length > 1 && (
              <div className="absolute top-4 left-4 bg-white/20 rounded-full px-3 py-1 text-sm">
                {currentBadgeIndex + 1} of {badges.length}
              </div>
            )}

            {/* Celebration Content */}
            <div className="text-center pt-4">
              <motion.div
                key={currentBadgeIndex}
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Celebration Header */}
                <h1 className="text-4xl font-bold mb-2">
                  🎉 Congratulations! 🎉
                </h1>
                <p className="text-xl text-purple-200 mb-6">
                  You've earned a new badge!
                </p>

                {/* Badge Display */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20"
                >
                  <div className="text-6xl mb-4">{currentBadge.icon}</div>
                  <h2 className="text-2xl font-bold mb-2">
                    {currentBadge.name}
                  </h2>
                  <p className="text-purple-200 mb-4">
                    {currentBadge.description}
                  </p>

                  {/* Stats Display */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 rounded-lg p-4">
                    <div>
                      <div className="text-purple-300">Requirement</div>
                      <div className="font-bold">
                        {currentBadge.criteriaValue} {currentBadge.criteriaType}
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-300">Your Achievement</div>
                      <div className="font-bold text-green-400">
                        {currentBadge.actualValue} {currentBadge.criteriaType}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* User Stats Overview */}
                <div className="bg-white/10 rounded-xl p-4 mb-6 text-sm">
                  <h3 className="font-semibold mb-3">
                    Your Contributions to {repository?.name}
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {userStats?.totalPRs || 0}
                      </div>
                      <div className="text-gray-300">Total PRs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {userStats?.mergedPRs || 0}
                      </div>
                      <div className="text-gray-300">Merged</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {userStats?.totalCommits || 0}
                      </div>
                      <div className="text-gray-300">Commits</div>
                    </div>
                  </div>
                </div>

                {/* Sharing Buttons */}
                <div className="flex justify-center gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToLinkedIn(currentBadge)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => shareToTwitter(currentBadge)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(currentBadge)}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Copy
                  </motion.button>
                </div>

                {/* Continue Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-xl font-semibold transition-all"
                >
                  {badges.length > 1 && currentBadgeIndex < badges.length - 1
                    ? "Next Badge"
                    : "Continue"}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeCelebration;
