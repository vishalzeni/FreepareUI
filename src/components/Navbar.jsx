import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
  Avatar,
  Box,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import User from "../pages/Authentication/User"; // Import the User dialog component
import jwtDecode from "jwt-decode";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [isTokenExpired, setIsTokenExpired] = useState(true); // State to manage token expiration
  const [userImage, setUserImage] = useState(null); // State for user image URL
  const [userName, setUserName] = useState(null); // State for user details
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    setShowSearch(location.pathname === "/");

    // JWT token check
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (expiryTime > currentTime) {
          setIsTokenExpired(false); // Token is valid
        } else {
          setIsTokenExpired(true); // Token has expired
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
        setIsTokenExpired(true); // Token is invalid or expired
      }
    } else {
      setIsTokenExpired(true); // No token found
    }
  }, [location]);

  const toggleSearch = () => {
    const event = new CustomEvent("toggleSearch");
    window.dispatchEvent(event);
  };

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  // Callback to receive the image URL from User component
  const handleUserImageUpdate = (imageUrl, firstName) => {
    setUserImage(imageUrl); // Dynamically set the user image
    setUserName(firstName); // Dynamically set the user name
  };

  const handleAuthButtonClick = () => {
    // Redirect to appropriate page based on token expiry
    if (isTokenExpired) {
      window.open("/login", "_blank"); // Open login page in a new tab
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          top: 0,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          boxShadow:
            "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)", // Modern shadow
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            style={{
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontSize: "1.5rem",
            }}
          >
            FREEPARE
          </Typography>
          {showSearch && (
            <IconButton
              color="inherit"
              onClick={toggleSearch}
              sx={{ color: theme.palette.primary.main }}
            >
              <SearchIcon />
            </IconButton>
          )}
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            Home
          </Button>

          {/* Conditionally render Avatar or Auth Button based on token status */}
          {location.pathname !== "/admin" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={handleDialogOpen} // Open dialog on click
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                {isTokenExpired ? (
                  <AccountCircle />
                ) : userImage ? (
                  <Avatar src={userImage} alt="User Avatar" />
                ) : (
                  <AccountCircle />
                )}
                <Typography
                  variant="h4"
                  style={{ color: theme.palette.primary.main }}
                >
                  {userName}
                </Typography>
              </IconButton>

              {/* Conditionally render login/signup button based on token expiry */}
              {isTokenExpired && (
                <Button
                  color="inherit"
                  onClick={handleAuthButtonClick}
                  sx={{
                    color: "#fff",
                    background: theme.palette.primary.main,
                    padding: "6px 16px",
                    transition: "background-color 0.3s ease", // Smooth transition for hover
                    "&:hover": {
                      background: theme.palette.primary.dark, // Darker shade on hover
                    },
                    // Responsive styles
                    [theme.breakpoints.down("sm")]: {
                      padding: "4px 10px", // Adjust padding on small screens
                      fontSize: "0.9rem", // Reduce font size on smaller screens
                    },
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* User Dialog */}
      <User
        open={dialogOpen}
        onClose={handleDialogClose}
        onUpdateImage={handleUserImageUpdate} // Pass callback to User component
      />
    </>
  );
};

export default Navbar;
