import React from "react";
import { Button, Typography, Box, Grid } from "@mui/material";

const JoinUs = () => {
  const handleButtonClick = () => {
    window.open("/signup", "_blank", "noopener,noreferrer");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: {xs: 3, sm: 2, md: 0},
        }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* Left Side Content */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                fontWeight: "500",
                fontSize: "2rem",
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
              sx={{ color: "#555", marginBottom: "24px" }}
            >
              At <b>FREEPARE</b>, we are committed to providing high-quality exam
              preparation resources completely free of charge.
            </Typography>
            <ul
              style={{ margin: "0 0 24px", paddingLeft: "20px", color: "#555" }}
            >
              <li style={{ marginBottom: "12px" }}>
                <Typography variant="body1">
                  High quality exam preparation.
                </Typography>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <Typography variant="body1">
                  Wide range of test categories.
                </Typography>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <Typography variant="body1">
                  No hidden charges, completely free of cost.
                </Typography>
              </li>
              <li style={{ marginBottom: "12px" }}>
                <Typography variant="body1">
                  Free mock tests for various exams.
                </Typography>
              </li>
            </ul>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleButtonClick}
              sx={{
                textTransform: "none",
                fontSize: "16px",
                padding: "6px 24px",
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
              src="https://s3-alpha-sig.figma.com/img/3d12/e646/d8b1c2a08af2332c30872912698ba920?Expires=1739145600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=WgFMGDzbsHntEyGbD6JHWqsjfyQhP14O~EQ5BqEIO60yjdca7vtK~znsBgbE6YaVObSb1thR5yz~eXz1JaQ0m-lVgn4MtfIPQoM2i856qQlZmNHRQbbPRQ~Ez3arkmbAbw82yxYRndf6sPXpo2zML-hVNhc4CLE~7sME8ojikhAihWGi0ncDpkRCqpSIoiwUhYLTFy6gc5aS-11TgVJNAoyZXEWfH2xi~~vyz2izdn6eG3Fo8Tv08TEyeaaQQafSj6LZ-p942m7jnehWicDfC-NBzatCtSo081Td0Lmpb6RMmMT6BjNcfGA0uSesRtOisQ-424O3Pfu1GuwoM3Xr5A__"
              alt="Join Us"
              sx={{
                width: "100%",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default JoinUs;
