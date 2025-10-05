import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5175";

const useBadgeProgress = (repositoryId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [badgeProgress, setBadgeProgress] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [prActivity, setPrActivity] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [chartData, setChartData] = useState(null);

  const fetchBadgeProgress = async () => {
    if (!repositoryId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/badges/repository/${repositoryId}/progress`,
        {
          withCredentials: true,
        }
      );

      const data = response.data.data;
      setBadgeProgress(data.badgeProgress || []);
      setUserStats(data.userStats || null);
      setPrActivity(data.prActivity || []);
      setUserRole(data.userRole || null);
      setChartData(data.chartData || null);
    } catch (err) {
      console.error("Error fetching badge progress:", err);
      setError(err.response?.data?.message || "Failed to fetch badge progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadgeProgress();
  }, [repositoryId]);

  return {
    loading,
    error,
    badgeProgress,
    userStats,
    prActivity,
    userRole,
    chartData,
    refetch: fetchBadgeProgress,
  };
};

export default useBadgeProgress;
