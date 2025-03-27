import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Add, Remove } from "@mui/icons-material";
import { CardActionArea, Chip, Divider, IconButton } from "@mui/material";

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

  const taskEmojis = {
    "Sem Álcool": "🚫",
    Água: "💧",
    Nutrição: "🍎",
    Exercícios: "🏋️",
    "Exercícios (focado)": "🏋️🔥",
    Sono: "😴",
    Projeto: "🍆",
    Grind: "🔥",
    "Laboratório Mental": "🧪",
    Caminhada: "👣",
  };

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

    const updatedAlerts = [...alerts, `${taskName}: ${formattedTime}`];
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

  const backgroundColor =
    taskName === "Projeto"
      ? "#ffff"
      : taskName === "Grind"
      ? "#FF9B61"
      : taskName === "Água"
      ? "#95DBFA"
      : taskName === "Exercícios"
      ? "#B6F36B"
      : taskName === "Exercícios (focado)"
      ? "#FF4C4C"
      : taskName === "Sem Álcool"
      ? "#282828"
      : taskName === "Nutrição"
      ? "#FFCC66"
      : taskName === "Sono"
      ? "#7051DC"
      : taskName === "Laboratório Mental"
      ? "#3BB273"
      : taskName === "Caminhada"
      ? "#000"
      : "transparent";

  const textColor =
    taskName === "Projeto"
      ? "#000000"
      : taskName === "Grind"
      ? "#000000"
      : taskName === "Água"
      ? "#000000"
      : taskName === "Exercícios"
      ? "#000000"
      : taskName === "Sem Álcool"
      ? "##ffff"
      : taskName === "Caminhada"
      ? "##ffff"
      : taskName === "Nutrição"
      ? "#000000"
      : taskName === "Sono"
      ? "#000000"
      : taskName === "Laboratório Mental"
      ? "#000000"
      : "#000000";

  return (
    <Card
      sx={{
        marginBottom: 2,
        border: "1px solid #5A5A5A",
        borderRadius: "0px",
        backgroundColor: backgroundColor,
        color: textColor, // Aplica a cor de texto principal
      }}
      elevation={5}
    >
      <CardActionArea onClick={() => onCardClick(taskName)}>
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ color: textColor, fontSize: "1.25rem" }}
          >
            {taskName} {taskEmojis[taskName as keyof typeof taskEmojis] || ""}
          </Typography>

          <Divider sx={{ mb: 2, backgroundColor: textColor }} />

          {taskName === "Sem Álcool" && (
            <Typography
              variant="body2"
              sx={{ color: textColor, mb: 4, fontFamily: "Fira Sans" }}
            >
              Ficar sem beber álcool nos dias que costuma beber.
            </Typography>
          )}

          {taskName === "Laboratório Mental" && (
            <Typography
              variant="body2"
              sx={{ color: textColor, mb: 4, fontFamily: "Fira Sans" }}
            >
              A cada 1 minuto dedicado ao fortalecimento do autocontrole,
              explorando diferentes abordagens no seu Laboratório Mental.
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              color: textColor,
              mb: 1,
              fontFamily: "Fira Sans",
              fontSize: "13px",
            }}
            component="div"
          >
            SORTEIO POR EXECUÇÃO:
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: textColor, mb: 1, fontSize: "20px" }}
          >
            {packs}
          </Typography>

          {drawResults && (
            <>
              <Typography
                variant="body2"
                sx={{ color: textColor, mb: 1, mt: "64px" }}
                component="div"
              >
                Ganhou:
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mb: 1,
                  fontSize: "44px",
                  color: "#00000",
                  fontWeight: "bold",
                }}
              >
                {drawResults.wonPacks}
              </Typography>

              <Typography variant="body2" sx={{ color: textColor }}>
                Do total sorteado, ganhou: {calculateWinPercentage()}%
              </Typography>

              <Typography variant="body2" sx={{ color: textColor }}>
                Total de packs sorteados: {drawResults.packs}
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>

      <div style={{ padding: "0px 16px 0px 16px" }}>
        {["Água", "Nutrição", "Sem Álcool", "Laboratório Mental"].includes(
          taskName
        ) && (
          <>
            {!selectedNow && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "100%"}}>
                  <IconButton
                    color="success"
                    aria-label="add"
                    size="small"
                    onClick={() => handleAddTask(taskName)}
                    sx={{
                      border: "1px solid #4caf50",
                      borderRadius: "0px",
                      backgroundColor: "#4caf50",
                      width: "95%",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#388e3c" },
                    }}
                  >
                    <Add />
                  </IconButton>
                </div>

                <div style={{ width: "100%"}}>
                  <IconButton
                    color="error"
                    size="small"
                    aria-label="remove"
                    onClick={handleRemoveLastAlert}
                    sx={{
                      border: "1px solid #f44336",
                      borderRadius: "0px",
                      backgroundColor: "#f44336",
                      color: "#fff",
                      width: "95%",
                      "&:hover": { backgroundColor: "#951309" },
                    }}
                  >
                    <Remove />
                  </IconButton>
                </div>
              </div>
            )}

            <div style={{ padding: "16px 0px 16px 0px" }}>
              {alerts.map((alert, index) => (
                <Chip
                  key={index}
                  label={alert}
                  sx={{
                    marginTop: 1,
                    borderRadius: "0px",
                    color: "#ffff",
                    backgroundColor: "rgba(0, 0, 0, 0.4)", // Leve transparência para contraste
                    width: "97.5%",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
