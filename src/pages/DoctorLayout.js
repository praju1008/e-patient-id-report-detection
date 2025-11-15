import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const doctor_name = params.get("doctor_name");
  const doc_id = params.get("doc_id");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    navigate("/login?userType=2");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const goToPatients = () => {
    navigate(`/doctor-home?doc_id=${doc_id}&doctor_name=${doctor_name}`);
  };

  return (
    <Box>
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
              <Button color="inherit" sx={{ mr: 2 }} onClick={goToPatients}>
                Patients
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <List>
          <ListItem button onClick={goToPatients}>
            <ListItemText primary="Patients" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ p: 3 }}>
        <Outlet /> {/* This will render nested pages like DoctorHome or PatientDetail */}
      </Box>
    </Box>
  );
};

export default DoctorLayout;
