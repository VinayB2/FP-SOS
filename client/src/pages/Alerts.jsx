// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Loader from "../components/Loader";
// import "./css/surveillance.css";
// import "./css/alerts.css";

// const Alerts = () => {
//   const [alerts, setAlerts] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const fetchAlertedPoles = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetchingjhdj");
      
//       const response = await axios.get("/api/alerted-poles");
//       if (response.data.success) {
//         setAlerts(response.data.poles);
//         setError("");
//       } else {
//         setError("No alerted poles found");
//       }
//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setError("An error occurred while fetching alerted poles");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     fetchAlertedPoles();
//     setLoading(false);
//   }, []);
//   useEffect(() => {
//     // const ws = new WebSocket("ws://localhost:5000");
//     setLoading(true);
//     const ws = new WebSocket("wss://fp-sos.onrender.com");
//     setLoading(false);
//     ws.onopen = () => {
//       console.log("Connected to WebSocket");
//     };
//     ws.onmessage = (event) => {
//       const message = JSON.parse(event.data);
//       if (message.type === "ALERT") {
//         setAlerts((prevAlerts) => {
//           if (prevAlerts.find((alert) => alert.poleId === message.poleId)) {
//             return prevAlerts;
//           }
//           return [...prevAlerts, message];
//         });
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//       setError("Error with WebSocket connection");
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   const handleImageClick = (pole) => {
//     console.log(pole);
//     navigate("/monitor", { state: { pole } });
//   };

//   return (
//     <div className="main-container">
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="surveillance-grid">
//           {alerts.map((camera) => (
//             <div
//               key={camera.poleId}
//               className="camera-item alert-item"
//               onClick={() => handleImageClick(camera)}
//             >
//               <img
//                 src={camera.cameraUrl}
//                 alt={`Camera ${camera.poleId}`}
//                 className="camera-image"
//               />
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Alerts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import "./css/surveillance.css";
import "./css/alerts.css";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const navigate = useNavigate();

  const fetchAlertedPoles = async () => {
    try {
      const response = await axios.get("/api/alerted-poles");
      if (response.data.success) {
        setAlerts(response.data.poles);
        setError("");
      } else {
        setError("No alerted poles found");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching alerted poles");
    } finally {
      setLoading(false); // Set loading to false once the data fetching completes
    }
  };

  useEffect(() => {
    fetchAlertedPoles(); // Call the API to fetch alerted poles
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const ws = new WebSocket("wss://fp-sos.onrender.com");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "ALERT") {
        setAlerts((prevAlerts) => {
          if (prevAlerts.find((alert) => alert.poleId === message.poleId)) {
            return prevAlerts;
          }
          return [...prevAlerts, message];
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Error with WebSocket connection");
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleImageClick = (pole) => {
    navigate("/monitor", { state: { pole } });
  };

  return (
    <div className="main-container">
      {loading ? (
        <Loader /> 
      ) : (
        <div className="surveillance-grid">
          {alerts.length === 0 ? (
            <div></div>
          ) : (
            alerts.map((camera) => (
              <div
                key={camera.poleId}
                className="camera-item alert-item"
                onClick={() => handleImageClick(camera)}
              >
                <img
                  src={camera.cameraUrl}
                  alt={`Camera ${camera.poleId}`}
                  className="camera-image"
                />
              </div>
            ))
         )}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Alerts;
