export const COLORS = {
  primary: "#066C98",
  secondary: "#2CACE3",
  white: "#ffffff",
  grey: "grey",
  lightGrey: "#f0f0f0",
  green: "#4bb543",
  red: "red",
  black: "#000",
  darkGrey: "#555",
  success: "#5cb85c",
  error: "#e57373",
};
export const STYLES = {
  card: {
    backgroundColor: COLORS.white,
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)", // Better Depth
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    minHeight: "250px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    "&:hover": {
      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)", // Stronger Hover Shadow
    },
    cursor: "pointer",
  },
  typography: {
    fontWeight: "bold",
    color: COLORS.primary,
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  button: {
    width: "auto",
    fontSize: { xs: "0.6rem", sm: "0.9rem" },
    padding: { xs: "6px 2px", sm: "8px 14px" },
    minWidth: { xs: "100px", sm: "120px" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  dialogTitle: {
    fontSize: "1.4rem",
    fontWeight: 600,
    color: COLORS.primary,
  },
  dialogContent: {
    background: "linear-gradient(to bottom,rgb(255, 255, 255), #e3f2fd)",
  },
  linearProgress: {
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightGrey,
    "& .MuiLinearProgress-bar": {
      backgroundColor: COLORS.primary,
    },
  },
  iconButton: {
    position: "fixed",
    top: "80px",
    left: "20px",
    backgroundColor: COLORS.white,
    color: "#1976d2",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    "&:hover": {
      backgroundColor: COLORS.lightGrey,
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    },
  },
  searchBox: {
    width: "350px",
    backgroundColor: COLORS.white,
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease-in-out",
  },
  serialNumberBox: {
    mr: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: "8px",
    width: "70px",
    height: "70px",
    boxShadow: 2,
  },
  serialNumberTypography: {
    fontWeight: "bold",
    color: COLORS.white,
    padding: "4px 8px",
    textAlign: "center",
    lineHeight: "1.5",
  },
  solutionButton: {
    mt: 1,
    mb: 1,
    fontSize: { xs: "0.7rem", sm: "0.9rem" },
    background: COLORS.white,
    color: COLORS.primary,
    "&:hover": {
      backgroundColor: COLORS.lightGrey,
    },
  },
  previewButton: {
    bgcolor: COLORS.white,
    color: COLORS.primary,
    borderRadius: 1,
    transition: "all 0.3s ease",
    padding: { xs: "6px 2px", sm: "8px 14px" },
    minWidth: { xs: "110px", sm: "100px" },
    "&:hover": {
      bgcolor: COLORS.lightGrey,
    },
    textTransform: "none",
    fontSize: { xs: "0.7rem", sm: "0.8rem" },
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
  },
  viewMoreTypography: {
    textTransform: "none",
    fontWeight: 600, // ✅ Thoda bold for better readability
    fontSize: "14px", // ✅ Slightly optimized font-size
    borderRadius: "10px", // ✅ Smoother rounded edges
    textAlign: "right",
    color: COLORS.primary,
    cursor: "pointer",
    padding: "8px 18px", // ✅ Thoda zyada padding for better click area
    boxShadow: "none",
    border: `1px solid ${COLORS.primary}`,
    transition: "all 0.3s ease-in-out", // ✅ Smooth hover effect
  
    "&:hover": {
      backgroundColor: COLORS.primary,
      color: COLORS.white,
      transform: "scale(1.06)", // ✅ Subtle lift effect
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // ✅ Light shadow on hover
    },
  },
  
  descriptionTypography: {
    color: COLORS.black,
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitLineClamp: 5,
  },
  percentageTypography: {
    color: COLORS.black,
    fontWeight: "bold",
  },
  completedTestsTypography: {
    color: COLORS.black,
    fontWeight: "bold",
  },
  totalTestsTypography: {
    color: COLORS.black,
    fontWeight: "bold",
  },
};
