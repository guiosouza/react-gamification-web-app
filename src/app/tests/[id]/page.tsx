"use client"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

function SingleTest() {
  const { id } = useParams();
  const [open, setOpen] = React.useState(false);
  const [isLogged, setIsLogged] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isLogged) {
    return (
      <div className="generic-container">
        <h4>Por favor, faça login para ver os dados.</h4>
      </div>
    );
  }

  return (
    <>
      <div className="generic-container">
        <Link href="/tests">
          <Button variant="contained" color="primary">
            Voltar
          </Button>
        </Link>
      </div>
      <div>
        <h1>Params {id}</h1>
      </div>
      <div className="generic-container">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              title do teste
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              test descriptions
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" size="small" onClick={handleClickOpen}>
              Iniciar
            </Button>
            <Button variant="outlined" color="error" size="small">
              Parar
            </Button>
          </CardActions>
        </Card>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Iniciar teste?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Descrição de como será o teste.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Não</Button>
          <Button onClick={handleClose} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SingleTest;
