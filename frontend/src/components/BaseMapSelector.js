import React from "react";
import { useLists } from "../context/DataContext";

const BaseMapSelector = ({ language, isMobile }) => {
  const { baseMap, changeBaseMap } = useLists();

  const mapTypes = [
    {
      id: "streets",
      nameEn: "Streets",
      nameTh: "แผนที่ถนน",
      icon: "🗺️",
    },
    {
      id: "satellite",
      nameEn: "Satellite",
      nameTh: "ดาวเทียม",
      icon: "🛰️",
    },
    {
      id: "hybrid",
      nameEn: "Hybrid",
      nameTh: "ผสม",
      icon: "🌍",
    },
    {
      id: "terrain",
      nameEn: "Terrain",
      nameTh: "ภูมิประเทศ",
      icon: "🏔️",
    },
    {
      id: "osm",
      nameEn: "OpenStreetMap",
      nameTh: "โอเพ่นสตรีทแมป",
      icon: "🌐",
    },
  ];

  const handleMapTypeChange = (mapType) => {
    changeBaseMap(mapType);
  };

  return (
    <div className={`base-map-selector ${isMobile ? "mobile" : "desktop"}`}>
      <div className="base-map-header">
        <span className="base-map-title">
          {language === "th" ? "แผนที่พื้นฐาน" : "Base Map"}
        </span>
      </div>
      <div className="base-map-options">
        {mapTypes.map((mapType) => (
          <button
            key={mapType.id}
            className={`base-map-option ${
              baseMap === mapType.id ? "active" : ""
            }`}
            onClick={() => handleMapTypeChange(mapType.id)}
            title={language === "th" ? mapType.nameTh : mapType.nameEn}
          >
            <span className="map-icon">{mapType.icon}</span>
            <span className="map-name">
              {language === "th" ? mapType.nameTh : mapType.nameEn}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BaseMapSelector;
