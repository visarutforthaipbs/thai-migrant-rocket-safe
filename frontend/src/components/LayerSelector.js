import React, { useState } from "react";

const LayerSelector = ({
  layerVisibility,
  toggleLayerVisibility,
  language,
  isMobile,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const texts = {
    en: {
      layers: "Layers",
      alertZones: "Alert Zones",
      thaiWorkers: "Thai Workers",
      countryBoundary: "Country Boundary",
    },
    th: {
      layers: "ชั้นข้อมูล",
      alertZones: "เขตเตือนภัย",
      thaiWorkers: "แรงงานไทย",
      countryBoundary: "เขตแดนประเทศ",
    },
  };

  const currentTexts = texts[language];

  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? "5px" : "80px",
        right: isMobile ? "5px" : "360px", // Position next to sidebar (350px width + 10px margin)
        zIndex: 1000,
      }}
    >
      {/* Layer Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: isMobile ? "35px" : "40px",
          height: isMobile ? "35px" : "40px",
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "16px" : "18px",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f8fafc";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
        }}
      >
        🗂️
      </button>

      {/* Layer Controls Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            right: "0",
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            padding: "12px",
            minWidth: "180px",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "13px",
              color: "#2c3e50",
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: "6px",
            }}
          >
            {currentTexts.layers}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {/* Alert Zones */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <input
                type="checkbox"
                checked={layerVisibility.alertZones}
                onChange={() => toggleLayerVisibility("alertZones")}
                style={{ marginRight: "8px" }}
              />
              <span style={{ fontSize: "16px", marginRight: "6px" }}>🚨</span>
              <span style={{ fontSize: "11px" }}>
                {currentTexts.alertZones}
              </span>
            </label>

            {/* Thai Workers */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <input
                type="checkbox"
                checked={layerVisibility.thaiWorkers}
                onChange={() => toggleLayerVisibility("thaiWorkers")}
                style={{ marginRight: "8px" }}
              />
              <span style={{ fontSize: "16px", marginRight: "6px" }}>👥</span>
              <span style={{ fontSize: "11px" }}>
                {currentTexts.thaiWorkers}
              </span>
            </label>

            {/* Country Boundary */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <input
                type="checkbox"
                checked={layerVisibility.countryBoundary}
                onChange={() => toggleLayerVisibility("countryBoundary")}
                style={{ marginRight: "8px" }}
              />
              <span style={{ fontSize: "16px", marginRight: "6px" }}>🗺️</span>
              <span style={{ fontSize: "11px" }}>
                {currentTexts.countryBoundary}
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LayerSelector;
