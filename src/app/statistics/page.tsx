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

  // Agrupa os sorteios por data
  const drawsByDate = history.reduce((acc: Record<string, number>, entry) => {
    const date = entry.date.split(" ")[0]; // Obtém apenas a parte da data
    acc[date] = (acc[date] || 0) + entry.totalDraws;
    return acc;
  }, {});

  return (
    <div>
      <div className="generic-container">
        {/* Exibe as somas agrupadas por data */}
        {Object.entries(drawsByDate).map(([date, totalDraws]) => (
          <Card key={date} sx={{ mb: 2, border: "1px solid orange" }}>
            <CardContent>
              <Typography variant="h6" component="div">
                Soma de todos os sorteios de {date}
              </Typography>
              <Divider sx={{ mb: 2, mt: 1 }} />
              <Typography variant="body1" color="textSecondary">
                Total de sorteios: {totalDraws}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Lista de entradas individuais */}
        {history.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Não há dados para exibir.
          </Typography>
        ) : (
          history.map((entry) => (
            <Card key={entry.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  Data e hora: {entry.date}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  Sorteios ganhos: {entry.wonDraws}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Deletar
                  </Button>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  {entry.task} {entry.task === "Sem Álcool" ? "🚫" : ""}{" "}
                  {entry.task === "Água" ? "💧" : ""}{" "}
                  {entry.task === "Nutrição" ? "🍎" : ""}
                  {entry.task === "Exercícios" ? "🏋️" : ""}
                  {entry.task === "Sono" ? "😴" : ""}
                  {entry.task === "Projeto" ? "🍆" : ""}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
        {history.length > 0 && (
          <CardActions>
            <Button size="small" color="error" onClick={handleDeleteAll}>
              Deletar tudo
            </Button>
          </CardActions>
        )}
      </div>
    </div>
  );
}

export default Statistics;
