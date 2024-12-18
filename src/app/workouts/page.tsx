"use client";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState, useEffect, useCallback } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Alert, Card, CardContent, Typography, Chip, Backdrop, CircularProgress } from "@mui/material";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

interface ExerciseHistory {
  date: string;
  reps: number;
  weight: number;
  totalWeightLifted: number;
  failsOrNegative: number;
}

interface Exercise {
  title: string;
  history: ExerciseHistory[];
}

type WorkoutWithExerciseTitle = ExerciseHistory & { title: string };

type DatabaseExerciseData = Exercise[];

const Workouts = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [isLogged, setIsLogged] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutWithExerciseTitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  const fetchWorkouts = useCallback(async () => {
    if (!auth.currentUser || !startDate || !endDate) return;

    setIsLoading(true);
    const userRef = ref(database, `users/${auth.currentUser.uid}/data`);

    try {
      const snapshot = await get(userRef);
      const data: DatabaseExerciseData = snapshot.val() || [];

      const allWorkouts: WorkoutWithExerciseTitle[] = [];

      data.forEach((exercise) => {
        exercise.history.forEach((record) => {
          const recordDate = dayjs(record.date, "DD/MM/YYYY - HH:mm");
          if (
            recordDate.isAfter(startDate) &&
            recordDate.isBefore(endDate.add(1, "day"))
          ) {
            allWorkouts.push({ ...record, title: exercise.title });
          }
        });
      });

      setWorkouts(allWorkouts);
    } catch (error) {
      console.error("Erro ao buscar treinos:", error);
      alert("Erro ao buscar os treinos.");
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsLogged(true);
      else setIsLogged(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLogged && startDate && endDate) {
      fetchWorkouts();
    }
  }, [isLogged, startDate, endDate, fetchWorkouts]);

  if (isLoading) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
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
      {startDate && endDate && endDate.isBefore(startDate) && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          A data final não pode ser anterior à data inicial.
        </Alert>
      )}
      {startDate && endDate && !endDate.isBefore(startDate) && (
        <Card sx={{ marginTop: 4 }}>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {startDate && endDate ? (
                <>
                  Treinos entre {startDate.format("DD/MM/YYYY")} e{" "}
                  {endDate.format("DD/MM/YYYY")}
                </>
              ) : startDate ? (
                <>Treino no dia {startDate.format("DD/MM/YYYY")}</>
              ) : (
                "Selecione um período"
              )}
            </Typography>
            {/* Coloquei aqui o card com as as informações do treino da data selecionada */}
            {workouts.length === 0 ? (
              <Alert severity="info" sx={{ marginTop: 2 }}>
                Sem dados para exibir. Tente outro período ou veja se está logado. Para logar basta ir na aba de Exercícios.
              </Alert>
            ) : (
              workouts.map((workout, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Chip
                      label={workout.title.toUpperCase()}
                      color="success"
                      sx={{ marginBottom: 1, borderRadius: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Data: {workout.date}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Repetições: {workout.reps}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Peso usado: {workout.weight.toFixed(3).replace('.', ',')} KG
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Negativas ou falhas: {workout.failsOrNegative}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      Peso total: {workout.totalWeightLifted.toFixed(3).replace('.', ',')} KG
                    </Typography>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Workouts;
