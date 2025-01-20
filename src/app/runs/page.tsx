"use client";
import React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";

// interface RunData {
//   room: number;
//   gameOver: boolean;
// }

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});


const steps = [
  {
    id: 1,
    label: "Select campaign settings",
    description: `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`,
  },
  {
    id: 2,
    label: "Create an ad group",
    description:
      "An ad group contains one or more ads which target a shared set of keywords.",
  },
  {
    id: 3,
    label: "Create an ad",
    description: `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`,
  },
];

// const generateRunTasks = (room: number) => {
//   switch (room) {
//     case 1:
//       return mockedExercises;
//     case 2:
//       return mockedExercises;
//     case 3:
//       return mockedExercises;
//     case 4:
//       return mockedExercises;
//     case 5:
//       return mockedExercises;
//     case 6:
//       return mockedExercises;
//     case 7:
//       return mockedExercises;
//     case 8:
//       return mockedExercises;
//     case 9:
//       return mockedExercises;
//     case 10:
//       return mockedExercises;
//     default:
//       return [];
//   }
// }

// const mockedExercises = [
//   {
//     id: 1,
//     title: "Burpees",
//     description: "Exercício completo que combina força e cardio.",
//     muscles: "Corpo inteiro",
//   },
//   {
//     id: 2,
//     title: "Polichinelos",
//     description: "Exercício aeróbico que melhora a resistência cardiovascular.",
//     muscles: "Corpo inteiro",
//   },
//   {
//     id: 3,
//     title: "Flexões",
//     description: "Exercício de força focado na parte superior do corpo.",
//     muscles: "Peito, ombros, tríceps, core",
//   },
//   {
//     id: 4,
//     title: "Agachamentos",
//     description: "Exercício para fortalecer e tonificar a parte inferior do corpo.",
//     muscles: "Pernas, glúteos",
//   },
//   {
//     id: 5,
//     title: "Escaladores",
//     description: "Exercício cardio com forte ativação do core.",
//     muscles: "Core, pernas, ombros",
//   },
//   {
//     id: 6,
//     title: "Prancha",
//     description: "Exercício de estabilização do core.",
//     muscles: "Core, ombros",
//   },
//   {
//     id: 7,
//     title: "Corrida estacionária com joelhos altos",
//     description: "Exercício aeróbico que melhora a resistência das pernas e a coordenação.",
//     muscles: "Pernas, core",
//   },
//   {
//     id: 8,
//     title: "Afundos",
//     description: "Exercício para a parte inferior do corpo que também trabalha equilíbrio.",
//     muscles: "Pernas, glúteos, core",
//   },
//   {
//     id: 9,
//     title: "Subidas no degrau",
//     description: "Exercício que combina cardio e força usando uma superfície elevada.",
//     muscles: "Pernas, glúteos",
//   },
// ];

// const mockedActualRunData = {
//   room: 1,
//   gameOver: false,
// }

// const mockedUserDataForRuns = {
//   id: 1,
//   name: "John Doe",
//   totalHearts: 2,
//   totalTimers: 2,
//   highestRoomReached: 4,
//   bonusChance: 11,
//   heartInBonus: 1,
//   upgrades: [
//     {
//       id: 1,
//       title: "Coração extra no bônus",
//       description: "Aumenta 1 coração para quando o bônus surgir.",
//       price: 200,
//       total: 20,
//       completed: false,
//     },
//     {
//       id: 2,
//       title: "Temporizador extra no bônus",
//       description: "Aumenta 1 temporizador para quando o bônus surgir.",
//       price: 100,
//       total: 20,
//       completed: false,
//     },
//     {
//       id: 3,
//       title: "Chance de aparecer sorteio",
//       description: "Aumente em 8% a chance de aparecer um sorteio ao final de uma tarefa da RUN.",
//       price: 100,
//       total: 20,
//       completed: false,
//     },

//   ], 
// }

function Runs() {
  const [activeStep, setActiveStep] = React.useState(0);
  // const [checked, setChecked] = React.useState([0]);

  // const handleToggle = (value: number) => () => {
  //   const currentIndex = checked.indexOf(value);
  //   const newChecked = [...checked];

  //   if (currentIndex === -1) {
  //     newChecked.push(value);
  //   } else {
  //     newChecked.splice(currentIndex, 1);
  //   }

  //   setChecked(newChecked);
  // };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div>
      <div className="generic-container">
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Sala {2}
        </Typography>
      </div>
      <div className="generic-container">
        <Typography component="legend">Vidas restantes</Typography>
        <StyledRating
          name="customized-color"
          defaultValue={2}
          getLabelText={(value: number) =>
            `${value} Heart${value !== 1 ? "s" : ""}`
          }
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        />
      </div>
      <div className="generic-container">
        <Box sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  optional={
                    index === steps.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? "Finish" : "Continuar"}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} sx={{ p: 3 }}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Reset
              </Button>
            </Paper>
          )}
        </Box>
      </div>
    </div>
  );
}

export default Runs;
