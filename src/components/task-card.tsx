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
}


export default function TaskCard({ taskName, level, packs }: TaskCardProps) {
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
}