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

// types
interface Exercise {
  id: number;
  name: string;
  description: string;
  duration: number;
  repetitions: number;
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
  const [lives, setLives] = useState(3);
  const [drops, setDrops] = useState(3); // Estado inicial com 3 gotas

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

  // ------------------------------ functions to handle the page main logic ------------------------------
  const handleSucess = () => {
    if (!extraStepActive) {
      // 60% chance de ativar um extra step
      if (Math.random() < 0.3) {
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

  const handleFail = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setLives((prevLives) => prevLives - 1);
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

  const allExercisesCompleted = activeStep >= calculatedExercises.length;

  return (
    <div>
      <div className="generic-container">
        <Typography variant="h6">Sala {room}</Typography>
      </div>
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
            <div className="generic-container">Sala de descanso</div>
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
    </div>
  );
}

export default Runs;
