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
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

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
  { level: 7888, path: "/images/diamond_dog.png", name: "Diamond Dog" },
  { level: 15700, path: "/images/gnome_soldier.png", name: "Gnome Soldier" },
  {
    level: 27122,
    path: "/images/outer_heaven_soldier.png",
    name: "Outer Heaven Soldier",
  },
  {
    level: 39000,
    path: "/images/militaires_sans_frontieres.png",
    name: "Militaires Sans Frontières",
  },
  { level: 58000, path: "/images/fox.png", name: "Fox" },
  {
    level: 72000,
    path: "/images/desperado_enforcement_llc.png",
    name: "Desperado Enforcement LLC",
  },
  {
    level: 92000,
    path: "/images/les_enfants_terribles.png",
    name: "Les Enfants Terribles",
  },
  {
    level: 112000,
    path: "/images/fox_hound_special_forces.png",
    name: "FOX HOUND Special Forces",
  },
  { level: 249000, path: "/images/big_boss.png", name: "BIG BOSS" },
  { level: 378196, path: "/images/the_boss.png", name: "The Boss" },
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

  const [editingExp, setEditingExp] = useState<boolean>(false);
  const [editedExp, setEditedExp] = useState<number>(0);

  const handleExpUpdate = () => {
    if (!isNaN(exp)) {
      const newExp = isNaN(editedExp) ? exp : editedExp;
      localStorage.setItem("currentExp", newExp.toString());
      onExpChange(newExp);
      setEditingExp(false);
    }
  };

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
          <div style={{ marginBottom: "12px", marginTop: "12px" }}>
            {editingExp ? (
              <>
                <TextField
                  label="Atualizar EXP"
                  type="number"
                  value={editedExp}
                  onChange={(e) => setEditedExp(parseInt(e.target.value))}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" onClick={handleExpUpdate}>
                  Salvar
                </Button>
              </>
            ) : (
              <Button variant="outlined" onClick={() => setEditingExp(true)}>
                Editar EXP
              </Button>
            )}
          </div>
          <Typography gutterBottom variant="h5" component="div">
            Patente: {levelData.name}
          </Typography>
          <div style={{ marginBottom: "16px", marginTop: "16px" }}>
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
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {exp.toFixed(0)}/500000
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
