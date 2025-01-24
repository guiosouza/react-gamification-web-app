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
import CircularProgressWithLabel from "./circular-progress-with-label";

interface TaskDialogProps {
  handleSuccess: () => void;
  handleFail: () => void;
  taskDialogOpen: boolean;
  exerciseTimeLeft: number | null;
  isExerciseStarted: boolean
}

function TaskDialog({
  handleSuccess,
  handleFail,
  exerciseTimeLeft,
  taskDialogOpen,
  isExerciseStarted
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
                Escolha o resultado ou perca vida
              </Alert>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <CircularProgressWithLabel
                  countdownSeconds={45} // Configura o tempo total
                  onComplete={handleFail} // Chama handleFail ao completar
                  isExerciseStarted={isExerciseStarted}
                  taskDialogOpen={taskDialogOpen}
                  size={80}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Box display="flex" gap={2}>
            <div>
              <Button size="small" onClick={handleSuccess}>
                Sucesso
              </Button>
              <Button size="small" onClick={handleFail} color="error">
                Falha
              </Button>
            </div>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskDialog;
