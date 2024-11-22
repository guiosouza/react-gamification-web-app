"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

interface TaskCardProps {
  taskName: string;
  level: string;
  packs: number;
  drawResults?: {
    task: string;
    packs: number;
    wonPacks: number;
  } | null;
}

export default function TaskCard({
  taskName,
  level,
  packs,
  drawResults,
}: TaskCardProps) {
  const calculateWinPercentage = (): string => {
    if (!drawResults || drawResults.packs === 0) return "0";
    return ((drawResults.wonPacks / drawResults.packs) * 100).toFixed(1);
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {taskName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Seu nível atual: {level}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Packs que tem direito pelo nível: {packs}
          </Typography>
          {drawResults && (
            <>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", marginTop: 2 }}
              >
                Total de packs sorteados: {drawResults.packs}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Packs ganhos: <strong style={{color:  "#ADD8E6"}}> {drawResults.wonPacks}</strong>
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Porcentagem de ganho: {calculateWinPercentage()}%
              </Typography>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
