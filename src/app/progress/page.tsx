"use client";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { Alert, Card } from "@mui/material";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);
dayjs.extend(duration);

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Card>
      <Box sx={{ display: "flex", alignItems: "center", p: 3 }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            {...props}
            sx={{ height: "26px", borderRadius: "4px" }}
          />
        </Box>
        <Box sx={{ minWidth: 65 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
          >{`${props.value.toFixed(6)}%`}</Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default function LinearWithValueLabel() {
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  const calculateProgress = (start: Dayjs, end: Dayjs) => {
    const now = dayjs();
    const totalDuration = end.diff(start, "millisecond");
    const elapsedDuration = now.diff(start, "millisecond");

    // Se ainda não começou
    if (now.isBefore(start)) {
      return 0;
    }
    // Se já terminou
    if (now.isAfter(end)) {
      return 100;
    }
    // Calcula a porcentagem de progresso
    return (elapsedDuration / totalDuration) * 100;
  };

  const formatRemainingTime = (end: Dayjs) => {
    const now = dayjs();
    const diff = end.diff(now);
    const duration = dayjs.duration(Math.abs(diff));
    const totalHours = Math.floor(duration.asHours());
    const minutes = String(duration.minutes()).padStart(2, "0");
    const seconds = String(duration.seconds()).padStart(2, "0");
    return `${totalHours}:${minutes}:${seconds}`;
  };

  // Atualizar progresso a cada segundo
  useEffect(() => {
    const updateProgress = () => {
      if (startDate && endDate) {
        const newProgress = calculateProgress(startDate, endDate);
        setProgress(newProgress);
        setRemainingTime(formatRemainingTime(endDate));
      }
    };

    // Atualiza imediatamente
    updateProgress();

    // Configura intervalo para atualizar a cada 50ms
    const timer = setInterval(updateProgress, 50);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  // Carregar datas salvas do localStorage
  useEffect(() => {
    const savedStartDate = localStorage.getItem("startDate");
    const savedEndDate = localStorage.getItem("endDate");

    if (savedStartDate) {
      setStartDate(dayjs(savedStartDate));
    }
    if (savedEndDate) {
      setEndDate(dayjs(savedEndDate));
    }
  }, []);

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue) {
      localStorage.setItem("startDate", newValue.toISOString());
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    if (newValue) {
      localStorage.setItem("endDate", newValue.toISOString());
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <div className="generic-container">
          <DatePicker
            sx={{ width: "100%" }}
            label="Data inicial"
            value={startDate}
            onChange={handleStartDateChange}
            format="DD/MM/YYYY"
          />
        </div>
        <div className="generic-container">
          <DatePicker
            sx={{ width: "100%" }}
            label="Data final"
            value={endDate}
            onChange={handleEndDateChange}
            format="DD/MM/YYYY"
          />
        </div>
      </LocalizationProvider>
      <div className="generic-container">
        <LinearProgressWithLabel value={progress} />
        {endDate && (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            {dayjs().isBefore(endDate)
              ? `Faltam ${remainingTime} horas/minutos para o fim do projeto. E faltam ${Math.ceil(
                  dayjs.duration(endDate.diff(dayjs())).asDays()
                )} dias.`
              : `Você passou ${remainingTime} da meta`}
          </Typography>
        )}
      </div>
      <div className="generic-container">
        <Alert variant="outlined" severity="warning" sx={{ marginTop: 1 }}>
          Caiu dia 12/01/2025. Quedas fazem parte do processo, porém só foi
          perdoado porque resolveu não cair mais vezes neste mesmo dia provando
          ter MUITA FORÇA DE VONTADE. Essa chance é única, portanto não haverão
          mais perdões. Projeto ainda continua. Orgulhe-se 😎
        </Alert>
      </div>
    </Box>
  );
}
