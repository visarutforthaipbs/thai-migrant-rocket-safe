import React, { useState } from "react";
import { DataProvider, useLists } from "./context/DataContext";
import MapComponent from "./components/MapComponent";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import LocationSafetyCheck from "./components/LocationSafetyCheck";
import "./App.css";

const AppContent = () => {
  const [language, setLanguage] = useState("th");
  const [selectedArea, setSelectedArea] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mapFocusTarget, setMapFocusTarget] = useState(null);
  const { timeFilter } = useLists();

  // Check if device is mobile/tablet
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handlePolygonClick = (areaData) => {
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
  };

  const handleLocationFound = (latitude, longitude) => {
    // Focus map on user location
    setMapFocusTarget({
      type: "location",
      data: { latitude, longitude },
    });

    // Clear focus target after animation
    setTimeout(() => setMapFocusTarget(null), 6000); // Longer for location marker
  };

  const handleCloseSidebar = () => {
    setSelectedArea(null);
    setSidebarOpen(false);
  };

  return (
    <div className="App">
      {/* Navbar */}
      <Navbar language={language} onLanguageChange={handleLanguageChange} />

      {/* Main Content Area */}
      <div
        style={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 70px)", // Subtract navbar height only
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Map Container */}
        <div
          style={{
            flex: 1,
            marginRight: isMobile ? "0" : "350px", // No margin on mobile
            height: "100%",
          }}
        >
          <MapComponent
            onPolygonClick={handlePolygonClick}
            language={language}
            isMobile={isMobile}
            focusTarget={mapFocusTarget}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          selectedArea={selectedArea}
          language={language}
          timeFilter={timeFilter}
          onClose={handleCloseSidebar}
          isMobile={isMobile}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Location Safety Check Button */}
      <LocationSafetyCheck
        language={language}
        isMobile={isMobile}
        onLocationFound={handleLocationFound}
      />
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
