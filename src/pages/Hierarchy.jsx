import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
  Button,
  LinearProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import YouTubeIcon from '@mui/icons-material/YouTube';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ArrowBack } from "@mui/icons-material";
import axios from "axios";
import jwt_decode from "jwt-decode";
import AdditionalInfoDialog from "./Authentication/AdditionalInfoDialog";
import { Snackbar, Alert } from "@mui/material";

const flattenEntities = (entities) => {
  const result = {};
  entities.forEach((entity) => {
    result[entity.id] = entity;
    if (entity.children) {
      Object.assign(result, flattenEntities(entity.children)); // Merge child entities
    }
  });
  return result;
};
const processData = (examData) => {
  // Convert newlines to <br /> tags
  examData = examData.replace(/\\n/g, "<br />");

  // Convert bold markdown (**) to <b> tag
  examData = examData.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Convert italic markdown (*) to <i> tag
  examData = examData.replace(/\*(.*?)\*/g, "<i>$1</i>");

  return examData;
};
const Hierarchy = () => {
  const [data, setData] = useState([]);
  const [path, setPath] = useState([]);
  const [currentLevel, setCurrentLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [examData, setExamData] = useState([]); // Store fetched exam data
  const [testCompleted, setTestCompleted] = useState({}); // Track completion for each test
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility
  const [additionalInfo, setAdditionalInfo] = useState({
    institutionType: "",
    class: "",
    institutionName: "",
    degreeName: "",
    passingYear: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userCreatedAt, setUserCreatedAt] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [institutionType, setInstitutionType] = useState(null);

  const entityMap = useMemo(() => flattenEntities(data), [data]);
  useEffect(() => {
    const fetchData = async (retries = 3) => {
      try {
        const response = await axios.get("https://freepare.onrender.com:5000/api/entities");
        setData(response.data);
        setCurrentLevel(response.data);
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => fetchData(retries - 1), 1000);
        } else {
          let errorMessage = "Failed to fetch data. Please try again later.";
          if (error.response) {
            switch (error.response.status) {
              case 404:
                errorMessage = "Data not found.";
                break;
              case 500:
                errorMessage = "Server error. Please try again later.";
                break;
              default:
                errorMessage = "An unexpected error occurred.";
            }
          } else if (error.request) {
            errorMessage = "Network Error: Please check your internet connection.";
          }
          setSnackbarMessage(errorMessage);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          setData([]);
          setCurrentLevel([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const handleToggleSearch = () => {
      setShowSearch((prev) => !prev);
    };
    window.addEventListener("toggleSearch", handleToggleSearch);
    return () => {
      window.removeEventListener("toggleSearch", handleToggleSearch);
    };
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEntities = searchQuery
    ? currentLevel.filter((entity) =>
        entity.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : currentLevel;

  const handleBackClick = useCallback(() => {
    if (path.length > 0) {
      const updatedPath = path.slice(0, -1);
      setPath(updatedPath);

      if (updatedPath.length === 0) {
        setCurrentLevel(data);
      } else {
        const lastEntity = updatedPath[updatedPath.length - 1];
        setCurrentLevel(lastEntity.children || []);
      }
    }
  }, [path, data]);

  const navigateTo = (entity) => {
    setPath((prevPath) => [...prevPath, entity]);
    setCurrentLevel(entity.children);
  };

  const currentEntity = path.length > 0 ? path[path.length - 1] : null;

  useEffect(() => {
    if (
      currentEntity &&
      currentEntity.type === "topic" &&
      currentEntity.children
    ) {
      currentEntity.children.forEach((paper) => {
        fetchExamData(paper.name); // Treat paper.name as examId
      });
    }
  }, [currentEntity]);

  const fetchExamData = async (examId, retries = 3) => {
    try {
      const response = await axios.get(
        `https://freepare.onrender.com:5000/api/exams/${examId}`
      );
      setExamData((prevData) => ({
        ...prevData,
        [examId]: response.data,
      }));
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchExamData(examId, retries - 1), 1000);
      } else {
        let errorMessage = "Error fetching exam data. Please try again later.";
        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = "Exam data not found.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = "An unexpected error occurred.";
          }
        } else if (error.request) {
          errorMessage = "Network Error: Please check your internet connection.";
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const fetchCompletedTests = async (retries = 3) => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await axios.get(
        "https://freepare.onrender.com:5000/api/tests/getCompletedTests",
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Include JWT in headers
          },
        }
      );

      if (response.status === 200) {
        const completedTestsMap = response.data.completedTests.reduce(
          (acc, testName) => {
            acc[testName] = true;
            return acc;
          },
          {}
        );
        setTestCompleted(completedTestsMap);
      } else {
        console.error(
          "Failed to fetch completed tests:",
          response.data.message
        );
      }
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchCompletedTests(retries - 1), 1000);
      } else {
        let errorMessage = "Error fetching completed tests. Please try again later.";
        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = "Completed tests data not found.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = "An unexpected error occurred.";
          }
        } else if (error.request) {
          errorMessage = "Network Error: Please check your internet connection.";
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchCompletedTests();
  }, []);
  const fetchUserData = async (retries = 3) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) {
      setLoading(false);
      return;
    }
    try {
      const decodedToken = jwt_decode(jwtToken);
      const userId = decodedToken.userId;
      if (!userId) {
        setLoading(false);
        return;
      }
      const response = await fetch(`https://freepare.onrender.com:5000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }
      const data = await response.json();
      setUserCreatedAt(data.createdAt);
      setInstitutionType(data.institutionType);
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => fetchUserData(retries - 1), 1000);
      } else {
        let errorMessage = "Error fetching user data. Please try again later.";
        if (error.response) {
          switch (error.response.status) {
            case 404:
              errorMessage = "User data not found.";
              break;
            case 500:
              errorMessage = "Server error. Please try again later.";
              break;
            default:
              errorMessage = "An unexpected error occurred.";
          }
        } else if (error.request) {
          errorMessage = "Network Error: Please check your internet connection.";
        }
        setSnackbarMessage(errorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const isSixDaysPassed = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays >= 6;
  };
  const handleStartTestClick = (examId, testName) => {
    if (
      userCreatedAt &&
      institutionType === null &&
      isSixDaysPassed(userCreatedAt)
    ) {
      setIsDialogOpen(true);
    } else {
      navigateToTestPage(examId, testName);
    }
  };
  const handleAddInfoSubmit = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        setSnackbarMessage("You need to log in to update information.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      const decodedToken = jwt_decode(jwtToken);
      const { userId } = decodedToken;
      const updatedAdditionalInfo = {
        ...additionalInfo,
        userId: userId,
      };

      const response = await fetch("https://freepare.onrender.com:5000/users/add-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedAdditionalInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to update additional info.");
      }

      const data = await response.json();
      console.log("Response data:", data);

      setUserData((prev) => ({ ...prev, ...data }));
      setIsDialogOpen(false);
      // Show success message
      setSnackbarMessage("Additional information updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      window.location.reload();
    } catch (err) {
      if (err.response) {
        setSnackbarMessage(
          "Failed to update additional information. Please try again."
        );
      } else if (err.request) {
        setSnackbarMessage(
          "Network Error: Please check your internet connection."
        );
      } else {
        setSnackbarMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const navigateToTestPage = (examId, testName) => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (jwtToken) {
      try {
        const decodedToken = jwt_decode(jwtToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          alert("Session expired. Please log in again.");
          window.open("/login", "_blank");
          return;
        }
        const url = `/test?examId=${examId}&testName=${testName}`;
        const testWindow = window.open(url, "_blank");
        const handleTestCompletion = async (event) => {
          if (event.origin === window.location.origin) {
            if (event.data.type === "TEST_COMPLETED") {
              const { submittedTest } = event.data;
              setTestCompleted((prevState) => ({
                ...prevState,
                [testName]: true,
              }));
              // Show success message
              setSnackbarMessage("Test completed successfully!");
              setSnackbarSeverity("success");
              setSnackbarOpen(true);
              try {
                const response = await fetch(
                  "https://freepare.onrender.com:5000/api/tests/markCompleted",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${jwtToken}`,
                    },
                    body: JSON.stringify({
                      email: decodedToken.email,
                      testName,
                      submittedTest,
                    }),
                  }
                );
                if (response.ok) {
                  const data = await response.json();
                  console.log("Test completion recorded:", data);
                } else {
                  console.error(
                    "Failed to mark test as completed:",
                    response.statusText
                  );
                }
              } catch (error) {
                console.error("Error during API call:", error);
              }
            }
          }
        };
        window.addEventListener("message", handleTestCompletion);
        const interval = setInterval(() => {
          if (testWindow.closed) {
            clearInterval(interval);
            window.removeEventListener("message", handleTestCompletion);
          }
        }, 1000);
      } catch (error) {
        console.error("Error decoding token:", error);
        alert("You are not logged in. Please log in to continue.");
        window.open("/login", "_blank");
      }
    } else {
      const signupWindow = window.open("/signup", "_blank");
      signupWindow.examId = examId;
      signupWindow.testName = testName;
    }
  };
  useEffect(() => {
    const handleMessage = (event) => {
      if (
        event.origin === window.location.origin &&
        event.data === "AUTH_SUCCESS"
      ) {
        window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleVisibilityClick = async (examId) => {
    setLoading(true);
    const token = localStorage.getItem("jwtToken");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const userEmail = decodedToken.email;
        const userResponse = await fetch(
          `https://freepare.onrender.com:5000/users?email=${userEmail}&examId=${examId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error(
            `User Data Fetch Error! Status: ${userResponse.status}`
          );
        }
        const userData = await userResponse.json();
        const examResponse = await fetch(
          `https://freepare.onrender.com:5000/api/exams/${examId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!examResponse.ok) {
          throw new Error(
            `Exam Data Fetch Error! Status: ${examResponse.status}`
          );
        }
        const examData = await examResponse.json();
        const combinedData = {
          user: userData,
          exam: examData,
        };
        setUserData(combinedData);
        setOpenDialog(true);
      } catch (error) {
        if (error.response) {
          setSnackbarMessage("Error fetching data. Please try again later.");
        } else if (error.request) {
          setSnackbarMessage(
            "Network Error: Please check your internet connection."
          );
        } else {
          setSnackbarMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        console.error("Error fetching data:", error);
        if (error instanceof SyntaxError) {
          alert(
            "The server response is not valid JSON. Please check the server."
          );
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Token not found in localStorage");
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ marginTop: "15px" }}>
          Loading...
        </Typography>
      </Box>
    );
  }
  if (!data.length) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <Typography variant="h6" sx={{ marginTop: "15px", color: "grey" }}>
          No data available at the moment. Please try again later.
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        padding: "30px",
        height: "auto",
        position: "relative",
      }}
    >
      {path.length > 0 && (
        <IconButton
          onClick={handleBackClick}
          disabled={path.length === 0}
          sx={{
            position: "fixed",
            top: "80px",
            left: "20px",
            backgroundColor: "#ffffff",
            color: "#1976d2",
            zIndex: 1000,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
            },
          }}
          aria-label="Go back to the previous level"
        >
          <ArrowBack />
        </IconButton>
      )}

      {currentEntity && (
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#066C98",
            mb: 4,
            textAlign: "center",
          }}
        >
          {currentEntity.name}
        </Typography>
      )}

      {path.length === 0 && (
        <Typography
          variant="h1"
          align="center"
          sx={{
            mb: 3,
            background: "linear-gradient(90deg, #066C98, #2CACE3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            padding: "10px",
            borderRadius: "8px",
            fontWeight: "500",
            fontSize: {
              xs: "1.6rem", // For extra small screens (phones)
              sm: "1.8rem", // For small screens (tablets)
              md: "2.2rem", // For medium screens (laptops)
            },
          }}
        >
          Welcome to <span style={{ fontWeight: "550" }}>FREEPARE </span> – Ace
          Your Exams for Free!
        </Typography>
      )}

      {showSearch && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              width: "350px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            InputLabelProps={{
              shrink: true,
            }}
            aria-label="Search"
            placeholder="Search here..."
          />
        </Box>
      )}

      {searchQuery && filteredEntities.length === 0 && (
        <Typography variant="h6" sx={{ color: "grey", textAlign: "center" }}>
          No results found for "{searchQuery}".
        </Typography>
      )}

      {currentEntity &&
        currentEntity.type === "topic" &&
        currentEntity.children && (
          <Box sx={{ mt: 4 }}>
            {currentEntity.children.map((paper, index) => (
              <Box
                key={paper.id}
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                {/* Serial Number */}
                <Box
                  sx={{
                    mr: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#066C98", // Box background color
                    borderRadius: "8px",
                    width: "70px", // Set width to match the Typography box
                    height: "70px", // Match card height
                    boxShadow: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      color: "#fff",
                      padding: "4px 8px",
                      textAlign: "center",
                      lineHeight: "1.5",
                    }}
                  >
                    {index + 1}.
                  </Typography>
                </Box>

                {examData[paper.name] && (
                  <Card
                    sx={{
                      width: "100%", // Make the card full width
                      padding: 2,
                      boxShadow: 2,
                      borderRadius: 2,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: testCompleted[paper.testName]
                        ? "#4bb543"
                        : "#fff", // Green background for completed

                      "@media (max-width:600px)": {
                        flexDirection: "column",
                        gap: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {/* Test Name */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: "500",
                          color: testCompleted[paper.testName]
                            ? "#fff"
                            : "#000", // Text color changes
                          overflow: "hidden", // Required for ellipsis
                          textOverflow: "ellipsis", // Adds the ellipsis when text overflows
                          whiteSpace: "nowrap", // Prevents wrapping of text
                          textTransform: "capitalize",
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.25rem",
                          }, // Responsive font sizes

                          // Ensure consistent behavior
                          maxWidth: "50ch", // Limit text to around 50 characters on larger screens
                          "@media (max-width:600px)": {
                            maxWidth: "30ch", // Limit text to 30 characters on smaller screens
                          },
                        }}
                      >
                        {paper.testName}
                      </Typography>
                    </Box>

                    {!testCompleted[paper.testName] ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleStartTestClick(
                            examData[paper.name].examId,
                            paper.testName
                          )
                        }
                        disabled={testCompleted[paper.testName]} // Disable button for completed tests
                        sx={{
                          width: "auto",
                          fontSize: { xs: "0.6rem", sm: "0.9rem" },
                          padding: { xs: "6px 2px", sm: "8px 14px" },
                          minWidth: { xs: "100px", sm: "120px" },
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        Start Test
                      </Button>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1, sm: 2 },
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Box>
                          {paper.videoLink && (
                           <Button
                           variant="contained"
                           component="a"
                           href={paper.videoLink}
                           target="_blank"
                           rel="noopener noreferrer"
                           startIcon={<YouTubeIcon sx={{ color: "red" }} />}
                           sx={{
                             mt: 1,
                             mb: 1,
                             fontSize: { xs: "0.7rem", sm: "0.9rem" },
                             background: "#fff",
                             color: "#066C98",
                             "&:hover": {
                               backgroundColor: "#f0f0f0", // Light grey background on hover
                             },
                           }}
                         >
                           Solution
                         </Button>
                         
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          onClick={() => handleVisibilityClick(paper.name)}
                          startIcon={
                            <VisibilityIcon
                              sx={{
                                color: "inherit",
                              }}
                            />
                          }
                          sx={{
                            bgcolor: "#fff",
                            color: "#066C98",
                            borderRadius: 1,
                            transition: "all 0.3s ease",
                            padding: { xs: "6px 2px", sm: "8px 14px" },
                            minWidth: { xs: "110px", sm: "100px" },
                            "&:hover": {
                              bgcolor: "#055a7d",
                              transform: "translateY(-1px)",
                            },
                            textTransform: "none", // Prevent uppercase transformation
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          PREVIEW
                        </Button>
                      </Box>
                    )}
                    <Dialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      BackdropProps={{
                        style: {
                          backgroundColor: "rgba(28, 28, 28, 0.4)", // Backdrop ka color aur transparency
                        },
                      }}
                      maxWidth="lg"
                    >
                      <DialogTitle
                        sx={{
                          fontSize: "1.4rem",
                          fontWeight: 600,
                          color: "#066C98",
                        }}
                      >
                        Submitted Response
                      </DialogTitle>
                      <DialogContent
                        sx={{
                          background:
                            "linear-gradient(to bottom,rgb(255, 255, 255), #e3f2fd)",
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <>
                            {/* Display Exam Data */}
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontWeight: 500,
                                color: "#066C98",
                                fontSize: "1.2rem",
                                marginBottom: "1rem",
                              }}
                            >
                              {userData?.exam?.examName ||
                                "Exam name not available"}
                            </Typography>

                            {/* Exam Questions Section */}
                            {userData?.exam?.questions?.length > 0 ? (
                              <Grid container spacing={2}>
                                {userData.exam.questions.map(
                                  (question, index) => {
                                    const questionKey =
                                      question.questionNo.replace("QQ", ""); // This removes the "QQ" part from questionNo
                                    const userAnswer =
                                      userData.user.answers[questionKey]; // Use the generated questionKey to fetch the user answer

                                    return (
                                      <Grid item xs={12} key={index}>
                                        <Card
                                          sx={{
                                            padding: "1.5rem",
                                            marginBottom: "1.5rem",
                                            borderRadius: "12px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#ffffff",
                                            boxShadow: 3,

                                            transition: "all 0.3s ease",
                                          }}
                                        >
                                          <Typography
                                            variant="h3"
                                            sx={{
                                              fontWeight: "500",
                                              color: "#000",
                                              marginBottom: "1rem",
                                              display: "flex",
                                            }}
                                          >
                                            <strong>
                                              {question.questionNo}:
                                            </strong>
                                            {question.questionText && (
                                              <span
                                                style={{
                                                  marginBottom:
                                                    question.questionImage
                                                      ? "4rem"
                                                      : "0", // Conditional margin
                                                  flexGrow: 1,
                                                  marginLeft: "1rem",
                                                  marginRight: "1rem",
                                                }}
                                                dangerouslySetInnerHTML={{
                                                  __html: processData(
                                                    question.questionText
                                                  ),
                                                }}
                                              />
                                            )}
                                          </Typography>

                                          {/* Conditionally render the question image if available */}
                                          {question.questionImage && (
                                            <Box sx={{ marginBottom: "1rem" }}>
                                              <img
                                                src={question.questionImage}
                                                alt={`Question ${question.questionNo}`}
                                                style={{
                                                  width: "80%",
                                                  maxHeight: "300px",
                                                  objectFit: "contain",
                                                  display: "block",
                                                  margin: "0 40px",
                                                  marginTop: "-40px",
                                                }}
                                              />
                                            </Box>
                                          )}

                                          {/* Render the options */}
                                          <FormControl
                                            component="fieldset"
                                            sx={{ marginTop: "1rem" }}
                                          >
                                            <RadioGroup>
                                              {["A", "B", "C", "D"].map(
                                                (option, i) => {
                                                  const optionKey = `option${option}`; // e.g., optionA, optionB, etc.
                                                  const isSelected =
                                                    userAnswer === option; // Check if this option matches the user's answer
                                                  const isDisabled = userAnswer
                                                    ? true
                                                    : false; // Disable all options once selected

                                                  return (
                                                    <FormControlLabel
                                                      key={i}
                                                      value={option}
                                                      control={
                                                        <Radio
                                                          disabled={isDisabled} // Disable all options once selected
                                                          checked={isSelected} // Mark the selected option as checked
                                                        />
                                                      }
                                                      label={
                                                        <Box
                                                          sx={{
                                                            display: "flex",
                                                            alignItems:
                                                              "center",
                                                            justifyContent:
                                                              "space-between",
                                                            width: "100%",
                                                            padding: "10px 0",
                                                          }}
                                                        >
                                                          <Typography
                                                            sx={{
                                                              marginRight:
                                                                "10px",
                                                              marginLeft: "0px",
                                                              flexGrow: 1,
                                                              fontWeight: "600",
                                                            }}
                                                          >
                                                            {option}:
                                                          </Typography>

                                                          <Typography
                                                            sx={{
                                                              color: "#555",
                                                            }}
                                                          >
                                                            {
                                                              question[
                                                                optionKey
                                                              ]
                                                            }{" "}
                                                            {/* Display the option text */}
                                                          </Typography>

                                                          {/* Conditionally render the option image if available */}
                                                          {question[
                                                            `option${option}Image`
                                                          ] && (
                                                            <Box
                                                              sx={{
                                                                marginLeft:
                                                                  "10px",
                                                              }}
                                                            >
                                                              <img
                                                                src={
                                                                  question[
                                                                    `option${option}Image`
                                                                  ]
                                                                }
                                                                alt={`Option ${option}`}
                                                                style={{
                                                                  width: "40px",
                                                                  height:
                                                                    "40px",
                                                                  objectFit:
                                                                    "cover",
                                                                }}
                                                              />
                                                            </Box>
                                                          )}
                                                        </Box>
                                                      }
                                                    />
                                                  );
                                                }
                                              )}
                                            </RadioGroup>
                                          </FormControl>
                                          {question.correctAnswer && (
                                            <Typography
                                              sx={{
                                                marginTop: "1rem",
                                                color: "#5cb85c",
                                                fontStyle: "italic",
                                              }}
                                            >
                                              Correct Answer:{" "}
                                              <strong>
                                                {question.correctAnswer}
                                              </strong>
                                            </Typography>
                                          )}

                                          {(question.explanation ||
                                            question.explanationImage) && (
                                            <Box
                                              sx={{
                                                marginTop: "1rem",
                                                display: "flex",
                                              }}
                                            >
                                              <>
                                                <Typography
                                                  sx={{
                                                    fontWeight: "600",
                                                    color: "grey",
                                                  }}
                                                >
                                                  Explanation:
                                                </Typography>
                                                {question.explanation && (
                                                  <Typography
                                                    sx={{
                                                      fontStyle: "italic",
                                                      color: "#666",
                                                      marginBottom: "0.5rem",
                                                    }}
                                                  >
                                                    {question.explanation}
                                                  </Typography>
                                                )}
                                              </>

                                              {question.explanationImage && (
                                                <Box>
                                                  <img
                                                    src={
                                                      question.explanationImage
                                                    }
                                                    alt={`Explanation for ${question.questionNo}`}
                                                    style={{
                                                      width: "100%",
                                                      maxHeight: "300px",
                                                      objectFit: "contain",
                                                    }}
                                                  />
                                                </Box>
                                              )}
                                            </Box>
                                          )}
                                        </Card>
                                      </Grid>
                                    );
                                  }
                                )}
                              </Grid>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ color: "#555" }}
                              >
                                No questions available for this exam.
                              </Typography>
                            )}
                          </>
                        )}
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setOpenDialog(false)}
                          color="primary"
                        >
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Card>
                )}
              </Box>
            ))}
            {/* Additional Info Dialog */}
            <AdditionalInfoDialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              additionalInfo={additionalInfo}
              handleAdditionalInfoChange={(e) =>
                setAdditionalInfo({
                  ...additionalInfo,
                  [e.target.name]: e.target.value,
                })
              }
              handleAddInfoSubmit={handleAddInfoSubmit}
            />
          </Box>
        )}

      {/* Render cards only when the current entity is not a topic */}
      {!(currentEntity && currentEntity.type === "topic") && (
        <Grid container spacing={3}>
          {filteredEntities.map((entity) => (
            <Grid item key={entity.id} xs={12} sm={6} md={6} lg={4}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  minHeight: "200px",
                  overflow: "hidden", // Extra content chhupane ke liye
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                  },
                  cursor: "pointer",
                }}
                onClick={() => navigateTo(entity)}
                aria-label={`Navigate to ${entity.name}`}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: "bold",
                    color: "#066C98",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  onClick={() => navigateTo(entity)}
                >
                  {entity.name}
                </Typography>

                {/* Only show points under the Exam and subjects */}
                {!(currentEntity && currentEntity.type === "subject") &&
                  entity.children && (
                    <Box sx={{ mt: 2 }}>
                      {entity.children.slice(0, 4).map((child) => (
                        <Typography
                          key={child.id}
                          variant="h4"
                          sx={{ color: "#555", mb: 1, fontWeight: "500" }}
                        >
                          • {child.name}
                        </Typography>
                      ))}
                      {!(currentEntity && currentEntity.type === "exam") && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end", // Align to the right
                          }}
                        >
                          <Typography
                            variant="button"
                            component="span"
                            sx={{
                              textTransform: "none",
                              fontWeight: "500",
                              borderRadius: "8px",
                              textAlign: "right",
                              color: "#066C98",
                              cursor: "pointer",
                              padding: "6px 16px",
                              boxShadow: 2,
                              border: "1px solid #066C98",
                              "&:hover": {
                                backgroundColor: "#066C98", // Revert background color on hover
                                color: "#fff", // Revert text color on hover
                                transform: "scale(1.05)", // Scale slightly on hover
                              },
                            }}
                            onClick={() => navigateTo(entity)}
                          >
                            ...View More
                          </Typography>
                        </Box>
                      )}
                      {/* totalTests */}
                      {!(currentEntity && currentEntity.type === "exam") &&
                        entity.totalTests && (
                          <Box
                            sx={{ display: "flex", gap: 1, marginTop: "-30px" }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                color: "#333",
                                fontWeight: 600,
                                whiteSpace: "nowrap", // Prevent text from wrapping to the next line
                                overflow: "hidden", // Hide overflowed text
                                textOverflow: "ellipsis", // Show ellipsis when text overflows
                                width: "100%", // Default width to take full space
                                // Apply 40px width and ellipsis on small screens only
                                "@media (max-width: 820px)": {
                                  width: "180px", // Set the width to 40px for small screens
                                },
                                "@media (max-width: 770px)": {
                                  width: "160px", // Set the width to 40px for small screens
                                },
                                "@media (max-width: 700px)": {
                                  width: "140px", // Set the width to 40px for small screens
                                },
                              }}
                            >
                              {entity.totalTests}
                            </Typography>
                          </Box>
                        )}
                      {currentEntity && currentEntity.type === "exam" && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end", // Align to the right
                            marginTop: "-30px",
                          }}
                        >
                          <Typography
                            variant="button"
                            component="span"
                            sx={{
                              textTransform: "none",
                              fontWeight: "600",
                              borderRadius: "8px",
                              textAlign: "right",
                              color: "#066C98",
                              cursor: "pointer",
                            }}
                            onClick={() => navigateTo(entity)}
                          >
                            ...View More
                          </Typography>
                        </Box>
                      )}

                      <Box>
                        {currentEntity && currentEntity.type === "exam" && (
                          <Box sx={{ mt: 2 }}>
                            {/* Out of line and Percentage inline */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1, // Space between the line and progress bar
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Typography
                                  variant="h4"
                                  sx={{ color: "#000", fontWeight: "bold" }}
                                >
                                  {/* Total completed tests */}
                                  {entity.children
                                    ? entity.children.reduce(
                                        (completed, subject) =>
                                          completed +
                                          (subject.children
                                            ? subject.children.filter(
                                                (test) =>
                                                  testCompleted[test.testName]
                                              ).length
                                            : 0),
                                        0
                                      )
                                    : "0"}
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{
                                    color: "#000",
                                    fontWeight: "bold",
                                    mx: 1,
                                  }} // margin between the text
                                >
                                  out of
                                </Typography>
                                <Typography
                                  variant="h4"
                                  sx={{ color: "#000", fontWeight: "bold" }}
                                >
                                  {/* Total tests */}
                                  {entity.children
                                    ? entity.children.reduce(
                                        (total, subject) =>
                                          total +
                                          (subject.children
                                            ? subject.children.length
                                            : 0),
                                        0
                                      )
                                    : "0"}{" "}
                                  Tests
                                </Typography>
                              </Box>

                              <Typography
                                variant="h5"
                                sx={{ color: "#000", fontWeight: "bold" }}
                              >
                                {/* Calculate percentage */}
                                {entity.children
                                  ? Math.round(
                                      (entity.children.reduce(
                                        (completed, subject) =>
                                          completed +
                                          (subject.children
                                            ? subject.children.filter(
                                                (test) =>
                                                  testCompleted[test.testName]
                                              ).length
                                            : 0),
                                        0
                                      ) /
                                        entity.children.reduce(
                                          (total, subject) =>
                                            total +
                                            (subject.children
                                              ? subject.children.length
                                              : 0),
                                          0
                                        )) *
                                        100
                                    )
                                  : 0}
                                %
                              </Typography>
                            </Box>

                            {/* Progress Bar */}
                            <LinearProgress
                              variant="determinate"
                              value={
                                entity.children
                                  ? (entity.children.reduce(
                                      (completed, subject) =>
                                        completed +
                                        (subject.children
                                          ? subject.children.filter(
                                              (test) =>
                                                testCompleted[test.testName]
                                            ).length
                                          : 0),
                                      0
                                    ) /
                                      entity.children.reduce(
                                        (total, subject) =>
                                          total +
                                          (subject.children
                                            ? subject.children.length
                                            : 0),
                                        0
                                      )) *
                                    100
                                  : 0
                              }
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#f0f0f0", // Placeholder bar background
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#066C98", // Bar color
                                },
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                {/* description for topics */}
                {currentEntity &&
                  currentEntity.type === "subject" &&
                  entity.description && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#333",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          WebkitLineClamp: 3,
                        }}
                      >
                        {entity.description}
                      </Typography>
                    </Box>
                  )}

                {/* Completed and Total Tests for topics */}
                {currentEntity && currentEntity.type === "subject" && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        // Adjust gap as needed
                        mb: 1, // Margin for spacing between the inline elements and progress bar
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          {entity.children
                            ? entity.children.filter(
                                (paper) =>
                                  testCompleted[paper.testName] === true
                              ).length
                            : 0}
                        </Typography>{" "}
                        out of{" "}
                        <Typography
                          variant="h4"
                          sx={{ color: "#000", fontWeight: "bold" }}
                        >
                          {entity.children ? entity.children.length : "0"} Tests
                        </Typography>
                      </Box>

                      <Typography
                        variant="h5"
                        sx={{ color: "#000", fontWeight: "bold" }}
                      >
                        {/* Percentage */}
                        {entity.children
                          ? `${Math.round(
                              (entity.children.filter(
                                (paper) =>
                                  testCompleted[paper.testName] === true
                              ).length /
                                entity.children.length) *
                                100
                            )}%`
                          : "0%"}
                      </Typography>
                    </Box>

                    {/* Progress Bar */}
                    <LinearProgress
                      variant="determinate"
                      value={
                        entity.children
                          ? (entity.children.filter(
                              (paper) => testCompleted[paper.testName] === true
                            ).length /
                              entity.children.length) *
                            100
                          : 0
                      }
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#f0f0f0", // Placeholder bar background
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: entity.children ? "#066C98" : "#ccc", // Change bar color based on data
                        },
                      }}
                    />
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Auto-hide after 6 seconds
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Hierarchy;
