"use client";
import React, { useState, useEffect } from "react";
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
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";

type StepType = {
  label: string;
  title: string;
  difficulty: number;
  time: number; // Tempo total do progresso em segundos
  reps: number; // Quantidade de repetições
};

// Passos base
const steps: StepType[] = [
  { label: "Passo 1", title: "Task 1", difficulty: 1, time: 2, reps: 1 },
  { label: "Passo 2", title: "Task 2", difficulty: 1, time: 2, reps: 1 },
  { label: "Passo 3", title: "Task 3", difficulty: 2, time: 4, reps: 2 },
  { label: "Passo 4", title: "Task 4", difficulty: 2, time: 4, reps: 2 },
];

// Função para gerar passos com ajustes de reps e time
const generateSteps = (room: number): StepType[] => {
  let count = 0;

  // Definição da quantidade de passos com base na sala
  switch (room) {
    case 1:
      count = Math.floor(Math.random() * 2) + 1; // 1 a 2
      break;
    case 2:
      count = Math.floor(Math.random() * 3) + 1; // 1 a 3
      break;
    case 4:
    case 5:
      count = Math.floor(Math.random() * 3) + 4; // 4 a 6
      break;
    case 10:
      count = Math.floor(Math.random() * 8) + 3; // 3 a 10
      break;
    case 11:
      count = Math.floor(Math.random() * 6) + 5; // 5 a 10
      break;
    case 12:
      count = Math.floor(Math.random() * 4) + 7; // 7 a 10
      break;
    case 13:
      count = Math.floor(Math.random() * 4) + 8; // 8 a 11
      break;
    case 14:
      count = Math.floor(Math.random() * 7) + 14; // 14 a 20
      break;
    default:
      return [];
  }

  // Geração de passos com tempo e reps ajustados
  const generatedSteps: StepType[] = [];
  for (let i = 0; i < count; i++) {
    const randomStep = steps[Math.floor(Math.random() * steps.length)];

    // Multiplicação do tempo e das repetições
    generatedSteps.push({
      ...randomStep,
      time: randomStep.time * Math.pow(2, room - 1), // Tempo dobra a cada sala
      reps: randomStep.reps * Math.pow(3, room - 1), // Reps triplicam a cada sala
    });
  }

  return generatedSteps;
};

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; timeLeft: number }
) {
  const { timeLeft, ...circularProgressProps } = props;
  return (
    <Box sx={{ position: "relative", display: "inline-flex", width: 90, height: 90 }}>
      <CircularProgress
        variant="determinate"
        {...circularProgressProps}
        sx={{ width: "100% !important", height: "100% !important" }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ fontSize: "1rem", color: "text.secondary" }}
        >
          {timeLeft > 0 ? `${timeLeft}s` : "0s"}
        </Typography>
      </Box>
    </Box>
  );
}


function Runs() {
  const [currentRoom, setCurrentRoom] = useState<number>(1);
  const [generatedSteps, setGeneratedSteps] = useState<StepType[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState<boolean[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const steps = generateSteps(currentRoom);
    setGeneratedSteps(steps);
    setProgress(new Array(steps.length).fill(0));
    setTimeLeft(steps.map((step) => step.time));
    setIsRunning(new Array(steps.length).fill(false));
    setActiveStep(0);
  }, [currentRoom]);

  useEffect(() => {
    const timers = isRunning.map((running, index) => {
      if (running) {
        return setInterval(() => {
          setProgress((prev) => {
            const newProgress = [...prev];
            if (newProgress[index] < 100) {
              newProgress[index] = Math.min(
                newProgress[index] + 100 / generatedSteps[index].time,
                100
              );
            }
            return newProgress;
          });

          setTimeLeft((prev) => {
            const newTimeLeft = [...prev];
            if (newTimeLeft[index] > 0) {
              newTimeLeft[index] -= 1;
            } else {
              newTimeLeft[index] = 0;
            }
            return newTimeLeft;
          });
        }, 1000);
      }
      return null;
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearInterval(timer);
      });
    };
  }, [isRunning, generatedSteps]);

  const handleStart = (index: number) => {
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = true;
      return newRunning;
    });
  };

  const handleSuccess = (index: number) => {
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });
    setActiveStep((prev) => prev + 1); // Avança para o próximo passo
  };

  return (
    <div>
      <div className="generic-container">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Sala {currentRoom}
        </Typography>
      </div>
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {generatedSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Dificuldade: {step.difficulty}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Repetições: {step.reps}
                      </Typography>
                      <div className="generic-container">
                        <CircularProgressWithLabel
                          value={progress[index]}
                          timeLeft={timeLeft[index]}
                        />
                      </div>
                    </CardContent>
                    <CardActions>
                      {!isRunning[index] && timeLeft[index] > 0 && (
                        <Button size="small" onClick={() => handleStart(index)}>
                          INICIAR
                        </Button>
                      )}
                      {timeLeft[index] === 0 && (
                        <>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleSuccess(index)}
                          >
                            SUCESSO
                          </Button>
                          <Button size="small" color="error">
                            FALHA
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
      <div className="generic-container">
        <Button
          variant="contained"
          onClick={() => setCurrentRoom((prev) => prev + 1)}
        >
          Próxima Sala
        </Button>
      </div>
    </div>
  );
}

export default Runs;
