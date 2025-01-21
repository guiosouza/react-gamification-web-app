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
  title: string;
  difficulty: number;
  timeToComplete: number; // Tempo total do progresso em segundos
  reps: number; // Quantidade de repetições
};

// Passos base
const steps: StepType[] = [
  { title: "Agachamento", difficulty: 1, timeToComplete: 2, reps: 1 },
  { title: "Flexão", difficulty: 2, timeToComplete: 4, reps: 2 },
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
    case 6:
      count = Math.floor(Math.random() * 2) + 5; // 5 a 6
      break;
    case 8:
      count = Math.floor(Math.random() * 2) + 7; // 7 a 8
      break;
    case 9:
      count = Math.floor(Math.random() * 9) + 1; // 1 a 9
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

  // Geração de passos com multiplicadores aleatórios
  const generatedSteps: StepType[] = [];
  for (let i = 0; i < count; i++) {
    const randomStep = steps[Math.floor(Math.random() * steps.length)];

    // Multiplicadores aleatórios
    const timeMultiplier = Math.random() * (3 - 2) + 2; // Entre 2 e 3
    const repsMultiplier = Math.random() * (4 - 3) + 3; // Entre 3 e 4

    generatedSteps.push({
      ...randomStep,
      timeToComplete: Math.round(randomStep.timeToComplete * timeMultiplier), // Tempo ajustado (arredondado)
      reps: Math.round(randomStep.reps * repsMultiplier), // Reps ajustados (arredondados)
    });
  }

  return generatedSteps;
};

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number; timeLeft: number }
) {
  const { value, timeLeft, ...circularProgressProps } = props;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        width: 90,
        height: 90,
      }}
    >
      {/* Fundo (parte não preenchida) */}
      <CircularProgress
        variant="determinate"
        value={100} // Fundo sempre completo
        sx={{
          color: "grey", // Cor do fundo
          opacity: 0.3, // Controle de opacidade para suavizar
          width: "100% !important",
          height: "100% !important",
          position: "absolute", // Fica atrás do progresso real
        }}
      />
      {/* Progresso real */}
      <CircularProgress
        variant="determinate"
        value={value}
        {...circularProgressProps}
        sx={{
          width: "100% !important",
          height: "100% !important",
        }}
      />
      {/* Texto no centro */}
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
  const [lives, setLives] = useState<number>(3); // Estado para rastrear as vidas
  const [timers, setTimers] = useState<number>(3); // Quantidade de timers
  const [drops, setDrops] = useState<number>(0); // Quantidade de gotas
  const [generatedSteps, setGeneratedSteps] = useState<StepType[]>([]);
  const [progress, setProgress] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState<boolean[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showChoiceCard, setShowChoiceCard] = useState<boolean>(false); // Exibe o card de escolha
  const [isRestRoom, setIsRestRoom] = useState<boolean>(false);

  useEffect(() => {
    const steps = generateSteps(currentRoom);
    setGeneratedSteps(steps);
    setProgress(new Array(steps.length).fill(0));
    setTimeLeft(steps.map((step) => step.timeToComplete));
    setIsRunning(new Array(steps.length).fill(false));
    setActiveStep(0);
    setShowChoiceCard(false); // Reinicia a exibição do card especial
  }, [currentRoom]);

  useEffect(() => {
    const timers = isRunning.map((running, index) => {
      if (running) {
        const startTime = Date.now(); // Marca o início do timer
        return setInterval(() => {
          setProgress((prev) => {
            const newProgress = [...prev];
            const elapsed = (Date.now() - startTime) / 1000; // Tempo decorrido em segundos
            const stepTime = generatedSteps[index].timeToComplete;
            
            if (elapsed <= stepTime) {
              newProgress[index] = Math.min((elapsed / stepTime) * 100, 100); // Progresso proporcional
            } else {
              newProgress[index] = 100; // Garante que o progresso não passe de 100%
            }
            return newProgress;
          });
  
          setTimeLeft((prev) => {
            const newTimeLeft = [...prev];
            const elapsed = (Date.now() - startTime) / 1000; // Tempo decorrido em segundos
            const remaining = Math.max(
              Math.round(generatedSteps[index].timeToComplete - elapsed),
              0
            );
            newTimeLeft[index] = remaining;
            return newTimeLeft;
          });
        }, 100); // Atualiza a cada 100ms para maior precisão
      }
      return null;
    });
  
    return () => {
      timers.forEach((timer) => {
        if (timer) clearInterval(timer);
      });
    };
  }, [isRunning, generatedSteps]);

  useEffect(() => {
    const steps = generateSteps(currentRoom);
    setGeneratedSteps(steps);
    setIsRestRoom(steps.length === 0); // Define se é uma sala de descanso
  }, [currentRoom]);

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

    // Adiciona gotas com 45% de chance (12 a 18 gotas)
    if (Math.random() < 0.45) {
      const gainedDrops = Math.floor(Math.random() * (18 - 12 + 1)) + 12;
      setDrops((prev) => prev + gainedDrops);
    }

    // Verifica se o card de escolha deve aparecer (40% de chance)
    if (Math.random() < 0.4) {
      setShowChoiceCard(true); // Exibe o card de escolha
    } else {
      setActiveStep((prev) => prev + 1); // Avança para o próximo passo
    }
  };

  const handleFail = (index: number) => {
    setIsRunning((prev) => {
      const newRunning = [...prev];
      newRunning[index] = false;
      return newRunning;
    });

    setActiveStep((prev) => prev + 1); // Marca o passo como completo

    setLives((prev) => Math.max(prev - 1, 0)); // Reduz uma vida

    if (lives <= 1) {
      alert("GAME OVER! Você perdeu todas as suas vidas.");
      setCurrentRoom(1); // Reinicia o jogo
      setLives(3); // Restaura as vidas
      setDrops(0); // Restaura as gotas
      setTimers(3); // Restaura os timers
    }
  };

  const handleChoice = (choice: "timer" | "life") => {
    if (choice === "life") {
      setLives((prev) => prev + 1); // Adiciona uma vida
    } else if (choice === "timer") {
      setTimers((prev) => prev + 1); // Adiciona um timer
    }
    setShowChoiceCard(false); // Fecha o card de escolha
    setActiveStep((prev) => prev + 1); // Avança para o próximo passo
  };

  return (
    <div>
      <div className="generic-container" style={{ display: "flex", gap: 16 }}>
        <Typography variant="body2">Sala - {currentRoom}</Typography>
        <Typography variant="body2">Vidas: {lives}</Typography>
        <Typography variant="body2">Gotas: {drops}</Typography>
        <Typography variant="body2">Timers: {timers}</Typography>
      </div>
      {isRestRoom ? (
        <div className="generic-container">
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Sala de Descanso
              </Typography>
              <Typography variant="body2">
                Relaxe antes de continuar para a próxima sala!
              </Typography>
              <CardActions>
                <Button
                  variant="contained"
                  onClick={() => setCurrentRoom((prev) => prev + 1)}
                >
                  Avançar
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="generic-container">
          {showChoiceCard ? (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Escolha uma Recompensa!
                </Typography>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleChoice("life")}
                  >
                    Vida +1
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleChoice("timer")}
                  >
                    Timer +1
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ maxWidth: 400 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {generatedSteps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>{step.title}</StepLabel>
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
                            <Button
                              size="small"
                              onClick={() => handleStart(index)}
                            >
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
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleFail(index)}
                              >
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
          )}
        </div>
      )}
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
