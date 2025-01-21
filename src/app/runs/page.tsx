"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface Step {
  id: number;
  title: string;
  description: string;
  muscles: string;
  time: number; // Tempo em segundos
}

// Mocked data
const mockedExercises = [
  {
    id: 1,
    title: "Burpees",
    description: "Exercício completo que combina força e cardio.",
    muscles: "Corpo inteiro",
  },
  {
    id: 2,
    title: "Polichinelos",
    description: "Exercício aeróbico que melhora a resistência cardiovascular.",
    muscles: "Corpo inteiro",
  },
  {
    id: 3,
    title: "Flexões",
    description: "Exercício de força focado na parte superior do corpo.",
    muscles: "Peito, ombros, tríceps, core",
  },
  {
    id: 4,
    title: "Agachamentos",
    description:
      "Exercício para fortalecer e tonificar a parte inferior do corpo.",
    muscles: "Pernas, glúteos",
  },
  {
    id: 5,
    title: "Escaladores",
    description: "Exercício cardio com forte ativação do core.",
    muscles: "Core, pernas, ombros",
  },
  {
    id: 6,
    title: "Prancha",
    description: "Exercício de estabilização do core.",
    muscles: "Core, ombros",
  },
  {
    id: 7,
    title: "Corrida estacionária com joelhos altos",
    description:
      "Exercício aeróbico que melhora a resistência das pernas e a coordenação.",
    muscles: "Pernas, core",
  },
  {
    id: 8,
    title: "Afundos",
    description:
      "Exercício para a parte inferior do corpo que também trabalha equilíbrio.",
    muscles: "Pernas, glúteos, core",
  },
  {
    id: 9,
    title: "Subidas no degrau",
    description:
      "Exercício que combina cardio e força usando uma superfície elevada.",
    muscles: "Pernas, glúteos",
  },
];

// Salas de descanso
const restRooms = [3, 7, 10];

// Mapeamento das regras por sala
const roomExerciseRules: Record<number, { min: number; max: number }> = {
  1: { min: 1, max: 2 },
  2: { min: 1, max: 3 },
  4: { min: 4, max: 6 },
  5: { min: 4, max: 6 },
  10: { min: 3, max: 10 },
  11: { min: 5, max: 10 },
  12: { min: 7, max: 10 },
  13: { min: 8, max: 11 },
  14: { min: 14, max: 20 },
};

// Função para gerar exercícios aleatórios
const generateRandomExercises = (room: number) => {
  if (restRooms.includes(room)) {
    return []; // Salas de descanso não geram exercícios
  }

  const rule = roomExerciseRules[room];
  if (!rule) {
    throw new Error(`Sala ${room} não tem regras definidas.`);
  }

  const numExercises =
    Math.floor(Math.random() * (rule.max - rule.min + 1)) + rule.min;
  const selectedExercises = [];
  const usedIds = new Set();

  while (selectedExercises.length < numExercises) {
    const randomIndex = Math.floor(Math.random() * mockedExercises.length);
    const exercise = mockedExercises[randomIndex];

    if (!usedIds.has(exercise.id)) {
      selectedExercises.push({
        ...exercise,
        time: Math.floor(Math.random() * 5) + 1, // Tempo entre 1 e 5 segundos para testes
      });
      usedIds.add(exercise.id);
    }
  }

  return selectedExercises;
};

function Runs() {
  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const room = 1; // Número da sala atual (exemplo)

  useEffect(() => {
    const generatedSteps = generateRandomExercises(room);
    setSteps(generatedSteps);
  }, [room]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(interval);
      setShowResult(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleStart = () => {
    setTimer(steps[activeStep]?.time || 0);
    setShowResult(false);
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
    setTimer(null);
    setShowResult(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTimer(null);
    setShowResult(false);
  };

  return (
    <div>
      <div className="generic-container">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Sala {room}
        </Typography>
      </div>
      <div className="generic-container">
        <Typography component="legend">Gotas: {0}</Typography>
      </div>
      <div className="generic-container">
        <Typography component="legend">Vidas restantes: {1}</Typography>
      </div>
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.id}>
                <StepLabel>{step.title}</StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Tempo: {step.time} segundos
                  </Typography>
                  {timer === null && !showResult && (
                    <Button
                      variant="contained"
                      onClick={handleStart}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === 0 ? "Iniciar" : "Continuar"}
                    </Button>
                  )}
                  {timer !== null && (
                    <Typography>Tempo restante: {timer} segundos</Typography>
                  )}
                  {showResult && (
                    <>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continuar
                      </Button>
                      <Button variant="outlined" color="error" sx={{ mt: 1 }}>
                        Falha
                      </Button>
                    </>
                  )}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                Todos os passos concluídos - você terminou!
              </Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Resetar
              </Button>
            </Paper>
          )}
        </Box>
      </div>
    </div>
  );
}

export default Runs;
