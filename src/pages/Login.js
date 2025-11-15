import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, CardContent, IconButton,Link } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Eye icons for show/hide password
import axios from "axios";
import login from '../assets/login.jpg';
const BASE_URL = "http://localhost:5000";
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userType = params.get("userType");

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleLogin = async () => {
    /* if (userType === "1") { */
      // Admin login (Hardcoded)
 /*      if (credentials.username === "admin" && credentials.password === "admin@123") {
        navigate("/admin-home");
      } else {
        setError("Invalid Admin Credentials");
      }
    } else {
      setError("Invalid User Type");
    } */
      setError("");
      if (userType === "1") {
        if (credentials.username === "admin" && credentials.password === "admin@123") {
          navigate("/admin-home");
        } else {
          setError("Invalid Admin Credentials");
        }
      } else if (userType === "2") {
        try {
          const res = await axios.post(`${BASE_URL}/doctor-login`, credentials);
          const doctor = res.data;
         // navigate(`/doctor-home?doc_id=${doctor.doc_id}&doctor_name=${encodeURIComponent(doctor.doctor_name)}`);
         
    // Store doctor data in localStorage
    localStorage.setItem("doc_id", doctor.doc_id);
    localStorage.setItem("doctor_name", doctor.doctor_name);
        // Navigate without parameters
        navigate("/doctor-home");

        } catch (err) {
          setError("Invalid Doctor Credentials");
        }
      } else {
        setError("Invalid User Type");
      }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #E3F2FD, #BBDEFB)",
        backgroundImage: `url(${login})`, // replace with your image path
        //background-image: url('../assets//login.jpg'); /* Ensure this path is correct */
        //background-image:url('../assets/login.jpg');
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* Smart Health System Title */}
      <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold", color:"white", textAlign: "center" }}>
        E-Patient ID Report Detection
      </Typography>

      <Card sx={{ width: 350, p: 3, borderRadius: "16px", textAlign: "center", boxShadow: 4,backgroundColor: "rgba(255, 255, 255, 0.7)",backdropFilter: "blur(6px)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#0D47A1" }}>
            {userType === "1" ? "Admin Login" : "Doctor Login"}
          </Typography>

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            sx={{ mb: 2 }}
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            sx={{ mb: 2 }}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            type={showPassword ? "text" : "password"} // Toggle password visibility
            InputProps={{
              endAdornment: (
                <IconButton
                  position="end"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
          >
            Login
          </Button>
          {/* Link to Start Page */}
          <Box sx={{ mt: 2 }}>
            <Link href="/" underline="hover" sx={{ fontSize: "14px", color: "#0D47A1" }}>
              Back to Start Page
            </Link>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
