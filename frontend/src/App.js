import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import MapPage from "./pages/MapPage";
import WorkplaceLookupPage from "./pages/WorkplaceLookupPage";
import "./App.css";

const App = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WorkplaceLookupPage />} />
          <Route path="/emergency-map" element={<MapPage />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
