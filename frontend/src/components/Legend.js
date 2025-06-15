import React from "react";

const Legend = ({ language, timeFilter, layerVisibility, isMobile }) => {
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

  const texts = {
    en: {
      title: "Map Legend",
      alertZonesTitle: "Risk Zones by Alert Frequency",
      thaiWorkersTitle: "Thai Worker Population",
      instruction: "Click on any zone for detailed information",
      timeLabel: "Time Period:",
      alertLevels: [
        {
          color: "#ff0000",
          label: "Very High Risk (150+ alerts)",
          description: "Most dangerous areas",
        },
        {
          color: "#ff6600",
          label: "High Risk (51-150 alerts)",
          description: "Frequently targeted",
        },
        {
          color: "#ffcc00",
          label: "Moderate Risk (11-50 alerts)",
          description: "Occasionally targeted",
        },
        {
          color: "#90EE90",
          label: "Low Risk (1-10 alerts)",
          description: "Rarely targeted",
        },
        {
          color: "#e8f4fd",
          label: "No Risk (0 alerts)",
          description: "No recorded alerts",
        },
      ],
      workerLevels: [
        {
          color: "#8B0000",
          label: "10,000+ workers",
          description: "Very high population",
        },
        {
          color: "#DC143C",
          label: "5,000-9,999 workers",
          description: "High population",
        },
        {
          color: "#FF6347",
          label: "2,000-4,999 workers",
          description: "Medium-high population",
        },
        {
          color: "#FFA500",
          label: "1,000-1,999 workers",
          description: "Medium population",
        },
        {
          color: "#FFD700",
          label: "500-999 workers",
          description: "Low-medium population",
        },
        {
          color: "#FFFF99",
          label: "100-499 workers",
          description: "Low population",
        },
        {
          color: "#F0F8FF",
          label: "0-99 workers",
          description: "Very low population",
        },
      ],
    },
    th: {
      title: "คำอธิบายแผนที่",
      alertZonesTitle: "เขตเสี่ยงตามความถี่การเตือนภัย",
      thaiWorkersTitle: "จำนวนแรงงานไทย",
      instruction: "คลิกที่เขตใดก็ได้เพื่อดูข้อมูลรายละเอียด",
      timeLabel: "ช่วงเวลา:",
      alertLevels: [
        {
          color: "#ff0000",
          label: "เสี่ยงสูงมาก (150+ ครั้ง)",
          description: "พื้นที่อันตรายที่สุด",
        },
        {
          color: "#ff6600",
          label: "เสี่ยงสูง (51-150 ครั้ง)",
          description: "ถูกโจมตีบ่อยครั้ง",
        },
        {
          color: "#ffcc00",
          label: "เสี่ยงปานกลาง (11-50 ครั้ง)",
          description: "ถูกโจมตีเป็นครั้งคราว",
        },
        {
          color: "#90EE90",
          label: "เสี่ยงต่ำ (1-10 ครั้ง)",
          description: "ถูกโจมตีไม่บ่อย",
        },
        {
          color: "#e8f4fd",
          label: "ไม่มีความเสี่ยง (0 ครั้ง)",
          description: "ไม่มีการเตือนภัยที่บันทึกไว้",
        },
      ],
      workerLevels: [
        {
          color: "#8B0000",
          label: "10,000+ คน",
          description: "จำนวนมากที่สุด",
        },
        {
          color: "#DC143C",
          label: "5,000-9,999 คน",
          description: "จำนวนมาก",
        },
        {
          color: "#FF6347",
          label: "2,000-4,999 คน",
          description: "จำนวนปานกลาง-มาก",
        },
        {
          color: "#FFA500",
          label: "1,000-1,999 คน",
          description: "จำนวนปานกลาง",
        },
        {
          color: "#FFD700",
          label: "500-999 คน",
          description: "จำนวนน้อย-ปานกลาง",
        },
        {
          color: "#FFFF99",
          label: "100-499 คน",
          description: "จำนวนน้อย",
        },
        {
          color: "#F0F8FF",
          label: "0-99 คน",
          description: "จำนวนน้อยที่สุด",
        },
      ],
    },
  };

  const currentTexts = texts[language];

  return (
    <div
      style={{
        position: "absolute",
        bottom: isMobile ? "5px" : "10px",
        left: isMobile ? "5px" : "10px",
        background: "white",
        padding: isMobile ? "8px" : "12px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        fontSize: isMobile ? "10px" : "12px",
        maxWidth: isMobile ? "calc(100vw - 20px)" : "280px",
        maxHeight: isMobile ? "40vh" : "80vh",
        overflowY: "auto",
      }}
    >
      <h4 style={{ margin: "0 0 8px 0", fontSize: isMobile ? "12px" : "14px" }}>
        {currentTexts.title}
      </h4>

      {/* Alert Zones Legend */}
      {layerVisibility.alertZones && (
        <div style={{ marginBottom: "12px" }}>
          <h5
            style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#2c3e50" }}
          >
            {currentTexts.alertZonesTitle}
          </h5>

          {/* Time Filter Display */}
          <div
            style={{
              marginBottom: "8px",
              padding: "6px 8px",
              background: "#f8fafc",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            <strong>{currentTexts.timeLabel}</strong>{" "}
            {timeFilterLabels[language][timeFilter]}
          </div>

          {currentTexts.alertLevels.map((item, index) => (
            <div
              key={`alert-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: item.color,
                  marginRight: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                }}
              ></div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "10px" }}>
                  {item.label}
                </div>
                <div style={{ color: "#666", fontSize: "9px" }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Thai Workers Legend */}
      {layerVisibility.thaiWorkers && (
        <div style={{ marginBottom: "12px" }}>
          <h5
            style={{ margin: "0 0 8px 0", fontSize: "13px", color: "#2c3e50" }}
          >
            {currentTexts.thaiWorkersTitle}
          </h5>

          {currentTexts.workerLevels.map((item, index) => (
            <div
              key={`worker-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: item.color,
                  marginRight: "6px",
                  border: "1px solid #ccc",
                  borderRadius: "2px",
                }}
              ></div>
              <div>
                <div style={{ fontWeight: "bold", fontSize: "10px" }}>
                  {item.label}
                </div>
                <div style={{ color: "#666", fontSize: "9px" }}>
                  {item.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "10px", fontSize: "10px", color: "#666" }}>
        {currentTexts.instruction}
      </div>
    </div>
  );
};

export default Legend;
