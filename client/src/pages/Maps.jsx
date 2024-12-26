import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./css/maps.css";

const Maps = () => {
  const [poles, setPoles] = useState([]);
  const [viewType, setViewType] = useState("satellite");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchPoles = async () => {
      try {
        const response = await axios.get("/api/get-pole-list");
        setPoles(response.data.poles);
      } catch (error) {
        console.error("Error fetching poles:", error);
      }
    };
    fetchPoles();
  }, []);

  const handleMarkerClick = (pole) => {
    navigate("/monitor", { state: { pole } });
  };

  const handleViewChange = (event) => {
    setViewType(event.target.value);
  };

  const tileLayerUrl = () => {
    switch (viewType) {
      case "satellite":
        return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      case "terrain":
        return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
      // case "sketch":
      //   return "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
      default:
        return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }
  };
  return (
    <>
      <div ref={dropdownRef} className="dropdown-container">
        <select
          value={viewType}
          onChange={handleViewChange}
          className="dropdown-select"
        >
          <option value="street">Street</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
        </select>
      </div>
      <div className="map-container">
        <MapContainer center={[0, 0]} zoom={2} className="full-map">
          <TileLayer
            url={tileLayerUrl()}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {poles.map((pole) => (
            <Marker
              className="marker"
              key={pole.poleId}
              position={[pole.latitude, pole.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(pole),
              }}
            >
              <Tooltip>{pole.address}</Tooltip>
              <Popup>
                <div>{pole.address}</div>
              </Popup>
            </Marker>
          ))}
          <FitToBounds poles={poles} />
        </MapContainer>
      </div>
    </>
  );
};

const FitToBounds = ({ poles }) => {
  const map = useMap();

  useEffect(() => {
    if (poles.length > 0) {
      const bounds = poles.map((pole) => [pole.latitude, pole.longitude]);
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }
  }, [poles, map]);

  return null;
};

export default Maps;