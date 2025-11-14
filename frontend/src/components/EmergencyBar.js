import React from "react";

const EmergencyBar = ({ language, userLocation, emergencyMode }) => {
  const texts = {
    en: {
      emergencyMode: "🚨 EMERGENCY MODE ACTIVE",
      noActiveAlerts: "✅ No Active Alerts in Your Area",
      emergencyContacts: "Emergency Contacts",
      police: "Police: 100",
      emergencyNum: "Emergency: 101",
      fire: "Fire: 102",
      thaiConsulate: "Thai Consulate: 054-636-8150",
      findShelter: "🏠 Find Nearest Shelter",
      currentStatus: "Current Status",
      lastUpdate: "Last Update",
      instructions: "Stay in secure location. Monitor for updates.",
    },
    th: {
      emergencyMode: "🚨 เปิดโหมดฉุกเฉิน",
      noActiveAlerts: "✅ ไม่มีการแจ้งเตือนในพื้นที่ของคุณ",
      emergencyContacts: "หมายเลขฉุกเฉิน",
      police: "ตำรวจ: 100",
      emergencyNum: "เหตุฉุกเฉิน: 101",
      fire: "ดับเพลิง: 102",
      thaiConsulate: "สถานกงสุลไทย: 054-636-8150",
      findShelter: "🏠 หาที่หลบภัยใกล้ที่สุด",
      currentStatus: "สถานะปัจจุบัน",
      lastUpdate: "อัปเดตล่าสุด",
      instructions: "อยู่ในที่ปลอดภัย ติดตามข้อมูลอัปเดต",
    },
  };

  const currentTexts = texts[language];

  return (
    <div
      style={{
        background: emergencyMode
          ? "linear-gradient(135deg, #dc2626, #991b1b)"
          : "linear-gradient(135deg, #059669, #047857)",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        animation: emergencyMode ? "pulse 2s infinite" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          {emergencyMode
            ? currentTexts.emergencyMode
            : currentTexts.noActiveAlerts}
        </div>
        <div style={{ fontSize: "12px", opacity: 0.9 }}>
          {currentTexts.lastUpdate}: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "14px",
        }}
      >
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <span>{currentTexts.emergencyNum}</span>
          <span>{currentTexts.police}</span>
          <span>{currentTexts.fire}</span>
          <span>{currentTexts.thaiConsulate}</span>
        </div>

        {emergencyMode && (
          <button
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => {
              // Logic to find nearest shelter
              console.log("Finding nearest shelter...");
            }}
          >
            {currentTexts.findShelter}
          </button>
        )}
      </div>

      {emergencyMode && (
        <div
          style={{
            fontSize: "14px",
            fontStyle: "italic",
            opacity: 0.9,
            textAlign: "center",
            marginTop: "4px",
          }}
        >
          {currentTexts.instructions}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default EmergencyBar;
