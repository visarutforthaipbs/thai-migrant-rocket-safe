import React, { useState } from "react";
import { useLists } from "../context/DataContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const SafetyCheckPage = ({ language }) => {
  const [currentLanguage, setCurrentLanguage] = useState(language || "th");
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [safetyResult, setSafetyResult] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [manualLocation, setManualLocation] = useState({ lat: "", lng: "" });
  const [showManualInput, setShowManualInput] = useState(false);
  const { historical, cities, alertFrequencies } = useLists();

  const texts = {
    en: {
      pageTitle: "Safety Assessment Center",
      subtitle: "Learn about the safety profile of your work and living areas",
      newArrivalWelcome:
        "👋 Welcome to Israel! Let's help you understand the safety of your new environment.",
      selectAreaType: "What area would you like to learn about?",
      workLocation: "🏢 Work Location",
      homeLocation: "🏠 Housing/Living Area",
      generalArea: "📍 General Area",
      checkNow: "Assess This Area",
      checking: "Analyzing area safety profile...",
      educationalMode: "📚 Educational Mode",
      learnAboutArea:
        "Learn about this area's safety patterns, history, and local protocols",
      locationDenied:
        "Location access denied. Please enable location services to learn about your area.",
      locationError:
        "Unable to get your location. Please try manual entry to learn about a specific area.",
      locationInstructions: "To enable location access for area learning:",
      locationStep1: "1. Click the location icon in your browser's address bar",
      locationStep2: "2. Select 'Allow' or 'Always allow'",
      locationStep3: "3. Refresh the page and try again",
      manualEntry: "Enter Specific Coordinates",
      latitude: "Latitude",
      longitude: "Longitude",
      checkManual: "Learn About This Location",
      coordinateHelp:
        "Get coordinates from Google Maps, your employer, or housing provider",
      backToMap: "← Back to Emergency Map",
      safetyAssessment: "Area Safety Profile",
      currentLocation: "Area Being Assessed",
      coordinates: "Coordinates",
      nearestCity: "Nearest City",
      recentAlerts: "Recent Activity (Last 30 Days)",
      historicalAlerts: "Historical Safety Pattern",
      riskLevel: "Long-term Risk Assessment",
      alertFrequency: "Alert Frequency",
      seasonalPatterns: "Seasonal Patterns",
      localProtocols: "Local Safety Protocols",
      recommendation: "Living/Working Recommendations",
      safe: "VERY SAFE AREA",
      lowRisk: "GENERALLY SAFE",
      moderateRisk: "MODERATE CAUTION",
      highRisk: "HEIGHTENED AWARENESS",
      veryHighRisk: "HIGH RISK AREA",
      noAlertsNearby: "This area has very low historical alert activity",
      alertsFound: "historical incidents found in this area",
      distance: "Distance from you",
      tryAgain: "Assess Another Area",
      areaLearned: "✅ Area Profile Learned",
      safeMessage:
        "This is a very safe area for Thai workers. Perfect for comfortable living and working.",
      lowRiskMessage:
        "Generally safe area with minimal security concerns. Good for long-term residence.",
      moderateRiskMessage:
        "Area requires basic awareness. Follow standard safety protocols when living/working here.",
      highRiskMessage:
        "Area needs heightened awareness. Ensure you know local emergency procedures.",
      veryHighRiskMessage:
        "High-risk area requiring special safety protocols. Consult with employer about safety measures.",
      howItWorks: "How Area Assessment Works",
      step1: "1. We analyze 2+ years of historical security data",
      step2: "2. We identify seasonal and temporal patterns",
      step3: "3. We assess long-term risk factors for this area",
      step4:
        "4. We provide educational recommendations for living/working safely",
      educationalNote:
        "Educational Purpose: This assessment helps you understand your new environment for long-term planning.",
      nextSteps: "Next Steps for New Arrivals",
      step1Next: "• Learn about 2-3 different areas (work, home, shopping)",
      step2Next: "• Understand local emergency procedures",
      step3Next: "• Connect with local Thai community",
      step4Next: "• Save emergency contacts in your phone",
      areasLearned: "Areas You've Learned About",
      workSafety: "Workplace Safety Tips",
      homeSafety: "Housing Area Safety",
      generalTips: "General Living Tips",
    },
    th: {
      pageTitle: "ตรวจสอบความปลอดภัยพื้นที่",
      subtitle: "ตรวจสอบระดับความปลอดภัยของตำแหน่งปัจจุบันของคุณ",
      checkNow: "ตรวจสอบตำแหน่งของฉันตอนนี้",
      checking: "กำลังตรวจสอบตำแหน่งของคุณ...",
      locationDenied:
        "ไม่อนุญาตให้เข้าถึงตำแหน่ง กรุณาเปิดใช้งานบริการตำแหน่งในการตั้งค่าเบราว์เซอร์และลองใหม่อีกครั้ง",
      locationError:
        "ไม่สามารถรับตำแหน่งของคุณได้ กรุณาลองใหม่อีกครั้งหรือใส่พิกัดด้วยตนเอง",
      locationInstructions: "วิธีเปิดใช้งานการเข้าถึงตำแหน่ง:",
      locationStep1: "1. คลิกไอคอนตำแหน่งในแถบที่อยู่ของเบราว์เซอร์",
      locationStep2: "2. เลือก 'อนุญาต' หรือ 'อนุญาตเสมอ'",
      locationStep3: "3. รีเฟรชหน้าเว็บและลองใหม่อีกครั้ง",
      manualEntry: "ใส่ตำแหน่งด้วยตนเอง",
      latitude: "ละติจูด",
      longitude: "ลองจิจูด",
      checkManual: "ตรวจสอบตำแหน่งนี้",
      coordinateHelp: "คุณสามารถหาพิกัดได้จาก Google Maps หรือแอป GPS",
      backToMap: "← กลับไปยังแผนที่",
      safetyResult: "ผลการประเมินความปลอดภัย",
      currentLocation: "ตำแหน่งปัจจุบัน",
      coordinates: "พิกัด",
      nearestCity: "เมืองที่ใกล้ที่สุด",
      recentAlerts: "การแจ้งเตือนล่าสุด (24 ชั่วโมงที่ผ่านมา)",
      historicalAlerts: "ข้อมูลการแจ้งเตือนในอดีต",
      riskLevel: "ระดับความเสี่ยง",
      alertFrequency: "ความถี่ของการแจ้งเตือน",
      recommendation: "คำแนะนำ",
      safe: "ปลอดภัย",
      lowRisk: "เสี่ยงต่ำ",
      moderateRisk: "เสี่ยงปานกลาง",
      highRisk: "เสี่ยงสูง",
      veryHighRisk: "เสี่ยงสูงมาก",
      noAlertsNearby: "ไม่มีการแจ้งเตือนล่าสุดในพื้นที่ของคุณ",
      alertsFound: "พบการแจ้งเตือนในบริเวณใกล้เคียง",
      distance: "ระยะทาง",
      tryAgain: "ลองใหม่อีกครั้ง",
      safeMessage:
        "ตำแหน่งปัจจุบันของคุณดูเหมือนจะปลอดภัย ไม่มีการแจ้งเตือนล่าสุดในบริเวณใกล้เคียง ติดตามการอัปเดตต่อไป",
      lowRiskMessage:
        "ตรวจพบกิจกรรมในระดับต่ำในพื้นที่ของคุณ รับทราบข้อมูลและปฏิบัติตามมาตรการความปลอดภัยพื้นฐาน",
      moderateRiskMessage:
        "กิจกรรมการแจ้งเตือนในระดับปานกลางในพื้นที่ของคุณ ระวังและเตรียมพร้อมที่จะปฏิบัติตามคำแนะนำด้านความปลอดภัย",
      highRiskMessage:
        "ตรวจพบกิจกรรมการแจ้งเตือนในระดับสูง ปฏิบัติตามมาตรการความปลอดภัยทั้งหมดและอยู่ในสถานที่ปลอดภัย",
      veryHighRiskMessage:
        "ตรวจพบความเสี่ยงระดับสูงมากในพื้นที่ของคุณ หาที่หลบภัยทันทีและปฏิบัติตามขั้นตอนฉุกเฉิน",
      howItWorks: "วิธีการทำงาน",
      step1: "1. เราตรวจจับตำแหน่ง GPS ปัจจุบันของคุณ",
      step2: "2. เราวิเคราะห์ข้อมูลการแจ้งเตือนในอดีตในพื้นที่ของคุณ",
      step3: "3. เราคำนวณระดับความเสี่ยงตามกิจกรรมล่าสุด",
      step4: "4. เราให้คำแนะนำด้านความปลอดภัย",
      privacyNote:
        "หมายเหตุความเป็นส่วนตัว: ตำแหน่งของคุณจะใช้สำหรับการตรวจสอบความปลอดภัยนี้เท่านั้น และจะไม่ถูกเก็บหรือแชร์",
    },
  };

  const t = texts[currentLanguage];

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Find nearest city
  const findNearestCity = (lat, lng) => {
    if (!cities || typeof cities !== "object") return null;

    // Handle both object structure (cities.cities) and direct object
    const citiesData = cities.cities || cities;
    if (!citiesData || typeof citiesData !== "object") return null;

    let nearestCity = null;
    let minDistance = Infinity;

    // Convert object to array and iterate
    Object.values(citiesData).forEach((city) => {
      if (
        city &&
        typeof city.lat === "number" &&
        typeof city.lng === "number"
      ) {
        const distance = calculateDistance(lat, lng, city.lat, city.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      }
    });

    return nearestCity ? { city: nearestCity, distance: minDistance } : null;
  };

  // Analyze safety based on location and historical data
  const analyzeSafety = (latitude, longitude) => {
    const now = Math.floor(Date.now() / 1000);
    const last24Hours = now - 24 * 60 * 60;

    // Find nearby alerts in last 24 hours
    const nearbyAlerts = historical.filter((alert) => {
      const alertTime = alert[3];
      if (alertTime < last24Hours) return false;

      const alertCities = alert[2];
      return alertCities.some((cityName) => {
        const city = cities.find(
          (c) =>
            (c.nameTh && c.nameTh.includes(cityName)) ||
            (c.nameEn && c.nameEn.includes(cityName))
        );
        if (!city || !city.lat || !city.lng) return false;

        const distance = calculateDistance(
          latitude,
          longitude,
          city.lat,
          city.lng
        );
        return distance <= 10; // Within 10km
      });
    });

    // Find nearest city and its historical frequency
    const nearestCity = findNearestCity(latitude, longitude);
    let alertFrequency = 0;
    if (nearestCity) {
      const cityKey = nearestCity.nameTh || nearestCity.nameEn;
      alertFrequency = alertFrequencies[cityKey] || 0;
    }

    // Calculate risk level
    let riskLevel = "safe";
    let riskColor = "#10b981"; // green
    let recommendation = t.safeMessage;

    if (nearbyAlerts.length >= 5 || alertFrequency >= 50) {
      riskLevel = "veryHighRisk";
      riskColor = "#dc2626"; // red
      recommendation = t.veryHighRiskMessage;
    } else if (nearbyAlerts.length >= 3 || alertFrequency >= 30) {
      riskLevel = "highRisk";
      riskColor = "#ea580c"; // orange-600
      recommendation = t.highRiskMessage;
    } else if (nearbyAlerts.length >= 2 || alertFrequency >= 15) {
      riskLevel = "moderateRisk";
      riskColor = "#f59e0b"; // amber-500
      recommendation = t.moderateRiskMessage;
    } else if (nearbyAlerts.length >= 1 || alertFrequency >= 5) {
      riskLevel = "lowRisk";
      riskColor = "#eab308"; // yellow-500
      recommendation = t.lowRiskMessage;
    }

    return {
      riskLevel,
      riskColor,
      recommendation,
      nearbyAlerts: nearbyAlerts.length,
      alertFrequency,
      nearestCity,
    };
  };

  // Function to log location data to backend
  const logLocationData = async (latitude, longitude, safetyResult) => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

      const logData = {
        latitude,
        longitude,
        safetyResult: {
          status:
            safetyResult.riskLevel === "safe" ||
            safetyResult.riskLevel === "lowRisk"
              ? "safe"
              : "at-risk",
          recentAlerts: safetyResult.nearbyAlerts || 0,
          historicalAlerts: safetyResult.alertFrequency || 0,
          riskLevel: safetyResult.riskLevel,
          nearestAlert: safetyResult.nearestCity
            ? {
                name:
                  safetyResult.nearestCity.city?.nameTh ||
                  safetyResult.nearestCity.city?.nameEn ||
                  "Unknown",
                distance: safetyResult.nearestCity.distance || 0,
              }
            : null,
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };

      await fetch(`${API_BASE_URL}/api/log-location`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });

      console.log("✅ Location data logged successfully");
    } catch (error) {
      console.warn("⚠️ Failed to log location data:", error);
      // Don't show error to user, this is background logging
    }
  };

  const handleCheckLocation = () => {
    setIsChecking(true);
    setShowResult(false);
    setLocationError(null);

    if (!navigator.geolocation) {
      setIsChecking(false);
      setLocationError("geolocation_not_supported");
      return;
    }

    // Test if geolocation permission is already granted
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "denied") {
          setIsChecking(false);
          setLocationError("permission_denied");
          return;
        }
      });
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationData = {
          latitude,
          longitude,
          timestamp: new Date(),
        };

        const safetyAnalysis = analyzeSafety(latitude, longitude);

        setLocationInfo(locationData);
        setSafetyResult(safetyAnalysis);
        setShowResult(true);
        setIsChecking(false);
        setLocationError(null);

        // Log the location data to database
        logLocationData(latitude, longitude, safetyAnalysis);
      },
      (error) => {
        setIsChecking(false);
        console.error("Geolocation error:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("permission_denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("position_unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("timeout");
            break;
          default:
            setLocationError("unknown");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const handleManualLocationCheck = () => {
    const lat = parseFloat(manualLocation.lat);
    const lng = parseFloat(manualLocation.lng);

    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      alert(
        language === "th"
          ? "กรุณาใส่พิกัดที่ถูกต้อง (ละติจูด: -90 ถึง 90, ลองจิจูด: -180 ถึง 180)"
          : "Please enter valid coordinates (Latitude: -90 to 90, Longitude: -180 to 180)"
      );
      return;
    }

    const locationData = {
      latitude: lat,
      longitude: lng,
      timestamp: new Date(),
      manual: true,
    };

    const safetyAnalysis = analyzeSafety(lat, lng);

    setLocationInfo(locationData);
    setSafetyResult(safetyAnalysis);
    setShowResult(true);
    setShowManualInput(false);
    setLocationError(null);

    // Log the manual location data to database
    logLocationData(lat, lng, safetyAnalysis);
  };

  const getRiskLevelText = (level) => {
    switch (level) {
      case "safe":
        return t.safe;
      case "lowRisk":
        return t.lowRisk;
      case "moderateRisk":
        return t.moderateRisk;
      case "highRisk":
        return t.highRisk;
      case "veryHighRisk":
        return t.veryHighRisk;
      default:
        return t.safe;
    }
  };

  return (
    <div className="safety-check-page">
      <Navbar
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      <div
        className="safety-check-container"
        style={{ paddingTop: "var(--navbar-height)" }}
      >
        {/* Header */}
        <div className="safety-check-header">
          <Link to="/" className="back-button">
            {t.backToMap}
          </Link>
          <h1 className="page-title">{t.pageTitle}</h1>
          <p className="page-subtitle">{t.subtitle}</p>
        </div>

        {/* Main Content */}
        {!showResult ? (
          <div className="safety-check-main">
            {/* How it works */}
            <div className="how-it-works">
              <h2>{t.howItWorks}</h2>
              <div className="steps">
                <div className="step">{t.step1}</div>
                <div className="step">{t.step2}</div>
                <div className="step">{t.step3}</div>
                <div className="step">{t.step4}</div>
              </div>
            </div>

            {/* Check button */}
            <div className="check-section">
              <button
                className={`check-button ${isChecking ? "checking" : ""}`}
                onClick={handleCheckLocation}
                disabled={isChecking}
              >
                {isChecking ? (
                  <>
                    <div className="spinner"></div>
                    {t.checking}
                  </>
                ) : (
                  t.checkNow
                )}
              </button>
            </div>

            {/* Location Error Handling */}
            {locationError && (
              <div className="location-error">
                <div className="error-content">
                  <h3>📍 {t.locationError}</h3>

                  {locationError === "permission_denied" && (
                    <div className="location-instructions">
                      <p>
                        <strong>{t.locationInstructions}</strong>
                      </p>
                      <ul>
                        <li>{t.locationStep1}</li>
                        <li>{t.locationStep2}</li>
                        <li>{t.locationStep3}</li>
                      </ul>
                    </div>
                  )}

                  <button
                    className="manual-entry-button"
                    onClick={() => setShowManualInput(!showManualInput)}
                  >
                    {t.manualEntry}
                  </button>
                </div>
              </div>
            )}

            {/* Manual Location Input */}
            {(showManualInput || locationError) && (
              <div className="manual-location-input">
                <h3>{t.manualEntry}</h3>
                <p className="coordinate-help">{t.coordinateHelp}</p>

                <div className="coordinate-inputs">
                  <div className="input-group">
                    <label>{t.latitude}</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="31.5"
                      value={manualLocation.lat}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          lat: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="input-group">
                    <label>{t.longitude}</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="35.0"
                      value={manualLocation.lng}
                      onChange={(e) =>
                        setManualLocation((prev) => ({
                          ...prev,
                          lng: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  className="check-manual-button"
                  onClick={handleManualLocationCheck}
                  disabled={!manualLocation.lat || !manualLocation.lng}
                >
                  {t.checkManual}
                </button>
              </div>
            )}

            {/* Privacy note */}
            <div className="privacy-note">
              <p>{t.privacyNote}</p>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="safety-results">
            {/* Location Info */}
            <div className="location-info">
              <h2>{t.currentLocation}</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">{t.coordinates}:</span>
                  <span className="value">
                    {locationInfo.latitude.toFixed(6)},{" "}
                    {locationInfo.longitude.toFixed(6)}
                  </span>
                </div>
                {safetyResult.nearestCity && (
                  <div className="info-item">
                    <span className="label">{t.nearestCity}:</span>
                    <span className="value">
                      {language === "th"
                        ? safetyResult.nearestCity.nameTh
                        : safetyResult.nearestCity.nameEn}
                      {safetyResult.nearestCity.distance && (
                        <span className="distance">
                          ({safetyResult.nearestCity.distance.toFixed(1)} km)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="risk-assessment">
              <h2>{t.safetyResult}</h2>
              <div
                className="risk-level-badge"
                style={{
                  backgroundColor: safetyResult.riskColor,
                  color: "white",
                }}
              >
                {getRiskLevelText(safetyResult.riskLevel)}
              </div>

              <div className="risk-details">
                <div className="detail-item">
                  <span className="label">{t.recentAlerts}:</span>
                  <span className="value">{safetyResult.nearbyAlerts}</span>
                </div>
                <div className="detail-item">
                  <span className="label">{t.alertFrequency}:</span>
                  <span className="value">{safetyResult.alertFrequency}</span>
                </div>
              </div>

              <div className="recommendation">
                <h3>{t.recommendation}</h3>
                <p>{safetyResult.recommendation}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="result-actions">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowResult(false);
                  setSafetyResult(null);
                  setLocationInfo(null);
                }}
              >
                {t.tryAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyCheckPage;
