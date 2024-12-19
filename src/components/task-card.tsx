import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Add, Remove } from "@mui/icons-material";
import { Alert, Chip, Divider, IconButton } from "@mui/material";

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
}

export default function TaskCard({
  taskName,
  level,
  packs,
  drawResults,
  selectedNow,
  shouldRemoveAlerts,
  setShouldRemoveAlerts,
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
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {taskName} ({"LV " + level})
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 1 }}
          component="div"
        >
          Pelo nível pode sortear:{" "}
          <Chip
            label={packs + " por execução"}
            sx={{
              borderRadius: "6px",
            }}
          />
        </Typography>
        {drawResults && (
          <>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
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
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
              Do total sorteado, ganhou: {calculateWinPercentage()}%
            </Typography>
          </>
        )}
        {taskName === "Água" || taskName === "Nutrição" ? (
          <>
            {!selectedNow ? (
              <div style={{ marginTop: "16px" }}>
                <IconButton
                  color="success"
                  aria-label="add"
                  onClick={() => handleAddTask(taskName)}
                >
                  <Add />
                </IconButton>
                <IconButton
                  color="error"
                  aria-label="remove"
                  onClick={handleRemoveLastAlert}
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
      </CardContent>
    </Card>
  );
}
