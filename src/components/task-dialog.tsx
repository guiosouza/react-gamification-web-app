import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface TaskDialogProps {
  handleSuccess: () => void;
  handleFail: () => void;
  taskDialogOpen: boolean;
  exerciseTimeLeft: number | null;
  isExerciseStarted: boolean;
}

function TaskDialog({
  handleSuccess,
  handleFail,
  exerciseTimeLeft,
  taskDialogOpen,
}: TaskDialogProps) {
  return (
    <div>
      <Dialog
        open={taskDialogOpen && exerciseTimeLeft === 0}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Bônus"}</DialogTitle>
        <DialogContent>
          <div className="generic-container">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Alert severity="warning" sx={{ mb: 4 }} variant="outlined">
                Escolha o resultado
              </Alert>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              ></div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Box display="flex" gap={2}>
            <Button size="small" onClick={handleSuccess}>
              Sucesso
            </Button>
            <Button size="small" onClick={handleFail} color="error">
              Falha
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskDialog;
