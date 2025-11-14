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
      .slice(0, 10);
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
          <aside className="sidebar-fixed">
            <div
              style={{
                background: "var(--danger)",
                color: "white",
                padding: 16,
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
          </aside>
        )}
      </>
    );
  }

  // When area is selected - show area details
  const alertsForArea = getAlertsForArea(selectedArea);
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
            <h4 style={{ margin: "0 0 12px 0" }}>
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

            <div style={{ marginBottom: 16 }}>
              <h5 style={{ margin: "0 0 8px 0" }}>
                {currentTexts.recentAlerts}
              </h5>
              {alertsForArea.length > 0 ? (
                alertsForArea.map((a, i) => (
                  <div key={i} className="card" style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>
                      {a[2].map((n) => translateCityName(n)).join(", ")}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {formatTimeAgo(a[3])}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card muted">{currentTexts.noRecentAlerts}</div>
              )}
            </div>

            <div>
              <h5 style={{ margin: "0 0 8px 0" }}>
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
        <aside className="sidebar-fixed">
          <div
            style={{ background: "var(--danger)", color: "white", padding: 16 }}
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

            <div style={{ marginBottom: 16 }}>
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
                <div className="card muted">{currentTexts.noRecentAlerts}</div>
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
        </aside>
      )}
    </>
  );
};

export default Sidebar;
