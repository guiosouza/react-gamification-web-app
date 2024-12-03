import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";
import React from "react";

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

function LevelCard({ level }: { level: string }) {
  try {
    const levelData = getLevelData(level);

    return (
      <Card sx={{ marginBottom: 2, marginTop: 2 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="220"
            image={levelData.path}
            alt={`level ${levelData.level}`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Patente: {levelData.name}
            </Typography>
            {levelData.nextLevel && (
              <Chip
                color="secondary"
                label={`Próximo: ${levelData.nextName}`}
                size="small"
              />
            )}
          </CardContent>
        </CardActionArea>
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
