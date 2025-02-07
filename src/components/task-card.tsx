import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Add, Remove } from "@mui/icons-material";
import {
  Alert,
  CardActionArea,
  Chip,
  Divider,
  IconButton,
} from "@mui/material";

interface TaskCardProps {
  taskName: string;
  selectedNow?: string;
  level: string;
  packs: number;
  shouldRemoveAlerts?: boolean;
  setShouldRemoveAlerts?: React.Dispatch<React.SetStateAction<boolean>>;
  drawResults?: {
    task: string;
    packs: number;
    wonPacks: number;
  } | null;
  onCardClick: (taskName: string) => void;
}

export default function TaskCard({
  taskName,
  packs,
  drawResults,
  selectedNow,
  shouldRemoveAlerts,
  setShouldRemoveAlerts,
  onCardClick,
}: TaskCardProps) {
  const [alerts, setAlerts] = React.useState<string[]>([]);

  React.useEffect(() => {
    const taskKey = taskName.toLowerCase().replace(" ", "");
    const storedAlerts = JSON.parse(
      localStorage.getItem(`${taskKey}_alerts`) || "[]"
    );
    setAlerts(storedAlerts);
  }, [taskName]);

  const calculateWinPercentage = (): string => {
    if (!drawResults || drawResults.packs === 0) return "0";
    return ((drawResults.wonPacks / drawResults.packs) * 100).toFixed(1);
  };

  const handleAddTask = (taskName: string) => {
    const currentTime = new Date();
    const formattedTime = `${currentTime.toLocaleDateString()} - ${currentTime.toLocaleTimeString()}`;

    const taskKey = taskName.toLowerCase().replace(" ", "");
    const currentCount = parseInt(localStorage.getItem(taskKey) || "0", 10);
    localStorage.setItem(taskKey, (currentCount + 1).toString());

    const updatedAlerts = [
      ...alerts,
      `${taskName} adicionado: ${formattedTime}`,
    ];
    localStorage.setItem(`${taskKey}_alerts`, JSON.stringify(updatedAlerts));

    setAlerts(updatedAlerts);
  };

  const handleRemoveLastAlert = () => {
    if (alerts.length === 0) return;

    const taskKey = taskName.toLowerCase().replace(" ", "");
    const currentCount = parseInt(localStorage.getItem(taskKey) || "0", 10);

    if (currentCount > 0) {
      localStorage.setItem(taskKey, (currentCount - 1).toString());
    }

    const updatedAlerts = alerts.slice(0, -1);
    localStorage.setItem(`${taskKey}_alerts`, JSON.stringify(updatedAlerts));
    setAlerts(updatedAlerts);
  };

  const handleRemoveAllAlerts = React.useCallback(() => {
    const taskKey = taskName.toLowerCase().replace(" ", "");

    localStorage.removeItem(`${taskKey}_alerts`);

    localStorage.setItem(taskKey, "0");

    setAlerts([]);
  }, [taskName]);

  React.useEffect(() => {
    if (shouldRemoveAlerts) {
      handleRemoveAllAlerts();

      // Resetar o estado após a execução
      if (setShouldRemoveAlerts) {
        setShouldRemoveAlerts(false);
      }
    }
  }, [shouldRemoveAlerts, handleRemoveAllAlerts, setShouldRemoveAlerts]);

  return (
    <Card sx={{ marginBottom: 2, border: "1px solid #5A5A5A" }} elevation={5}>
      <CardActionArea onClick={() => onCardClick(taskName)}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {taskName} {taskName === "Sem Álcool" ? "🚫" : ""}{" "}
            {taskName === "Água" ? "💧" : ""}{" "}
            {taskName === "Nutrição" ? "🍎" : ""}
            {taskName === "Exercícios" ? "🏋️" : ""}
            {taskName === "Sono" ? "😴" : ""}
            {taskName === "Projeto" ? "🍆" : ""}
            {taskName === "Grind" ? "🔥" : ""}
            {taskName === "Controle" ? "🕶️" : ""}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {taskName === "Sem Álcool" ? (
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0 }}>
              Ficar sem beber álcool nos dias que costuma beber.
            </Typography>
          ) : null}
          {taskName === "Controle" ? (
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0 }}>
              No mínimo 1 minuto de cultivação de mentalidade de controle.
            </Typography>
          ) : null}
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 1 }}
            component="div"
          >
            Pode sortear:{" "}
            <Chip
              label={packs + " por execução"}
              sx={{
                borderRadius: "6px",
              }}
            />
          </Typography>
          {drawResults && (
            <>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
              >
                Total de packs sorteados: {drawResults.packs}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 1 }}
                component="div"
              >
                Packs ganhos: {""}
                <Chip
                  variant="filled"
                  label={drawResults.wonPacks}
                  color="warning"
                  sx={{
                    borderRadius: "6px",
                  }}
                />
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mb: 4 }}
              >
                Do total sorteado, ganhou: {calculateWinPercentage()}%
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
      <div style={{ paddingLeft: "16px" }}>
        {taskName === "Água" ||
        taskName === "Nutrição" ||
        taskName === "Sem Álcool" ||
        taskName === "Controle" ? (
          <>
            {!selectedNow ? (
              <div
                style={{
                  marginTop: "6px",
                  display: "flex",
                }}
              >
                <IconButton
                  color="success"
                  aria-label="add"
                  size="small"
                  onClick={() => handleAddTask(taskName)}
                  sx={{
                    border: "1px solid #4caf50",
                    backgroundColor: "#4caf50",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#388e3c" },
                  }}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  aria-label="remove"
                  onClick={handleRemoveLastAlert}
                  sx={{
                    border: "1px solid #f44336",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#951309" },
                    ml: 4,
                  }}
                >
                  <Remove />
                </IconButton>
              </div>
            ) : (
              ""
            )}

            <div style={{ marginTop: "16px" }}>
              {alerts.map((alert, index) => (
                <Alert
                  key={index}
                  variant="outlined"
                  severity="success"
                  sx={{ marginTop: 1 }}
                >
                  {alert}
                </Alert>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </Card>
  );
}
