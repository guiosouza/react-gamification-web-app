"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";

interface Upgrade {
  id: number;
  name: string;
  description: string;
  dropsUsedToUpgrade: number;
  completed: boolean;
  dropsNeededToUpgrade: number;
  aditionalPercentage?: number;
  aditionalSeconds?: number;
}

function Profile() {
  const [open, setOpen] = useState(false);
  const [upgradesData, setUpgradesData] = useState<Upgrade[]>([]);

  useEffect(() => {
    const storedUpgrades = localStorage.getItem("upgradesData");
    if (storedUpgrades) {
      setUpgradesData(JSON.parse(storedUpgrades));
    }
  }, []);

  const handleDoNotGiveUp = () => {
    setOpen(false);
  };

  const handleGiveUp = () => {
    localStorage.removeItem("upgradesData");
    setUpgradesData([]);
    setOpen(false);
  };

  return (
    <>
      <div className="generic-container">
        <Card sx={{ maxWidth: 345, border: "1px solid #5A5A5A" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Dados dos Upgrades
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <div style={{ marginBottom: "32px" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Resumo
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Total de upgrades: {upgradesData.length}
              </Typography>
            </div>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Detalhes dos Upgrades
            </Typography>
            {upgradesData.map((upgrade) => (
              <Card
                key={upgrade.id}
                variant="outlined"
                sx={{ mb: 1, p: 1, backgroundColor: "rgba(0,0,0,0.05)" }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {upgrade.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {upgrade.description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Progresso: {upgrade.dropsUsedToUpgrade}/
                  {upgrade.dropsNeededToUpgrade}
                </Typography>
                {upgrade.completed && <Chip label="Completo" size="small" color="success" />}
              </Card>
            ))}
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => setOpen(true)}
              color="error"
              disabled={upgradesData.length === 0}
            >
              Deletar dados
            </Button>
          </CardActions>
        </Card>
      </div>
      <Dialog
        open={open}
        onClose={handleDoNotGiveUp}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Apagar todos os dados"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja apagar todos os dados do usuário?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleGiveUp}>
            Sim
          </Button>
          <Button onClick={handleDoNotGiveUp} autoFocus>
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;
