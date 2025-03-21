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
  Grid2,
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

interface RunHistory {
  room: number;
  time: string;
}

function Profile() {
  const [open, setOpen] = useState(false);
  const [upgradesData, setUpgradesData] = useState<Upgrade[]>([]);
  const [farthestRoom, setFarthestRoom] = useState(1);
  const [runHistory, setRunHistory] = useState<RunHistory[]>([]);

  useEffect(() => {
    const storedUpgrades = localStorage.getItem("upgradesData");
    const storedFarthest = localStorage.getItem("farthestRoom");
    const storedHistory = localStorage.getItem("runHistory");

    if (storedUpgrades) setUpgradesData(JSON.parse(storedUpgrades));
    if (storedFarthest) setFarthestRoom(Number(storedFarthest));
    if (storedHistory) setRunHistory(JSON.parse(storedHistory));
  }, []);

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

  const handleDeleteRun = (index: number) => {
    const newHistory = runHistory.filter((_, i) => i !== index);
    setRunHistory(newHistory);
    localStorage.setItem("runHistory", JSON.stringify(newHistory));
  };

  return (
    <>
      <div className="generic-container">
        <Card
          sx={{
            maxWidth: 345,
            border: "1px solid #5A5A5A",
            mb: 2, // Adiciona margem inferior
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Dados das Runs
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              Sala mais distante: {farthestRoom}
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                mt: 2,
                mb: 1,
              }}
            >
              Últimas 10 runs:
            </Typography>

            {runHistory.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma run registrada
              </Typography>
            )}

            {runHistory.map((run, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 1,
                  p: 1,
                  backgroundColor: "rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <Typography variant="body2">
                    Sala {run.room} - {run.time}
                  </Typography>
                </div>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteRun(index)}
                >
                  X
                </Button>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
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
                {upgrade.completed && (
                  <Grid2 mt={2}>
                    <Chip label="Completo" size="small" color="success" />{" "}
                  </Grid2>
                )}
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
