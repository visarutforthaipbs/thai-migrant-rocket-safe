import React from "react";
import { TileLayer } from "react-leaflet";

const DynamicTileLayer = ({ baseMap }) => {
  const getMapConfig = (mapType) => {
    switch (mapType) {
      case "streets":
        return {
          url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        };
      case "satellite":
        return {
          url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Satellite</a>',
        };
      case "hybrid":
        return {
          url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Hybrid</a>',
        };
      case "terrain":
        return {
          url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Terrain</a>',
        };
      case "osm":
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        };
      default:
        return {
          url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
          attribution:
            '&copy; <a href="https://www.google.com/maps">Google Maps</a>',
        };
    }
  };

  const mapConfig = getMapConfig(baseMap);

  return (
    <TileLayer
      url={mapConfig.url}
      attribution={mapConfig.attribution}
      key={baseMap} // Force re-render when base map changes
    />
  );
};

export default DynamicTileLayer;
