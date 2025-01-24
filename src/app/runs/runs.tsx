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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import TimerIcon from "@mui/icons-material/Timer";
import { Exercise, Upgrade } from "../types/run-types";
import GiveRunDialog from "@/components/give-run-dialog";
import LinearProgressWithLabel from "@/components/linear-progress-with-label";
import HeaderItensRuns from "@/components/header-itens-runs";
import { generatePageExercises } from "./scripts/exerciseGenerator";
import CircularProgressWithLabel from "@/components/circular-progress-with-label";

const upgrades = [
  {
    id: 1,
    name: "Bonus Chance 1",
    description: "+ 8% de chance de sair com um bônus",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 1200,
    aditionalPercentage: 0.08,
  },
  {
    id: 2,
    name: "Timer Extra 1",
    description: "+ 3 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 330,
    aditionalSeconds: 3,
  },
  {
    id: 3,
    name: "Timer Extra 2",
    description: "+ 4 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 775,
    aditionalSeconds: 4,
  },
  {
    id: 4,
    name: "Timer Extra 3",
    description: "+ 5 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 5200,
    aditionalSeconds: 5,
  },
  {
    id: 5,
    name: "Bonus Chance 2",
    description: "+ 12% de chance de sair com um bônus",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 2000,
    aditionalPercentage: 0.12,
  },
  {
    id: 6,
    name: "Bonus Chance 3",
    description: "+ 16% de chance de sair com um bônus",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 5000,
    aditionalPercentage: 0.16,
  },
  {
    id: 7,
    name: "Timer Extra 4",
    description: "+ 6 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 8000,
    aditionalSeconds: 6,
  },
  {
    id: 8,
    name: "Bonus Chance 4",
    description: "+ 17% de chance de sair com um bônus",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 9000,
    aditionalPercentage: 0.17,
  },
  {
    id: 9,
    name: "Timer Extra 5",
    description: "+ 9 segundos de duração do timer",
    dropsUsedToUpgrade: 0,
    completed: false,
    dropsNeededToUpgrade: 9000,
    aditionalSeconds: 6,
  },
];

function Runs() {
  const [room, setRoom] = useState(1);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isExerciseStarted, setIsExerciseStarted] = useState(false);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState<number | null>(null);
  const [calculatedExercises, setCalculatedExercises] = useState<Exercise[]>(
    []
  );
  const [extraStepActive, setExtraStepActive] = useState(false);
  const [extraChoice, setExtraChoice] = useState<"TIMER" | "VIDA" | null>(null);
  const [timers, setTimers] = useState(0);
  const [timeValueInSeconds, setTimeValueInSeconds] = useState(10);
  const [lives, setLives] = useState(1);
  const [drops, setDrops] = useState(0); // Estado inicial com 500 gotas
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [isTimerAnimating, setIsTimerAnimating] = useState(false);
  const [isDropAnimating, setIsDroptAnimating] = useState(false);
  const [isBonusActive, setIsBonusActive] = useState(false);

  // ------------------------------ all useEffects ------------------------------
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (
      isExerciseStarted &&
      exerciseTimeLeft !== null &&
      exerciseTimeLeft > 0
    ) {
      timer = setInterval(() => {
        setExerciseTimeLeft((prev) =>
          prev !== null && prev > 0 ? prev - 1 : prev
        );
      }, 1000);
    }

    if (exerciseTimeLeft === 0) {
      clearInterval(timer!);
    }

    return () => clearInterval(timer!);
  }, [isExerciseStarted, exerciseTimeLeft]);

  // Update calculated exercises when room changes
  useEffect(() => {
    generatePageExercises(room, setCalculatedExercises);
  }, [room]);

  useEffect(() => {
    if (room === 3) {
      const upgradesKey = "upgradesData";
      if (!localStorage.getItem(upgradesKey)) {
        localStorage.setItem(upgradesKey, JSON.stringify(upgrades));
      }
    }
  }, [room]);

  useEffect(() => {
    // Função para calcular o valor final de timeValueInSeconds
    const bonusTimerChecker = () => {
      const upgradesKey = "upgradesData";
      const currentUpgrades = JSON.parse(
        localStorage.getItem(upgradesKey) || "[]"
      );

      // Filtrar upgrades completos que adicionam tempo
      const completedUpgrades = currentUpgrades.filter(
        (upgrade: Upgrade) => upgrade.completed && upgrade.aditionalSeconds
      );

      // Calcular os segundos extras de todos os upgrades
      const extraSeconds = completedUpgrades.reduce(
        (total: number, upgrade: Upgrade) =>
          total + (upgrade.aditionalSeconds || 0),
        0
      );

      // Atualizar o estado de timeValueInSeconds
      setTimeValueInSeconds(10 + extraSeconds); // Começa com o valor inicial de 4 segundos
    };

    bonusTimerChecker();
  }, []);

  // ------------------------------ functions to handle the page main logic ------------------------------
  const handleSuccess = () => {
    const upgradesKey = "upgradesData";
    const currentUpgrades = JSON.parse(
      localStorage.getItem(upgradesKey) || "[]"
    );

    // Obtém a chance adicional de todos os upgrades completados que aumentam a chance de bônus
    const bonusUpgrades = currentUpgrades.filter(
      (upgrade: Upgrade) => upgrade.completed && upgrade.aditionalPercentage
    );

    // Soma as porcentagens adicionais de todos os upgrades completados
    const additionalBonusChance = bonusUpgrades.reduce(
      (total: number, upgrade: Upgrade) =>
        total + (upgrade.aditionalPercentage || 0),
      0
    );

    // Define a chance padrão
    let defaultChance = 0.19;

    // Adiciona a chance extra acumulada
    defaultChance += additionalBonusChance;

    console.log(`Chance de ativar extra step: ${defaultChance * 100}%`);

    if (!extraStepActive) {
      // 30% chance de ativar um extra step
      if (Math.random() < defaultChance) {
        setExtraStepActive(true);
        setIsBonusActive(true);
        return;
      }
    }

    const minDropChance = 0.42;
    const maxDropChance = 0.67;
    const dropChance =
      Math.random() * (maxDropChance - minDropChance) + minDropChance;

    console.log(`Chance de ganhar gotas: ${dropChance * 100}%`);

    // 50% chance de ganhar entre 10 e 20 gotas
    if (Math.random() < dropChance) {
      const earnedDrops = Math.floor(Math.random() * 10) + 11; // Valor aleatório entre 10 e 20
      setDrops((prevDrops) => prevDrops + earnedDrops); // Incrementa as gotas

      setIsDroptAnimating(true);
      setTimeout(() => setIsDroptAnimating(false), 300);

      console.log(`Você ganhou ${earnedDrops} gotas!`);
    }

    // Se não houver passo extra ou ele já foi resolvido, avança para o próximo passo
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setIsExerciseStarted(false);
    setExtraStepActive(false); // Reseta o estado do passo extra
    setExtraChoice(null); // Reseta a escolha do passo extra
  };

  const handleFail = useCallback(() => {
    console.log("chamou");
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setLives((prevLives) => {
      const newLives = prevLives - 1;

      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 300);

      if (newLives < 0) {
        // Reinicia o jogo
        setRoom(1);
        setLives(1);
        setDrops(0);
        setTimers(0);
        setActiveStep(0);
        setIsExerciseStarted(false);
        setExtraStepActive(false);
        setExtraChoice(null);
        setExerciseTimeLeft(null);

        generatePageExercises(1, setCalculatedExercises);

        // Mostra feedback de reinício
        setSnackbarOpen(true);
        setGameOverMessage("Você perdeu todas as vidas e voltou ao início!");
      }

      return newLives;
    });
  }, []);

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
      setIsTimerAnimating(true);
      setTimeout(() => setIsTimerAnimating(false), 300);
    } else {
      console.log("Sem timers disponíveis!");
      window.alert("Sem timers disponíveis! ");
    }
  };

  const handleExtraChoice = (choice: "TIMER" | "VIDA") => {
    setExtraChoice(choice);
    console.log("Escolha extra:", extraChoice);
    if (choice === "TIMER") {
      setTimers((prevTimers) => prevTimers + 1);
      setIsTimerAnimating(true);
      setIsBonusActive(false);
      setTimeout(() => setIsTimerAnimating(false), 300);
    } else if (choice === "VIDA") {
      setLives((prevLives) => prevLives + 1);
      setIsHeartAnimating(true);
      setIsBonusActive(false);
      setTimeout(() => setIsHeartAnimating(false), 300);
    }

    // Avança para o próximo passo após a escolha
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setExtraStepActive(false);
    setIsExerciseStarted(false);
  };

  const handleStartExercise = (exerciseDuration: number) => {
    setExerciseTimeLeft(exerciseDuration);
    setIsExerciseStarted(true);
  };

  const handleNextRoom = () => {
    setRoom((prevRoom) => prevRoom + 1);
    setIsExerciseStarted(false);
    setExerciseTimeLeft(null);
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
    setDrops(0);
    setTimers(3);
    setActiveStep(0);
    setIsExerciseStarted(false);
    setExtraStepActive(false);
    setExtraChoice(null);
    setExerciseTimeLeft(null);
    setOpen(false);

    generatePageExercises(1, setCalculatedExercises);

    // Mostra feedback
    setSnackbarOpen(true);
    setGameOverMessage("Você desistiu e voltou ao início!");
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
  };

  const allExercisesCompleted = activeStep >= calculatedExercises.length;

  return (
    <div>
      {/* Room */}
      <div className="generic-container" style={{ textAlign: "center" }}>
        <Typography variant="h5">Sala {room}</Typography>
      </div>
      {/* Top itens */}
      <HeaderItensRuns
        lives={lives}
        isHeartAnimating={isHeartAnimating}
        isDropAnimating={isDropAnimating}
        drops={drops}
        timeValueInSeconds={timeValueInSeconds}
        timers={timers}
        isTimerAnimating={isTimerAnimating}
      />
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
              + (1) <TimerIcon sx={{ ml: 1 }} />
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleExtraChoice("VIDA")}
            >
              + (1) <FavoriteIcon sx={{ ml: 1 }} />
            </Button>
          </Box>
        </div>
      )}
      <div
        className="generic-container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {exerciseTimeLeft === 0 && isExerciseStarted && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Alert severity="warning" sx={{mb: 4}} variant="outlined" >Escolha o resultado ou perca vida</Alert>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <CircularProgressWithLabel
                countdownSeconds={5} // Configura o tempo total
                onComplete={handleFail} // Chama handleFail ao completar
                isExerciseStarted={isExerciseStarted}
                size={80}
              />
            </div>
          </div>
        )}
      </div>
      {/* Main content */}
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {calculatedExercises.map((exercise, index) => (
              <Step key={exercise.id}>
                <StepLabel>{exercise.name}</StepLabel>
                <StepContent>
                  <Card sx={{ maxWidth: 345, border: "1px solid #5A5A5A" }}>
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
                        sx={{ color: "text.secondary", mb: 2 }}
                      >
                        {isExerciseStarted && activeStep === index
                          ? `Tempo restante: ${exerciseTimeLeft} (s)`
                          : `Tempo restante: ${exercise.duration} (s)`}
                      </Typography>
                      <LinearProgressWithLabel
                        value={
                          isExerciseStarted &&
                          activeStep === index &&
                          exerciseTimeLeft !== null
                            ? (exerciseTimeLeft / exercise.duration) * 100
                            : 100
                        }
                      />
                      {!isExerciseStarted && (
                        <Button
                          variant="outlined"
                          sx={{ marginTop: 2 }}
                          onClick={handleAddTimerToExercise}
                        >
                          Usar <TimerIcon sx={{ ml: 1 }} />
                        </Button>
                      )}
                    </CardContent>
                    <CardActions>
                      {isExerciseStarted && activeStep === index ? (
                        <>
                          <Button
                            size="small"
                            onClick={handleSuccess}
                            disabled={exerciseTimeLeft !== 0 || isBonusActive}
                          >
                            Sucesso
                          </Button>
                          <Button
                            size="small"
                            disabled={exerciseTimeLeft !== 0 || isBonusActive}
                            onClick={handleFail}
                            color="error"
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
          {room === 3 ||
            room === 6 ||
            room === 10 ||
            (room === 13 && (
              <>
                <div className="generic-container">Sala de descanso</div>
                <div className="generic-container">
                  {upgrades.map((upgrade) => {
                    const upgradesData = JSON.parse(
                      localStorage.getItem("upgradesData") || "[]"
                    );
                    const storedUpgrade = upgradesData.find(
                      (u: Upgrade) => u.id === upgrade.id
                    );

                    return (
                      <Card
                        sx={{
                          maxWidth: 400,
                          padding: 2,
                          mb: 2,
                          border: "1px solid #cecece",
                        }}
                        key={upgrade.id}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            mb: 2,
                          }}
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
                          color="success"
                        >
                          Comprar
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </>
            ))}
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
      {/* Give Up  Dialog */}
      <GiveRunDialog
        open={open}
        giveUp={giveUp}
        handleDoNotGiveUp={handleDoNotGiveUp}
      />
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
          {gameOverMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Runs;
