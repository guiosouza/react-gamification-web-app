"use client";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { database } from "@/lib/firebase";

interface ExerciseOption {
  label: string;
}

interface ExerciseOption {
  label: string;
}

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

type DatabaseExerciseData = Exercise[];

const marginBottomAndTop4 = {
  marginTop: 4,
  marginBottom: 4,
};

function Exercises() {
  const exerciseOptions: ExerciseOption[] = [
    { label: "Flexão" },
    { label: "Barra" },
    { label: "Abdominal" },
    { label: "Agachamento" },
    { label: "Agachamento (1 perna)" },
    { label: "Levantamento lateral (1 perna)" },
    { label: "Bícepes" },
    { label: "Trícepes" },
    { label: "Ombro" },
    { label: "Costas" },
    { label: "Antebraço" },
    { label: "Nádegas" },
  ];

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseOption | null>(exerciseOptions[0]);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("month")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [fails, setFails] = useState<number>(0);
  const [records, setRecords] = useState<ExerciseHistory[]>([]);

  const onSelectedExerciseChange = (
    _: React.SyntheticEvent,
    value: ExerciseOption | null
  ) => {
    setSelectedExercise(value);
  };

  const onStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const onEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  const calculateTotalWeight = (
    reps: number,
    weight: number,
    fails: number
  ) => {
    return reps * Number(weight) - fails * (weight / 2);
  };

  const fetchRecords = useCallback(async () => {
    if (!auth.currentUser || !selectedExercise || !startDate || !endDate)
      return;

    const userRef = ref(database, `users/${auth.currentUser.uid}/data`);

    try {
      const snapshot = await get(userRef);
      const data: DatabaseExerciseData = snapshot.val() || [];

      const exercise = data.find(
        (item: Exercise) =>
          item.title.toLowerCase() === selectedExercise.label.toLowerCase()
      );

      if (!exercise || !exercise.history) {
        setRecords([]);
        return;
      }

      // Filtra por data e ordena por peso total
      const filteredRecords = exercise.history
        .filter((record: ExerciseHistory) => {
          const recordDate = dayjs(record.date, "DD/MM/YYYY - HH:mm");
          return (
            recordDate.isAfter(startDate) &&
            recordDate.isBefore(endDate.add(1, "day"))
          );
        })
        .sort((a: ExerciseHistory, b: ExerciseHistory) => {
          // Ordena por peso total em ordem decrescente
          if (b.totalWeightLifted !== a.totalWeightLifted) {
            return b.totalWeightLifted - a.totalWeightLifted;
          }
          // Se empatar, ordena por data mais recente
          const dateA = dayjs(a.date, "DD/MM/YYYY - HH:mm");
          const dateB = dayjs(b.date, "DD/MM/YYYY - HH:mm");
          return dateB.diff(dateA);
        })
        .slice(0, 3);

      setRecords(filteredRecords);
    } catch (error) {
      console.error("Erro ao buscar recordes:", error);
      alert("Erro ao buscar os recordes.");
    }
  }, [selectedExercise, startDate, endDate]);

  const saveExerciseData = async () => {
    if (!auth.currentUser) return;

    const userRef = ref(database, `users/${auth.currentUser.uid}/data`);
    const totalWeight = calculateTotalWeight(reps, Number(weight), fails);

    try {
      const snapshot = await get(userRef);
      const existingData = snapshot.val() || [];

      // Procura o exercício existente
      let exerciseIndex = existingData.findIndex(
        (item: Exercise) =>
          item.title.toLowerCase() === selectedExercise?.label.toLowerCase()
      );

      if (exerciseIndex === -1) {
        // Se o exercício não existe, cria um novo
        existingData.push({
          title: selectedExercise?.label.toLowerCase(),
          history: [],
        });
        exerciseIndex = existingData.length - 1;
      }

      // Adiciona o novo registro ao histórico
      if (!existingData[exerciseIndex].history) {
        existingData[exerciseIndex].history = [];
      }

      existingData[exerciseIndex].history.push({
        date: dayjs().format("DD/MM/YYYY - HH:mm"),
        reps,
        weight,
        totalWeightLifted: totalWeight,
        failsOrNegative: fails,
      });

      await set(userRef, existingData);

      // Limpa os campos após salvar
      setWeight(0);
      setReps(0);
      setFails(0);

      // Atualiza os recordes
      fetchRecords();
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      alert("Erro ao salvar os dados do exercício.");
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return userCredential.user && setIsLogged(true);
    } catch (error) {
      console.error("Error saving login data", error);
      alert("E-mail ou senha incorretos.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsLogged(false);
    } catch (error) {
      console.error("Error on logout", error);
      alert("Erro ao deslogar.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsLogged(true);
      else setIsLogged(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLogged && selectedExercise && startDate && endDate) {
      fetchRecords();
    }
  }, [isLogged, selectedExercise, startDate, endDate, fetchRecords]);

  return (
    <div>
      {isLogged ? (
        <>
          <div className="generic-container">
            <Button variant="outlined" onClick={logout} sx={{ width: "100%" }}>
              DESLOGAR
            </Button>
          </div>
          <div className="generic-container">
            <Typography gutterBottom variant="h5" component="div">
              Escolha o exercício
            </Typography>
          </div>

          <div className="generic-container">
            <Autocomplete
              disablePortal
              options={exerciseOptions}
              value={selectedExercise}
              onChange={onSelectedExerciseChange}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Exercises" />
              )}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-number"
              label="Peso"
              type="text"
              value={weight}
              onChange={(e) => {
                const value = e.target.value;
                // Valida apenas números decimais
                if (/^\d*\.?\d*$/.test(value)) {
                  setWeight(Number(value));
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-number"
              label="Repetições"
              type="text"
              value={reps}
              onChange={(e) => {
                const value = e.target.value;

                if (/^\d*\.?\d*$/.test(value)) {
                  setReps(Number(e.target.value));
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-number"
              label="Quantas falhou ou usou negativa"
              type="text"
              value={fails}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setFails(Number(e.target.value));
                }
              }}
              sx={{ width: "100%" }}
            />
          </div>
          <Button
            variant="contained"
            onClick={saveExerciseData}
            sx={{ width: "100%", marginY: 2 }}
          >
            Enviar
          </Button>
          <Divider sx={marginBottomAndTop4}>RECORDES</Divider>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Para ver os 20 últimos recordes, selecione o período.
          </Typography>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <div className="generic-container">
              <DatePicker
                sx={{ width: "100%" }}
                label="Data inicial"
                value={startDate}
                onChange={onStartDateChange}
                format="DD/MM/YYYY"
              />
            </div>
            <div className="generic-container">
              <DatePicker
                sx={{ width: "100%" }}
                label="Data final"
                value={endDate}
                onChange={onEndDateChange}
                format="DD/MM/YYYY"
              />
            </div>
          </LocalizationProvider>

          {selectedExercise && startDate && endDate && (
            <>
              {records.length === 0 ? (
                <div className="generic-container">
                  <Alert variant="outlined" severity="success">
                    Sem dados para exibir.
                  </Alert>
                </div>
              ) : (
                records.map((record, index) => {
                  const recordDate = record.date.split(" - ")[0];
                  const today = dayjs().format("DD/MM/YYYY");
                  const isToday = recordDate === today;

                  return (
                        <Card
                          key={index}
                          sx={{
                            marginBottom: 2,
                            marginTop: 4,
                            backgroundColor: isToday ? "secondary" : "inherit",
                            transition: "background-color 0.3s ease",
                            border: isToday ? "2px solid #2196f3" : "none",
                          }}
                        >
                          <CardActionArea>
                            <CardContent>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {selectedExercise.label}
                                </Typography>
                                {isToday && (
                                  <Chip
                                    label="Registro de hoje"
                                    color="primary"
                                    size="small"
                                    sx={{ marginLeft: 1 }}
                                  />
                                )}
                              </div>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Data: {record.date}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Repetições: {record.reps}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Peso usado: {record.weight} KG
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                Negativas ou falhas: {record.failsOrNegative}
                              </Typography>
                              <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                              <Typography
                                variant="body2"
                                component="span"
                                sx={{ color: "text.secondary" }}
                              >
                                Peso total:{" "}
                                <Chip
                                  color="secondary"
                                  label={`${record.totalWeightLifted}KG`}
                                  size="small"
                                />
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                  );
                })
              )}
            </>
          )}
        </>
      ) : (
        <>
          <div className="generic-container">
            <Typography gutterBottom variant="h5" component="div">
              Logar
            </Typography>
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-email-input"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-password-input"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "100%" }}
            />
          </div>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ width: "100%", marginY: 2 }}
          >
            Logar
          </Button>
        </>
      )}
    </div>
  );
}

export default Exercises;
