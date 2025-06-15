import React from "react";

const TimeFilter = ({ timeFilter, updateTimeFilter, language, isMobile }) => {
  const texts = {
    en: {
      title: "Time Period",
      filters: {
        "24h": "Last 24 Hours",
        week: "Last Week",
        month: "Last Month",
        all: "All Time",
      },
    },
    th: {
      title: "ช่วงเวลา",
      filters: {
        "24h": "24 ชั่วโมงที่ผ่านมา",
        week: "สัปดาห์ที่ผ่านมา",
        month: "เดือนที่ผ่านมา",
        all: "ทั้งหมด",
      },
    },
  };

  const currentTexts = texts[language];

  const handleFilterChange = (filter) => {
    updateTimeFilter(filter);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? "5px" : "10px",
        left: isMobile ? "5px" : "10px",
        background: "white",
        padding: isMobile ? "8px" : "12px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1000,
        fontSize: isMobile ? "12px" : "14px",
        minWidth: isMobile ? "140px" : "180px",
        maxWidth: isMobile ? "calc(100vw - 20px)" : "none",
      }}
    >
      <h4
        style={{
          margin: "0 0 8px 0",
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "600",
        }}
      >
        {currentTexts.title}
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {Object.entries(currentTexts.filters).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            style={{
              padding: isMobile ? "6px 8px" : "8px 12px",
              border:
                timeFilter === key ? "2px solid #2563eb" : "1px solid #d1d5db",
              borderRadius: "6px",
              background: timeFilter === key ? "#eff6ff" : "white",
              color: timeFilter === key ? "#2563eb" : "#374151",
              cursor: "pointer",
              fontSize: isMobile ? "11px" : "13px",
              fontWeight: timeFilter === key ? "600" : "400",
              transition: "all 0.2s ease",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              if (timeFilter !== key) {
                e.target.style.background = "#f9fafb";
                e.target.style.borderColor = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (timeFilter !== key) {
                e.target.style.background = "white";
                e.target.style.borderColor = "#d1d5db";
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#6b7280",
          fontStyle: "italic",
        }}
      >
        {language === "th"
          ? "เลือกช่วงเวลาเพื่อดูข้อมูลการเตือนภัย"
          : "Select time period to view alert data"}
      </div>
    </div>
  );
};

export default TimeFilter;
