import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TimerIcon from "@mui/icons-material/Timer";

interface BonusDialogProps {
  open: boolean;
  handleExtraChoice: (choice: "TIMER" | "VIDA") => void;
  handleCloseBonusDialog: () => void;
}

function BonusDialog({
  open,
  handleExtraChoice,
  handleCloseBonusDialog,
}: BonusDialogProps) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Bônus"}</DialogTitle>
        <DialogContent>
          <div className="generic-container">
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              Escolha uma recompensa:
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => {
                handleExtraChoice("TIMER");
                handleCloseBonusDialog();
              }}
            >
              + (1) <TimerIcon sx={{ ml: 1 }} />
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleExtraChoice("VIDA");
                handleCloseBonusDialog();
              }}
            >
              + (1) <FavoriteIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BonusDialog;
