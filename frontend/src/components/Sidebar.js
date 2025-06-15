import React from "react";
import { useLists } from "../context/DataContext";

const Sidebar = ({
  selectedArea,
  language,
  onClose,
  timeFilter,
  isMobile,
  isOpen,
}) => {
  const { historical, cities } = useLists();

  // Function to translate Hebrew city names to English
  const translateCityName = (hebrewName) => {
    if (!cities) return hebrewName;

    // Find the city by Hebrew name
    const cityEntry = Object.values(cities).find(
      (city) => city.he === hebrewName
    );
    return cityEntry ? cityEntry.en : hebrewName;
  };

  // Function to get recent alerts within the last 3 hours
  const getRecentAlerts = () => {
    if (!historical || historical.length === 0) return [];

    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const threeHoursAgo = now - 3 * 60 * 60; // 3 hours ago

    return historical
      .filter((alert) => alert[3] >= threeHoursAgo) // Filter alerts from last 3 hours
      .sort((a, b) => b[3] - a[3]) // Sort by timestamp (newest first)
      .slice(0, 12); // Limit to 12 most recent alerts
  };

  // Function to get alerts for a specific selected area
  const getAlertsForArea = (selectedArea) => {
    if (!historical || historical.length === 0 || !selectedArea) return [];

    // Get the area name to match against
    const areaName = selectedArea.he || selectedArea.en || selectedArea.name;

    return historical
      .filter((alert) => {
        // Filter by area - check if any city in the alert matches the selected area
        const alertCities = alert[2]; // Array of Hebrew city names
        return alertCities.some((cityName) => {
          // Direct match with Hebrew name
          if (cityName === areaName) return true;

          // Try to find English translation and match
          const translatedName = translateCityName(cityName);
          return (
            translatedName === areaName ||
            translatedName === selectedArea.en ||
            cityName === selectedArea.he
          );
        });
      })
      .sort((a, b) => b[3] - a[3]) // Sort by timestamp (newest first)
      .slice(0, 10); // Limit to 10 most recent alerts for the specific area
  };

  const texts = {
    en: {
      noSelection: "Click on any area to view details",
      recentAlertsTitle: "Recent Alerts (Last 3 Hours)",
      noRecentAlertsInHour: "No alerts in the last 3 hours",
      warningLevel: "Warning",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      justNow: "just now",
      instructions: "Safety Instructions",
      areaDetails: "Area Details",
      thaiWorkerDetails: "Thai Worker Region Details",
      warningTime: "Warning Time",
      seconds: "seconds",
      safetyInstructions: [
        "🚨 Stay calm and move quickly to shelter",
        "🏠 Find the nearest reinforced room or shelter",
        "🚪 Close all windows and doors",
        "📱 Keep your phone with you",
        "⏰ Wait for all-clear signal before leaving",
      ],
      thaiWorkerInfo: [
        "👥 This region has a significant Thai worker population",
        "🏢 Contact your employer for emergency procedures",
        "📞 Keep Thai consulate contact information handy",
        "🆘 Learn basic Hebrew emergency phrases",
        "🤝 Connect with local Thai community groups",
      ],
      recentAlerts: "Recent Alerts (Last 10 for this area)",
      noRecentAlerts: "No alerts found for this area",
      emergencyContacts: "Emergency Contacts",
      contacts: [
        "🚨 Emergency Services: 101",
        "🏥 Medical Emergency: 101",
        "🇹🇭 Thai Consulate: 054-636-8150",
        "👮 Police: 100",
      ],
      riskLevel: "Risk Level",
      totalAlerts: "Total Alerts",
      thaiWorkers: "Thai Workers",
      regionName: "Region",
      veryHigh: "Very High Risk",
      high: "High Risk",
      moderate: "Moderate Risk",
      low: "Low Risk",
      noRisk: "No Risk",
      timePeriod: "Time Period",
      populationDensity: "Population Density",
      veryHighPop: "Very High",
      highPop: "High",
      mediumPop: "Medium",
      lowPop: "Low",
      close: "Close",
    },
    th: {
      noSelection: "คลิกที่พื้นที่ใดก็ได้เพื่อดูรายละเอียด",
      recentAlertsTitle: "การแจ้งเตือนล่าสุด (3 ชั่วโมงที่ผ่านมา)",
      noRecentAlertsInHour: "ไม่มีการแจ้งเตือนใน 3 ชั่วโมงที่ผ่านมา",
      warningLevel: "ระดับเตือนภัย",
      minutesAgo: "นาทีที่แล้ว",
      hoursAgo: "ชั่วโมงที่แล้ว",
      justNow: "เมื่อสักครู่",
      instructions: "คำแนะนำความปลอดภัย",
      areaDetails: "รายละเอียดพื้นที่",
      thaiWorkerDetails: "รายละเอียดเขตแรงงานไทย",
      warningTime: "เวลาเตือนภัย",
      seconds: "วินาที",
      safetyInstructions: [
        "🚨 จงสงบสติอารมณ์และเคลื่อนที่ไปยังที่หลบภัยอย่างรวดเร็ว",
        "🏠 หาห้องเสริมกำลังหรือที่หลบภัยที่ใกล้ที่สุด",
        "🚪 ปิดหน้าต่างและประตูทั้งหมด",
        "📱 ถือโทรศัพท์มือถือไว้กับตัว",
        "⏰ รอสัญญาณปลอดภัยก่อนออกจากที่หลบภัย",
      ],
      thaiWorkerInfo: [
        "👥 เขตนี้มีแรงงานไทยจำนวนมาก",
        "🏢 ติดต่อนายจ้างเพื่อขั้นตอนฉุกเฉิน",
        "📞 เก็บข้อมูลติดต่อสถานกงสุลไทยไว้",
        "🆘 เรียนรู้คำศัพท์ฉุกเฉินภาษาฮีบรูเบื้องต้น",
        "🤝 เชื่อมต่อกับกลุ่มชุมชนไทยในท้องถิ่น",
      ],
      recentAlerts: "การแจ้งเตือนล่าสุด (10 รายการสุดท้ายของพื้นที่นี้)",
      noRecentAlerts: "ไม่พบการแจ้งเตือนสำหรับพื้นที่นี้",
      emergencyContacts: "หมายเลขฉุกเฉิน",
      contacts: [
        "🚨 หน่วยกู้ภัย: 101",
        "🏥 ฉุกเฉินทางการแพทย์: 101",
        "🇹🇭 สถานกงสุลไทย: 054-636-8150",
        "👮 ตำรวจ: 100",
      ],
      riskLevel: "ระดับความเสี่ยง",
      totalAlerts: "จำนวนการเตือนภัยทั้งหมด",
      thaiWorkers: "แรงงานไทย",
      regionName: "เขต",
      veryHigh: "เสี่ยงสูงมาก",
      high: "เสี่ยงสูง",
      moderate: "เสี่ยงปานกลาง",
      low: "เสี่ยงต่ำ",
      noRisk: "ไม่มีความเสี่ยง",
      timePeriod: "ช่วงเวลา",
      populationDensity: "ความหนาแน่นประชากร",
      veryHighPop: "สูงมาก",
      highPop: "สูง",
      mediumPop: "ปานกลาง",
      lowPop: "ต่ำ",
      close: "ปิด",
    },
  };

  const currentTexts = texts[language];

  const timeFilterLabels = {
    en: {
      "24h": "Last 24 Hours",
      week: "Last Week",
      month: "Last Month",
      all: "All Time",
    },
    th: {
      "24h": "24 ชั่วโมงที่ผ่านมา",
      week: "สัปดาห์ที่ผ่านมา",
      month: "เดือนที่ผ่านมา",
      all: "ทั้งหมด",
    },
  };

  const getRiskLevel = (alertCount) => {
    if (alertCount === 0)
      return { level: currentTexts.noRisk, color: "#64748b" };
    if (alertCount <= 10) return { level: currentTexts.low, color: "#16a34a" };
    if (alertCount <= 50)
      return { level: currentTexts.moderate, color: "#d97706" };
    if (alertCount <= 150)
      return { level: currentTexts.high, color: "#ea580c" };
    return { level: currentTexts.veryHigh, color: "#dc2626" };
  };

  const getPopulationDensity = (numWorkers) => {
    if (numWorkers >= 10000)
      return { level: currentTexts.veryHighPop, color: "#8B0000" };
    if (numWorkers >= 5000)
      return { level: currentTexts.highPop, color: "#DC143C" };
    if (numWorkers >= 1000)
      return { level: currentTexts.mediumPop, color: "#FFA500" };
    return { level: currentTexts.lowPop, color: "#FFD700" };
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString(
      language === "th" ? "th-TH" : "en-US"
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = Math.floor(Date.now() / 1000);
    const diffMinutes = Math.floor((now - timestamp) / 60);
    const diffHours = Math.floor(diffMinutes / 60);

    if (diffMinutes < 1) {
      return currentTexts.justNow;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} ${currentTexts.minutesAgo}`;
    } else {
      return `${diffHours} ${currentTexts.hoursAgo}`;
    }
  };

  const getWarningLevelColor = (level) => {
    switch (level) {
      case 0:
        return "#16a34a"; // Green for immediate
      case 5:
        return "#eab308"; // Yellow for 5 seconds
      case 15:
        return "#f97316"; // Orange for 15 seconds
      case 30:
        return "#ef4444"; // Red for 30+ seconds
      case 60:
        return "#dc2626"; // Dark red for 60+ seconds
      case 90:
        return "#991b1b"; // Very dark red for 90+ seconds
      default:
        return "#64748b"; // Gray for unknown
    }
  };

  // Common sidebar styles
  const sidebarStyles = {
    width: isMobile ? "100vw" : "350px",
    height: isMobile ? "85vh" : "calc(100vh - 70px)",
    backgroundColor: "#ffffff",
    borderLeft: isMobile ? "none" : "1px solid #e2e8f0",
    borderTop: isMobile ? "1px solid #e2e8f0" : "none",
    borderRadius: isMobile ? "20px 20px 0 0" : "0",
    padding: "0",
    overflowY: "auto",
    position: "fixed",
    right: 0,
    top: isMobile ? "auto" : "70px",
    bottom: isMobile ? 0 : "auto",
    zIndex: 1000,
    boxShadow: isMobile
      ? "0 -4px 20px rgba(0,0,0,0.15)"
      : "-2px 0 10px rgba(0,0,0,0.1)",
    transform: isMobile ? `translateY(${isOpen ? "0" : "100%"})` : "none",
    transition: isMobile ? "transform 0.3s ease-in-out" : "none",
  };

  if (!selectedArea) {
    const recentAlerts = getRecentAlerts();

    return (
      <>
        {/* Mobile Overlay */}
        {isMobile && isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 999,
            }}
            onClick={onClose}
          />
        )}

        <div style={sidebarStyles}>
          {/* Mobile Close Button */}
          {isMobile && (
            <div
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#dc2626",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 1001,
              }}
            >
              <span
                style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
              >
                {currentTexts.recentAlertsTitle}
              </span>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Header - Desktop only */}
          {!isMobile && (
            <div
              style={{
                backgroundColor: "#dc2626",
                color: "white",
                padding: "15px 20px",
                borderBottom: "1px solid #ef4444",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                {currentTexts.recentAlertsTitle}
              </h3>
            </div>
          )}

          {/* Recent Alerts Content */}
          <div style={{ padding: isMobile ? "10px 20px 20px" : "20px" }}>
            {recentAlerts.length > 0 ? (
              <div
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom:
                        index < recentAlerts.length - 1 ? "12px" : "0",
                      padding: "10px",
                      backgroundColor: "white",
                      borderRadius: "6px",
                      border: "1px solid #f3f4f6",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "150px" }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "13px" : "14px",
                            color: "#1f2937",
                            marginBottom: "4px",
                          }}
                        >
                          {alert[2]
                            .map((cityName) => translateCityName(cityName))
                            .join(", ")}
                        </div>
                        <div
                          style={{
                            fontSize: isMobile ? "11px" : "12px",
                            color: "#6b7280",
                          }}
                        >
                          {formatTimeAgo(alert[3])}
                        </div>
                      </div>
                      <div
                        style={{
                          backgroundColor: getWarningLevelColor(alert[1]),
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          marginLeft: "8px",
                        }}
                      >
                        {alert[1]}s
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "20px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>✅</div>
                <div style={{ color: "#166534", fontSize: "14px" }}>
                  {currentTexts.noRecentAlertsInHour}
                </div>
              </div>
            )}

            {/* Instruction */}
            <div
              style={{
                textAlign: "center",
                color: "#64748b",
                fontSize: "14px",
                padding: "20px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🗺️</div>
              {currentTexts.noSelection}
            </div>
          </div>
        </div>
      </>
    );
  }

  const isThaiWorkerRegion = selectedArea.type === "thaiWorker";
  const alertCount = selectedArea.alertCount || 0;
  const numWorkers = selectedArea.numWorkers || 0;
  const risk = getRiskLevel(alertCount);
  const populationDensity = getPopulationDensity(numWorkers);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={onClose}
        />
      )}

      <div style={sidebarStyles}>
        {/* Mobile Close Button */}
        {isMobile && (
          <div
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: isThaiWorkerRegion ? "#7c3aed" : "#1e40af",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1001,
            }}
          >
            <span
              style={{ color: "white", fontSize: "16px", fontWeight: "bold" }}
            >
              {isThaiWorkerRegion
                ? currentTexts.thaiWorkerDetails
                : currentTexts.areaDetails}
            </span>
            <button
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
                padding: "5px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Header - Desktop only */}
        {!isMobile && (
          <div
            style={{
              backgroundColor: isThaiWorkerRegion ? "#7c3aed" : "#1e40af",
              color: "white",
              padding: "15px 20px",
              borderBottom: `1px solid ${
                isThaiWorkerRegion ? "#8b5cf6" : "#3b82f6"
              }`,
            }}
          >
            <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
              {isThaiWorkerRegion
                ? currentTexts.thaiWorkerDetails
                : currentTexts.areaDetails}
            </h3>
          </div>
        )}

        {/* Area Information */}
        <div style={{ padding: isMobile ? "10px 20px 20px" : "20px" }}>
          <div
            style={{
              backgroundColor: "#f1f5f9",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                fontSize: "16px",
                color: "#1e293b",
              }}
            >
              {isThaiWorkerRegion
                ? selectedArea.regionName || selectedArea.layer
                : language === "th" && selectedArea.th
                ? selectedArea.th
                : selectedArea.en}
            </h4>

            {isThaiWorkerRegion ? (
              // Thai Worker Region Information
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    {currentTexts.thaiWorkers}:
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: populationDensity.color,
                      fontSize: "16px",
                    }}
                  >
                    {numWorkers.toLocaleString()}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    {currentTexts.populationDensity}:
                  </span>
                  <span
                    style={{
                      backgroundColor: populationDensity.color,
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {populationDensity.level}
                  </span>
                </div>
              </>
            ) : (
              // Alert Zone Information
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    {currentTexts.totalAlerts}:
                  </span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: risk.color,
                      fontSize: "16px",
                    }}
                  >
                    {alertCount}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    {currentTexts.timePeriod}:
                  </span>
                  <span style={{ fontSize: "14px", color: "#374151" }}>
                    {timeFilterLabels[language][timeFilter]}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "#64748b", fontSize: "14px" }}>
                    {currentTexts.riskLevel}:
                  </span>
                  <span
                    style={{
                      backgroundColor: risk.color,
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {risk.level}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Safety Instructions or Thai Worker Info */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 10px 0",
                fontSize: "16px",
                color: "#1e293b",
              }}
            >
              {currentTexts.instructions}
            </h4>
            <div
              style={{
                backgroundColor: isThaiWorkerRegion ? "#f3e8ff" : "#fef3c7",
                border: `1px solid ${
                  isThaiWorkerRegion ? "#a855f7" : "#f59e0b"
                }`,
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              {(isThaiWorkerRegion
                ? currentTexts.thaiWorkerInfo
                : currentTexts.safetyInstructions
              ).map((instruction, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    lineHeight: "1.4",
                    color: isThaiWorkerRegion ? "#7c3aed" : "#92400e",
                  }}
                >
                  {instruction}
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div style={{ marginBottom: "20px" }}>
            <h4
              style={{
                margin: "0 0 10px 0",
                fontSize: "16px",
                color: "#1e293b",
              }}
            >
              {currentTexts.emergencyContacts}
            </h4>
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #f87171",
                borderRadius: "8px",
                padding: "15px",
              }}
            >
              {currentTexts.contacts.map((contact, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: "bold",
                    color: "#dc2626",
                  }}
                >
                  {contact}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts - Only show for alert zones */}
          {!isThaiWorkerRegion && (
            <div>
              <h4
                style={{
                  margin: "0 0 10px 0",
                  fontSize: "16px",
                  color: "#1e293b",
                }}
              >
                {currentTexts.recentAlerts}
              </h4>
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                {(() => {
                  const areaAlerts = getAlertsForArea(selectedArea);
                  return areaAlerts.length > 0 ? (
                    areaAlerts.map((alert, index) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: "10px",
                          fontSize: "12px",
                          color: "#374151",
                          borderBottom: "1px solid #e2e8f0",
                          paddingBottom: "8px",
                          backgroundColor: "#f9fafb",
                          padding: "8px",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "4px",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: isMobile ? "12px" : "13px",
                            }}
                          >
                            📅 {formatDate(alert[3])}
                          </span>
                          <span
                            style={{
                              backgroundColor: getWarningLevelColor(alert[1]),
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {alert[1]}s
                          </span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                          {currentTexts.warningLevel}: {alert[1]}{" "}
                          {currentTexts.seconds}
                        </div>
                        {alert[2] && alert[2].length > 1 && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: "#6b7280",
                              marginTop: "2px",
                            }}
                          >
                            {language === "th"
                              ? "เขตอื่นๆ ที่ได้รับผลกระทบ"
                              : "Other affected areas"}
                            :{" "}
                            {alert[2]
                              .filter((city) => city !== selectedArea.he)
                              .map((city) => translateCityName(city))
                              .join(", ")}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                        textAlign: "center",
                      }}
                    >
                      {currentTexts.noRecentAlerts}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
