import React from "react";
import { GeoJSON } from "react-leaflet";

const ThaiWorkerLayer = ({ thaiWorkerData, language, onRegionClick }) => {
  if (!thaiWorkerData) return null;

  // Function to get color based on Thai worker population
  const getWorkerPopulationColor = (numWorkers) => {
    if (numWorkers >= 10000) return "#8B0000"; // Dark red for very high population
    if (numWorkers >= 5000) return "#DC143C"; // Crimson for high population
    if (numWorkers >= 2000) return "#FF6347"; // Tomato for medium-high population
    if (numWorkers >= 1000) return "#FFA500"; // Orange for medium population
    if (numWorkers >= 500) return "#FFD700"; // Gold for low-medium population
    if (numWorkers >= 100) return "#FFFF99"; // Light yellow for low population
    return "#F0F8FF"; // Alice blue for very low population
  };

  // Style function for each feature
  const getFeatureStyle = (feature) => {
    const numWorkers = feature.properties["num-thai-w"] || 0;
    const color = getWorkerPopulationColor(numWorkers);

    return {
      fillColor: color,
      weight: 2,
      opacity: 0.8,
      color: "#2c3e50",
      fillOpacity: 0.6,
    };
  };

  // Function to handle feature clicks
  const onEachFeature = (feature, layer) => {
    const props = feature.properties;
    const numWorkers = props["num-thai-w"] || 0;
    const regionName = props.layer || "Unknown Region";

    // Add click event handler
    layer.on({
      click: () => {
        if (onRegionClick) {
          onRegionClick({
            regionName,
            numWorkers,
            layer: regionName,
            type: "thaiWorker",
          });
        }
      },
    });
  };

  return (
    <GeoJSON
      data={thaiWorkerData}
      style={getFeatureStyle}
      onEachFeature={onEachFeature}
    />
  );
};

export default ThaiWorkerLayer;
