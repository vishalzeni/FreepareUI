export const styles = {
  container: {
    py: 2,
  },
  title: {
    mb: 4,
    background: "linear-gradient(90deg, #066C98, #2CACE3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "500",
    fontSize: "2.5rem",
  },
  entityBox: (level) => ({
    pl: level * 1.5,
    mb: 1.5,
    position: "relative",
  }),
  entityInnerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  entityHeader: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  dragHandle: {
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    mr: 1,
    "&:active": { cursor: "grabbing" },
  },
  entityTypography: (entity, selectedEntity) => ({
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    border: selectedEntity === entity ? "2px solid #1976d2" : "none",
    padding: "6px 10px",
    borderRadius: "4px",
    position: "relative",
    zIndex: 1,
    textTransform: entity.type === "exam" ? "capitalize" : "none",
    fontWeight: entity.type === "exam" ? "bold" : entity.type === "subject" ? "medium" : "normal",
    boxShadow: selectedEntity === entity ? "0 3px 5px 2px rgba(255, 105, 135, .3)" : "none",
    "&:hover": { backgroundColor: "#e3f2fd" },
  }),
  entityDescription: {
    mt: 1,
  },
  fixedButtonContainer: {
    position: "fixed",
    bottom: 20,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    zIndex: 999,
    mt: 2,
    flexWrap: "wrap",
    gap: 1,
  },
  undoBox: (position) => ({
    position: "fixed",
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
  }),
  loadingContainer: {
    py: 2,
    textAlign: "center",
  },
  fullScreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 1300,
  },
};
