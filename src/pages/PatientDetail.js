import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Paper, Grid
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import DoctorHome from './DoctorHome';
const PatientDetail = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const patient_id = params.get("patient_id");
  const patient_no = params.get("patient_no");
  const patient_name = params.get("patient_name");
  const age = params.get("age");
  const gender = params.get("gender");
  const mobile = params.get("mobile");

  //const [gender, setGender] = useState("");
  const [prescription, setPrescription] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [history, setHistory] = useState([]);

  const date = new Date().toLocaleDateString("en-GB").split("/").reverse().join("-"); // yyyy-MM-dd
 // const doc_id = 1; // get from login/session/localStorage if needed
  const doc_id = localStorage.getItem("doc_id");

useEffect(() => {
      axios.get(`http://localhost:5000/patient-history?patient_id=${patient_no}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err));
  }, [patient_no]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("patient_id", patient_id);
    formData.append("patient_no", patient_no);
    formData.append("doc_id", doc_id);
    formData.append("date", date);
    formData.append("prescription", prescription);
    formData.append("description", description);
    Array.from(files).forEach(file => formData.append("files", file));

    try {
      await axios.post("http://localhost:5000/add-patient-description", formData);
      alert("Patient description saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving description.");
    }
  };

  return (
    <DoctorHome>
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Patient Details</Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}><strong>Date:</strong> {date}</Grid>
          <Grid item xs={6}><strong>Patient NO:</strong> {patient_no}</Grid>
          <Grid item xs={6}><strong>Name:</strong> {patient_name}</Grid>
          <Grid item xs={6}><strong>Age:</strong> {age}</Grid>
          <Grid item xs={6}><strong>Gender:</strong> {gender}</Grid>
          <Grid item xs={6}><strong>Mobile:</strong> {mobile}</Grid>
        </Grid>
      </Paper>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth multiline rows={3} label="Prescription"
          value={prescription} onChange={(e) => setPrescription(e.target.value)} sx={{ mb: 2 }}
        />
        <TextField
          fullWidth multiline rows={3} label="Description"
          value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }}
        />
        <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">Save</Button>
        </Box>
      </form>

      <Typography variant="h6" sx={{ mt: 5 }}>Past History</Typography>
      {history.length === 0 ? (
        <Typography>No previous records found.</Typography>
      ) : (
        history.map((record) => (
            <Paper key={record.id} sx={{ p: 2, my: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography><strong>Date:</strong> {new Date(record.date).toLocaleDateString("en-GB")}</Typography>
              </Grid>
        {/* Doctor Info */}
  <Grid item xs={12}>
    <Typography>
      <strong>Doctor:</strong> {record.doctor_name} &nbsp; | &nbsp; 
      <strong>Mobile:</strong> {record.mobile}
    </Typography>
  </Grid>
              <Grid item xs={2}>
                <Typography><strong>Prescription:</strong></Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{record.prescription}</Typography>
              </Grid>
        
              <Grid item xs={2}>
                <Typography><strong>Description:</strong></Typography>
              </Grid>
              <Grid item xs={10}>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{record.description}</Typography>
              </Grid>
        
            {/*   {record.files && JSON.parse(record.files).length > 0 && (
                <>
                  <Grid item xs={2}>
                    <Typography><strong>Reports:</strong></Typography>
                  </Grid>
                  <Grid item xs={10}>
                    {JSON.parse(record.files).map((file, idx) => (
                      <Typography key={idx}>
                        <a
                          href={`http://localhost:5000/uploads/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {file}
                        </a>
                      </Typography>
                    ))}
                  </Grid>
                </>
              )} */}
              {(() => {
  if (!record.files) return null;

  let files = [];
  try {
    files = JSON.parse(record.files);
  } catch (error) {
    console.error("Invalid JSON in record.files:", record.files);
    return null;
  }

  if (!Array.isArray(files) || files.length === 0) return null;

  return (
    <>
      <Grid item xs={2}>
        <Typography><strong>Reports:</strong></Typography>
      </Grid>
      <Grid item xs={10}>
        {files.map((file, idx) => (
          <Typography key={idx}>
            <a
              href={`http://localhost:5000/uploads/${file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file}
            </a>
          </Typography>
        ))}
      </Grid>
    </>
  );
})()}

            </Grid>
          </Paper>
        ))
      )}
    </Box>
    </DoctorHome>
  );
};

export default PatientDetail;
