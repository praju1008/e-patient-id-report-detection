import React, { useEffect, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import back from "../assets/back.jpg"; // Adjust path if needed

const DoctorHome = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const doc_id = localStorage.getItem("doc_id");
  const doctor_name = localStorage.getItem("doctor_name");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const isDoctorHome = location.pathname === "/doctor-home";

  const handleLogout = () => {
    navigate("/login?userType=2");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const fetchPatients = useCallback(async (search = "", date = selectedDate) => {
    try {
      setPatients([]);
      const res = await axios.get(
        `http://localhost:5000/today-patients?doc_id=${doc_id}&date=${date}&search=${search}`
      );
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  }, [doc_id, selectedDate]);

  useEffect(() => {
    fetchPatients("", selectedDate);
  }, [fetchPatients, selectedDate]);

  const handlePatientClick = (patient) => {
    navigate(
      `/patient-detail?patient_id=${patient.patient_id}&patient_no=${patient.patient_no}&patient_name=${patient.patient_name}&age=${patient.age}&gender=${patient.gender}&mobile=${patient.mobile}`
    );
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundImage: `url(${back})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        zIndex: 1,
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#0D47A1" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome Dr. {doctor_name}
          </Typography>
          {!isMobile && (
            <Box>
              <Button color="inherit" sx={{ mr: 2 }} onClick={() => navigate(`/doctor-home`)}>
                Patients
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItem button onClick={() => navigate("/doctor-home")}>
            <ListItemText primary="Patients" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ padding: { xs: 2, sm: 3 } }}>
        {isDoctorHome ? (
          <>
            <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
              Patients on {selectedDate}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mb: 2, flexWrap: "wrap" }}>
              <TextField
                label="Search Patient ID/Name"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <TextField
                type="date"
                size="small"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => fetchPatients(searchTerm, selectedDate)}
              >
                Search
              </Button>
            </Box>

            <Paper sx={{ width: "100%", overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Patient Name</b></TableCell>
                    <TableCell><b>Age</b></TableCell>
                    <TableCell><b>Mobile</b></TableCell>
                    <TableCell><b>Gender</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No patients found for the selected date.
                      </TableCell>
                    </TableRow>
                  ) : (
                    patients.map((patient) => (
                      <TableRow key={patient.patient_id} hover>
                        <TableCell
                          sx={{ cursor: "pointer", color: "blue" }}
                          onClick={() => handlePatientClick(patient)}
                        >
                          {patient.patient_name}
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>{patient.mobile}</TableCell>
                        <TableCell>{patient.gender}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Paper>
          </>
        ) : (
          <>{children}</>
        )}
      </Box>
    </Box>
  );
};

export default DoctorHome;
