import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import AdminHomePage from "./AdminHomePage";

const AddDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [formData, setFormData] = useState({
    doctor_name: "",
    hospital: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    specialization: ""
  });
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors").then(response => setDoctors(response.data));
    axios.get("http://localhost:5000/api/specializations").then(response => setSpecializations(response.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,8}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,8}$/;
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.doctor_name || !formData.hospital || !formData.mobile || !formData.email || !formData.username || !formData.password || !formData.specialization) {
      alert("All fields are mandatory!");
      return false;
    }
    if (!usernameRegex.test(formData.username)) {
      alert("Username must have at least one uppercase letter, one digit, one special character, and be max 8 characters long.");
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      alert("Password must have at least one uppercase letter, one digit, one special character, and be max 8 characters long.");
      return false;
    }
    if (!mobileRegex.test(formData.mobile)) {
      alert("Mobile number must be 10 digits.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      alert("Enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateInputs()) return;
    const url = editingId ? `http://localhost:5000/api/doctors/${editingId}` : "http://localhost:5000/api/doctors";
    const method = editingId ? axios.put : axios.post;
    method(url, formData)
      .then(response => {
        alert(response.data.message);
        axios.get("http://localhost:5000/api/doctors").then(response => setDoctors(response.data));
        setFormData({ doctor_name: "", hospital: "", mobile: "", email: "", username: "", password: "", specialization: "" });
        setEditingId(null);
      })
      .catch(error => console.error("Error saving doctor:", error));
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.doc_id);
    formRef.current.scrollIntoView({ behavior: "smooth" });
  };
// Delete doctor function
const deleteDoctor = async (doctorId) => {
  if (window.confirm("Are you sure you want to delete this doctor?")) {
    try {
      await axios.delete(`http://localhost:5000/api/doctors/${doctorId}`);
      alert("Doctor deleted successfully!");
      //fetchDoctors(); // Refresh the list after deletion
      axios.get("http://localhost:5000/api/doctors").then(response => setDoctors(response.data));
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor.");
    }
  }
};
  return (
    <AdminHomePage>
      <div ref={formRef} style={{ width: "90%", margin: "auto", paddingTop: "20px" }}>
        <Typography variant="h4" gutterBottom>{editingId ? "Edit Doctor" : "Add Doctor"}</Typography>

        <TextField name="doctor_name" label="Doctor Name" fullWidth onChange={handleChange} value={formData.doctor_name} required />
        <TextField name="hospital" label="Hospital" fullWidth onChange={handleChange} value={formData.hospital} required />
        <TextField name="mobile" label="Mobile" fullWidth onChange={handleChange} value={formData.mobile} required />
        <TextField name="email" label="Email" fullWidth onChange={handleChange} value={formData.email} required />
        <TextField name="username" label="Username" fullWidth onChange={handleChange} value={formData.username} required />
        <TextField name="password" label="Password" type="password" fullWidth onChange={handleChange} value={formData.password} required />
        <FormControl fullWidth>
          <InputLabel>Specialization</InputLabel>
          <Select name="specialization" value={formData.specialization} onChange={handleChange}>
            {specializations.map(spec => (
              <MenuItem key={spec.id} value={spec.id}>{spec.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" fullWidth onClick={handleSave} style={{ marginTop: "20px" }}>{editingId ? "Update Doctor" : "Save Doctor"}</Button>

        <TableContainer component={Paper} style={{ marginTop: "30px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#3f51b5", color: "#fff" }}>
                <TableCell style={{ color: "white" }}>Doctor Name</TableCell>
                <TableCell style={{ color: "white" }}>Hospital</TableCell>
                <TableCell style={{ color: "white" }}>Mobile</TableCell>
                <TableCell style={{ color: "white" }}>Email</TableCell>
                <TableCell style={{ color: "white" }}>Username</TableCell>
                <TableCell style={{ color: "white" }}>Specialization</TableCell>
                <TableCell style={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map(doctor => (
                <TableRow key={doctor.doc_id}>
                  <TableCell>{doctor.doctor_name}</TableCell>
                  <TableCell>{doctor.hospital}</TableCell>
                  <TableCell>{doctor.mobile}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.username}</TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(doctor)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => deleteDoctor(doctor.doc_id)}
                    ><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </AdminHomePage>
  );
};

export default AddDoctor;