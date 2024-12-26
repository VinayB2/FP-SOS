import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/surveillance.css";

const Surveillance = () => {
  const [cameras, setCameras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const response = await axios.get("/api/get-pole-list");
        setCameras(response.data.poles);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const handleImageClick = (pole) => {
    navigate("/monitor", { state: { pole } });
  };

  return (
    <div className="surveillance-grid">
      {cameras.map((camera) => (
        <div
          key={camera.poleId}
          className="camera-item"
          onClick={() => handleImageClick(camera)}
        >
          <img
            src={camera.cameraUrl}
            alt={"processing..."}
            className="camera-image"
          />
        </div>
      ))}
    </div>
  );
};

export default Surveillance;
