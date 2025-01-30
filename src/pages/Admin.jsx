import { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Panel from './Panel';
import Dashboard from './Dashboard';
import Navbar from '../components/Navbar';
import Upload from './Upload';
import ExamList from './ExamsList';  // Import your ExamList component

const Admin = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [adminCode, setAdminCode] = useState('');
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [openCodeDialog, setOpenCodeDialog] = useState(true); // Open dialog initially
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const hardcodedAdminCode = 'admin123'; // Hardcoded admin code

  const handleCodeSubmit = () => {
    if (adminCode === hardcodedAdminCode) {
      setIsCodeCorrect(true);
      setOpenCodeDialog(false); // Close the dialog
    } else {
      setSnackbarMessage('Invalid Admin Code');
      setSnackbarOpen(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleCodeSubmit();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const renderContent = () => {
    if (!isCodeCorrect) return null; // Don't render content unless the code is correct
    switch (selectedComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Panel':
        return <Panel />;
      case 'Upload':
        return <Upload />;
      case 'ExamList':  // Add case for ExamList
        return <ExamList />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        background: "linear-gradient(to bottom,rgb(255, 255, 255), #e3f2fd)",
        minHeight: '100vh',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ flexGrow: 1, transition: 'margin-left 0.5s ease', width: '100%' }}>
        <Navbar />
        <Box sx={{ width: '100%', padding: 2 }}>
          {/* Admin Code Dialog */}
          <Dialog open={openCodeDialog} onClose={() => setOpenCodeDialog(false)}>
            <DialogTitle>Enter Admin Code</DialogTitle>
            <DialogContent>
              <TextField
                label="Admin Code"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                autoFocus
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCodeSubmit} color="primary" variant="contained">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>

          {!selectedComponent && isCodeCorrect && (
            <Box sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
              <Typography
                variant="h1"
                align="center"
                sx={{
                  mb: 4,
                  background: "linear-gradient(90deg, #066C98, #2CACE3)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontWeight: "500",
                  fontSize: '2.5rem',
                }}
              >
                Admin
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => setSelectedComponent('Dashboard')}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                      padding: '20px',
                    }}
                    aria-label="Dashboard"
                  >
                    <CardContent>
                      <Typography variant="h2" align="center" sx={{ color: '#066C98', fontWeight: "300", fontSize: '2rem' }}>
                        Dashboard
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ color: 'grey', fontWeight: "regular", fontSize: '1.25rem' }}>
                        View statistics and summaries
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => setSelectedComponent('Panel')}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                      padding: '20px',
                    }}
                    aria-label="Panel"
                  >
                    <CardContent>
                      <Typography variant="h2" align="center" sx={{ color: '#066C98', fontWeight: "300", fontSize: '2rem' }}>
                        Panel
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ color: 'grey', fontWeight: "regular", fontSize: '1.25rem' }}>
                        Manage entities and hierarchy
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => setSelectedComponent('Upload')}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                      padding: '20px',
                    }}
                    aria-label="Upload"
                  >
                    <CardContent>
                      <Typography variant="h2" align="center" sx={{ color: '#066C98', fontWeight: "300", fontSize: '2rem' }}>
                        Upload
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ color: 'grey', fontWeight: "regular", fontSize: '1.25rem' }}>
                        Upload files and manage data
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => setSelectedComponent('ExamList')}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                      boxShadow: 3,
                      borderRadius: 2,
                      padding: '20px',
                    }}
                    aria-label="Listed Tests"
                  >
                    <CardContent>
                      <Typography variant="h2" align="center" sx={{ color: '#066C98', fontWeight: "300", fontSize: '2rem' }}>
                        Listed Tests
                      </Typography>
                      <Typography variant="body2" align="center" sx={{ color: 'grey', fontWeight: "regular", fontSize: '1.25rem' }}>
                        View and manage test listings
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {selectedComponent && (
            <Box sx={{ width: '100%', padding: 2 }}>
              <IconButton
                onClick={() => setSelectedComponent(null)}
                sx={{
                  position: 'absolute',
                  top: 80,
                  left: 40,
                  backgroundColor: 'white',
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <ArrowBack />
              </IconButton>
              {renderContent()}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Admin;
