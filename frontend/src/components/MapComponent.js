import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import { useLists } from "../context/DataContext";
import Legend from "./Legend";
import TimeFilter from "./TimeFilter";
import ThaiWorkerLayer from "./ThaiWorkerLayer";
import LayerSelector from "./LayerSelector";
import "leaflet/dist/leaflet.css";

// Component to auto-fit bounds to all polygons
const FitBounds = ({ polygons }) => {
  const map = useMap();

  useEffect(() => {
    if (Object.keys(polygons).length > 0) {
      const allCoords = [];

      // Collect all coordinates from all polygons
      Object.values(polygons).forEach((polygon) => {
        polygon.forEach((coord) => {
          allCoords.push([coord[0], coord[1]]); // [lat, lng] format for Leaflet
        });
      });

      if (allCoords.length > 0) {
        const bounds = allCoords.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, L.latLngBounds(allCoords[0], allCoords[0]));

        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [map, polygons]);

  return null;
};

// Component to handle map focusing from external triggers
const MapFocusController = ({ focusTarget, polygons, cities }) => {
  const map = useMap();

  useEffect(() => {
    if (!focusTarget) return;

    const { type, data } = focusTarget;

    if (type === "location" && data.latitude && data.longitude) {
      // Focus on user location
      const userLocation = [data.latitude, data.longitude];
      map.setView(userLocation, 12, { animate: true, duration: 1.5 });

      // Add a temporary marker for user location
      const userMarker = L.marker(userLocation, {
        icon: L.divIcon({
          className: "user-location-marker",
          html: '<div style="background: #dc2626; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      // Remove marker after 5 seconds
      setTimeout(() => {
        map.removeLayer(userMarker);
      }, 5000);
    } else if (type === "polygon" && data.id) {
      // Focus on clicked polygon
      const polygonCoords = polygons[data.id];
      if (polygonCoords && polygonCoords.length > 0) {
        // Convert coordinates to Leaflet format [lat, lng]
        const leafletCoords = polygonCoords.map((coord) => [
          coord[0],
          coord[1],
        ]);

        // Create bounds for the polygon
        const bounds = leafletCoords.reduce((bounds, coord) => {
          return bounds.extend(coord);
        }, L.latLngBounds(leafletCoords[0], leafletCoords[0]));

        // Fit the map to the polygon with some padding
        map.fitBounds(bounds, {
          padding: [30, 30],
          animate: true,
          duration: 1.5,
          maxZoom: 11, // Don't zoom in too much for large polygons
        });
      }
    }
  }, [focusTarget, map, polygons, cities]);

  return null;
};

// Component to render country boundary
const CountryBoundary = ({ isVisible }) => {
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    // Load the country boundary GeoJSON
    fetch("/static/country-boundary.geojson")
      .then((response) => response.json())
      .then((data) => setCountryData(data))
      .catch((error) =>
        console.error("Error loading country boundary:", error)
      );
  }, []);

  if (!countryData || !isVisible) return null;

  const boundaryStyle = {
    color: "#2c3e50",
    weight: 3,
    opacity: 0.8,
    fillColor: "transparent",
    fillOpacity: 0,
    dashArray: "10, 5",
  };

  return (
    <GeoJSON data={countryData} style={boundaryStyle} interactive={false} />
  );
};

// Component to render city polygons
const CityPolygons = ({ onPolygonClick, language, isVisible }) => {
  const { cities, polygons, historical, alertFrequencies } = useLists();

  // Helper function to get alert summary for a city
  const getAlertSummary = (city) => {
    if (!historical || historical.length === 0) return null;

    // Search using Hebrew name since alert data contains Hebrew city names
    const hebrewName = city.he;
    if (!hebrewName) return null;

    // Find recent alerts for this city
    const cityAlerts = historical
      .filter((alert) => alert[2] && alert[2].includes(hebrewName))
      .sort((a, b) => b[3] - a[3]) // Sort by timestamp (newest first)
      .slice(0, 10); // Get last 10 alerts

    return cityAlerts;
  };

  // Helper function to ensure polygon is closed
  const ensureClosedPolygon = (coords) => {
    if (coords.length === 0) return coords;

    const first = coords[0];
    const last = coords[coords.length - 1];

    // Check if first and last points are the same
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return [...coords, first];
    }

    return coords;
  };

  // Helper function to get polygon style based on alert frequency
  const getPolygonStyle = (polygonId) => {
    const alertCount = alertFrequencies[polygonId] || 0;
    let color = "#e8f4fd"; // Very light blue for no alerts

    if (alertCount === 0) {
      color = "#e8f4fd"; // Very light blue for no alerts
    } else if (alertCount <= 10) {
      color = "#90EE90"; // Light green for low risk (1-10 alerts)
    } else if (alertCount <= 50) {
      color = "#ffcc00"; // Yellow for moderate risk (11-50 alerts)
    } else if (alertCount <= 150) {
      color = "#ff6600"; // Orange for high risk (51-150 alerts)
    } else {
      color = "#ff0000"; // Red for very high risk (150+ alerts)
    }

    return {
      color: color,
      weight: 2,
      opacity: 0.8,
      fillColor: color,
      fillOpacity: 0.6,
    };
  };

  const renderPolygons = () => {
    if (!isVisible) return [];

    const polygonElements = [];

    // Match polygons with cities by ID
    Object.entries(polygons).forEach(([polygonId, coords]) => {
      // Find matching city by ID
      const city = Object.values(cities).find(
        (c) => c.id.toString() === polygonId
      );

      if (city && coords && coords.length > 0) {
        // Convert coordinates to Leaflet format [lat, lng]
        const leafletCoords = coords.map((coord) => [coord[0], coord[1]]);
        const closedCoords = ensureClosedPolygon(leafletCoords);

        const style = getPolygonStyle(polygonId);
        const alerts = getAlertSummary(city);
        const alertCount = alertFrequencies[polygonId] || 0;

        const areaData = {
          ...city,
          id: polygonId,
          alerts: alerts,
          alertCount: alertCount,
        };

        polygonElements.push(
          <Polygon
            key={polygonId}
            positions={closedCoords}
            pathOptions={style}
            eventHandlers={{
              click: () => {
                onPolygonClick(areaData);
              },
            }}
          />
        );
      }
    });

    return polygonElements;
  };

  return <>{renderPolygons()}</>;
};

const MapComponent = ({ onPolygonClick, language, isMobile, focusTarget }) => {
  const {
    loading,
    error,
    polygons,
    cities,
    timeFilter,
    updateTimeFilter,
    thaiWorkerData,
    layerVisibility,
    toggleLayerVisibility,
  } = useLists();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          fontFamily: "Kanit",
        }}
      >
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "red",
        }}
      >
        Error loading data: {error}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <MapContainer
        center={[31.5, 35.0]} // Approximate center of Israel
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Google Maps Tile Layer */}
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://www.google.com/maps">Google Maps</a>'
        />

        {/* Country Boundary */}
        <CountryBoundary isVisible={layerVisibility.countryBoundary} />

        {/* Thai Worker Layer - Rendered first so it appears below alert zones */}
        {layerVisibility.thaiWorkers && (
          <ThaiWorkerLayer
            thaiWorkerData={thaiWorkerData}
            language={language}
            onRegionClick={onPolygonClick}
          />
        )}

        {/* City Polygons (Alert Zones) - Rendered last so it appears on top */}
        <CityPolygons
          onPolygonClick={onPolygonClick}
          language={language}
          isVisible={layerVisibility.alertZones}
        />

        {/* Auto-fit bounds */}
        <FitBounds polygons={polygons} />

        {/* Map Focus Controller */}
        <MapFocusController
          focusTarget={focusTarget}
          polygons={polygons}
          cities={cities}
        />
      </MapContainer>

      {/* Time Filter */}
      <TimeFilter
        timeFilter={timeFilter}
        updateTimeFilter={updateTimeFilter}
        language={language}
        isMobile={isMobile}
      />

      {/* Layer Selector */}
      <LayerSelector
        layerVisibility={layerVisibility}
        toggleLayerVisibility={toggleLayerVisibility}
        language={language}
        isMobile={isMobile}
      />

      {/* Legend */}
      <Legend
        language={language}
        timeFilter={timeFilter}
        layerVisibility={layerVisibility}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MapComponent;
