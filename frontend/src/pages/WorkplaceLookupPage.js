import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useLists } from "../context/DataContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polygon,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Component to recenter map when location changes
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 12);
    }
  }, [lat, lng, map]);
  return null;
};

const WorkplaceLookupPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState("th");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isAddressGuideOpen, setIsAddressGuideOpen] = useState(false);
  const { historical, cities, polygons, alertFrequencies } = useLists();

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
      fillOpacity: 0.5,
    };
  };

  const texts = {
    th: {
      title: "🔍 ค้นหาข้อมูลสถานที่ทำงานและประเมินความเสี่ยง",
      subtitle: "สำหรับแรงงานไทยที่จะไปทำงานในอิสราเอล",
      searchPlaceholder: "ชื่อเมือง, หรือที่อยู่",
      searchButton: "ค้นหาสถานที่",
      noResults: "ไม่พบข้อมูลสถานที่ที่ค้นหา",
      tryAgain: "ลองค้นหาด้วยคำอื่น เช่น ชื่อเมือง หรือภูมิภาค",
      exampleSearches: "ตัวอย่างการค้นหา:",
      examples: [
        "Tel Aviv - เมืองเทลอาวีฟ",
        "Haifa - เมืองไฮฟา",
        "Northern - ภาคเหนือ",
        "Kiryat Gat - เมืองคีริยัต กัต",
        "Jerusalem - เยรูซาเล็ม",
        "Beersheba - เบเออร์เชบา",
      ],
      howToUse: "วิธีใช้งาน:",
      instructions: [
        "📄 ดูเอกสารจากนายจ้างที่ได้รับ",
        "🔍 หาชื่อเมืองหรือภูมิภาคในเอกสาร (เช่น NORTHERN, SOUTHERN, HAZAFON)",
        "⌨️ กรอกชื่อนั้นในช่องค้นหา",
        "✅ ดูข้อมูลความปลอดภัยของพื้นที่",
      ],
      addressGuide: "คู่มือเข้าใจที่อยู่นายจ้างอิสราเอล (ฉบับง่าย)",
      addressGuideContent: [
        {
          title:
            'เวลาคุณเห็นที่อยู่ของนายจ้าง ให้มองหา "คำในวงเล็บ" ก่อนเลยครับ นี่คือสิ่งที่สำคัญที่สุด',
        },
        {
          subtitle: '1. คำในวงเล็บ = "ภาค" ของไทย',
          content: 'คำในวงเล็บ (เช่น HAZAFON) จะบอกว่านายจ้างอยู่ "ภาค" ไหน',
          examples: [
            "(HAZAFON) = ภาคเหนือ (เหมือน เชียงใหม่, เชียงราย)",
            "(HADAROM) = ภาคใต้ (เหมือน ชุมพร, สงขลา)",
            "(HAMERKAZ) = ภาคกลาง (เหมือน กรุงเทพฯ, อยุธยา)",
          ],
        },
        {
          subtitle: '2. ชื่อภาษาอังกฤษอื่นๆ = "เมือง" หรือ "อำเภอ"',
          content:
            'ชื่ออื่นๆ ที่ไม่ใช่คำในวงเล็บ คือชื่อ "เมือง", "หมู่บ้าน" หรือ "ชุมชน" ที่คุณจะไปทำงาน',
        },
        {
          subtitle: "ลองดูตัวอย่างจริง",
          addressExample:
            "HARIMON ST. KIRYAT GAT SOUTHERN (HADAROM) KIRYAT GAT (QIRYAT GAT) STATE OF ISRAEL",
          steps: [
            "หาคำในวงเล็บ: เราเห็น (HADAROM) → แปลว่า: ภาคใต้",
            "หาชื่อเมือง: เราเห็น KIRYAT GAT → แปลว่า: เมืองคิรยัตกัต",
            'สรุปง่ายๆ: ที่ทำงานนี้อยู่ที่ "เมืองคิรยัตกัต" ใน "ภาคใต้" ของอิสราเอลครับ',
          ],
        },
      ],
      safetyInfo: "ข้อมูลความปลอดภัย",
      recentAlerts: "การแจ้งเตือนล่าสุด",
      riskLevel: "ระดับความเสี่ยง",
      location: "ตำแหน่งที่ตั้ง",
      region: "ภูมิภาค",
      alertsLast7Days: "การแจ้งเตือนใน 7 วันที่ผ่านมา",
      alertsLast30Days: "การแจ้งเตือนใน 30 วันที่ผ่านมา",
      alertsLast90Days: "การแจ้งเตือนใน 90 วันที่ผ่านมา",
      safe: "ปลอดภัย",
      lowRisk: "เสี่ยงต่ำ",
      moderateRisk: "เสี่ยงปานกลาง",
      highRisk: "เสี่ยงสูง",
      veryHighRisk: "เสี่ยงสูงมาก",
      backToHome: "← กลับไปแผนที่",
      foundResults: "พบ {count} สถานที่",
      selectLocation: "คลิกที่การ์ดเพื่อดูรายละเอียด",
      totalAlerts: "ทั้งหมด",
      noAlertsRecently: "ไม่มีการแจ้งเตือนในช่วงที่เลือก",
      lastAlert: "แจ้งเตือนล่าสุด",
      cityName: "ชื่อเมือง",
      selectToViewDetails: "เลือกสถานที่เพื่อดูรายละเอียดความปลอดภัย",
      locationOnMap: "ตำแหน่งบนแผนที่",
      methodologyTitle: "วิธีการคำนวณความเสี่ยง",
      methodologyContent:
        "ข้อมูลความเสี่ยงของเราคำนวณจากประวัติการแจ้งเตือนภัยทั้งหมดที่เคยเกิดขึ้นในพื้นที่นั้นๆ โดยใช้ข้อมูลจากระบบ Red Alert ของอิสราเอล ยิ่งพื้นที่ไหนมีประวัติการแจ้งเตือนมาก ก็แสดงว่ามีความเสี่ยงสูงขึ้น เราแบ่งระดับความเสี่ยงเป็น 5 ระดับ: ปลอดภัย (0 ครั้ง), เสี่ยงต่ำ (1-10 ครั้ง), เสี่ยงปานกลาง (11-50 ครั้ง), เสี่ยงสูง (51-150 ครั้ง), และเสี่ยงสูงมาก (มากกว่า 150 ครั้ง)",
      dataSource:
        "แหล่งข้อมูล: ระบบ Red Alert ของอิสราเอล และข้อมูลประวัติการแจ้งเตือนภัย",
    },
    en: {
      title: "🔍 Workplace Safety Lookup",
      subtitle: "For Thai workers going to work in Israel",
      searchPlaceholder: "Enter company name, city, or address",
      searchButton: "Search Location",
      noResults: "No locations found",
      tryAgain: "Try searching with different terms like city name or region",
      exampleSearches: "Example searches:",
      examples: [
        "Tel Aviv - Tel Aviv city",
        "Haifa - Haifa city",
        "Northern - Northern region",
        "Kiryat Gat - Kiryat Gat city",
        "Jerusalem - Jerusalem city",
        "Beersheba - Beersheba city",
      ],
      howToUse: "How to use:",
      instructions: [
        "📄 Look at your employer documents",
        "🔍 Find city or region name (e.g., NORTHERN, SOUTHERN, HAZAFON)",
        "⌨️ Enter that name in search box",
        "✅ View safety information for the area",
      ],
      safetyInfo: "Safety Information",
      recentAlerts: "Recent Alerts",
      riskLevel: "Risk Level",
      location: "Location",
      region: "Region",
      alertsLast7Days: "Alerts in last 7 days",
      alertsLast30Days: "Alerts in last 30 days",
      alertsLast90Days: "Alerts in last 90 days",
      safe: "Safe",
      lowRisk: "Low Risk",
      moderateRisk: "Moderate Risk",
      highRisk: "High Risk",
      veryHighRisk: "Very High Risk",
      backToHome: "← Back to Map",
      foundResults: "Found {count} locations",
      selectLocation: "Click on card to view details",
      totalAlerts: "Total",
      noAlertsRecently: "No alerts in selected period",
      lastAlert: "Last alert",
      cityName: "City Name",
      selectToViewDetails: "Select a location to view safety details",
      locationOnMap: "Location on Map",
      methodologyTitle: "Risk Calculation Methodology",
      methodologyContent:
        "Our risk data is calculated from the total historical alert records in each area using data from Israel's Red Alert system. Areas with more historical alerts indicate higher risk levels. We categorize risk into 5 levels: Safe (0 alerts), Low Risk (1-10 alerts), Moderate Risk (11-50 alerts), High Risk (51-150 alerts), and Very High Risk (150+ alerts).",
      dataSource:
        "Data Source: Israel Red Alert System and historical alert records",
    },
  };

  const t = texts[currentLanguage];

  // Function to log search to backend
  const logSearch = async (query, results, selected = null) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";

      await fetch(`${apiUrl}/api/log-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery: query,
          resultsCount: results.length,
          selectedLocation: selected,
          language: currentLanguage,
        }),
      });
    } catch (error) {
      // Silent fail - don't interrupt user experience
      console.error("Failed to log search:", error);
    }
  };

  // Search function
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase().trim();

    // If cities is an object, convert to array
    const citiesArray = Array.isArray(cities)
      ? cities
      : Object.values(cities || {});

    const results = citiesArray.filter((city) => {
      const nameEn = (city.en || city.name || "").toLowerCase();
      const nameHe = (city.he || "").toLowerCase();

      return nameEn.includes(query) || nameHe.includes(query);
    });

    setSearchResults(results);
    setSearchPerformed(true);
    setSelectedLocation(null);

    // Log the search
    logSearch(searchQuery, results);
  };

  // Handle location selection
  const handleLocationSelect = (city) => {
    setSelectedLocation(city);
    // Log the search with selected location
    logSearch(searchQuery, searchResults, city);
  };

  // Calculate alerts for a location
  const getAlertsForLocation = (city) => {
    if (!historical || !Array.isArray(historical))
      return { last7Days: 0, last30Days: 0, last90Days: 0, total: 0 };

    const now = Math.floor(Date.now() / 1000);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    const ninetyDaysAgo = now - 90 * 24 * 60 * 60;

    const cityName = city.en || city.name || city.he;

    console.log("Searching for alerts for city:", {
      en: city.en,
      he: city.he,
      name: city.name,
      searching: cityName,
    });

    const cityAlerts = historical.filter((alert) => {
      const alertCities = alert[2] || [];
      return alertCities.some((alertCity) => {
        const match =
          alertCity === cityName ||
          alertCity === city.he ||
          alertCity === city.en;
        if (match) {
          console.log("Found matching alert:", alert);
        }
        return match;
      });
    });

    console.log("Total alerts found:", cityAlerts.length);

    const last7Days = cityAlerts.filter((a) => a[3] >= sevenDaysAgo).length;
    const last30Days = cityAlerts.filter((a) => a[3] >= thirtyDaysAgo).length;
    const last90Days = cityAlerts.filter((a) => a[3] >= ninetyDaysAgo).length;

    return { last7Days, last30Days, last90Days, total: cityAlerts.length };
  };

  // Get risk level based on total historical alerts (matching the map polygon colors)
  const getRiskLevel = (alerts) => {
    const totalAlerts = alerts.total || 0;

    // Match the polygon color scheme from getPolygonStyle
    if (totalAlerts === 0) {
      return { level: t.safe, color: "#22c55e" }; // Green - Safe
    } else if (totalAlerts <= 10) {
      return { level: t.lowRisk, color: "#90EE90" }; // Light green - Low risk
    } else if (totalAlerts <= 50) {
      return { level: t.moderateRisk, color: "#ffcc00" }; // Yellow - Moderate risk
    } else if (totalAlerts <= 150) {
      return { level: t.highRisk, color: "#ff6600" }; // Orange - High risk
    } else {
      return { level: t.veryHighRisk, color: "#ff0000" }; // Red - Very high risk
    }
  };

  // Format last alert time
  const getLastAlertTime = (city) => {
    if (!historical || !Array.isArray(historical)) return null;

    const cityName = city.en || city.name || city.he;
    const cityAlerts = historical.filter((alert) => {
      const alertCities = alert[2] || [];
      return alertCities.some(
        (alertCity) =>
          alertCity === cityName ||
          alertCity === city.he ||
          alertCity === city.en
      );
    });

    if (cityAlerts.length === 0) return null;

    const latestAlert = cityAlerts.sort((a, b) => b[3] - a[3])[0];
    const date = new Date(latestAlert[3] * 1000);
    return date.toLocaleDateString(
      currentLanguage === "th" ? "th-TH" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Navbar
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
          paddingTop: "calc(var(--navbar-height) + 2rem)",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            color: "#2b7c9a",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "0.5rem",
            }}
          >
            {t.title}
          </h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>{t.subtitle}</p>
        </div>

        {/* Search Section */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t.searchPlaceholder}
              style={{
                flex: 1,
                minWidth: "250px",
                padding: "1rem 1.5rem",
                fontSize: "1.1rem",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "1rem 2rem",
                background: "#2b7c9a",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              🔍 {t.searchButton}
            </button>
          </div>

          {/* How to Use */}
          <div
            style={{
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                marginBottom: "1rem",
                fontSize: "1.2rem",
              }}
            >
              {t.howToUse}
            </h3>
            <div style={{ marginLeft: "1.5rem", color: "#475569" }}>
              {t.instructions.map((instruction, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "0.5rem", lineHeight: "1.6" }}
                >
                  {instruction}
                </div>
              ))}
            </div>
          </div>

          {/* Address Guide - Collapsible */}
          <div
            style={{
              background: "#fef3c7",
              borderRadius: "12px",
              marginBottom: "1.5rem",
              border: "2px solid #fbbf24",
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setIsAddressGuideOpen(!isAddressGuideOpen)}
              style={{
                width: "100%",
                padding: "1.25rem 1.5rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fde68a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <h3
                style={{
                  color: "#92400e",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                📋 {t.addressGuide}
              </h3>
              <span
                style={{
                  color: "#92400e",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  transition: "transform 0.3s ease",
                  transform: isAddressGuideOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                }}
              >
                ▼
              </span>
            </button>

            {isAddressGuideOpen && (
              <div
                style={{
                  padding: "0 1.5rem 1.5rem 1.5rem",
                  color: "#78350f",
                  animation: "slideDown 0.3s ease-out",
                }}
              >
                {t.addressGuideContent.map((section, index) => (
                  <div key={index} style={{ marginBottom: "1.5rem" }}>
                    {section.title && (
                      <p
                        style={{
                          fontSize: "1rem",
                          lineHeight: "1.6",
                          marginBottom: "1rem",
                          fontWeight: "500",
                        }}
                      >
                        {section.title}
                      </p>
                    )}
                    {section.subtitle && (
                      <h4
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          color: "#b45309",
                        }}
                      >
                        {section.subtitle}
                      </h4>
                    )}
                    {section.content && (
                      <p style={{ lineHeight: "1.6", marginBottom: "0.5rem" }}>
                        {section.content}
                      </p>
                    )}
                    {section.examples && (
                      <div style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                        {section.examples.map((example, i) => (
                          <div
                            key={i}
                            style={{
                              marginBottom: "0.3rem",
                              lineHeight: "1.6",
                              paddingLeft: "1rem",
                              borderLeft: "3px solid #fbbf24",
                            }}
                          >
                            • {example}
                          </div>
                        ))}
                      </div>
                    )}
                    {section.addressExample && (
                      <div
                        style={{
                          background: "#fffbeb",
                          padding: "1rem",
                          borderRadius: "8px",
                          border: "1px dashed #fbbf24",
                          marginTop: "0.5rem",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <strong
                          style={{ display: "block", marginBottom: "0.5rem" }}
                        >
                          ที่อยู่เต็ม:
                        </strong>
                        <code
                          style={{
                            fontSize: "0.9rem",
                            color: "#b45309",
                            wordBreak: "break-word",
                            display: "block",
                          }}
                        >
                          {section.addressExample}
                        </code>
                      </div>
                    )}
                    {section.steps && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <strong
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            color: "#b45309",
                          }}
                        >
                          วิธีอ่านแบบง่าย:
                        </strong>
                        {section.steps.map((step, i) => (
                          <div
                            key={i}
                            style={{
                              marginBottom: "0.5rem",
                              paddingLeft: "1rem",
                              lineHeight: "1.7",
                            }}
                          >
                            {i + 1}. {step}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Examples */}
          <div>
            <h4 style={{ color: "#1e293b", marginBottom: "1rem" }}>
              {t.exampleSearches}
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {t.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const searchTerm = example.split(" - ")[0];
                    setSearchQuery(searchTerm);
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#e3f2f7",
                    color: "#2b7c9a",
                    border: "1px solid #2b7c9a",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontSize: "0.95rem",
                  }}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchPerformed && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            {searchResults.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#64748b",
                    marginBottom: "1rem",
                  }}
                >
                  {t.noResults}
                </p>
                <p style={{ color: "#64748b" }}>{t.tryAgain}</p>
              </div>
            ) : (
              <>
                <h2 style={{ color: "#1e293b", marginBottom: "0.5rem" }}>
                  {t.foundResults.replace("{count}", searchResults.length)}
                </h2>
                <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                  {t.selectLocation}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    marginTop: "1.5rem",
                  }}
                >
                  {searchResults.map((city, index) => {
                    const alerts = getAlertsForLocation(city);
                    const risk = getRiskLevel(alerts);
                    const isSelected = selectedLocation === city;

                    return (
                      <div
                        key={index}
                        onClick={() => handleLocationSelect(city)}
                        style={{
                          background: "white",
                          border: isSelected
                            ? "3px solid #667eea"
                            : "2px solid #e2e8f0",
                          borderRadius: "12px",
                          padding: "1.5rem",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform: isSelected ? "translateY(-4px)" : "none",
                          boxShadow: isSelected
                            ? "0 8px 20px rgba(102, 126, 234, 0.3)"
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                            marginBottom: "1rem",
                          }}
                        >
                          <h3
                            style={{
                              color: "#1e293b",
                              fontSize: "1.3rem",
                              margin: 0,
                              flex: 1,
                            }}
                          >
                            {city.en || city.name}
                          </h3>
                          <div
                            style={{
                              padding: "0.4rem 0.8rem",
                              borderRadius: "6px",
                              color: "white",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              whiteSpace: "nowrap",
                              backgroundColor: risk.color,
                            }}
                          >
                            {risk.level}
                          </div>
                        </div>
                        <div style={{ color: "#64748b" }}>
                          {city.he && (
                            <p
                              style={{
                                fontWeight: "600",
                                color: "#475569",
                                marginBottom: "0.5rem",
                              }}
                            >
                              {city.he}
                            </p>
                          )}
                          <div
                            style={{
                              display: "flex",
                              gap: "1rem",
                              paddingTop: "0.75rem",
                              borderTop: "1px solid #e2e8f0",
                              fontSize: "0.9rem",
                            }}
                          >
                            <span>🚨 7d: {alerts.last7Days}</span>
                            <span>📊 30d: {alerts.last30Days}</span>
                            <span>📈 90d: {alerts.last90Days}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Selected Location Details */}
        {selectedLocation && (
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "2rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                color: "#1e293b",
                marginBottom: "1.5rem",
                fontSize: "1.8rem",
              }}
            >
              {t.safetyInfo}: {selectedLocation.en || selectedLocation.name}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    color: "#1e293b",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {t.location}
                </h3>
                <p
                  style={{
                    color: "#475569",
                    marginBottom: "0.5rem",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>{t.cityName}:</strong>{" "}
                  {selectedLocation.en || selectedLocation.name}
                </p>
                {selectedLocation.he && (
                  <p
                    style={{
                      color: "#475569",
                      marginBottom: "0.5rem",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong>Hebrew:</strong> {selectedLocation.he}
                  </p>
                )}
              </div>

              {(() => {
                const alerts = getAlertsForLocation(selectedLocation);
                const risk = getRiskLevel(alerts);
                const lastAlert = getLastAlertTime(selectedLocation);

                return (
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "1.5rem",
                      borderRadius: "12px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#1e293b",
                        marginBottom: "1rem",
                        fontSize: "1.2rem",
                      }}
                    >
                      {t.riskLevel}
                    </h3>
                    <div
                      style={{
                        padding: "1rem",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "1.5rem",
                        fontWeight: "700",
                        textAlign: "center",
                        marginBottom: "1rem",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                        backgroundColor: risk.color,
                      }}
                    >
                      {risk.level}
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                      <p
                        style={{
                          padding: "0.5rem 0",
                          borderBottom: "1px solid #e2e8f0",
                          color: "#475569",
                        }}
                      >
                        <strong>{t.alertsLast7Days}:</strong> {alerts.last7Days}
                      </p>
                      <p
                        style={{
                          padding: "0.5rem 0",
                          borderBottom: "1px solid #e2e8f0",
                          color: "#475569",
                        }}
                      >
                        <strong>{t.alertsLast30Days}:</strong>{" "}
                        {alerts.last30Days}
                      </p>
                      <p
                        style={{
                          padding: "0.5rem 0",
                          borderBottom: "1px solid #e2e8f0",
                          color: "#475569",
                        }}
                      >
                        <strong>{t.alertsLast90Days}:</strong>{" "}
                        {alerts.last90Days}
                      </p>
                      <p style={{ padding: "0.5rem 0", color: "#475569" }}>
                        <strong>{t.totalAlerts}:</strong> {alerts.total}
                      </p>
                      {lastAlert && (
                        <p
                          style={{
                            padding: "0.5rem 0",
                            color: "#475569",
                            fontSize: "0.9rem",
                            fontStyle: "italic",
                          }}
                        >
                          <strong>{t.lastAlert}:</strong> {lastAlert}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Methodology Section */}
            <div
              style={{
                background: "#fef3c7",
                padding: "1.5rem",
                borderRadius: "12px",
                marginTop: "1.5rem",
                border: "2px solid #fbbf24",
              }}
            >
              <h3
                style={{
                  color: "#92400e",
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                📊 {t.methodologyTitle}
              </h3>
              <p
                style={{
                  color: "#78350f",
                  lineHeight: "1.7",
                  marginBottom: "0.75rem",
                  fontSize: "0.95rem",
                }}
              >
                {t.methodologyContent}
              </p>
              <p
                style={{
                  color: "#b45309",
                  fontSize: "0.85rem",
                  fontStyle: "italic",
                }}
              >
                {t.dataSource}
              </p>
            </div>

            {/* Map Visualization */}
            <div
              style={{
                marginTop: "2rem",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h3
                style={{
                  color: "#1e293b",
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  padding: "0 0.5rem",
                }}
              >
                🗺️ {t.locationOnMap}
              </h3>
              <div
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={[
                    selectedLocation.lat || 32.0853,
                    selectedLocation.lng || 34.7818,
                  ]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Render all city polygons with alert data */}
                  {(() => {
                    const polygonElements = [];

                    // Render all polygons
                    Object.entries(polygons).forEach(([polygonId, coords]) => {
                      // Find matching city by ID
                      const citiesArray = Array.isArray(cities)
                        ? cities
                        : Object.values(cities || {});
                      const city = citiesArray.find(
                        (c) => c.id?.toString() === polygonId
                      );

                      if (city && coords && coords.length > 0) {
                        // Convert coordinates to Leaflet format [lat, lng]
                        const leafletCoords = coords.map((coord) => [
                          coord[0],
                          coord[1],
                        ]);
                        const closedCoords = ensureClosedPolygon(leafletCoords);
                        const style = getPolygonStyle(polygonId);

                        polygonElements.push(
                          <Polygon
                            key={polygonId}
                            positions={closedCoords}
                            pathOptions={style}
                          />
                        );
                      }
                    });

                    return polygonElements;
                  })()}

                  {/* Marker for selected location */}
                  <Marker
                    position={[
                      selectedLocation.lat || 32.0853,
                      selectedLocation.lng || 34.7818,
                    ]}
                  >
                    <Popup>
                      <div style={{ fontFamily: "inherit" }}>
                        <strong>
                          {selectedLocation.en || selectedLocation.name}
                        </strong>
                        <br />
                        {selectedLocation.he && (
                          <>
                            {selectedLocation.he}
                            <br />
                          </>
                        )}
                        <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                          {selectedLocation.lat?.toFixed(4)},{" "}
                          {selectedLocation.lng?.toFixed(4)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                  <RecenterMap
                    lat={selectedLocation.lat || 32.0853}
                    lng={selectedLocation.lng || 34.7818}
                  />
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkplaceLookupPage;
