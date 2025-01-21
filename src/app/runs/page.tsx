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
import React, { useState, useEffect } from "react";

const steps = [
  { label: "Passo 1", content: "Lizard" },
  { label: "Passo 2", content: "Lizard" },
  { label: "Passo 3", content: "Lizard" },
  { label: "Passo 4", content: "Lizard" },
  { label: "Passo 5", content: "Lizard" },
  { label: "Passo 6", content: "Lizard" },
  { label: "Passo 7", content: "Lizard" },
  { label: "Passo 8", content: "Lizard" },
  { label: "Passo 9", content: "Lizard" },
  { label: "Passo 10", content: "Lizard" },
  { label: "Passo 11", content: "Lizard" },
  { label: "Passo 12", content: "Lizard" },
  { label: "Passo 13", content: "Lizard" },
  { label: "Passo 14", content: "Lizard" },
  { label: "Passo 15", content: "Lizard" },
  { label: "Passo 16", content: "Lizard" },
  { label: "Passo 17", content: "Lizard" },
  { label: "Passo 18", content: "Lizard" },
  { label: "Passo 19", content: "Lizard" },
  { label: "Passo 20", content: "Lizard" },
];

const generateSteps = (rom: number) => {
  if (rom === 1) {
    const count = Math.floor(Math.random() * 2) + 1; // 1 to 2
    return steps.slice(0, count);
  }
  if (rom === 2) {
    const count = Math.floor(Math.random() * 3) + 1; // 1 to 3
    return steps.slice(0, count);
  }
  if (rom === 4 || rom === 5) {
    const count = Math.floor(Math.random() * 3) + 4; // 4 to 6
    return steps.slice(0, count);
  }
  if (rom === 10) {
    const count = Math.floor(Math.random() * 8) + 3; // 3 to 10
    return steps.slice(0, count);
  }
  if (rom === 11) {
    const count = Math.floor(Math.random() * 6) + 5; // 5 to 10
    return steps.slice(0, count);
  }
  if (rom === 12) {
    const count = Math.floor(Math.random() * 4) + 7; // 7 to 10
    return steps.slice(0, count);
  }
  if (rom === 13) {
    const count = Math.floor(Math.random() * 4) + 8; // 8 to 11
    return steps.slice(0, count);
  }
  if (rom === 14) {
    const count = Math.floor(Math.random() * 7) + 14; // 14 to 20
    return steps.slice(0, count);
  }
  return [];
};

function Runs() {
  const [currentRoom] = useState(1);
  const [generatedSteps, setGeneratedSteps] = useState<{ label: string; content: string }[]>([]);

  useEffect(() => {
    setGeneratedSteps(generateSteps(currentRoom));
  }, [currentRoom]);

  return (
    <div>
      <div className="generic-container">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Sala {currentRoom}
        </Typography>
      </div>
      <div className="generic-container">
        <Typography component="legend">Gotas: {0}</Typography>
      </div>
      <div className="generic-container">
        <Typography component="legend">Corações: {1}</Typography>
      </div>
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={0} orientation="vertical">
            {generatedSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {step.content}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Lizards are a widespread group of squamate reptiles, with
                        over 6,000 species, ranging across all continents except
                        Antarctica.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small">Share</Button>
                      <Button size="small">Learn More</Button>
                    </CardActions>
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
    </div>
  );
}

export default Runs;
