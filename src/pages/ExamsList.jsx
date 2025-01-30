import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"; // Import icons
import axios from "axios";
import { debounce } from "lodash";

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [newExamName, setNewExamName] = useState("");
  const [previewExam, setPreviewExam] = useState(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const examsPerPage = 12; // Number of cards per page

  // Fetch exams data with retry logic
  useEffect(() => {
    const fetchExams = async (retries = 3) => {
      try {
        const response = await axios.get("https://freepare.onrender.com:5000/api/exams");
        setExams(response.data);
        setFilteredExams(response.data);
        setLoading(false);
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => fetchExams(retries - 1), 1000);
        } else {
          let errorMessage = "Failed to load exams!";
          if (error.response) {
            switch (error.response.status) {
              case 404:
                errorMessage = "Exams data not found.";
                break;
              case 500:
                errorMessage = "Server error. Please try again later.";
                break;
              default:
                errorMessage = "An unexpected error occurred.";
            }
          }
          setError(errorMessage);
          setSnackbarMessage(errorMessage);
          setOpenSnackbar(true);
          setLoading(false);
        }
      }
    };
    fetchExams();
  }, []);

  const debouncedSearch = debounce((query) => {
    const filtered = exams.filter(
      (exam) =>
        exam.examName.toLowerCase().includes(query) ||
        exam.examId.toLowerCase().includes(query)
    );
    setFilteredExams(filtered);
    setCurrentPage(1); // Reset to first page on new search
  }, 500);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const sortedExams = filteredExams.sort((a, b) => {
    if (sortOrder === "A-Z") {
      return a.examName.localeCompare(b.examName);
    } else if (sortOrder === "Z-A") {
      return b.examName.localeCompare(a.examName);
    }
    return 0;
  });

  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = sortedExams.slice(indexOfFirstExam, indexOfLastExam);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredExams(exams);
  };

  const handleRenameClick = (exam) => {
    setCurrentExam(exam);
    setNewExamName(exam.examName); // Pre-fill with the current name
    setRenameDialogOpen(true);
  };
  const handleRenameConfirm = async () => {
    if (!newExamName.trim()) {
      setSnackbarMessage("Exam name cannot be empty!");
      setOpenSnackbar(true);
      return;
    }

    try {
      await axios.put(`https://freepare.onrender.com:5000/api/exams/${currentExam._id}`, {
        examName: newExamName,
      });

      const updatedExams = exams.map((exam) =>
        exam._id === currentExam._id ? { ...exam, examName: newExamName } : exam
      );
      setExams(updatedExams);
      setFilteredExams(updatedExams);

      setRenameDialogOpen(false);
      setSnackbarMessage("Exam renamed successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Failed to rename exam!");
      setOpenSnackbar(true);
    }
  };

  const handleRenameCancel = () => {
    setRenameDialogOpen(false);
    setCurrentExam(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://freepare.onrender.com:5000/api/exams/${id}`);

      setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
      setFilteredExams((prevExams) =>
        prevExams.filter((exam) => exam._id !== id)
      );

      setSnackbarMessage("Exam deleted successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to delete exam!");
      setOpenSnackbar(true);
    }
  };

  const handlePreviewClick = (exam) => {
    setPreviewExam(exam); // Pass the selected exam data
    setPreviewDialogOpen(true);
  };

  const handleDialogClose = () => {
    setPreviewDialogOpen(false);
    setPreviewExam(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", color: "red", fontSize: "1.5rem" }}>
        <Typography variant="h6">{`Error: ${error}`}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          mt: 2,
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#066C98",
            fontWeight: "500",
            fontSize: { xs: "1.8rem", sm: "2.5rem" },
            mb: { xs: 2, sm: 0 },
          }}
        >
          Listed Tests
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={handleSortChange}
              label="Sort By"
            >
              <MenuItem value="A-Z">A-Z</MenuItem>
              <MenuItem value="Z-A">Z-A</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              variant="outlined"
              placeholder="Search by name or ID"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "grey.600" }} />
                ),
              }}
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
            {searchQuery && (
              <IconButton onClick={handleClearSearch} aria-label="clear search">
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {currentExams.length > 0 ? (
          currentExams.map((exam) => (
            <Grid item xs={12} sm={6} md={4} key={exam._id}>
              <Card
                sx={{
                  boxShadow: 3,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 2,
                    backgroundColor: "#fff",
                    borderRadius: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{ color: "#066C98", fontWeight: "500" }}
                    >
                      {exam.examName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "grey", mt: 0.5 }}>
                      Id: {exam.examId}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handlePreviewClick(exam)}>
                      <VisibilityIcon />
                    </IconButton>

                    <IconButton
                      color="primary"
                      onClick={() => handleRenameClick(exam)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(exam._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", width: "100%", mt: 2, color: "grey" }}
          >
            No exams found.
          </Typography>
        )}
      </Grid>

      {filteredExams.length > examsPerPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.ceil(filteredExams.length / examsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={handleRenameCancel}>
        <DialogTitle>Rename Exam</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Exam Name"
            fullWidth
            value={newExamName}
            onChange={(e) => setNewExamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRenameConfirm} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Exam Preview</DialogTitle>
        <DialogContent dividers>
          {previewExam?.questions?.map((question, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h4">
                {question.questionNo}: {question.questionText}
              </Typography>
              {question.questionImage && (
                <Box
                  component="img"
                  src={question.questionImage}
                  alt="Question"
                  sx={{ width: "100%", maxHeight: 200, mt: 1 }}
                />
              )}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ pl: 2 }}>
                  <Typography>A: {question.optionA}</Typography>
                  {question.optionAImage && (
                    <Box
                      component="img"
                      src={question.optionAImage}
                      alt="Option A"
                      sx={{ width: "100px", height: "100px", mt: 1 }}
                    />
                  )}
                  <Typography>B: {question.optionB}</Typography>
                  {question.optionBImage && (
                    <Box
                      component="img"
                      src={question.optionBImage}
                      alt="Option B"
                      sx={{ width: "100px", height: "100px", mt: 1 }}
                    />
                  )}
                  <Typography>C: {question.optionC}</Typography>
                  {question.optionCImage && (
                    <Box
                      component="img"
                      src={question.optionCImage}
                      alt="Option C"
                      sx={{ width: "100px", height: "100px", mt: 1 }}
                    />
                  )}
                  <Typography>D: {question.optionD}</Typography>
                  {question.optionDImage && (
                    <Box
                      component="img"
                      src={question.optionDImage}
                      alt="Option D"
                      sx={{ width: "100px", height: "100px", mt: 1 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ExamsList;
