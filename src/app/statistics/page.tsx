"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface Draw {
  id: string;
  date: string;
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
    console.log("Deleting entry with ID:", id);
    const updatedHistory = history.filter((entry) => entry.id !== id);
    console.log("Updated history after deletion:", updatedHistory);
    setHistory(updatedHistory);
    localStorage.setItem("drawHistory", JSON.stringify(updatedHistory));
  };

  const handleDeleteAll = () => {
    console.log("Deleting all entries.");
    setHistory([]);
    localStorage.removeItem("drawHistory");
  };

  return (
    <div>
      <div className="generic-container">
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
