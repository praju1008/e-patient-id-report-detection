import React from "react";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { AdminPanelSettings, LocalHospital } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Admin",
      icon: <AdminPanelSettings sx={{ fontSize: 60, color: "#1976D2" }} />,
      path: "/login?userType=1", // Pass userType=1 for Admin

    },
    {
      title: "Doctor",
      icon: <LocalHospital sx={{ fontSize: 60, color: "#D32F2F" }} />,
      path: "/login?userType=2", // Pass userType=1 for Admin

    },
  ];

  return (
    
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "linear-gradient(to right, #E3F2FD, #BBDEFB)",
        textAlign: "center",
        p: 2,
      }}
      
    >
      {/* Project Heading */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#0D47A1",
          textTransform: "uppercase",
          letterSpacing: 2,
          textShadow: "2px 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        E-Patient ID Report Detection
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {cards.map((card, index) => (
          <Grid key={index}>
            <Card
              sx={{
                width: 250,
                textAlign: "center",
                p: 2,
                borderRadius: "16px",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.05)",
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                {card.icon}
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
    
  );
};

export default StartPage;
