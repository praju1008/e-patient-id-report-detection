import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Drawer, IconButton } from "@mui/material";
import { useNavigate,useLocation  } from "react-router-dom";
import { PersonAdd, LocalHospital, MedicalServices, Menu } from "@mui/icons-material"; // Import MUI icons
import { useState } from "react";
import back from "../assets/back.jpg"; // Adjust path if needed


const AdminHomePage = ({children}) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current location (route)
  const [drawerOpen, setDrawerOpen] = useState(false); // State for the Drawer menu

  // Function to handle Logout
  const handleLogout = () => {
    // Logic to clear session or authentication token if applicable
    navigate("/login?userType=1"); // Redirect back to the login page
  };

  // Function to navigate to Add Doctor page
  const navigateToAddDoctor = () => {
    navigate("/add-doctor");
  };

  // Function to navigate to Add Patient page
  const navigateToAddPatient = () => {
    navigate("/add-patient");
  };

  // Function to navigate to Add Specialization page
  const navigateToAddSpecialization = () => {
    navigate("/add-specialization");
  };

  // Handle opening/closing of the drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  // Check if we're on the admin home page
  const isAdminHome = location.pathname === "/admin-home"; // Assuming /admin-home is the admin dashboard route

  return (
    <Box
    sx={{
      minHeight: "100vh",
      backgroundImage: `url(${back})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundAttachment: "fixed", // Optional: gives a nice scrolling effect
      position: "relative",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.7)", // translucent white
      zIndex: 1,

    }}
    
    >
      {/* Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#0D47A1" }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <Menu />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>

          {/* Desktop View - Navigation buttons */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <Button color="inherit" onClick={navigateToAddDoctor}>
              <PersonAdd sx={{ mr: 1 }} />
              Add Doctor
            </Button>
            <Button color="inherit" onClick={navigateToAddPatient}>
              <LocalHospital sx={{ mr: 1 }} />
              Add Patient
            </Button>
            <Button color="inherit" onClick={navigateToAddSpecialization}>
              <MedicalServices sx={{ mr: 1 }} />
              Add Specialization
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <Button fullWidth onClick={navigateToAddDoctor}>
            <PersonAdd sx={{ mr: 1 }} />
            Add Doctor
          </Button>
          <Button fullWidth onClick={navigateToAddPatient}>
            <LocalHospital sx={{ mr: 1 }} />
            Add Patient
          </Button>
          <Button fullWidth onClick={navigateToAddSpecialization}>
            <MedicalServices sx={{ mr: 1 }} />
            Add Specialization
          </Button>
          <Button fullWidth onClick={handleLogout}>
            Log Out
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ padding: { xs: 2, sm: 3 } }}>
        {isAdminHome ? (
          <>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
              Welcome, Admin!
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              This is the Admin Dashboard where you can manage doctors, patients, and specializations.
            </Typography>
          </>
        ) : (
          <>{children}</> // Render the child content if it's not the admin-home page
        )}
      </Box>
    </Box>
  );
};

export default AdminHomePage;
