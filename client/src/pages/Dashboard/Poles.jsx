// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../css/poles.css";

// const Poles = () => {
//   const [poles, setPoles] = useState([]);
//   const [selectedPole, setSelectedPole] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
//   const [newPole, setNewPole] = useState({
//     poleId: "",
//     cameraUrl: "",
//     latitude: "",
//     longitude: "",
//     address: "",
//   });

//   useEffect(() => {
//     const fetchPoles = async () => {
//       try {
//         const response = await axios.get("/api/get-pole-list");
//         if (response.data.success) {
//           setPoles(response.data.poles);
//         }
//       } catch (error) {
//         console.error("Error fetching pole list:", error);
//       }
//     };

//     fetchPoles();
//   }, []);

//   const handleEdit = (pole) => {
//     setSelectedPole(pole);
//     setIsPopupOpen(true);
//   };

//   const handleUpdate = async () => {
//     try {
//       const response = await axios.post("/api/update-pole", selectedPole);
//       if (response.data.success) {
//         setPoles((prevPoles) =>
//           prevPoles.map((pole) =>
//             pole.poleId === response.data.updatedPole.poleId
//               ? response.data.updatedPole
//               : pole
//           )
//         );
//         setIsPopupOpen(false);
//       } else {
//         console.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error updating pole:", error);
//     }
//   };

//   const handleAddPole = async () => {
//     try {
//       const response = await axios.post("/api/add-pole", newPole);
//       if (response.data.success) {
//         setPoles((prevPoles) => [...prevPoles, newPole]);
//         setIsAddPopupOpen(false);
//         setNewPole({
//           poleId: "",
//           cameraUrl: "",
//           latitude: "",
//           longitude: "",
//           address: "",
//         });
//       } else {
//         console.error(response.data.message);
//       }
//     } catch (error) {
//       console.error("Error adding pole:", error);
//     }
//   };

//   const handleDelete = async (poleId) => {
//     try {
//       const response = await axios.post(`/api/delete-pole/${poleId}`);
//       if (response.data.success) {
//         setPoles(poles.filter((pole) => pole.poleId !== poleId));
//       } else {
//         console.error("Failed to delete pole");
//       }
//     } catch (error) {
//       console.error("Error deleting pole:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (isPopupOpen) {
//       setSelectedPole({ ...selectedPole, [name]: value });
//     } else {
//       setNewPole({ ...newPole, [name]: value });
//     }
//   };

//   return (
//     <div className="poles-container">
//       <button
//         className="add-pole-button"
//         onClick={() => setIsAddPopupOpen(true)}
//       >
//         Add Pole
//       </button>
//       <div className="poles-grid">
//         {poles.map((pole) => (
//           <div key={pole.poleId} className="pole-box">
//             <p>
//               <strong>Pole ID:</strong> {pole.poleId}
//             </p>
//             <p>
//               <strong>Address:</strong> {pole.address}
//             </p>
//             <p>
//               <strong>Latitude:</strong> {pole.latitude}
//             </p>
//             <p>
//               <strong>Longitude:</strong> {pole.longitude}
//             </p>
//             <p>
//               <strong>URL:</strong> {pole.cameraUrl}
//             </p>
//             <div className="pole-actions">
//               <button 
//                 className="edit-button" 
//                 onClick={() => handleEdit(pole)}
//               >
//                 Edit
//               </button>
//               <button
//                 className="delete-button"
//                 onClick={() => handleDelete(pole.poleId)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {isPopupOpen && selectedPole && (
//         <div className="popup">
//           <div className="popup-content">
//             <h3>Edit Pole Details</h3>
//             <label>
//               Pole ID:
//               <input
//                 type="text"
//                 name="poleId"
//                 value={selectedPole.poleId}
//                 onChange={handleInputChange}
//                 disabled
//               />
//             </label>
//             <label>
//               Address:
//               <input
//                 type="text"
//                 name="address"
//                 value={selectedPole.address}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Latitude:
//               <input
//                 type="text"
//                 name="latitude"
//                 value={selectedPole.latitude}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Longitude:
//               <input
//                 type="text"
//                 name="longitude"
//                 value={selectedPole.longitude}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               URL:
//               <input
//                 type="text"
//                 name="cameraUrl"
//                 value={selectedPole.cameraUrl}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <div className="popup-actions">
//               <button onClick={handleUpdate}>Update</button>
//               <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isAddPopupOpen && (
//         <div className="popup">
//           <div className="popup-content">
//             <h3>Add New Pole</h3>
//             <label>
//               Pole ID:
//               <input
//                 type="text"
//                 name="poleId"
//                 value={newPole.poleId}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Camera URL:
//               <input
//                 type="text"
//                 name="cameraUrl"
//                 value={newPole.cameraUrl}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Latitude:
//               <input
//                 type="text"
//                 name="latitude"
//                 value={newPole.latitude}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Longitude:
//               <input
//                 type="text"
//                 name="longitude"
//                 value={newPole.longitude}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <label>
//               Address:
//               <input
//                 type="text"
//                 name="address"
//                 value={newPole.address}
//                 onChange={handleInputChange}
//               />
//             </label>
//             <div className="popup-actions">
//               <button onClick={handleAddPole}>Add</button>
//               <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Poles;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/poles.css";

const Poles = () => {
  const [poles, setPoles] = useState([]);
  const [selectedPole, setSelectedPole] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newPole, setNewPole] = useState({
    poleId: "",
    cameraUrl: "",
    latitude: "",
    longitude: "",
    address: "",
  });
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);  // New state for delete confirmation
  const [poleToDelete, setPoleToDelete] = useState(null);  // Store the pole to be deleted

  useEffect(() => {
    const fetchPoles = async () => {
      try {
        const response = await axios.get("/api/get-pole-list");
        if (response.data.success) {
          setPoles(response.data.poles);
        }
      } catch (error) {
        console.error("Error fetching pole list:", error);
      }
    };

    fetchPoles();
  }, []);

  const handleEdit = (pole) => {
    setSelectedPole(pole);
    setIsPopupOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.post("/api/update-pole", selectedPole);
      if (response.data.success) {
        setPoles((prevPoles) =>
          prevPoles.map((pole) =>
            pole.poleId === response.data.updatedPole.poleId
              ? response.data.updatedPole
              : pole
          )
        );
        setIsPopupOpen(false);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating pole:", error);
    }
  };

  const handleAddPole = async () => {
    try {
      const response = await axios.post("/api/add-pole", newPole);
      if (response.data.success) {
        setPoles((prevPoles) => [...prevPoles, newPole]);
        setIsAddPopupOpen(false);
        setNewPole({
          poleId: "",
          cameraUrl: "",
          latitude: "",
          longitude: "",
          address: "",
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding pole:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`/api/delete-pole/${poleToDelete.poleId}`);
      if (response.data.success) {
        setPoles(poles.filter((pole) => pole.poleId !== poleToDelete.poleId));
        setIsDeletePopupOpen(false);  // Close the confirmation popup after deletion
      } else {
        console.error("Failed to delete pole");
      }
    } catch (error) {
      console.error("Error deleting pole:", error);
    }
  };

  const handleDeletePopupOpen = (pole) => {
    setPoleToDelete(pole);
    setIsDeletePopupOpen(true);  // Open the delete confirmation popup
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isPopupOpen) {
      setSelectedPole({ ...selectedPole, [name]: value });
    } else {
      setNewPole({ ...newPole, [name]: value });
    }
  };

  return (
    <div className="poles-container">
      <button
        className="add-pole-button"
        onClick={() => setIsAddPopupOpen(true)}
      >
        Add Pole
      </button>
      <div className="poles-grid">
        {poles.map((pole) => (
          <div key={pole.poleId} className="pole-box">
            <p>
              <strong>Pole ID:</strong> {pole.poleId}
            </p>
            <p>
              <strong>Address:</strong> {pole.address}
            </p>
            <p>
              <strong>Latitude:</strong> {pole.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {pole.longitude}
            </p>
            <p>
              <strong>URL:</strong> {pole.cameraUrl}
            </p>
            <div className="pole-actions">
              <button 
                className="edit-button" 
                onClick={() => handleEdit(pole)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeletePopupOpen(pole)}  // Trigger delete confirmation
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isPopupOpen && selectedPole && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Pole Details</h3>
            <label>
              Pole ID:
              <input
                type="text"
                name="poleId"
                value={selectedPole.poleId}
                onChange={handleInputChange}
                disabled
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={selectedPole.address}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Latitude:
              <input
                type="text"
                name="latitude"
                value={selectedPole.latitude}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Longitude:
              <input
                type="text"
                name="longitude"
                value={selectedPole.longitude}
                onChange={handleInputChange}
              />
            </label>
            <label>
              URL:
              <input
                type="text"
                name="cameraUrl"
                value={selectedPole.cameraUrl}
                onChange={handleInputChange}
              />
            </label>
            <div className="popup-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isAddPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Add New Pole</h3>
            <label>
              Pole ID:
              <input
                type="text"
                name="poleId"
                value={newPole.poleId}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Camera URL:
              <input
                type="text"
                name="cameraUrl"
                value={newPole.cameraUrl}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Latitude:
              <input
                type="text"
                name="latitude"
                value={newPole.latitude}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Longitude:
              <input
                type="text"
                name="longitude"
                value={newPole.longitude}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={newPole.address}
                onChange={handleInputChange}
              />
            </label>
            <div className="popup-actions">
              <button onClick={handleAddPole}>Add</button>
              <button onClick={() => setIsAddPopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h3>Are you sure you want to delete this pole?</h3>
            <div className="popup-actions">
              <button onClick={handleDelete}>Yes, Delete</button>
              <button onClick={() => setIsDeletePopupOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Poles;
