import React, { useState, useEffect, useCallback } from "react";
import { useLists } from "../context/DataContext";
import MapComponent from "../components/MapComponent";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import EmergencyBar from "../components/EmergencyBar";

const MapPage = () => {
  const [language, setLanguage] = useState("th");
  const [selectedArea, setSelectedArea] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapFocusTarget, setMapFocusTarget] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const { timeFilter } = useLists();

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Emergency mode: Focus on last 3 hours of alerts only
  useEffect(() => {
    const checkEmergencyMode = () => {
      const recentThreshold = 3 * 60 * 60 * 1000; // 3 hours
      const hasRecentAlerts = false; // This would be determined by actual alert data
      setEmergencyMode(hasRecentAlerts);
    };

    checkEmergencyMode();
    const interval = setInterval(checkEmergencyMode, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Auto-locate user for emergency response
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(
            "Location access denied - emergency response may be limited"
          );
        }
      );
    }
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handlePolygonClick = useCallback(
    (areaData) => {
      setSelectedArea(areaData);
      if (isMobile) {
        setSidebarOpen(true);
      }

      // Focus map on the clicked polygon
      setMapFocusTarget({
        type: "polygon",
        data: areaData,
      });

      // Clear focus target after animation
      setTimeout(() => setMapFocusTarget(null), 2000);
    },
    [isMobile]
  );

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="App">
      {/* Emergency Alert Bar - Always visible for immediate response */}
      <EmergencyBar
        language={language}
        userLocation={userLocation}
        emergencyMode={emergencyMode}
      />

      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        isMobile={isMobile}
      />

      <main className="main-content">
        <div className="map-wrap">
          <MapComponent
            onPolygonClick={handlePolygonClick}
            language={language}
            isMobile={isMobile}
            focusTarget={mapFocusTarget}
            userLocation={userLocation}
            emergencyMode={emergencyMode} // Pass emergency mode to map
          />
        </div>

        <Sidebar
          selectedArea={selectedArea}
          language={language}
          timeFilter={timeFilter}
          onClose={handleCloseSidebar}
          isMobile={isMobile}
          isOpen={sidebarOpen}
          emergencyFocus={true} // Focus on immediate safety info
        />
      </main>

      {/* Remove LocationSafetyCheck - Emergency map should focus only on alerts and emergency response */}
      {/* Safety check functionality moved to dedicated Safety Assessment page */}
    </div>
  );
};

export default MapPage;
