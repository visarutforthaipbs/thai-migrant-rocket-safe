import React, { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

// Function to filter historical data by time period
const filterDataByTime = (historicalData, timeFilter) => {
  if (timeFilter === "all") return historicalData;

  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  let cutoffTime;

  switch (timeFilter) {
    case "24h":
      cutoffTime = now - 24 * 60 * 60; // 24 hours ago
      break;
    case "week":
      cutoffTime = now - 7 * 24 * 60 * 60; // 1 week ago
      break;
    case "month":
      cutoffTime = now - 30 * 24 * 60 * 60; // 30 days ago
      break;
    default:
      return historicalData;
  }

  return historicalData.filter((alert) => alert[3] >= cutoffTime);
};

// Function to calculate alert frequencies for each polygon
const calculateAlertFrequencies = (
  historicalData,
  citiesData,
  polygonsData,
  timeFilter = "all"
) => {
  const frequencies = {};

  // Filter data by time period first
  const filteredData = filterDataByTime(historicalData, timeFilter);

  // Count alerts per city
  const cityAlertCounts = {};
  filteredData.forEach((alert) => {
    const cities = alert[2]; // Array of city names in the alert
    cities.forEach((cityName) => {
      cityAlertCounts[cityName] = (cityAlertCounts[cityName] || 0) + 1;
    });
  });

  // Map city alerts to polygons
  Object.keys(polygonsData).forEach((polygonId) => {
    let totalAlerts = 0;

    // Find cities that belong to this polygon
    Object.values(citiesData).forEach((city) => {
      if (city.id.toString() === polygonId) {
        // Check all possible city name variations
        const cityNames = [city.he, city.en, city.ar, city.ru, city.es].filter(
          Boolean
        );
        cityNames.forEach((cityName) => {
          if (cityAlertCounts[cityName]) {
            totalAlerts += cityAlertCounts[cityName];
          }
        });
      }
    });

    frequencies[polygonId] = totalAlerts;
  });

  return frequencies;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [cities, setCities] = useState({});
  const [polygons, setPolygons] = useState({});
  const [historical, setHistorical] = useState([]);
  const [thaiWorkerData, setThaiWorkerData] = useState(null);
  const [alertFrequencies, setAlertFrequencies] = useState({});
  const [timeFilter, setTimeFilter] = useState("all"); // '24h', 'week', 'month', 'all'
  const [layerVisibility, setLayerVisibility] = useState({
    alertZones: true,
    thaiWorkers: false,
    countryBoundary: true,
  });
  const [baseMap, setBaseMap] = useState("streets"); // 'streets', 'satellite', 'hybrid', 'terrain'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load all data files in parallel
        let historicalResponse;
        try {
          // Try to fetch from live API through proxy server first
          const API_BASE_URL =
            process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
          historicalResponse = await fetch(`${API_BASE_URL}/api/alerts`);
          if (!historicalResponse.ok) {
            throw new Error("Proxy server unavailable");
          }
          console.log("✅ Successfully fetched live alerts data");
        } catch (error) {
          console.warn(
            "Live API unavailable, falling back to static file:",
            error
          );
          // Fallback to static file
          historicalResponse = await fetch("/static/all.json");
        }

        const [citiesResponse, polygonsResponse, thaiWorkerResponse] =
          await Promise.all([
            fetch("/static/cities.json"),
            fetch("/static/polygons.json"),
            fetch("/data/thaiworker-where.geojson"),
          ]);

        if (
          !citiesResponse.ok ||
          !polygonsResponse.ok ||
          !historicalResponse.ok ||
          !thaiWorkerResponse.ok
        ) {
          throw new Error("Failed to load data files");
        }

        const [citiesData, polygonsData, historicalData, thaiWorkerGeoJSON] =
          await Promise.all([
            citiesResponse.json().catch((err) => {
              console.error("Error parsing cities.json:", err);
              throw new Error("Invalid cities.json format");
            }),
            polygonsResponse.json().catch((err) => {
              console.error("Error parsing polygons.json:", err);
              throw new Error("Invalid polygons.json format");
            }),
            historicalResponse.json().catch((err) => {
              console.error("Error parsing historical data:", err);
              throw new Error("Invalid historical data format");
            }),
            thaiWorkerResponse.json().catch((err) => {
              console.error("Error parsing thaiworker-where.geojson:", err);
              throw new Error("Invalid thaiworker-where.geojson format");
            }),
          ]);

        setCities(citiesData.cities || citiesData);
        setPolygons(polygonsData);
        setHistorical(historicalData);
        setThaiWorkerData(thaiWorkerGeoJSON);

        // Calculate alert frequencies for each polygon
        const frequencies = calculateAlertFrequencies(
          historicalData,
          citiesData.cities || citiesData,
          polygonsData,
          timeFilter
        );
        setAlertFrequencies(frequencies);

        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to update time filter and recalculate frequencies
  const updateTimeFilter = (newTimeFilter) => {
    setTimeFilter(newTimeFilter);
    if (historical.length > 0 && cities && polygons) {
      const frequencies = calculateAlertFrequencies(
        historical,
        cities,
        polygons,
        newTimeFilter
      );
      setAlertFrequencies(frequencies);
    }
  };

  // Function to toggle layer visibility
  const toggleLayerVisibility = (layerName) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerName]: !prev[layerName],
    }));
  };

  // Function to change base map
  const changeBaseMap = (mapType) => {
    setBaseMap(mapType);
  };

  const value = {
    cities,
    polygons,
    historical,
    thaiWorkerData,
    alertFrequencies,
    timeFilter,
    updateTimeFilter,
    layerVisibility,
    toggleLayerVisibility,
    baseMap,
    changeBaseMap,
    loading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook with the exact name from user requirements
export const useLists = () => {
  const {
    cities,
    polygons,
    historical,
    thaiWorkerData,
    alertFrequencies,
    timeFilter,
    updateTimeFilter,
    layerVisibility,
    toggleLayerVisibility,
    baseMap,
    changeBaseMap,
    loading,
    error,
  } = useData();
  return {
    cities,
    polygons,
    historical,
    thaiWorkerData,
    alertFrequencies,
    timeFilter,
    updateTimeFilter,
    layerVisibility,
    toggleLayerVisibility,
    baseMap,
    changeBaseMap,
    loading,
    error,
  };
};
