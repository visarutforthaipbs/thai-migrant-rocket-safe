import React, { useState } from "react";
import { useLists } from "../context/DataContext";

const Sidebar = ({
  selectedArea,
  language,
  onClose,
  timeFilter,
  isMobile,
  isOpen,
  emergencyFocus,
}) => {
  const { historical, cities } = useLists();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Function to translate Hebrew city names to English
  const translateCityName = (hebrewName) => {
    if (!cities) return hebrewName;
    const cityEntry = Object.values(cities).find(
      (city) => city.he === hebrewName
    );
    return cityEntry ? cityEntry.en : hebrewName;
  };

  // Function to get recent alerts within the last 3 hours
  const getRecentAlerts = () => {
    if (!historical || historical.length === 0) return [];
    const now = Math.floor(Date.now() / 1000);
    const threeHoursAgo = now - 3 * 60 * 60;
    return historical
      .filter((alert) => alert[3] >= threeHoursAgo)
      .sort((a, b) => b[3] - a[3])
      .slice(0, 12);
  };

  // Function to get alerts for a specific selected area
  const getAlertsForArea = (selectedArea) => {
    if (!historical || historical.length === 0 || !selectedArea) return [];
    const areaName = selectedArea.he || selectedArea.en || selectedArea.name;
    return historical
      .filter((alert) => {
        const alertCities = alert[2] || [];
        return alertCities.some((cityName) => {
          if (cityName === areaName) return true;
          const translatedName = translateCityName(cityName);
          return (
            translatedName === areaName ||
            translatedName === selectedArea.en ||
            cityName === selectedArea.he
          );
        });
      })
      .sort((a, b) => b[3] - a[3])
      .slice(0, 5);
  };

  const recentAlerts = getRecentAlerts();
  const alertsForArea = getAlertsForArea(selectedArea);

  // Language-specific texts
  const texts = {
    en: {
      recentAlertsTitle: "Recent Alerts",
      areaDetails: "Area Details",
      totalAlerts: "Total Alerts",
      thaiWorkers: "Thai Workers",
      recentAlerts: "Recent Alerts",
      noRecentAlerts: "No recent alerts",
      noRecentAlertsInHour: "No alerts in the last 3 hours",
      instructions: "Safety Instructions",
      close: "Close",
      justNow: "Just now",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      safetyInstructions: [
        "Stay alert and follow local authorities",
        "Avoid areas with active alerts",
        "Keep emergency contacts ready",
        "Monitor news and official channels",
      ],
    },
    th: {
      recentAlertsTitle: "การเตือนล่าสุด",
      areaDetails: "รายละเอียดพื้นที่",
      totalAlerts: "การเตือนทั้งหมด",
      thaiWorkers: "แรงงานไทย",
      recentAlerts: "การเตือนล่าสุด",
      noRecentAlerts: "ไม่มีการเตือนล่าสุด",
      noRecentAlertsInHour: "ไม่มีการเตือนใน 3 ชั่วโมงที่ผ่านมา",
      instructions: "คำแนะนำด้านความปลอดภัย",
      close: "ปิด",
      justNow: "เมื่อสักครู่",
      minutesAgo: "นาทีที่แล้ว",
      hoursAgo: "ชั่วโมงที่แล้ว",
      safetyInstructions: [
        "ให้ความสนใจและปฏิบัติตามคำแนะนำของเจ้าหน้าที่ท้องถิ่น",
        "หลีกเลี่ยงพื้นที่ที่มีการเตือนอยู่",
        "เตรียมเบอร์ฉุกเฉินไว้ให้พร้อม",
        "ติดตามข่าวสารและช่องทางอย่างเป็นทางการ",
      ],
    },
  };

  const currentTexts = texts[language];

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

  // Mobile overlay and desktop sidebar styles using CSS classes
  if (!selectedArea) {
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

        {/* Mobile bottom sheet */}
        {isMobile && (
          <div className={`sidebar-sheet ${isOpen ? "open" : ""}`}>
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "var(--danger)",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
              }}
            >
              <strong>{currentTexts.recentAlertsTitle}</strong>
              <button
                onClick={onClose}
                aria-label="close"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  padding: "8px",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "16px" }}>
              {recentAlerts.length > 0 ? (
                <div>
                  {recentAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="card"
                      style={{
                        marginBottom: index < recentAlerts.length - 1 ? 12 : 0,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>
                        {alert[2].map((n) => translateCityName(n)).join(", ")}
                      </div>
                      <div className="muted" style={{ fontSize: 13 }}>
                        {formatTimeAgo(alert[3])}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card muted">
                  {currentTexts.noRecentAlertsInHour}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop fixed sidebar */}
        {!isMobile && (
          <aside
            className={isCollapsed ? "sidebar-collapsed" : "sidebar-fixed"}
          >
            {/* Toggle Button */}
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? "→" : "←"}
            </button>

            {/* Sidebar Content - only show when not collapsed */}
            {!isCollapsed && (
              <>
                <div
                  style={{
                    background: "var(--danger)",
                    color: "white",
                    padding: 16,
                    marginTop: 48, // Space for toggle button
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 18 }}>
                    {currentTexts.recentAlertsTitle}
                  </h3>
                </div>
                <div style={{ padding: 16 }}>
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className="card"
                        style={{ marginBottom: 12 }}
                      >
                        <div style={{ fontWeight: 700 }}>
                          {alert[2].map((n) => translateCityName(n)).join(", ")}
                        </div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {formatTimeAgo(alert[3])}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card muted">
                      {currentTexts.noRecentAlertsInHour}
                    </div>
                  )}
                </div>
              </>
            )}
          </aside>
        )}
      </>
    );
  }

  // When area is selected - show area details
  const populationInfo = selectedArea?.thai_workers || 0;

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

      {/* Mobile bottom sheet */}
      {isMobile && (
        <div className={`sidebar-sheet ${isOpen ? "open" : ""}`}>
          <div
            style={{
              position: "sticky",
              top: 0,
              background: "var(--danger)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
            }}
          >
            <strong>{currentTexts.areaDetails}</strong>
            <button
              onClick={onClose}
              aria-label="close"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                padding: "8px",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ padding: "16px" }}>
            <h4 style={{ margin: "0 0 16px 0" }}>
              {selectedArea.en || selectedArea.he || selectedArea.name}
            </h4>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "1fr 1fr",
                marginBottom: 16,
              }}
            >
              <div className="card">
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: "var(--muted)",
                    marginBottom: 4,
                  }}
                >
                  {currentTexts.totalAlerts}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {alertsForArea.length}
                </div>
              </div>
              <div className="card">
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    color: "var(--muted)",
                    marginBottom: 4,
                  }}
                >
                  {currentTexts.thaiWorkers}
                </div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {populationInfo}
                </div>
              </div>
            </div>

            <div>
              <h5 style={{ margin: "0 0 12px 0" }}>
                {currentTexts.recentAlerts}
              </h5>
              {alertsForArea.length > 0 ? (
                alertsForArea.map((alert, index) => (
                  <div key={index} className="card" style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {alert[2].map((n) => translateCityName(n)).join(", ")}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {formatTimeAgo(alert[3])}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card muted">{currentTexts.noRecentAlerts}</div>
              )}
            </div>

            <div>
              <h5 style={{ margin: "16px 0 8px 0" }}>
                {currentTexts.instructions}
              </h5>
              {currentTexts.safetyInstructions.map((s, idx) => (
                <div key={idx} style={{ marginBottom: 8, fontSize: 14 }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      {!isMobile && (
        <aside className={isCollapsed ? "sidebar-collapsed" : "sidebar-fixed"}>
          {/* Toggle Button */}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? "→" : "←"}
          </button>

          {/* Sidebar Content - only show when not collapsed */}
          {!isCollapsed && (
            <>
              <div
                style={{
                  background: "var(--danger)",
                  color: "white",
                  padding: 16,
                  marginTop: 48, // Space for toggle button
                }}
              >
                <h3 style={{ margin: 0 }}>{currentTexts.areaDetails}</h3>
              </div>
              <div style={{ padding: 16 }}>
                <h4 style={{ margin: "0 0 16px 0" }}>
                  {selectedArea.en || selectedArea.he || selectedArea.name}
                </h4>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "1fr 1fr",
                    marginBottom: 16,
                  }}
                >
                  <div className="card">
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: "var(--muted)",
                        marginBottom: 4,
                      }}
                    >
                      {currentTexts.totalAlerts}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {alertsForArea.length}
                    </div>
                  </div>
                  <div className="card">
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: "var(--muted)",
                        marginBottom: 4,
                      }}
                    >
                      {currentTexts.thaiWorkers}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>
                      {populationInfo}
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ margin: "0 0 12px 0" }}>
                    {currentTexts.recentAlerts}
                  </h5>
                  {alertsForArea.length > 0 ? (
                    alertsForArea.map((a, i) => (
                      <div key={i} className="card" style={{ marginBottom: 8 }}>
                        <div style={{ fontWeight: 700 }}>
                          {a[2].map((n) => translateCityName(n)).join(", ")}
                        </div>
                        <div className="muted" style={{ fontSize: 13 }}>
                          {formatTimeAgo(a[3])}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="card muted">
                      {currentTexts.noRecentAlerts}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h5 style={{ margin: "0 0 12px 0" }}>
                    {currentTexts.instructions}
                  </h5>
                  {currentTexts.safetyInstructions.map((s, idx) => (
                    <div key={idx} style={{ marginBottom: 8 }}>
                      {s}
                    </div>
                  ))}
                </div>

                <button
                  onClick={onClose}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {currentTexts.close}
                </button>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
};

export default Sidebar;
