import React, { useState, useEffect ,useRef } from "react";
import axios from "axios";
import { TextField, Button,Box, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AdminHomePage from "./AdminHomePage";

const AddPatient = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [patient, setPatient] = useState({
        date: dayjs(),
        patient_name: "",
        age: "",
        gender: "",
        doctor_id: "",
        mobile: "",
        email: "",
        username: "",
        password: "",
        patient_no:"",
    });
    const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

    const isValidUsernameOrPassword = (value) => 
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{1,8}$/.test(value);
    
    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchPatients = async () => {
        const res = await axios.get("http://localhost:5000/api/patients");
        setPatients(res.data);
    };

    const fetchDoctors = async () => {
        const res = await axios.get("http://localhost:5000/api/doctors");
        setDoctors(res.data);
    };
    const [searchValue, setSearchValue] = useState('');
    const [message, setMessage] = useState('');
    const handleChange = (e) => {
        setPatient({ ...patient, [e.target.name]: e.target.value });
    };
    const topRef = useRef(null); // reference for scrolling
    const handleEdit = (p) => {
        setEditingId(p.patient_id);
        setPatient({ ...p, date: dayjs(p.date) });
        // Scroll to the top smoothly
    if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    };
    const handleSearch = async () => {
        try {
          const res = await axios.post('http://localhost:5000/searchpatient', {
            search: searchValue,
          });
          if (res.data.length > 0) {
            //setPatient(res.data[0]); // Autofill form
            const { date, ...rest } = res.data[0]; // Exclude date
            //setPatient(rest); // Only update the non-date fields
            setPatient((prev) => ({ ...prev, ...rest })); // Keep current date
    
            setMessage('Patient record found and loaded.');
          } else {
            setMessage('No matching record found.');
          }
        } catch (err) {
          console.error(err);
        }
      };
    const handleSubmit = async () => {
        const { mobile, email, username, password } = patient;

        if (!isValidMobile(mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return;
        }
    
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
    
        if (!isValidUsernameOrPassword(username)) {
            alert("Username must include at least one uppercase letter, one number, one special character, and be up to 8 characters.");
            return;
        }
    
        if (!isValidUsernameOrPassword(password)) {
            alert("Password must include at least one uppercase letter, one number, one special character, and be up to 8 characters.");
            return;
        }
        try {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/patients/${editingId}`, { ...patient, date: patient.date.format("YYYY-MM-DD") });
            alert("Patient updated successfully!");
            setEditingId(null);
        } else {
            await axios.post("http://localhost:5000/api/patients", { ...patient, date: patient.date.format("YYYY-MM-DD") });
            alert("Patient added successfully!");
        }
        fetchPatients();
        setPatient({ date: dayjs(), patient_name: "", age: "", gender: "", doctor_id: "", mobile: "", email: "", username: "", password: "" });
    } catch (error) {
        console.error("Submit error:", error);
        alert("An error occurred while saving the patient.");
    }

    };

    const deletePatient = async (id) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            await axios.delete(`http://localhost:5000/api/patients/${id}`);
            fetchPatients();
        }
    };

    return (
        <AdminHomePage>
            <div style={{ padding: "20px" }} ref={topRef}>
                <h2>{editingId ? "Edit Patient" : "Add Patient"}</h2>
                <div className="row mb-3">
  <div className="col-12">
    <Box
      display="flex"
      flexWrap="wrap"
      alignItems="flex-end"
      gap={2}
      sx={{ rowGap: 2 }}
    >
      {/* Date Picker */}
      <Box sx={{ minWidth: 220, flexGrow: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={patient.date}
            onChange={(newValue) => setPatient({ ...patient, date: newValue })}
            format="DD/MM/YYYY"
            renderInput={(params) => (
              <TextField {...params} fullWidth variant="outlined" />
            )}
          />
        </LocalizationProvider>
      </Box>

      {/* Search Input */}
      <Box sx={{ minWidth: 250, flexGrow: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter patient no or name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            borderRadius: 2,
            backgroundColor: "#fff",
            boxShadow: 1,
          }}
        />
      </Box>

      {/* Search Button */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{
            px: 3,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 2,
            whiteSpace: "nowrap",
          }}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
    </Box>
  </div>
</div>


      {message && <div className="alert alert-info">{message}</div>}


                <TextField label="Patient Name" name="patient_name" value={patient.patient_name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Age" type="number" name="age" value={patient.age} onChange={handleChange} fullWidth margin="normal" required />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select name="gender" value={patient.gender} onChange={handleChange}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Doctor</InputLabel>
                    <Select name="doctor_id" value={patient.doctor_id} onChange={handleChange}>
                        {doctors.map((doc) => (
                            <MenuItem key={doc.doc_id} value={doc.doc_id}>{doc.doctor_name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField label="Mobile" name="mobile" value={patient.mobile} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Email" name="email" type="email" value={patient.email} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Username" name="username" value={patient.username} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Password" name="password" type="password" value={patient.password} onChange={handleChange} fullWidth margin="normal" required />
                <Button variant="contained" color="primary" onClick={handleSubmit}>{editingId ? "Update" : "Save"}</Button>

                <h2>Patients List</h2>
                <TableContainer component={Paper} style={{ marginTop: "30px" }}>
                    <Table>
                        <TableHead><TableRow style={{ backgroundColor: "#3f51b5", color: "#fff" }}><TableCell style={{ color: "white" }}>Patient ID</TableCell><TableCell style={{ color: "white" }}>Patient Name</TableCell>        <TableCell style={{ color: "white" }}>Doctor Name</TableCell>
        <TableCell style={{ color: "white" }}>Age</TableCell>
        <TableCell style={{ color: "white" }}>Mobile</TableCell>
<TableCell style={{ color: "white" }}>Actions</TableCell></TableRow></TableHead>
<TableBody>
    {patients.map((p) => {
        const doctor = doctors.find(doc => doc.doc_id === p.doc_id);
        return (
            <TableRow key={p.patient_no}>
                <TableCell>{p.patient_no}</TableCell>
                <TableCell>{p.patient_name}</TableCell>
                <TableCell>{doctor ? doctor.doctor_name : "N/A"}</TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>{p.mobile}</TableCell>
                <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(p)}><Edit /></IconButton>
                    <IconButton color="error" onClick={() => deletePatient(p.patient_no)}><Delete /></IconButton>
                </TableCell>
            </TableRow>
        );
    })}
</TableBody>
                    </Table>
                </TableContainer>
            </div>
        </AdminHomePage>
    );
};

export default AddPatient;