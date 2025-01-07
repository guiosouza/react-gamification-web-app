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
  Grid2,
  TextField,
  Typography,
  Modal,
  Box,
  Backdrop,
  CircularProgress,
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

const adjustWeightForExercise = (exercise: string, weight: number) => {
  if (exercise === "Flexão") {
    return weight * 0.64;
  } else if (exercise === "Flexão declinada (30°)") {
    return weight * 0.75;
  }
  return weight;
};

const formatWeight = (weight: number) => {
  const fixedWeight = weight.toFixed(3);
  return fixedWeight.replace(".", ",");
};

function Exercises() {
  const exerciseOptions: ExerciseOption[] = [
    { label: "Flexão" },
    { label: "Flexão declinada (30°)" },
    { label: "Barra" },
    { label: "Abdominal" },
    { label: "Agachamento" },
    { label: "Agachamento (1 perna)" },
    { label: "Levantamento lateral (1 perna)" },
    { label: "Bícepes" },
    { label: "Rosca" },
    { label: "Rosca direta" },
    { label: "Rosca concentrada" },
    { label: "Rosca martelo" },
    { label: "Trícepes" },
    { label: "Ombro" },
    { label: "Ombro - Elevação frontal (pronada)" },
    { label: "Ombro - Elevação frontal (neutra)" },
    { label: "Costas" },
    { label: "Antebraço" },
    { label: "Nádegas" },
    { label: "Elevação pélvica" },
    { label: "Remada unilateral neutra" },
  ];

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseOption | null>(exerciseOptions[0]);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2024-12-01"));

  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [fails, setFails] = useState<number>(0);
  const [records, setRecords] = useState<ExerciseHistory[]>([]);
  const [timerIsRunning, setTimerIsRunning] = useState(false); // for when timer is running
  const [timeSessionInSeconds, setTimeSessionInSeconds] = useState(0);
  const [timeSessionDisplayed, setTimeSessionDisplayed] = useState("00:00:00");
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [actualSession, setActualSession] = useState(1);
  const [initialSessionTime, setInitialSessionTime] = useState(0);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const [shouldDelay, setShouldDelay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

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
    return reps * Number(weight) - fails * (weight * 0.9);
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
        .slice(0, 36);

      setRecords(filteredRecords);
    } catch (error) {
      console.error("Erro ao buscar recordes:", error);
      alert("Erro ao buscar os recordes.");
    }
  }, [selectedExercise, startDate, endDate]);

  const saveExerciseData = async () => {
    if (!auth.currentUser) return;

    if (weight <= 0 || reps <= 0) {
      alert("Peso e/ou Repetições não podem ser zero ou negativos.");
      return;
    }

    const userRef = ref(database, `users/${auth.currentUser.uid}/data`);
    const adjustedWeight = adjustWeightForExercise(
      selectedExercise?.label || "",
      Number(weight)
    );
    const totalWeight = calculateTotalWeight(reps, adjustedWeight, fails);

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

      // Adiciona o novo registro ao histórico temporariamente
      const newHistory = [
        ...(existingData[exerciseIndex].history || []),
        {
          date: dayjs().format("DD/MM/YYYY - HH:mm"),
          reps,
          weight: adjustedWeight,
          totalWeightLifted: totalWeight,
          failsOrNegative: fails,
        },
      ];

      // Ordena o histórico temporário para verificar o TOP 20
      const topRecords = newHistory
        .sort((a: ExerciseHistory, b: ExerciseHistory) => {
          if (b.totalWeightLifted !== a.totalWeightLifted) {
            return b.totalWeightLifted - a.totalWeightLifted;
          }
          const dateA = dayjs(a.date, "DD/MM/YYYY - HH:mm");
          const dateB = dayjs(b.date, "DD/MM/YYYY - HH:mm");
          return dateB.diff(dateA);
        })
        .slice(0, 36);

      // Verifica se o novo registro está no TOP 3
      const isInTop36 = topRecords.some(
        (record) =>
          record.date === dayjs().format("DD/MM/YYYY - HH:mm") &&
          record.totalWeightLifted === totalWeight
      );

      if (!isInTop36) {
        alert(
          "Obrigado por tentar, mas como não bateu nenhum dos da lista, seus dados não serão gravados na base."
        );
        return;
      }

      // Atualiza o histórico no Firebase mantendo apenas o TOP 3
      existingData[exerciseIndex].history = topRecords;
      await set(userRef, existingData);
      setIsModalOpen(true); // Abre o modal após salvar com sucesso

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
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return userCredential.user && setIsLogged(true);
    } catch (error) {
      console.error("Error saving login data", error);
      alert("E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
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

  const handleIncrement = (
    field: "weight" | "reps" | "fails",
    increment: number
  ) => {
    if (field === "weight") {
      setWeight((prev) => Math.max(0, prev + increment));
    } else if (field === "reps") {
      setReps((prev) => Math.max(0, prev + increment));
    } else if (field === "fails") {
      setFails((prev) => Math.max(0, prev + increment));
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
        setIsLoading(false);
      } else {
        setIsLogged(false);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isLogged && selectedExercise && startDate && endDate) {
      fetchRecords();
    }
  }, [isLogged, selectedExercise, startDate, endDate, fetchRecords]);

  const handleTimeSessionInSecondsChange = (e: React.ChangeEvent) => {
    const value = Number((e.target as HTMLInputElement).value);

    if (isNaN(value) || value < 0) return;

    setTimeSessionInSeconds(value);
    setInitialSessionTime(value);
    setIsTimerFinished(false);
  };

  const handleStartTimer = () => {
    console.log("Timer started");
    setTimerIsRunning(true);
    setIsTimerFinished(false);
    setShouldDelay(false);

    // clear any previous interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    const id = window.setInterval(() => {
      setTimeSessionInSeconds((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(id); // clear interval when time is up
          setShouldDelay(true); // ativa o delay

          // após 1 segundo, finaliza o timer
          setTimeout(() => {
            setIsTimerFinished(true);
            setShouldDelay(false);
          }, 1000);

          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const handlePauseTimer = () => {
    setTimerIsRunning(false);

    if (intervalId) {
      clearInterval(intervalId);
    }
  };

  const handleResetSessions = () => {
    setTimerIsRunning(false);
    setActualSession(1);
  };

  const transformSecondsToTime = useCallback(() => {
    const hours = Math.floor(timeSessionInSeconds / 3600);
    const minutes = Math.floor((timeSessionInSeconds % 3600) / 60);
    const seconds = timeSessionInSeconds % 60;

    setTimeSessionDisplayed(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );
  }, [timeSessionInSeconds]);

  useEffect(() => {
    transformSecondsToTime();
  }, [transformSecondsToTime]);

  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  useEffect(() => {
    if (timeSessionInSeconds === 0 && isTimerFinished) {
      setTimerIsRunning(false);
      setTimeSessionInSeconds(initialSessionTime);
      setActualSession((prev) => prev + 1);
      setIsTimerFinished(false);
    }
  }, [timeSessionInSeconds, initialSessionTime, isTimerFinished]);

  const calculateProgress = () => {
    if (initialSessionTime === 0) return 0;

    // Se shouldDelay for true, mantém 100%
    if (shouldDelay) return 100;

    const progress =
      ((initialSessionTime - timeSessionInSeconds) / initialSessionTime) * 100;

    return Math.min(100, Math.max(0, progress));
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

  return (
    <div>
      {isLogged ? (
        <>
          <div className="generic-container">
            <Button variant="outlined" onClick={logout} sx={{ width: "100%" }}>
              DESLOGAR
            </Button>
          </div>
          <Card sx={{ padding: "10px", marginBottom: 2, marginTop: 2 }}>
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/BpIjT-LhNwg?si=8vx2lCdB12IgUrJ3"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </Card>
          {/* Card do timer */}
          <Card
            sx={{
              p: 1,
              marginBottom: 2,
              marginTop: 2,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Barra de progresso */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: `${calculateProgress()}%`,
                backgroundColor: "#4D4D4D",
                transition: "height 0.7s ease",
                zIndex: 0,
              }}
            />

            {/* Conteúdo do card - wrapping em div para ficar acima da barra de progresso */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="generic-container">
                <TextField
                  disabled={timerIsRunning}
                  id="outlined-number"
                  label="Tempo de cada sessão (segundos)"
                  type="text"
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  value={timeSessionInSeconds}
                  onChange={handleTimeSessionInSecondsChange}
                  sx={{ width: "100%" }}
                />
              </div>
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Chip
                  label={`Sessão # ${actualSession}`}
                  color="success"
                  size="small"
                />
              </Grid2>
              <Grid2
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Typography variant="h3" sx={{ color: "text.secondary" }}>
                  {timeSessionDisplayed ? timeSessionDisplayed : "00:00:00"}
                </Typography>
              </Grid2>
              <Grid2
                sx={{
                  mt: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {!timerIsRunning && (
                  <Button variant="contained" onClick={handleStartTimer}>
                    Começar
                  </Button>
                )}

                {timerIsRunning && (
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handlePauseTimer}
                  >
                    Pausar
                  </Button>
                )}
              </Grid2>
              <Grid2
                sx={{
                  mt: 2,
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleResetSessions}
                >
                  Resetar sessões
                </Button>
              </Grid2>
            </div>
          </Card>
          <Grid2 sx={{ mt: 16 }}>
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
            <Card sx={{ mt: 2, p: 1 }}>
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
                <Grid2
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("weight", 1)}
                  >
                    + 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("weight", -1)}
                    color="error"
                  >
                    - 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("weight", 5)}
                  >
                    + 5
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("weight", -5)}
                    color="error"
                  >
                    - 5
                  </Button>
                </Grid2>
              </div>
            </Card>
            <Card sx={{ mt: 2, p: 1 }}>
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
                <Grid2
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("reps", 1)}
                  >
                    + 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("reps", -1)}
                    color="error"
                  >
                    - 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("reps", 5)}
                  >
                    + 5
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("reps", -5)}
                    color="error"
                  >
                    - 5
                  </Button>
                </Grid2>
              </div>
            </Card>
            <Card sx={{ mt: 2, p: 1 }}>
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
                <Grid2
                  sx={{
                    mt: 2,
                    mb: 2,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("fails", 1)}
                  >
                    + 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("fails", -1)}
                    color="error"
                  >
                    - 1
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("fails", 5)}
                  >
                    + 5
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleIncrement("fails", -5)}
                    color="error"
                  >
                    - 5
                  </Button>
                </Grid2>
              </div>
            </Card>
            <Button
              variant="contained"
              onClick={saveExerciseData}
              sx={{ width: "100%", marginY: 2 }}
            >
              Enviar
            </Button>
          </Grid2>
          <Grid2 sx={{ mt: 16 }}>
            <Divider sx={marginBottomAndTop4}>RECORDES</Divider>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Para ver os 36 maiores recordes, selecione o período.
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
          </Grid2>

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

                  // Calcula a melhora em relação ao próximo registro, se existir
                  const nextRecord = records[index + 1];
                  const improvementPercentage = nextRecord
                    ? ((record.totalWeightLifted -
                        nextRecord.totalWeightLifted) /
                        nextRecord.totalWeightLifted) *
                      100
                    : null;

                  const baseWeight =
                    selectedExercise.label === "Flexão"
                      ? formatWeight(record.weight / 0.64)
                      : selectedExercise.label === "Flexão declinada (30°)"
                      ? formatWeight(record.weight / 0.75)
                      : null;

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
                            Peso usado: {formatWeight(record.weight)} KG
                            {baseWeight && (
                              <> (peso base real: {baseWeight} KG)</>
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                          >
                            Negativas ou falhas: {record.failsOrNegative}
                          </Typography>
                          {nextRecord && (
                            <Typography
                              variant="body2"
                              sx={{ color: "text.secondary" }}
                            >
                              Melhora de:{" "}
                              <strong style={{ color: "green" }}>
                                {improvementPercentage?.toFixed(2)}%
                              </strong>{" "}
                              se comparado ao #{index + 2}
                            </Typography>
                          )}
                          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: "text.secondary" }}
                          >
                            Peso total:{" "}
                            <Chip
                              color="secondary"
                              label={`${formatWeight(
                                record.totalWeightLifted
                              )}KG`}
                              size="small"
                            />
                            <Chip
                              label={`# ${index + 1}`}
                              size="small"
                              sx={{ marginLeft: 1 }}
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
            <h4>Por favor, faça login para ver os dados.</h4>
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
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="success-modal-title" variant="h6" component="h2">
            Sucesso
          </Typography>
          <Typography id="success-modal-description" sx={{ mt: 2 }}>
            Exercício salvo com sucesso!
          </Typography>
          <Button onClick={() => setIsModalOpen(false)} sx={{ mt: 2 }}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Exercises;
