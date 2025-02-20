import React from "react";
import { Button, Typography, Box, Grid, Container } from "@mui/material";
import { Sparkles } from "lucide-react"; // ✨ Sparkling Star Icon
import img from "../Assets/Freepare_Exam_Img.png";

const JoinUs = () => {
  const handleButtonClick = () => {
    window.open("/signup", "_blank", "noopener,noreferrer");
  };

  return (
    <Box sx={{ width: "100%", py: { xs: 4, sm: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          {/* Left Side Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: "500",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
                background: "linear-gradient(90deg, #066C98, #2CACE3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Free Exam Preparation
            </Typography>
            <Typography
              variant="body1"
              paragraph
              sx={{ color: "#555", mb: 3 }}
            >
              At <b>FREEPARE</b>, we are committed to providing high-quality exam
              preparation resources completely free of charge.
            </Typography>

            {/* Features with Sparkling Star Icons ✨ */}
            <Box sx={{ mb: 3 }}>
              {[
                "High quality exam preparation.",
                "Wide range of test categories.",
                "No hidden charges, completely free of cost.",
                "Free mock tests for various exams.",
              ].map((text, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <Sparkles size={20} color="#FFA500" style={{ marginRight: "10px" }} />
                  <Typography variant="body1">{text}</Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleButtonClick}
              sx={{
                textTransform: "none",
                fontSize: "16px",
                px: 3,
                py: 1.5,
                borderRadius: 1,
              }}
            >
              Sign Up
            </Button>
          </Grid>

          {/* Right Side Image */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={img}
              alt="Join Us"
              sx={{
                width: { xs: "100%", sm: "90%", md: "80%" },
                mx: "auto",
                display: "block",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JoinUs;
