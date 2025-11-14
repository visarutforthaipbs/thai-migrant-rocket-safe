import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DashboardPage = ({ language }) => {
  const [currentLanguage, setCurrentLanguage] = useState(language || "th");
  const [analytics, setAnalytics] = useState(null);
  const [recentChecks, setRecentChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(30);

  const texts = {
    en: {
      pageTitle: "Thai Worker Safety Intelligence Dashboard",
      subtitle:
        "Strategic oversight and situational assessment for authorities and civil society",
      restrictedAccess: "🔒 Authorized Personnel Only",
      accessNote:
        "This dashboard is intended for Thai government officials, consulate staff, NGOs, and civil society organizations involved in Thai worker protection.",
      backToMap: "← Emergency Alert Map",
      populationOverview: "Population Safety Overview",
      totalChecks: "Total Location Assessments",
      workersAtRisk: "Workers in Higher Risk Areas",
      workersSafe: "Workers in Safe Areas",
      vulnerabilityAssessment: "Vulnerability Assessment",
      riskDistribution: "Geographic Risk Distribution",
      strategicIntelligence: "Strategic Intelligence",
      dailyActivity: "Activity Patterns (Last 7 Days)",
      geographicAnalysis: "Geographic Distribution Analysis",
      highRiskLocations: "Areas of Concern",
      resourceAllocation: "Resource Allocation Insights",
      recentChecks: "Recent Worker Assessments",
      policySupport: "Policy Support Data",
      location: "Location",
      riskLevel: "Risk Classification",
      alerts: "Security Incidents",
      timestamp: "Assessment Time",
      safe: "Safe Zone",
      lowRisk: "Low Risk",
      moderateRisk: "Moderate Risk",
      highRisk: "Higher Risk",
      veryHighRisk: "High Risk Zone",
      unknown: "Unassessed",
      noData: "No data available",
      loading: "Loading intelligence data...",
      error: "Error loading dashboard",
      timeRange: "Analysis Period",
      last7Days: "Last 7 Days",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      coordinates: "Coordinates",
      checksCount: "Assessments",
      maxAlerts: "Max Incidents",
      refreshData: "Refresh Intelligence",
      lastUpdated: "Last Updated",
      workerDistribution: "Worker Distribution Analysis",
      riskExposure: "Risk Exposure Statistics",
      temporalAnalysis: "Temporal Threat Analysis",
      evacuationPlanning: "Evacuation Planning Data",
      consulateServices: "Consulate Service Optimization",
      safetyCampaigns: "Safety Campaign Targeting",
      emergencyPreparedness: "Emergency Response Planning",
      keyInsights: "Key Strategic Insights",
      recommendations: "Policy Recommendations",
      exportData: "Export Analysis",
      generateReport: "Generate Report",
    },
    th: {
      pageTitle: "แดชบอร์ดข่าวกรองความปลอดภัยคนไทย",
      subtitle:
        "การกำกับดูแลเชิงกลยุทธ์และการประเมินสถานการณ์สำหรับหน่วยงานและภาคประชาสังคม",
      restrictedAccess: "🔒 เฉพาะบุคลากรที่ได้รับอนุญาต",
      accessNote:
        "แดชบอร์ดนี้มีไว้สำหรับเจ้าหน้าที่รัฐบาลไทย เจ้าหน้าที่สถานกงสุล องค์กรพัฒนาเอกชน และองค์กรภาคประชาสังคมที่เกี่ยวข้องกับการปกป้องคนงานไทย",
      backToMap: "← แผนที่เตือนภัยฉุกเฉิน",
      populationOverview: "ภาพรวมความปลอดภัยประชากร",
      totalChecks: "การประเมินตำแหน่งที่ตั้งทั้งหมด",
      workersAtRisk: "คนงานในพื้นที่เสี่ยงสูงขึ้น",
      workersSafe: "คนงานในพื้นที่ปลอดภัย",
      vulnerabilityAssessment: "การประเมินความเปราะบาง",
      riskDistribution: "การกระจายความเสี่ยงตามภูมิศาสตร์",
      strategicIntelligence: "ข่าวกรองเชิงกลยุทธ์",
      dailyActivity: "รูปแบบกิจกรรม (7 วันที่ผ่านมา)",
      geographicAnalysis: "การวิเคราะห์การกระจายทางภูมิศาสตร์",
      highRiskLocations: "พื้นที่ที่น่าห่วงใย",
      resourceAllocation: "ข้อมูลเชิงลึกการจัดสรรทรัพยากร",
      recentChecks: "การประเมินคนงานล่าสุด",
      policySupport: "ข้อมูลสนับสนุนนโยบาย",
      location: "ตำแหน่งที่ตั้ง",
      riskLevel: "การจัดประเภทความเสี่ยง",
      alerts: "เหตุการณ์ด้านความมั่นคง",
      timestamp: "เวลาประเมิน",
      safe: "โซนปลอดภัย",
      lowRisk: "เสี่ยงต่ำ",
      moderateRisk: "เสี่ยงปานกลาง",
      highRisk: "เสี่ยงสูงขึ้น",
      veryHighRisk: "โซนเสี่ยงสูง",
      unknown: "ยังไม่ได้ประเมิน",
      noData: "ไม่มีข้อมูล",
      loading: "กำลังโหลดข้อมูลข่าวกรอง...",
      error: "เกิดข้อผิดพลาดในการโหลดแดชบอร์ด",
      timeRange: "ช่วงเวลาการวิเคราะห์",
      last7Days: "7 วันที่ผ่านมา",
      last30Days: "30 วันที่ผ่านมา",
      last90Days: "90 วันที่ผ่านมา",
      coordinates: "พิกัด",
      checksCount: "การประเมิน",
      maxAlerts: "เหตุการณ์สูงสุด",
      refreshData: "รีเฟรชข่าวกรอง",
      lastUpdated: "อัปเดตล่าสุด",
      workerDistribution: "การวิเคราะห์การกระจายคนงาน",
      riskExposure: "สถิติการเผชิญความเสี่ยง",
      temporalAnalysis: "การวิเคราะห์ภัยคุกคามตามเวลา",
      evacuationPlanning: "ข้อมูลการวางแผนอพยพ",
      consulateServices: "การปรับปรุงบริการสถานกงสุล",
      safetyCampaigns: "การกำหนดเป้าหมายแคมเปญความปลอดภัย",
      emergencyPreparedness: "การวางแผนการตอบสนองฉุกเฉิน",
      keyInsights: "ข้อมูลเชิงลึกเชิงกลยุทธ์สำคัญ",
      recommendations: "คำแนะนำเชิงนโยบาย",
      exportData: "ส่งออกการวิเคราะห์",
      generateReport: "สร้างรายงาน",
    },
  };

  const currentTexts = texts[currentLanguage];

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      const API_BASE_URL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

      const [analyticsRes, checksRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/analytics?days=${timeRange}`),
        fetch(`${API_BASE_URL}/api/dashboard/recent-checks?limit=20`),
      ]);

      if (!analyticsRes.ok || !checksRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const analyticsData = await analyticsRes.json();
      const checksData = await checksRes.json();

      setAnalytics(analyticsData);
      setRecentChecks(checksData.checks);
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "safe":
        return "#10b981";
      case "low":
        return "#84cc16";
      case "moderate":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      case "very-high":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getRiskLevelText = (riskLevel) => {
    switch (riskLevel) {
      case "safe":
        return currentTexts.safe;
      case "low":
        return currentTexts.lowRisk;
      case "moderate":
        return currentTexts.moderateRisk;
      case "high":
        return currentTexts.highRisk;
      case "very-high":
        return currentTexts.veryHighRisk;
      default:
        return currentTexts.unknown;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(
      language === "th" ? "th-TH" : "en-US"
    );
  };

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div style={{ marginBottom: "10px", fontSize: "18px" }}>
            {currentTexts.loading}
          </div>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "3px solid #f3f4f6",
              borderTop: "3px solid #1e40af",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto",
            }}
          ></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "#ef4444",
        }}
      >
        <h2>{currentTexts.error}</h2>
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          style={{
            padding: "10px 20px",
            background: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {currentTexts.refreshData}
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar
        language={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      <div
        style={{
          padding: "20px",
          paddingTop: "calc(var(--navbar-height) + 20px)",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "DB HelvethaicaX, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <Link
            to="/"
            style={{
              color: "#1e40af",
              textDecoration: "none",
              fontSize: "14px",
              marginBottom: "10px",
              display: "inline-block",
            }}
          >
            {currentTexts.backToMap}
          </Link>
          <h1 style={{ margin: "0 0 5px 0", color: "#1f2937" }}>
            {currentTexts.pageTitle}
          </h1>
          <p style={{ margin: "0", color: "#6b7280" }}>
            {currentTexts.subtitle}
          </p>
          <div
            style={{
              marginTop: "15px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label style={{ marginRight: "8px", fontSize: "14px" }}>
                {currentTexts.timeRange}:
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                style={{
                  padding: "5px 10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                <option value={7}>{currentTexts.last7Days}</option>
                <option value={30}>{currentTexts.last30Days}</option>
                <option value={90}>{currentTexts.last90Days}</option>
              </select>
            </div>
            <button
              onClick={fetchDashboardData}
              style={{
                padding: "6px 12px",
                background: "#1e40af",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {currentTexts.refreshData}
            </button>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {currentTexts.lastUpdated}:{" "}
              {analytics && formatDate(analytics.generatedAt)}
            </div>
          </div>
        </div>

        {analytics && (
          <>
            {/* Summary Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  {currentTexts.totalChecks}
                </h3>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1e40af",
                  }}
                >
                  {analytics.summary.totalChecks.toLocaleString()}
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  {currentTexts.workersAtRisk}
                </h3>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#ef4444",
                  }}
                >
                  {analytics.summary.atRiskCount.toLocaleString()}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {analytics.summary.atRiskPercentage}% of total
                </div>
              </div>

              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#374151" }}>
                  {currentTexts.workersSafe}
                </h3>
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#10b981",
                  }}
                >
                  {analytics.summary.safeCount.toLocaleString()}
                </div>
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {analytics.summary.safePercentage}% of total
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ margin: "0 0 20px 0", color: "#374151" }}>
                {currentTexts.riskDistribution}
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "15px",
                }}
              >
                {Object.entries(analytics.riskDistribution).map(
                  ([level, count]) => (
                    <div key={level} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          background: getRiskLevelColor(level),
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          fontWeight: "bold",
                          margin: "0 auto 8px auto",
                        }}
                      >
                        {count}
                      </div>
                      <div style={{ fontSize: "12px", color: "#374151" }}>
                        {getRiskLevelText(level)}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* High-Risk Locations */}
            {analytics.highRiskLocations.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                  marginBottom: "30px",
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", color: "#374151" }}>
                  {currentTexts.highRiskLocations}
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.coordinates}
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.checksCount}
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.maxAlerts}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.highRiskLocations.map((loc, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #f3f4f6" }}
                        >
                          <td style={{ padding: "8px", fontSize: "13px" }}>
                            {loc.latitude.toFixed(3)},{" "}
                            {loc.longitude.toFixed(3)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              fontSize: "13px",
                            }}
                          >
                            {loc.checksCount}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              fontSize: "13px",
                            }}
                          >
                            {loc.maxRecentAlerts}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent Checks */}
            {recentChecks.length > 0 && (
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ margin: "0 0 20px 0", color: "#374151" }}>
                  {currentTexts.recentChecks}
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.timestamp}
                        </th>
                        <th
                          style={{
                            textAlign: "left",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.location}
                        </th>
                        <th
                          style={{
                            textAlign: "center",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.riskLevel}
                        </th>
                        <th
                          style={{
                            textAlign: "right",
                            padding: "8px",
                            fontSize: "14px",
                          }}
                        >
                          {currentTexts.alerts}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentChecks.slice(0, 10).map((check, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #f3f4f6" }}
                        >
                          <td style={{ padding: "8px", fontSize: "13px" }}>
                            {formatDate(check.createdAt)}
                          </td>
                          <td style={{ padding: "8px", fontSize: "13px" }}>
                            {check.latitude.toFixed(4)},{" "}
                            {check.longitude.toFixed(4)}
                          </td>
                          <td style={{ textAlign: "center", padding: "8px" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                color: "white",
                                background: getRiskLevelColor(
                                  check.safetyResult.riskLevel
                                ),
                              }}
                            >
                              {getRiskLevelText(check.safetyResult.riskLevel)}
                            </span>
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              padding: "8px",
                              fontSize: "13px",
                            }}
                          >
                            {check.safetyResult.recentAlerts || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </>
  );
};

export default DashboardPage;
