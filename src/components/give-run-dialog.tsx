import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

// Definindo os tipos das props com uma interface
interface DialogPros {
  open: boolean;
  handleDoNotGiveUp: () => void;
  giveUp: () => void;
}

function GiveRunDialog({ open, giveUp, handleDoNotGiveUp } : DialogPros) {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleDoNotGiveUp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Desistir da RUN?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ao desistir da RUN, você perderá todo o progresso feito até agora.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={giveUp}>
            Sim
          </Button>
          <Button onClick={handleDoNotGiveUp} autoFocus>
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GiveRunDialog;
