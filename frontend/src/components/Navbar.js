import React, { useState } from "react";

const Navbar = ({ language, onLanguageChange }) => {
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
      emergencyPhone: "Emergency: 101",
      thaiConsulate: "Thai Consulate: 054-636-8150",
    },
    th: {
      emergencyPhone: "เหตุฉุกเฉิน: 101",
      thaiConsulate: "สถานกงสุลไทย: 054-636-8150",
    },
  };

  const currentTexts = texts[language];

  return (
    <nav
      style={{
        backgroundColor: "#2b7c9a",
        color: "white",
        padding: isMobile ? "10px 15px" : "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
        position: "relative",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="/tmw-logo.svg"
          alt="TMW Logo"
          style={{
            height: isMobile ? "30px" : "40px",
            width: "auto",
          }}
        />
      </div>

      {/* Emergency Information */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "6px" : "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? "6px" : "15px",
            fontSize: isMobile ? "9px" : "12px",
            color: "#bfdbfe",
          }}
        >
          <div
            style={{
              backgroundColor: "#e14832",
              padding: isMobile ? "4px 6px" : "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {currentTexts.emergencyPhone}
          </div>
          <div
            style={{
              backgroundColor: "#1a5f7a",
              padding: isMobile ? "4px 6px" : "4px 8px",
              borderRadius: "4px",
              color: "white",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            {currentTexts.thaiConsulate}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
