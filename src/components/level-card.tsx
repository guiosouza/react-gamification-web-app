import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { useState, useEffect } from "react";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
    ...theme.applyStyles("dark", {
      backgroundColor: "#308fe8",
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
  { level: 1488, path: "/images/diamond_dog.png", name: "Diamond Dog" },
  { level: 2700, path: "/images/gnome_soldier.png", name: "Gnome Soldier" },
  {
    level: 19122,
    path: "/images/outer_heaven_soldier.png",
    name: "Outer Heaven Soldier",
  },
  {
    level: 34000,
    path: "/images/militaires_sans_frontieres.png",
    name: "Militaires Sans Frontières",
  },
  { level: 49000, path: "/images/fox.png", name: "Fox" },
  {
    level: 60000,
    path: "/images/desperado_enforcement_llc.png",
    name: "Desperado Enforcement LLC",
  },
  {
    level: 92000,
    path: "/images/les_enfants_terribles.png",
    name: "Les Enfants Terribles",
  },
  {
    level: 120000,
    path: "/images/fox_hound_special_forces.png",
    name: "FOX HOUND Special Forces",
  },
  { level: 199999, path: "/images/big_boss.png", name: "BIG BOSS" },
  { level: 235000, path: "/images/the_boss.png", name: "The Boss" },
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

const calculateLevelProgress = (exp: number, expPerLevel: number) => {
  const currentProgress = exp % expPerLevel;
  const progressPercentage = (currentProgress / expPerLevel) * 100;
  return { currentProgress, progressPercentage };
};

function LevelCard({ level }: { level: string }) {
  const expPerLevel = 500000; // Quantidade de EXP necessária para subir de nível
  const [currentExp, setCurrentExp] = useState<number>(0);
  const [editingExp, setEditingExp] = useState<boolean>(false);
  const [newExp, setNewExp] = useState<string>("");

  useEffect(() => {
    const savedExp = localStorage.getItem("userExp");
    setCurrentExp(savedExp ? Number(savedExp) : 0);
  }, []);

  const handleExpUpdate = () => {
    const exp = Number(newExp);
    if (!isNaN(exp)) {
      setCurrentExp(exp);
      localStorage.setItem("userExp", exp.toString());
      setEditingExp(false);
    }
  };

  const { currentProgress, progressPercentage } = calculateLevelProgress(
    currentExp,
    expPerLevel
  );

  try {
    const levelData = getLevelData(level);

    return (
      <Card sx={{ marginBottom: 2, marginTop: 2 }}>
        <CardMedia
          component="img"
          height="220"
          image={levelData.path}
          alt={`level ${levelData.level}`}
        />
        <CardContent>
          {editingExp ? (
            <div style={{ marginBottom: "12px" }}>
              <TextField
                label="Atualizar EXP"
                type="number"
                value={newExp}
                onChange={(e) => setNewExp(e.target.value)}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <Button variant="contained" onClick={handleExpUpdate}>
                Salvar
              </Button>
            </div>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              <Button variant="outlined" onClick={() => setEditingExp(true)}>
                Editar EXP
              </Button>
            </div>
          )}
          <Typography gutterBottom variant="h5" component="div">
            Patente: {levelData.name}
          </Typography>
          <div style={{ marginBottom: "16px", marginTop: "16px" }}>
            <BorderLinearProgress variant="determinate" value={50} />
          </div>
          <div
            style={{
              marginBottom: "12px",
              marginTop: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              250000/500000
            </Typography>
          </div>
          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          {levelData.nextLevel && (
            <Chip
              color="secondary"
              label={`Próximo: ${levelData.nextName}`}
              size="small"
            />
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
