import React from "react";

const Footer = ({ language }) => {
  const texts = {
    en: {
      copyright:
        "Iron Dome Alert System - Safety Guide for Thai Workers in Israel",
      lastUpdated: "Last Updated",
      disclaimer:
        "This is an emergency information system. Always follow official Israeli authorities' instructions.",
      support: "For support contact Thai Consulate: 03-544-1462",
      version: "Version 1.0",
      links: [
        { label: "🏥 Health Services", url: "#" },
        { label: "🏛️ Government Services", url: "#" },
        { label: "🇹🇭 Thai Community", url: "#" },
        { label: "📞 Emergency Services", url: "#" },
      ],
    },
    th: {
      copyright:
        "ระบบเตือนภัยไอรอนโดม - คู่มือความปลอดภัยสำหรับคนงานไทยในอิสราเอล",
      lastUpdated: "อัพเดทล่าสุด",
      disclaimer:
        "นี่คือระบบข้อมูลฉุกเฉิน โปรดปฏิบัติตามคำแนะนำของเจ้าหน้าที่อิสราเอลเสมอ",
      support: "สำหรับการสนับสนุน ติดต่อสถานกงสุลไทย: 03-544-1462",
      version: "เวอร์ชั่น 1.0",
      links: [
        { label: "🏥 บริการสุขภาพ", url: "#" },
        { label: "🏛️ บริการรัฐบาล", url: "#" },
        { label: "🇹🇭 ชุมชนไทย", url: "#" },
        { label: "📞 บริการฉุกเฉิน", url: "#" },
      ],
    },
  };

  const currentTexts = texts[language];
  const currentDate = new Date().toLocaleDateString(
    language === "th" ? "th-TH" : "en-US"
  );

  return (
    <footer
      style={{
        backgroundColor: "#1f2937",
        color: "#f9fafb",
        padding: "20px 0",
        marginTop: "auto",
        borderTop: "3px solid #3b82f6",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {/* Main Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* System Info */}
          <div>
            <h4
              style={{
                color: "#3b82f6",
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              🛡️ {language === "th" ? "ระบบเตือนภัย" : "Alert System"}
            </h4>
            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#d1d5db",
                margin: "0 0 10px 0",
              }}
            >
              {currentTexts.copyright}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: 0,
              }}
            >
              {currentTexts.lastUpdated}: {currentDate}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: "#3b82f6",
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              {language === "th" ? "ลิงก์ด่วน" : "Quick Links"}
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px",
              }}
            >
              {currentTexts.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  style={{
                    color: "#d1d5db",
                    textDecoration: "none",
                    fontSize: "12px",
                    padding: "4px 8px",
                    backgroundColor: "#374151",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.backgroundColor = "#4b5563")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.backgroundColor = "#374151")
                  }
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4
              style={{
                color: "#3b82f6",
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              {language === "th" ? "ติดต่อฉุกเฉิน" : "Emergency Contact"}
            </h4>
            <div
              style={{
                backgroundColor: "#dc2626",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                🚨 {language === "th" ? "เหตุฉุกเฉิน" : "Emergency"}: 101
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                }}
              >
                {language === "th"
                  ? "โทรฟรีจากทุกเครือข่าย"
                  : "Free from all networks"}
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#059669",
                padding: "10px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                🇹🇭 {language === "th" ? "สถานกงสุลไทย" : "Thai Consulate"}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.9,
                }}
              >
                03-544-1462
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid #374151",
            paddingTop: "15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            {currentTexts.version} | {currentTexts.support}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            ⚠️ {currentTexts.disclaimer}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
