import React, { useState } from "react";
import { useLists } from "../context/DataContext";

const LocationSafetyCheck = ({ language, isMobile }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [safetyResult, setSafetyResult] = useState(null);
  const { historical, cities } = useLists();

  const texts = {
    en: {
      checkSafety: "Check Current Location Safety",
      checkingSafety: "เช็คว่าปัจจุบันปลอดภัยไหม",
      checking: "Checking your location...",
      locationDenied:
        "Location access denied. Please enable location services.",
      locationError: "Unable to get your location. Please try again.",
      safetyResult: "Safety Status",
      currentLocation: "Current Location",
      recentAlerts: "Recent Alerts (3 hours)",
      historicalAlerts: "Historical Alerts",
      riskLevel: "Risk Level",
      safe: "SAFE",
      lowRisk: "LOW RISK",
      moderateRisk: "MODERATE RISK",
      highRisk: "HIGH RISK",
      veryHighRisk: "VERY HIGH RISK",
      noAlertsNearby: "No alerts in your area",
      alertsFound: "alerts found nearby",
      distance: "Distance",
      timeAgo: "ago",
      close: "Close",
      tryAgain: "Try Again",
      safeMessage:
        "Your current location appears to be safe with no recent alerts nearby.",
      riskMessage:
        "There have been alerts in your area. Stay alert and follow safety protocols.",
    },
    th: {
      checkSafety: "เช็คความปลอดภัยตำแหน่งปัจจุบัน",
      checkingSafety: "เช็คว่าปัจจุบันปลอดภัยไหม",
      checking: "กำลังตรวจสอบตำแหน่งของคุณ...",
      locationDenied: "ไม่อนุญาตให้เข้าถึงตำแหน่ง กรุณาเปิดใช้งานบริการตำแหน่ง",
      locationError: "ไม่สามารถรับตำแหน่งของคุณได้ กรุณาลองใหม่อีกครั้ง",
      safetyResult: "สถานะความปลอดภัย",
      currentLocation: "ตำแหน่งปัจจุบัน",
      recentAlerts: "การแจ้งเตือนล่าสุด (3 ชั่วโมง)",
      historicalAlerts: "การแจ้งเตือนในอดีต",
      riskLevel: "ระดับความเสี่ยง",
      safe: "ปลอดภัย",
      lowRisk: "เสี่ยงต่ำ",
      moderateRisk: "เสี่ยงปานกลาง",
      highRisk: "เสี่ยงสูง",
      veryHighRisk: "เสี่ยงสูงมาก",
      noAlertsNearby: "ไม่มีการแจ้งเตือนในพื้นที่ของคุณ",
      alertsFound: "พบการแจ้งเตือนใกล้เคียง",
      distance: "ระยะทาง",
      timeAgo: "ที่แล้ว",
      close: "ปิด",
      tryAgain: "ลองใหม่",
      safeMessage:
        "ตำแหน่งปัจจุบันของคุณดูเหมือนจะปลอดภัย ไม่มีการแจ้งเตือนล่าสุดในบริเวณใกล้เคียง",
      riskMessage:
        "มีการแจ้งเตือนในพื้นที่ของคุณ โปรดระมัดระวังและปฏิบัติตามขั้นตอนความปลอดภัย",
    },
  };

  const currentTexts = texts[language];

  // Function to log location data to MongoDB
  const logLocationToDatabase = async (latitude, longitude, safetyResult) => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
      const response = await fetch(`${API_BASE_URL}/api/log-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          safetyResult,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Location logged successfully:", result);
      return result;
    } catch (error) {
      console.error("Error logging location to database:", error);
      throw error;
    }
  };

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Function to translate Hebrew city names to English
  const translateCityName = (hebrewName) => {
    if (!cities) return hebrewName;
    const cityEntry = Object.values(cities).find(
      (city) => city.he === hebrewName
    );
    return cityEntry ? cityEntry.en : hebrewName;
  };

  // Function to analyze safety based on location
  const analyzeSafety = (userLat, userLon) => {
    if (!historical || !cities) return null;

    const now = Math.floor(Date.now() / 1000);
    const threeHoursAgo = now - 3 * 60 * 60;
    const nearbyAlerts = [];
    const recentNearbyAlerts = [];

    // Check all alerts and find nearby ones
    historical.forEach((alert) => {
      const alertCities = alert[2];
      alertCities.forEach((cityName) => {
        const cityData = Object.values(cities).find(
          (city) => city.he === cityName
        );
        if (cityData) {
          const distance = calculateDistance(
            userLat,
            userLon,
            cityData.lat,
            cityData.lng
          );
          if (distance <= 20) {
            // Within 20km radius
            nearbyAlerts.push({
              ...alert,
              cityName: translateCityName(cityName),
              distance: distance,
              isRecent: alert[3] >= threeHoursAgo,
            });
            if (alert[3] >= threeHoursAgo) {
              recentNearbyAlerts.push({
                ...alert,
                cityName: translateCityName(cityName),
                distance: distance,
              });
            }
          }
        }
      });
    });

    // Determine risk level
    let riskLevel = "safe";
    let riskColor = "#16a34a";

    if (recentNearbyAlerts.length > 0) {
      if (recentNearbyAlerts.length >= 5) {
        riskLevel = "veryHighRisk";
        riskColor = "#dc2626";
      } else if (recentNearbyAlerts.length >= 3) {
        riskLevel = "highRisk";
        riskColor = "#ea580c";
      } else {
        riskLevel = "moderateRisk";
        riskColor = "#d97706";
      }
    } else if (nearbyAlerts.length > 10) {
      riskLevel = "lowRisk";
      riskColor = "#65a30d";
    }

    return {
      riskLevel,
      riskColor,
      recentAlerts: recentNearbyAlerts.slice(0, 5),
      historicalCount: nearbyAlerts.length,
      recentCount: recentNearbyAlerts.length,
    };
  };

  const checkCurrentLocation = () => {
    setIsChecking(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      setIsChecking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const safety = analyzeSafety(latitude, longitude);
        setSafetyResult(safety);
        setShowResult(true);
        setIsChecking(false);

        // Log the location data to MongoDB
        try {
          await logLocationToDatabase(latitude, longitude, safety);
        } catch (error) {
          console.error("Failed to log location:", error);
          // Don't show error to user, just log it
        }
      },
      (error) => {
        let errorMessage = currentTexts.locationError;
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = currentTexts.locationDenied;
        }
        alert(errorMessage);
        setIsChecking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const diffMinutes = Math.floor((now - timestamp) / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) {
      return language === "th" ? "เมื่อสักครู่" : "just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${
        language === "th" ? "นาทีที่แล้ว" : "minutes ago"
      }`;
    } else {
      return `${diffHours} ${
        language === "th" ? "ชั่วโมงที่แล้ว" : "hours ago"
      }`;
    }
  };

  return (
    <>
      {/* Check Safety Button */}
      <button
        onClick={checkCurrentLocation}
        disabled={isChecking}
        style={{
          position: "fixed",
          top: isMobile ? "80px" : "90px", // Adjust for mobile
          left: "50%",
          transform: "translateX(-50%)", // Center horizontally
          backgroundColor: isChecking ? "#9ca3af" : "#dc2626",
          color: "white",
          border: "none",
          borderRadius: isMobile ? "20px" : "25px",
          padding: isMobile ? "10px 16px" : "12px 20px",
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "bold",
          cursor: isChecking ? "not-allowed" : "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.3s ease",
          fontFamily: "DB HelvethaicaX, Arial, sans-serif",
          whiteSpace: "nowrap",
          maxWidth: isMobile ? "90vw" : "auto",
        }}
      >
        {isChecking ? "🔄" : "📍"}
        {isChecking ? currentTexts.checking : currentTexts.checkingSafety}
      </button>

      {/* Safety Result Popup */}
      {showResult && safetyResult && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px",
          }}
          onClick={() => setShowResult(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: isMobile ? "16px" : "12px",
              padding: isMobile ? "20px" : "24px",
              maxWidth: isMobile ? "95vw" : "500px",
              width: "100%",
              maxHeight: isMobile ? "90vh" : "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              fontFamily: "DB HelvethaicaX, Arial, sans-serif",
              margin: isMobile ? "10px" : "0",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  color: "#1f2937",
                  fontSize: "20px",
                }}
              >
                {currentTexts.safetyResult}
              </h2>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: safetyResult.riskColor,
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                {currentTexts[safetyResult.riskLevel]}
              </div>
            </div>

            {/* Safety Message */}
            <div
              style={{
                backgroundColor:
                  safetyResult.riskLevel === "safe" ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${
                  safetyResult.riskLevel === "safe" ? "#bbf7d0" : "#fecaca"
                }`,
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.5" }}>
                {safetyResult.riskLevel === "safe"
                  ? currentTexts.safeMessage
                  : currentTexts.riskMessage}
              </p>
            </div>

            {/* Recent Alerts */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#1f2937",
                }}
              >
                {currentTexts.recentAlerts}
              </h3>
              {safetyResult.recentAlerts.length > 0 ? (
                <div>
                  {safetyResult.recentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        padding: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          marginBottom: "4px",
                        }}
                      >
                        {alert.cityName}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {currentTexts.distance}: {alert.distance.toFixed(1)}km •{" "}
                        {formatTimeAgo(alert[3])}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#16a34a", fontSize: "14px" }}>
                  {currentTexts.noAlertsNearby}
                </div>
              )}
            </div>

            {/* Historical Summary */}
            <div style={{ marginBottom: "20px" }}>
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#1f2937",
                }}
              >
                {currentTexts.historicalAlerts}
              </h3>
              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                {safetyResult.historicalCount} {currentTexts.alertsFound} (20km
                radius)
              </div>
            </div>

            {/* Close Button */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowResult(false)}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                {currentTexts.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationSafetyCheck;
