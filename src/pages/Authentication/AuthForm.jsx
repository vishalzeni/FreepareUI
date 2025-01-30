import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const AuthForm = ({ type }) => {
  // State for user input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");  // Added phone state
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (type === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      email,
      password,
      phone,
      ...(type === "signup" && { firstName, lastName }),
    };

    try {
      const response = await fetch(`https://freepare.onrender.com:5000/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Something went wrong");

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("jwtToken", data.token);

        // Notify the parent tab
        if (window.opener) {
          window.opener.postMessage("AUTH_SUCCESS", window.location.origin);
        }

        // Close the child tab
        window.close();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom,rgb(255, 255, 255), #e3f2fd)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          justifyItems: "center",
          alignItems: "center",
          fontSize: "4rem",
          fontWeight: 700,
          color: "rgba(0, 0, 0, 0.02)",
          textTransform: "uppercase",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
          gap: "30px",
        }}
      >
        {Array(100)
          .fill("Freepare")
          .map((text, index) => (
            <Box key={index}>{text}</Box>
          ))}
      </Box>

      {/* Left-side Image */}
      <Grid
        item
        xs={false}
        sm={4}
        md={5}
        sx={{
          backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0vwYhdNz0-wTJrF7QLWZJNNaSMns-SIvy3w&s')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "70vh",
          display: { xs: "none", sm: "block" },
        }}
      ></Grid>

      {/* Auth Form */}
      <Grid
        item
        xs={11}
        sm={8}
        md={5}
        sx={{
          zIndex: 1,
          height: "auto", // Allow height to adjust based on content
          padding: 0,
        }}
      >
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              variant="h3"
              textAlign="center"
              color="primary"
              fontWeight="600"
              gutterBottom
            >
              {type === "signup" ? "Create an Account" : "Welcome Back!"}
            </Typography>
            <Typography
              variant="body1"
              textAlign="center"
              color="textSecondary"
              sx={{ marginBottom: 3 }}
            >
              {type === "signup"
                ? "Join Freepare today to unlock endless possibilities."
                : "Log in to your Freepare account and continue your journey."}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}

            {/* First Name and Last Name Fields for Signup */}
            {type === "signup" && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            )}

            {/* Email, Password, and Confirm Password Fields */}
            {type === "signup" ? (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      margin="normal"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </>
            ) : (
              <>
                {/* Only Email and Password Fields for Login */}
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                paddingY: 1.5,
                marginTop: 2,
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              {type === "signup" ? "Sign Up" : "Log In"}
            </Button>

            {/* Link to Sign Up Page when on Login */}
            {type === "login" && (
              <Typography variant="body1" align="center" sx={{ mt: 2 }}>
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/signup"
                  underline="hover"
                  sx={{ color: "#066C98", fontWeight: 500 }}
                >
                  Sign up now
                </Link>
              </Typography>
            )}
          </Box>

          {/* Link to Login Page when on Sign Up */}
          {type === "signup" && (
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "#066C98", fontWeight: 500 }}
              >
                Click here to login
              </Link>
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthForm;
