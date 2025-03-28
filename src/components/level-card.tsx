import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  // Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "26px",
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: "#575757",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: "#0000",
    ...theme.applyStyles("dark", {
      backgroundColor: "#000",
    }),
  },
}));

const ThinBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "10px",
  borderRadius: 0,
  marginTop: "8px",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: "#575757",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 0,
    backgroundColor: "#0000",
    ...theme.applyStyles("dark", {
      backgroundColor: "#000",
    }),
  },
}));

interface levelImage {
  level: number;
  path: string;
  name: string;
}

const urlImages: levelImage[] = [
  { level: 1, path: "/images/novice.png", name: "Novice" },
  { level: 3944, path: "/images/novice-2.png", name: "Novice 2" },
  { level: 7888, path: "/images/diamond_dog.png", name: "Diamond Dog" },
  { level: 25000, path: "/images/gnome_soldier.png", name: "Gnome Soldier" },
  {
    level: 47122,
    path: "/images/outer_heaven_soldier.png",
    name: "Outer Heaven Soldier",
  },
  {
    level: 89000,
    path: "/images/militaires_sans_frontieres.png",
    name: "Militaires Sans Frontières",
  },
  { level: 118000, path: "/images/fox.png", name: "Fox" },
  {
    level: 177000,
    path: "/images/desperado_enforcement_llc.png",
    name: "Desperado Enforcement LLC",
  },
  {
    level: 251111,
    path: "/images/les_enfants_terribles.png",
    name: "Les Enfants Terribles",
  },
  {
    level: 300000,
    path: "/images/fox_hound_special_forces.png",
    name: "FOX HOUND Special Forces",
  },
  { level: 814549, path: "/images/big_boss.png", name: "BIG BOSS" },
  { level: 1378196, path: "/images/the_boss.png", name: "The Boss" },
];

function getLevelData(levelStr: string) {
  const level = parseInt(levelStr, 10); // Converte o nível de string para número
  if (isNaN(level)) {
    throw new Error("O nível fornecido não é um número válido.");
  }

  const currentLevel = urlImages.reduce((prev, curr) => {
    return level >= curr.level ? curr : prev;
  });

  const nextLevel = urlImages.find((item) => item.level > level);
  return {
    ...currentLevel,
    nextLevel: nextLevel ? nextLevel.level : null,
    nextName: nextLevel ? nextLevel.name : null,
  };
}

const lightColors = [
  "#FDDE67", // Amarelo atual
  "#A5D6A7", // Verde claro
  "#81D4FA", // Azul claro
  "#CE93D8", // Roxo claro
  "#FFAB91", // Laranja claro
  "#E6EE9C", // Amarelo esverdeado
  "#80DEEA", // Azul esverdeado claro
  "#F48FB1", // Rosa claro
];

function LevelCard({
  level,
  exp,
  onExpChange,
}: {
  level: string;
  exp: number;
  onExpChange: (newExp: number) => void;
}) {
  const calculateBorderLinearProgressPercantage = (exp: number) => {
    return (exp / 500000) * 100;
  };

  const getRandomLightColor = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * lightColors.length);
    return lightColors[randomIndex];
  }, []);

  const [editingExp, setEditingExp] = useState<boolean>(false);
  const [editedExp, setEditedExp] = useState<number>(0);
  const [cardColor, setCardColor] = useState(getRandomLightColor());

  useEffect(() => {
    const interval = setInterval(() => {
      setCardColor(getRandomLightColor());
    }, 120000); // Muda a cada 120 segundos

    return () => clearInterval(interval);
  }, [getRandomLightColor]);

  useEffect(() => {
    setEditedExp(exp);
  }, [exp]);

  const handleExpUpdate = () => {
    if (!isNaN(exp)) {
      const newExp = isNaN(editedExp) ? exp : editedExp;
      localStorage.setItem("currentExp", newExp.toString());
      onExpChange(newExp);
      setEditingExp(false);
    }
  };

  function calculatePercentageBetweenRanks(
    currentLevel: number,
    nextLevel: number,
    userLevel: number
  ) {
    const range = nextLevel - currentLevel;
    const progress = userLevel - currentLevel;
    return (progress / range) * 100;
  }

  try {
    const levelData = getLevelData(level);

    const percentageToNextRank = calculatePercentageBetweenRanks(
      levelData.level,
      levelData.nextLevel || 0,
      parseInt(level)
    );

    // const maxLevel = urlImages[urlImages.length - 1].level;
    // const percentageToMaxLevel = (parseInt(level) / maxLevel) * 100;

    return (
      <Card
        sx={{
          marginBottom: 2,
          marginTop: 2,
          borderRadius: "0px",
          backgroundColor: cardColor,
          color: "#000",
          fontWeight: 700,
        }}
      >
        <CardMedia
          component="img"
          sx={{ padding: 2, borderRadius: 2 }}
          height="220"
          image={levelData.path}
          alt={`level ${levelData.level}`}
        />
        <CardContent>
          <div>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              fontWeight={700}
            >
              LV {level}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000" }}>
              {levelData.name.toUpperCase()}
            </Typography>
          </div>
          <div style={{ marginBottom: "16px", marginTop: "32px" }}>
            <BorderLinearProgress
              variant="determinate"
              value={calculateBorderLinearProgressPercantage(exp)}
            />
          </div>
          <div
            style={{
              marginBottom: "12px",
              marginTop: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="body2" sx={{ color: "#000" }}>
              {exp.toFixed(0)}/500000
            </Typography>
          </div>
          <div style={{ marginBottom: "12px", marginTop: "12px" }}>
            {editingExp ? (
              <>
                {/* Quero o dado dentro do input na cor pretas */}
                <TextField
                  label="Atualizar EXP"
                  type="number"
                  value={editedExp}
                  onChange={(e) => setEditedExp(parseInt(e.target.value))}
                  fullWidth
                  sx={{
                    marginBottom: 2,
                    "& .MuiInputBase-input": {
                      color: "#000", // Cor do texto digitado
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000", // Cor do label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#000", // quando não está em foco
                      },
                      "&:hover fieldset": {
                        borderColor: "#000", // Cor da borda ao passar o mouse
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#000", // Cor da borda quando em foco
                      },
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleExpUpdate}
                  sx={{ color: "#fff", backgroundColor: "#000" }}
                >
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setEditingExp(true)}
                sx={{ color: "#000", borderColor: "#000" }}
              >
                Editar EXP
              </Button>
            )}
          </div>

          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          {levelData.nextLevel && (
            <>
              <Typography
                variant="body2"
                sx={{ color: "#000", marginBottom: 1 }}
              >
                Próxima Patente: {levelData.nextName}
              </Typography>
              <Typography variant="body2" sx={{ color: "#000" }}>
                Nível necessário: {levelData.nextLevel}
              </Typography>
              {/* <Typography variant="body2" sx={{ color: "#000" }}>
                Percentagem percorrida entre a patente atual e a próxima:{" "}
                {calculatePercentageBetweenRanks(
                  levelData.level,
                  levelData.nextLevel,
                  parseInt(level)
                ).toFixed(2)}
                %
              </Typography> */}
              {/* <Chip
                size="medium"
                label={`Percorrido: ${calculatePercentageBetweenRanks(
                  levelData.level,
                  levelData.nextLevel,
                  parseInt(level)
                ).toFixed(3)}%`}
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRadius: 0,
                  mt: 2,
                  fontWeight: 400,
                }}
              /> */}
              <Box mt={4}>
                <Typography variant="body2" sx={{ color: "#000" }}>
                  Evolução da patente:{" "}
                  {`${calculatePercentageBetweenRanks(
                    levelData.level,
                    levelData.nextLevel,
                    parseInt(level)
                  ).toFixed(3)}%`}
                </Typography>
                <ThinBorderLinearProgress
                  variant="determinate"
                  value={percentageToNextRank}
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    let errorMessage = "Ocorreu um erro.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return (
      <div className="generic-container">
        <Typography color="error" variant="body1">
          Erro: {errorMessage}
        </Typography>
      </div>
    );
  }
}

export default LevelCard;
