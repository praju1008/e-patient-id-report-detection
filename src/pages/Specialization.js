// Specialization.js
import React, { useState, useEffect } from "react";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; 
import axios from "axios"; // For making HTTP requests
import AdminHomePage from "./AdminHomePage"; // Import AdminHomePage

const Specialization = () => {
  const [specializations, setSpecializations] = useState([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/specializations")
      .then((response) => setSpecializations(response.data))
      .catch((err) => console.error("Error fetching specializations:", err));
  }, []);

  const handleAddSpecialization = () => {
    if (!newSpecialization) {
      setError("Specialization name cannot be empty.");
      return;
    }

    axios.get(`http://localhost:5000/api/specialization/check/${newSpecialization}`)
      .then((response) => {
        if (response.data.exists) {
          setError("Specialization already exists.");
        } else {
          axios.post("http://localhost:5000/api/specialization", { name: newSpecialization })
            .then(() => {
              setNewSpecialization(""); 
              setError("");
              alert("Specialization added successfully!");

              axios.get("http://localhost:5000/api/specializations")
                .then((response) => setSpecializations(response.data));
            })
            .catch((err) => console.error("Error adding specialization:", err));
        }
      })
      .catch((err) => console.error("Error checking specialization:", err));
  };

  const handleDeleteSpecialization = (id) => {
    axios.delete(`http://localhost:5000/api/specialization/${id}`)
      .then(() => {
        alert("Specialization deleted successfully!");
        axios.get("http://localhost:5000/api/specializations")
          .then((response) => setSpecializations(response.data));
      })
      .catch((err) => console.error("Error deleting specialization:", err));
  };

  const handleEditSpecialization = (id, currentName) => {
    const newName = prompt("Edit Specialization:", currentName);
    if (!newName) return;

    axios.put(`http://localhost:5000/api/specialization/${id}`, { name: newName })
      .then(() => {
        alert("Specialization updated successfully!");
        axios.get("http://localhost:5000/api/specializations")
          .then((response) => setSpecializations(response.data));
      })
      .catch((err) => console.error("Error updating specialization:", err));
  };
  return (
    <AdminHomePage>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>Specializations</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        fullWidth
        label="New Specialization"
        variant="outlined"
        sx={{ mb: 2 }}
        value={newSpecialization}
        onChange={(e) => setNewSpecialization(e.target.value)}
      />
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleAddSpecialization}>
        Save Specialization
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="specializations table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3f51b5" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>Specialization</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specializations.map((specialization) => (
              <TableRow key={specialization.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f4f4f4" } }}>
                <TableCell component="th" scope="row" sx={{ fontSize: "14px" }}>
                  {specialization.name}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditSpecialization(specialization.id, specialization.name)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteSpecialization(specialization.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminHomePage>
  );
};

export default Specialization;
