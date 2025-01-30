import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  CircularProgress,
  TextField,
} from "@mui/material";
import {
  Edit,
  Delete,
  School,
  Book,
  Description,
  Article,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import axios from "axios";

interface Entity {
  _id: string;
  name: string;
  type: string;
  description?: string; // Add description for topics
  testName?: string; // Add testName for papers
  videoLink?: string; // Add videoLink for papers
  children: Entity[];
}

const Panel = () => {
  const [data, setData] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [deletedEntity, setDeletedEntity] = useState<Entity | null>(null);
  const [undoVisible, setUndoVisible] = useState<boolean>(false);
  const [undoCounter, setUndoCounter] = useState<number>(5);
  const [undoPosition, setUndoPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [newEntityName, setNewEntityName] = useState<string>("");
  const [newEntityType, setNewEntityType] = useState<string>("");
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [expandedEntities, setExpandedEntities] = useState<Set<string>>(
    new Set()
  );
  const [isAdding, setIsAdding] = useState<boolean>(false); // Prevent API overload
  const [newEntityDescription, setNewEntityDescription] = useState<string>("");
  const [newTestName, setNewTestName] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://freepare.onrender.com:5000/api/entities");
        setData(response.data);
        console.log("Data fetched from server:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbarMessage("Error fetching data");
        setOpenSnackbar(true);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addEntity = async () => {
    if (isAdding) return; // Prevent API overload
    setIsAdding(true); // Prevent multiple clicks

    // Validate input
    if (!newEntityName || !newEntityType) {
      setSnackbarMessage("Name and type are required");
      setOpenSnackbar(true);
      setIsAdding(false);
      return;
    }
    try {
      // Send the data to the server
      const response = await axios.post("https://freepare.onrender.com:5000/api/entities", {
        name: newEntityName,
        type: newEntityType,
        description:
          newEntityType === "topic" ? newEntityDescription : undefined,
        parentName: selectedEntity ? selectedEntity.name : null, // Parent name for hierarchy
        testName: newTestName,
        videoLink: videoLink,
      });
      console.log("Entity added to server:", response.data);

      const newEntity = response.data; // New entity from the server
      let updatedData = [...data]; // Copy of the current data

      if (selectedEntity) {
        // Add the entity to the parent's children array
        const addToParent = (items: Entity[]): Entity[] => {
          return items.map((item) => {
            if (item._id === selectedEntity._id) {
              return {
                ...item,
                children: item.children.some(
                  (child) => child._id === newEntity._id
                )
                  ? item.children
                  : [...item.children, newEntity],
              };
            } else if (item.children) {
              return { ...item, children: addToParent(item.children) };
            }
            return item;
          });
        };
        updatedData = addToParent(updatedData); // Update the data
      } else {
        updatedData.push(newEntity); // Add the entity to the root level
      }

      setData(updatedData);
      setSelectedEntity(null); // Reset selected entity
    } catch (error) {
      console.error("Error saving entity:", error);
      setSnackbarMessage("Error saving entity");
      setOpenSnackbar(true);
    } finally {
      setIsAdding(false);
      // Reset dialog and show snackbar
      setSnackbarMessage("Entity Added");
      setOpenSnackbar(true);
      setOpenAddDialog(false);
      setNewEntityName("");
      setNewEntityType("");
      setNewEntityDescription("");
      setNewTestName("");
      setVideoLink("");
    }
  };

  const handleDialogClose = (
    dialogSetter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dialogSetter(false);
    setNewEntityName("");
    setNewEntityType("");
    setNewEntityDescription("");
    setNewTestName("");
    setVideoLink("");
  };

  const deleteEntity = async () => {
    if (selectedEntity && selectedEntity._id) {
      try {
        // Delete entity from the database
        await axios.delete(
          `https://freepare.onrender.com:5000/api/entities/${selectedEntity._id}`
        );
        console.log("Entity deleted from server:", selectedEntity);

        // Remove the deleted entity from the data
        const removeFromHierarchy = (items: Entity[]): Entity[] => {
          return items
            .filter((item) => item._id !== selectedEntity._id)
            .map((item) => ({
              ...item,
              children: removeFromHierarchy(item.children),
            }));
        };

        const updatedData = removeFromHierarchy(data);
        setData(updatedData); // Update the state immediately
        setDeletedEntity(selectedEntity); // Set deletedEntity here
        setSelectedEntity(null);
      } catch (error) {
        console.error("Error deleting entity:", error);
        console.error(
          "Error details:",
          error.response ? error.response.data : error.message
        );
        setSnackbarMessage("Error deleting entity");
        setOpenSnackbar(true);
      }
    } else {
      console.error("No entity selected or _id is missing.");
      setSnackbarMessage("No entity selected or _id is missing");
      setOpenSnackbar(true);
    }

    setOpenDeleteDialog(false);
    setUndoVisible(true);
    setUndoCounter(5);

    setTimeout(() => {
      setUndoVisible(false);
    }, 5000);

    setSnackbarMessage("Entity Deleted");
    setOpenSnackbar(true);
  };
  const updateEntity = async (entity: Entity) => {
    try {
      // Update entity on the server
      const response = await axios.put(
        `https://freepare.onrender.com:5000/api/entities/${entity._id}`,
        { name: editingName }
      );
      console.log("Entity updated on server:", response.data);

      // Update the entity in the hierarchical state
      const updateInHierarchy = (items: Entity[]): Entity[] => {
        return items.map((item) =>
          item._id === entity._id
            ? { ...item, ...response.data } // Merge updated entity data
            : {
                ...item,
                children: updateInHierarchy(item.children), // Recursively update children
              }
        );
      };

      const updatedData = updateInHierarchy(data);
      setData(updatedData); // Update state immediately
      setSelectedEntity(null); // Reset selected entity
    } catch (error) {
      console.error("Error updating entity:", error);
      setSnackbarMessage("Error updating entity");
      setOpenSnackbar(true);
    } finally {
      // Show feedback and reset editing state
      setSnackbarMessage("Entity Updated");
      setOpenSnackbar(true);
      setEditingEntity(null);
      setEditingName("");
    }
  };

  const undoDelete = async () => {
    if (deletedEntity) {
      try {
        const response = await axios.post(
          "https://freepare.onrender.com:5000/api/entities",
          deletedEntity
        );
        console.log(
          "Delete undone and entity added back to server:",
          response.data
        );

        // Update state to add the deleted entity back
        let updatedData = [...data];
        if (deletedEntity.parentName) {
          // Add the entity back to its parent's children array
          const addToParent = (items: Entity[]): Entity[] => {
            return items.map((item) => {
              if (item.name === deletedEntity.parentName) {
                return { ...item, children: [...item.children, response.data] };
              } else if (item.children) {
                return { ...item, children: addToParent(item.children) };
              }
              return item;
            });
          };
          updatedData = addToParent(updatedData);
        } else {
          // Add the entity directly to the root level if no parent is selected
          updatedData.push(response.data);
        }

        setData(updatedData);
      } catch (error) {
        console.error("Error undoing delete:", error);
        setSnackbarMessage("Error undoing delete");
        setOpenSnackbar(true);
      }

      setDeletedEntity(null); // Reset deletedEntity here
    }
    setUndoVisible(false);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setUndoPosition({ top: rect.top, left: rect.left });
    setOpenDeleteDialog(true);
  };

  const handleAddClick = (type: string) => {
    setNewEntityType(type);
    setOpenAddDialog(true);
  };

  const handleEditClick = (entity: Entity) => {
    setEditingEntity(entity);
    setEditingName(entity.name);
  };

  const handleToggleExpand = (entity: Entity) => {
    const newExpandedEntities = new Set(expandedEntities);
    if (newExpandedEntities.has(entity.name)) {
      newExpandedEntities.delete(entity.name);
    } else {
      newExpandedEntities.add(entity.name);
    }
    setExpandedEntities(newExpandedEntities);
  };

  const renderEntity = (entity: Entity, level: number = 0) => {
    const getIcon = (type: string) => {
      switch (type) {
        case "exam":
          return <School />;
        case "subject":
          return <Book />;
        case "topic":
          return <Description />;
        case "paper":
          return <Article />;
        default:
          return <School />;
      }
    };

    const isExpanded = expandedEntities.has(entity.name);

    return (
      <Box
        key={entity._id}
        sx={{
          pl: level * 1.5,
          mb: 1.5,
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "0",
            left: `-5px`,
            width: "8px",
            height: "100%",
            borderLeft: "3px dashed #066C98",
          },
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        {/* Main Box for Name, Type, CRUD Icons, and Expand/Collapse */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Box for Name, Type, Expand/Collapse Icon, and CRUD Icons */}
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Typography
              variant={
                entity.type === "exam"
                  ? "h5"
                  : entity.type === "subject"
                  ? "h6"
                  : "body2"
              }
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                border:
                  selectedEntity === entity ? "2px solid #1976d2" : "none",
                padding: "6px 10px",
                borderRadius: "4px",
                position: "relative",
                zIndex: 1,
                textTransform: entity.type === "exam" ? "capitalize" : "none",
                fontWeight:
                  entity.type === "exam"
                    ? "bold"
                    : entity.type === "subject"
                    ? "medium"
                    : "normal",
                boxShadow:
                  selectedEntity === entity
                    ? "0 3px 5px 2px rgba(255, 105, 135, .3)"
                    : "none",
                "&:hover": {
                  backgroundColor: "#e3f2fd",
                },
              }}
              onClick={() => setSelectedEntity(entity)}
              aria-label={`Select ${entity.name}`}
            >
              {getIcon(entity.type)}
              {editingEntity === entity ? (
                <TextField
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => updateEntity(entity)}
                  onKeyDown={(e) => e.key === "Enter" && updateEntity(entity)}
                  autoFocus
                  sx={{ ml: 1 }}
                  aria-label={`Edit ${entity.name}`}
                />
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", fontSize: "0.9rem", ml: 1 }}
                >
                  {entity.name}
                </Typography>
              )}
            </Typography>
            {/* Type */}
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
              ({entity.type})
            </Typography>

            {/* Expand/Collapse Icon */}
            {entity.children && entity.children.length > 0 && (
              <IconButton
                onClick={() => handleToggleExpand(entity)}
                size="small"
                sx={{ ml: 1 }}
                aria-label="Toggle Expand"
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}

            {/* CRUD Icons (Edit, Delete) */}
            {selectedEntity === entity && (
              <Box sx={{ ml: 2, display: "flex", gap: 1 }}>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleEditClick(entity)}
                    color="primary"
                    aria-label="Edit"
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    onClick={handleDeleteClick}
                    color="secondary"
                    aria-label="Delete"
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Box for Description */}
          {entity.type === "topic" && entity.description && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Topic Description -</strong> {entity.description}
              </Typography>
            </Box>
          )}
          {/* Box for Test Name */}
          {entity.type === "paper" && entity.testName && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="textSecondary">
                <strong>Test Name -</strong> {entity.testName}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Render Children if Expanded */}
        {isExpanded && entity.children && entity.children.length > 0 && (
          <Box sx={{ ml: 3 }}>
            {entity.children.map((child) => renderEntity(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  const handleUnselect = () => {
    setSelectedEntity(null);
  };

  if (loading) {
    return (
      <Container sx={{ py: 2, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 2 }}>
      <Typography
        variant="h1"
        align="center"
        sx={{
          mb: 4,
          background: "linear-gradient(90deg, #066C98, #2CACE3)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "500",
          fontSize: "2.5rem",
        }}
      >
        Hierarchy
      </Typography>
      <Box sx={{ mb: 3 }}>
        {data.map((entity) => renderEntity(entity))}

        <Box
          sx={{
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
          }}
        >
          {!selectedEntity && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddClick("exam")}
              sx={{ mr: 1 }}
              aria-label="Add Exam"
            >
              Add Exam
            </Button>
          )}

          {selectedEntity && selectedEntity.type === "exam" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddClick("subject")}
                sx={{ mr: 1 }}
                aria-label="Add Subject"
              >
                Add Subject
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddClick("topic")}
                sx={{ mr: 1 }}
                aria-label="Add Topic"
              >
                Add Topic
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddClick("paper")}
                aria-label="Add Paper"
              >
                Add Paper
              </Button>
            </>
          )}

          {selectedEntity && selectedEntity.type === "subject" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddClick("topic")}
                sx={{ mr: 1 }}
                aria-label="Add Topic"
              >
                Add Topic
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddClick("paper")}
                aria-label="Add Paper"
              >
                Add Paper
              </Button>
            </>
          )}

          {selectedEntity && selectedEntity.type === "topic" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddClick("paper")}
              aria-label="Add Paper"
            >
              Add Paper
            </Button>
          )}
          {selectedEntity && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleUnselect}
              aria-label="Unselect"
            >
              Unselect
            </Button>
          )}
        </Box>

        {undoVisible && (
          <Box
            sx={{
              position: "fixed",
              top: undoPosition?.top ?? 0,
              left: undoPosition?.left ?? 0,
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <Typography variant="body2" align="center">
              Entity Deleted. Undo in {undoCounter}s
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={undoDelete}
              aria-label="Undo Delete"
            >
              Undo
            </Button>
          </Box>
        )}
      </Box>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Are you sure you want to delete this entity?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            aria-label="Cancel Delete"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteEntity}
            color="secondary"
            aria-label="Confirm Delete"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddDialog}
        onClose={() => handleDialogClose(setOpenAddDialog)}
      >
        <DialogTitle>Add New {newEntityType}</DialogTitle>
        <DialogContent>
          {newEntityType === "exam" ||
            (newEntityType === "subject" && (
              <TextField
                label="Name"
                value={newEntityName}
                onChange={(e) => setNewEntityName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            ))}
          {newEntityType === "topic" && (
            <TextField
              label="Name"
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          {newEntityType === "topic" && (
            <TextField
              label="Description"
              value={newEntityDescription}
              onChange={(e) => setNewEntityDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          {newEntityType === "paper" && (
            <TextField
              label="Enter Id"
              value={newEntityName}
              onChange={(e) => setNewEntityName(e.target.value)}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          {newEntityType === "paper" && (
            <TextField
              label="Enter Test Name"
              value={newTestName}
              onChange={(e) => setNewTestName(e.target.value)}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
          {newEntityType === "paper" && (
            <TextField
              label="Enter Video Link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(setOpenAddDialog)}>
            Cancel
          </Button>
          <Button onClick={addEntity} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        message={snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      />
    </Container>
  );
};

export default Panel;
