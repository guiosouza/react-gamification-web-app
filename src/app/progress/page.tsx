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
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 65 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${props.value.toFixed(5)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel() {
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const calculateProgress = (start: Dayjs, end: Dayjs) => {
    const now = dayjs();
    const totalDuration = end.diff(start, 'millisecond');
    const elapsedDuration = now.diff(start, 'millisecond');

    // Se ainda não começou
    if (now.isBefore(start)) {
      return 0;
    }
    // Se já terminou
    if (now.isAfter(end)) {
      return 100;
    }
    // Calcula a porcentagem
    return (elapsedDuration / totalDuration) * 100;
  };

  // Atualizar progresso a cada segundo
  useEffect(() => {
    const updateProgress = () => {
      if (startDate && endDate) {
        const newProgress = calculateProgress(startDate, endDate);
        setProgress(newProgress);
      }
    };

    // Atualiza imediatamente
    updateProgress();

    // Configura intervalo para atualizar a cada segundo
    const timer = setInterval(updateProgress, 1000);

    return () => clearInterval(timer);
  }, [startDate, endDate]);

  // Carregar datas salvas
  useEffect(() => {
    const savedStartDate = localStorage.getItem('startDate');
    const savedEndDate = localStorage.getItem('endDate');
    
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
      localStorage.setItem('startDate', newValue.toISOString());
    }
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    setEndDate(newValue);
    if (newValue) {
      localStorage.setItem('endDate', newValue.toISOString());
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
      </div>
    </Box>
  );
}