import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./css/monitor.css";

const Monitor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pole = location.state?.pole || null;
  const [error, setError] = useState("");
  const [poleDetails, setPoleDetails] = useState(null);
  const [poleId, setPoleId] = useState(pole?.poleId || "");
  const [cameraUrl, setCameraUrl] = useState("");
  const [isAlerted, setIsAlerted] = useState(false);
  const handleAlert = () => {
    axios.get("/api/un-alert/" + poleId).then((res) => {      
      if (res.data.success) {
        setIsAlerted(false);
      }
    });
    navigate("/surveillance");
  };
  const handlePoleIdChange = (e) => {
    setPoleId(e.target.value);
  };

  const fetchCameraUrl = async () => {
    try {
      const response = await axios.get(`/api/get-pole?poleId=${poleId}`);
      if (!response || !response.data || !response.data.success) {
        setError("Pole not found");
        setCameraUrl("");
        setPoleDetails(null);
        return;
      }
      setCameraUrl(response.data.pole.cameraUrl);
      setPoleDetails(response.data.pole);
      setIsAlerted(response.data.pole.isAlerted);
      setError("");
    } catch (err) {
      console.error(err);
      setError("An error occurred");
      setCameraUrl("");
      setPoleDetails(null);
    }
  };

  useEffect(() => {
    if (poleId) {
      fetchCameraUrl();
    }
  }, [poleId]);

  return (
    <div className="monitor-container">
      <div className="input-container">
        <input
          type="text"
          value={poleId}
          onChange={handlePoleIdChange}
          className="pole-input"
          placeholder="Pole ID"
        />
        <button onClick={fetchCameraUrl} className="fetch-button">
          Fetch Camera URL
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
      {cameraUrl && (
        <div className="camera-container">
          <img
            src={cameraUrl}
            className="camera-iframe"
          ></img>
        </div>
      )}
      {isAlerted && <button onClick={handleAlert} className="clear-alert">Clear Alert</button>}
      {poleDetails && (
        <div className="details-container">
          <h2 className="details-title">Pole Details</h2>
          <table className="details-table">
            <tbody>
              <tr>
                <td>Pole ID:</td>
                <td>{poleDetails.poleId}</td>
              </tr>
              {/* <tr>
                <td>Camera URL:</td>
                <td>{poleDetails.cameraUrl}</td>
              </tr> */}
              <tr>
                <td>Latitude:</td>
                <td>{poleDetails.latitude}</td>
              </tr>
              <tr>
                <td>Longitude:</td>
                <td>{poleDetails.longitude}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{poleDetails.address}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Monitor;
