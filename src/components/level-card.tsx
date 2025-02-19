import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: "26px",
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: "#575757",
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
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
  { level: 378196, path: "/images/big_boss.png", name: "BIG BOSS" },
  { level: 995500, path: "/images/the_boss.png", name: "The Boss" },
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

  try {
    const levelData = getLevelData(level);

    return (
      <Card
        sx={{
          marginBottom: 2,
          marginTop: 2,
          borderRadius: "0px",
          backgroundColor: "#5C7047",
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
            <Typography gutterBottom variant="h5" component="div">
              LV {level}
            </Typography>
            <Typography variant="body2" sx={{ color: "#000", }}>
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
                  sx={{ marginBottom: 2, color: "#000" }}
                />
                <Button variant="contained" onClick={handleExpUpdate} sx={{ color: "#fff", backgroundColor: "#000" }}>
                  Salvar
                </Button>
              </>
            ) : (
              <Button variant="outlined" onClick={() => setEditingExp(true)} sx={{ color: "#000", borderColor: "#000" }}>
                Editar EXP
              </Button>
            )}
          </div>

          <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
          {levelData.nextLevel && (
            <Typography variant="body2" sx={{ color: "#000" }}>
              Próximo: {levelData.nextName}
            </Typography>
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
