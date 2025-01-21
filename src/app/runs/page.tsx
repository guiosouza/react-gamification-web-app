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
import React, { useState } from "react";

const steps = [
  'Passo 1',
  'Passo 2',
  'Passo 3',
];

function Runs() {
  const [currentRoom] = useState(1);

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
          <Stepper activeStep={1} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        Lizard
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
