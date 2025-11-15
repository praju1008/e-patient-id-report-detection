// Specialization.js
import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper, Typography } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material"; 
import axios from "axios"; // For making HTTP requests
import AdminHomePage from "./AdminHomePage"; // Import AdminHomePage

const Specialization = () => {
  const [specializations, setSpecializations] = useState([]);
  const [error, setError] = useState("");

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/specializations");
      setSpecializations(response.data || []);
    } catch (err) {
      console.error("Error fetching specializations:", err);
      setError("Failed to load specializations.");
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  // creation handled elsewhere; input removed from UI

  const handleDeleteSpecialization = async (id) => {
    const ok = window.confirm("Delete this specialization?");
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:5000/api/specializations/${id}`);
      alert("Specialization deleted successfully!");
      await fetchSpecializations();
    } catch (err) {
      console.error("Error deleting specialization:", err);
      setError("Failed to delete specialization.");
    }
  };

  const handleEditSpecialization = async (id, currentName) => {
    const newName = prompt("Edit Specialization:", currentName);
    if (!newName) return;
    const name = newName.trim();
    if (!name) return;

    try {
      await axios.put(`http://localhost:5000/api/specializations/${id}`, { name });
      alert("Specialization updated successfully!");
      await fetchSpecializations();
    } catch (err) {
      console.error("Error updating specialization:", err);
      setError("Failed to update specialization.");
    }
  };

  return (
    <AdminHomePage>
      <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>Specializations</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="specializations table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#3f51b5" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>Specialization</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specializations.map((specialization, idx) => {
              const id = specialization._id || specialization.id || specialization.ID || idx;
              return (
                <TableRow key={id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f4f4f4" } }}>
                  <TableCell component="th" scope="row" sx={{ fontSize: "14px" }}>
                    {specialization.name}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleEditSpecialization(id, specialization.name)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSpecialization(id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminHomePage>
  );
};

export default Specialization;
