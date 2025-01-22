"use client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

// types
interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number;
  repetitions: number;
}

interface Upgrade {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  dropsNeededToUpgrade: number;
  aditionalPercentage?: number;
  aditionalSeconds?: number;
  dropsUsedToUpgrade: number;
}

// mockedExerciseData
const baseExercises: Exercise[] = [
  {
    id: 1,
    name: "Tarefa 1",
    description: "Descrição tarefa 1",
    duration: 2,
    repetitions: 1,
  },
  {
    id: 2,
    name: "Tarefa 2",
    description: "Descrição tarefa 2",
    duration: 4,
    repetitions: 1,
  },
  {
    id: 3,
    name: "Tarefa 3",
    description: "Descrição tarefa 3",
    duration: 6,
    repetitions: 1,
  },
  {
    id: 4,
    name: "Tarefa 4",
    description: "Descrição tarefa 4",
    duration: 6,
    repetitions: 1,
  },
];

const upgrades = [
  {
    id: 1,
    name: "Bonus Chance 1",
    description: "Adiciona aumenta em 50% a chance de sair com um bônus",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 10,
    aditionalPercentage: 0.5,
  },
  {
    id: 2,
    name: "Timer Extra 1",
    description: "+ 3 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 10,
    aditionalSeconds: 3,
  },
];

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{ height: 22, borderRadius: 1 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function Runs() {
  const [room, setRoom] = useState(1);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [calculatedExercises, setCalculatedExercises] = useState<Exercise[]>(
    []
  );
  const [extraStepActive, setExtraStepActive] = useState(false);
  const [extraChoice, setExtraChoice] = useState<"TIMER" | "VIDA" | null>(null);
  const [timers, setTimers] = useState(3);
  const [timeValueInSeconds] = useState(4);
  const [lives, setLives] = useState(3);
  const [drops, setDrops] = useState(11); // Estado inicial com 3 gotas
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // generation functions
  const calculateDifficulty = (room: number) => {
    const durationDifficultyMultiplier = room * 2;
    const repetitionsDifficultyMultiplier = room * 2;

    return baseExercises.map((exercise) => ({
      ...exercise,
      duration: exercise.duration + durationDifficultyMultiplier,
      repetitions: exercise.repetitions + repetitionsDifficultyMultiplier,
    }));
  };

  const generatePageExercises = useCallback((room: number) => {
    console.log("Gerando exercícios para a sala:", room);
    const exercises = calculateDifficulty(room);

    if (room === 1) {
      // do something
      // Sorteio de 1 ou 2 exercícios aleatórios
      const selectedCount = Math.random() < 0.5 ? 1 : 2; // 50% chance para 1 ou 2 exercícios
      const shuffledExercises = [...exercises].sort(() => Math.random() - 0.5); // Embaralha os exercícios
      const selectedExercises = shuffledExercises.slice(0, selectedCount); // Seleciona a quantidade desejada

      console.log("Rom 1 - selectedExercises", selectedExercises);

      setCalculatedExercises(selectedExercises);
    }

    if (room === 2) {
      // do something
      const selectedCount = Math.random() < 0.5 ? 3 : 4; // 50% chance para 3 ou 4 exercícios
      const shuffledExercises = [...exercises].sort(() => Math.random() - 0.5); // Embaralha os exercícios
      const selectedExercises = shuffledExercises.slice(0, selectedCount); // Seleciona a quantidade desejada
      setCalculatedExercises(selectedExercises);

      console.log("Rom 2 - selectedExercises", selectedExercises);
    }

    if (room === 3) {
      setCalculatedExercises([]);
    }
  }, []);

  // ------------------------------ all useEffects ------------------------------
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isExerciseStarted && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }, 1000);
    }

    if (timeLeft === 0) {
      clearInterval(timer!);
    }

    return () => clearInterval(timer!);
  }, [isExerciseStarted, timeLeft]);

  // Update calculated exercises when room changes
  useEffect(() => {
    generatePageExercises(room);
  }, [room, generatePageExercises]);

  useEffect(() => {
    if (room === 3) {
      const upgradesKey = "upgradesData";
      if (!localStorage.getItem(upgradesKey)) {
        localStorage.setItem(upgradesKey, JSON.stringify(upgrades));
      }
    }
  }, [room]);

  // ------------------------------ functions to handle the page main logic ------------------------------
  const handleSucess = () => {
    const upgradesKey = "upgradesData";
    const currentUpgrades = JSON.parse(
      localStorage.getItem(upgradesKey) || "[]"
    );

    // Obtém a chance adicional a partir dos upgrades completados
    const bonusUpgrade = currentUpgrades.find(
      (upgrade: Upgrade) =>
        upgrade.name === "Bonus Chance 1" && upgrade.completed
    );

    let defaultChance = 0.3;

    if (bonusUpgrade?.aditionalPercentage) {
      defaultChance += bonusUpgrade.aditionalPercentage;
    }

    console.log(`Chance de ativar extra step: ${defaultChance * 100}%`);

    if (!extraStepActive) {
      // 30% chance de ativar um extra step
      if (Math.random() < defaultChance) {
        setExtraStepActive(true);
        return;
      }
    }

    // 50% chance de ganhar entre 10 e 20 gotas
    if (Math.random() < 0.5) {
      const earnedDrops = Math.floor(Math.random() * 11) + 10; // Valor aleatório entre 10 e 20
      setDrops((prevDrops) => prevDrops + earnedDrops); // Incrementa as gotas
      console.log(`Você ganhou ${earnedDrops} gotas!`);
    }

    // Se não houver passo extra ou ele já foi resolvido, avança para o próximo passo
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setIsExerciseStarted(false);
    setExtraStepActive(false); // Reseta o estado do passo extra
    setExtraChoice(null); // Reseta a escolha do passo extra
  };

  // const getUpradesData = () => {
  //   const data = JSON.parse(localStorage.getItem("upgradesData")!);
  //   console.log(data);
  // };

  const handleFail = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setLives((prevLives) => prevLives - 1);
  };

  const handleAddTimerToExercise = () => {
    if (timers > 0) {
      // Atualiza o tempo do exercício no estado calculatedExercises
      setCalculatedExercises((prevExercises) =>
        prevExercises.map((exercise, index) =>
          index === activeStep
            ? { ...exercise, duration: exercise.duration + timeValueInSeconds }
            : exercise
        )
      );
      setTimers((prevTimers) => prevTimers - 1); // Reduz o número de timers disponíveis
    } else {
      console.log("Sem timers disponíveis!");
    }
  };

  const handleExtraChoice = (choice: "TIMER" | "VIDA") => {
    setExtraChoice(choice);
    console.log("Escolha extra:", extraChoice);
    if (choice === "TIMER") {
      setTimers((prevTimers) => prevTimers + 1);
    } else if (choice === "VIDA") {
      setLives((prevLives) => prevLives + 1);
    }

    // Avança para o próximo passo após a escolha
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setExtraStepActive(false);
    setIsExerciseStarted(false);
  };

  const handleStartExercise = (exerciseDuration: number) => {
    setTimeLeft(exerciseDuration);
    setIsExerciseStarted(true);
  };

  const handleNextRoom = () => {
    setRoom((prevRoom) => prevRoom + 1);
    setIsExerciseStarted(false);
    setTimeLeft(null);
    setActiveStep(0);
  };

  // modal functions
  const handleGiveUp = () => {
    setOpen(true);
  };

  const handleDoNotGiveUp = () => {
    setOpen(false);
  };

  // Após o reset
  const giveUp = () => {
    setRoom(1);
    setLives(3);
    setDrops(3);
    setTimers(3);
    setActiveStep(0);
    setIsExerciseStarted(false);
    setExtraStepActive(false);
    setExtraChoice(null);
    setTimeLeft(null);
    setOpen(false);

    generatePageExercises(1);

    // Mostra feedback
    setSnackbarOpen(true);
  };

  const handleUpgrade = (upgradeId: number) => {
    const upgradesKey = "upgradesData";
    const currentUpgrades = JSON.parse(
      localStorage.getItem(upgradesKey) || "[]"
    );

    const updatedUpgrades = currentUpgrades.map((upgrade: Upgrade) => {
      if (upgrade.id === upgradeId && !upgrade.completed) {
        const remainingDropsNeeded =
          upgrade.dropsNeededToUpgrade - upgrade.dropsUsedToUpgrade;

        // Verifica se o jogador tem gotas suficientes para completar o upgrade
        if (drops >= remainingDropsNeeded) {
          setDrops((prevDrops) => prevDrops - remainingDropsNeeded); // Usa apenas o necessário
          return {
            ...upgrade,
            dropsUsedToUpgrade: upgrade.dropsNeededToUpgrade, // Completa o upgrade
            completed: true,
          };
        } else {
          // Caso não tenha gotas suficientes, gasta o que for possível
          const newDropsUsedToUpgrade = upgrade.dropsUsedToUpgrade + drops;
          setDrops(0); // Usa todas as gotas disponíveis
          return {
            ...upgrade,
            dropsUsedToUpgrade: newDropsUsedToUpgrade,
          };
        }
      }
      return upgrade;
    });

    // Atualiza o LocalStorage com os upgrades modificados
    localStorage.setItem(upgradesKey, JSON.stringify(updatedUpgrades));
    console.log("Upgrades atualizados:", updatedUpgrades);
  };

  const allExercisesCompleted = activeStep >= calculatedExercises.length;

  return (
    <div>
      {/* Room */}
      <div className="generic-container">
        <Typography variant="h6">Sala {room}</Typography>
      </div>
      {/* Top itens */}
      <div className="generic-container">
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Vidas: {lives}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Gotas: {drops}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Timers: {timers}
        </Typography>
      </div>
      {/* Main content */}
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {calculatedExercises.map((exercise, index) => (
              <Step key={exercise.id}>
                <StepLabel>{exercise.name}</StepLabel>
                <StepContent>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {exercise.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Repetições: {exercise.repetitions}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {isExerciseStarted && activeStep === index
                          ? `Tempo restante: ${timeLeft}s`
                          : `Tempo restante: ${exercise.duration}s`}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ marginTop: 2 }}
                        onClick={handleAddTimerToExercise}
                      >
                        Usar timer ({timers} disponíveis)
                      </Button>
                    </CardContent>
                    <CardActions>
                      {isExerciseStarted && activeStep === index ? (
                        <>
                          <Button
                            size="small"
                            onClick={handleSucess}
                            disabled={timeLeft !== 0}
                          >
                            Sucesso
                          </Button>
                          <Button
                            size="small"
                            disabled={timeLeft !== 0}
                            onClick={handleFail}
                          >
                            Falha
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="small"
                          onClick={() => handleStartExercise(exercise.duration)}
                        >
                          Iniciar
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {extraStepActive && (
            <div className="generic-container">
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                Escolha uma recompensa:
              </Typography>
              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleExtraChoice("TIMER")}
                >
                  Adicionar TIMER
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleExtraChoice("VIDA")}
                >
                  Adicionar VIDA
                </Button>
              </Box>
            </div>
          )}
          {calculatedExercises.length === 0 && (
            <>
              <div className="generic-container">Sala de descanso</div>
              <div className="generic-container" style={{}}>
                {upgrades.map((upgrade) => {
                  const upgradesData = JSON.parse(
                    localStorage.getItem("upgradesData") || "[]"
                  );
                  const storedUpgrade = upgradesData.find(
                    (u: Upgrade) => u.id === upgrade.id
                  );

                  console.log("storedUpgrade", storedUpgrade);

                  return (
                    <Card
                      sx={{ maxWidth: 400, padding: 2, mb: 2 }}
                      key={upgrade.id}
                    >
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", flexDirection: "column", mb: 2 }}
                      >
                        {storedUpgrade?.description || upgrade.description}:{" "}
                        {storedUpgrade?.dropsUsedToUpgrade}/
                        {storedUpgrade?.dropsNeededToUpgrade ||
                          upgrade.dropsNeededToUpgrade}
                      </Typography>
                      <div style={{ marginBottom: "16px" }}>
                        <LinearProgressWithLabel
                          value={
                            storedUpgrade
                              ? (storedUpgrade.dropsUsedToUpgrade /
                                  storedUpgrade.dropsNeededToUpgrade) *
                                100
                              : 0
                          }
                        />
                      </div>
                      <Button
                        variant="outlined"
                        onClick={() => handleUpgrade(upgrade.id)}
                      >
                        Comprar upgrade
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
          {allExercisesCompleted && (
            <div className="generic-container">
              <Box mt={2}>
                <Button variant="contained" onClick={handleNextRoom}>
                  Próxima sala
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </div>
      {/* botão de desistir e voltar desde o início */}
      <div className="generic-container">
        <Button variant="outlined" color="warning" onClick={handleGiveUp}>
          Desistir
        </Button>
      </div>
      {/* Dialog */}
      <div>
        <Dialog
          open={open}
          onClose={handleDoNotGiveUp}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Desistir da RUN?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Ao desistir da RUN, você perderá todo o progresso feito até agora.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={giveUp}>
              Sim
            </Button>
            <Button onClick={handleDoNotGiveUp} autoFocus>
              Não
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* Snack bar feedback when give up */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          Você desistiu e voltou ao início!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Runs;
