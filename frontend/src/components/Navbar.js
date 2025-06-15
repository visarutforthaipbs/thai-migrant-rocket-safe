import React, { useState } from "react";

const Navbar = ({ language, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const texts = {
    en: {
      title: "Iron Dome Alert System",
      subtitle: "Safety Guide for Thai Workers",
      emergencyPhone: "Emergency: 101",
      thaiConsulate: "Thai Consulate: 054-636-8150",
    },
    th: {
      title: "ระบบเตือนภัยไอรอนโดม",
      subtitle: "คู่มือความปลอดภัยสำหรับคนไทยในอิสราเอล",
      emergencyPhone: "เหตุฉุกเฉิน: 101",
      thaiConsulate: "สถานกงสุลไทย: 054-636-8150",
    },
  };

  const currentTexts = texts[language];

  return (
    <nav
      style={{
        backgroundColor: "#1e40af",
        color: "white",
        padding: isMobile ? "8px 15px" : "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
        position: "relative",
        flexWrap: isMobile ? "wrap" : "nowrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "15px",
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: isMobile ? "18px" : "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          🛡️{" "}
          {isMobile
            ? language === "th"
              ? "ไอรอนโดม"
              : "Iron Dome"
            : currentTexts.title}
        </div>
        {!isMobile && (
          <div
            style={{
              fontSize: "14px",
              color: "#bfdbfe",
              fontWeight: "500",
            }}
          >
            {currentTexts.subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "20px",
        }}
      >
        {/* Emergency Information */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "15px",
              fontSize: "12px",
              color: "#bfdbfe",
            }}
          >
            <div
              style={{
                backgroundColor: "#dc2626",
                padding: "4px 8px",
                borderRadius: "4px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTexts.emergencyPhone}
            </div>
            <div
              style={{
                backgroundColor: "#059669",
                padding: "4px 8px",
                borderRadius: "4px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTexts.thaiConsulate}
            </div>
          </div>
        )}

        {/* Language Toggle */}
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={() => onLanguageChange("en")}
            style={{
              backgroundColor: language === "en" ? "#3b82f6" : "transparent",
              color: "white",
              border: "1px solid #3b82f6",
              padding: isMobile ? "4px 8px" : "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: "bold",
            }}
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange("th")}
            style={{
              backgroundColor: language === "th" ? "#3b82f6" : "transparent",
              color: "white",
              border: "1px solid #3b82f6",
              padding: isMobile ? "4px 8px" : "5px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: isMobile ? "11px" : "12px",
              fontWeight: "bold",
            }}
          >
            ไทย
          </button>
        </div>
      </div>

      {/* Mobile Emergency Info */}
      {isMobile && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "8px",
            fontSize: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "#dc2626",
              padding: "3px 6px",
              borderRadius: "3px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {currentTexts.emergencyPhone}
          </div>
          <div
            style={{
              backgroundColor: "#059669",
              padding: "3px 6px",
              borderRadius: "3px",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {currentTexts.thaiConsulate}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
