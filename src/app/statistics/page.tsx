"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface Draw {
  id: string;
  date: string; // Data no formato "DD/MM/AAAA"
  task: string;
  totalDraws: number;
  wonDraws: number;
}

function Statistics() {
  const [history, setHistory] = useState<Draw[]>([]);

  const taskEmojis = {
    "Sem Álcool": "🚫",
    Água: "💧",
    Nutrição: "🍎",
    Exercícios: "🏋️",
    "Exercícios (focado)": "🏋️🔥",
    Sono: "😴",
    Projeto: "🍆",
    Grind: "🔥",
    "Laboratório Mental": "🧪",
  };


  useEffect(() => {
    const storedHistory = localStorage.getItem("drawHistory");
    const parsedHistory: Draw[] = storedHistory
      ? JSON.parse(storedHistory)
      : [];
    setHistory(parsedHistory);
  }, []);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("drawHistory", JSON.stringify(updatedHistory));
  };

  const handleDeleteAll = () => {
    setHistory([]);
    localStorage.removeItem("drawHistory");
  };

  return (
    <div>
      <div className="generic-container">
        {/* Lista de entradas individuais */}
        {history.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Não há dados para exibir.
          </Typography>
        ) : (
          history.map((entry) => (
            <Card key={entry.id} sx={{ mb: 4, border: "1px solid #5A5A5A" }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Data e hora: {entry.date}
                </Typography>
                <Divider />
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  Sorteios ganhos:
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Deletar
                  </Button>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "38px", color: "#4caf50" }}>
                  {entry.wonDraws}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                    fontSize: "24px",
                  }}
                >
                  {taskEmojis[entry.task as keyof typeof taskEmojis] || ""}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
        {history.length > 0 && (
          <CardActions>
            <Button size="small" color="error" onClick={handleDeleteAll}>
              Deletar tudo 😢
            </Button>
          </CardActions>
        )}
      </div>
    </div>
  );
}

export default Statistics;
