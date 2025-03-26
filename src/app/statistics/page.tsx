"use client";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Draw {
  id: string;
  date: string; // Data no formato "DD/MM/AAAA"
  task: string;
  totalDraws: number;
  wonDraws: number;
}

interface GroupedHistory {
  [key: string]: number;
}

function Statistics() {
  const [history, setHistory] = useState<Draw[]>([]);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [expPercentageIncrease, setExpPercentageIncrease] = useState<
    string | null
  >(null);

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
    Caminhada: "👣",
  };

  const calculateExpPercentageIncrease = (history: Draw[]): string | null => {
    if (history.length === 0) return null;

    const groupedHistory = history.reduce<GroupedHistory>((acc, entry) => {
      const day = entry.date.split(" ")[0];
      acc[day] = (acc[day] || 0) + entry.wonDraws;
      return acc;
    }, {});

    const days = Object.keys(groupedHistory).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/").map(Number);
      const [dayB, monthB, yearB] = b.split("/").map(Number);
      return (
        new Date(yearB, monthB - 1, dayB).getTime() -
        new Date(yearA, monthA - 1, dayA).getTime()
      );
    });

    if (days.length < 2) return null; // Sem comparações possíveis

    const today = days[0];
    const yesterday = days[1];

    const todayExp = groupedHistory[today] || 0;
    const yesterdayExp = groupedHistory[yesterday] || 0;

    if (yesterdayExp === 0) return null; // Evita divisão por zero

    const percentageIncrease = ((todayExp - yesterdayExp) / yesterdayExp) * 100;
    return percentageIncrease.toFixed(2);
  };

  useEffect(() => {
    setExpPercentageIncrease(calculateExpPercentageIncrease(history));
  }, [history]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("drawHistory");
    const parsedHistory: Draw[] = storedHistory
      ? JSON.parse(storedHistory)
      : [];
    setHistory(parsedHistory);

    // Expandir automaticamente o dia mais recente
    if (parsedHistory.length > 0) {
      const mostRecentDay = extractDayFromDate(parsedHistory[0].date);
      setExpandedDay(mostRecentDay);
    }
  }, []);

  // Extrai apenas a parte da data (DD/MM/AAAA) da string completa
  const extractDayFromDate = (dateString: string) => {
    return dateString.split(" ")[0];
  };

  // Agrupa os dados por dia
  const groupByDay = () => {
    const grouped: Record<string, Draw[]> = {};

    history.forEach((entry) => {
      const day = extractDayFromDate(entry.date);
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(entry);
    });

    return grouped;
  };

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("drawHistory", JSON.stringify(updatedHistory));
  };

  const handleDeleteAll = () => {
    setHistory([]);
    localStorage.removeItem("drawHistory");
    setExpandedDay(null);
  };

  const handleAccordionChange = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const groupedHistory = groupByDay();
  const days = Object.keys(groupedHistory).sort((a, b) => {
    // Ordena por data (mais recente primeiro)
    const [dayA, monthA, yearA] = a.split("/").map(Number);
    const [dayB, monthB, yearB] = b.split("/").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  return (
    <div>
      <div className="generic-container">
        {/* Adicione este bloco logo no início do container */}
        {expPercentageIncrease !== null && (
          <Card sx={{ mb: 2, backgroundColor: "#f5f5f5" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  color:
                    Number(expPercentageIncrease) >= 0 ? "#4caf50" : "#f44336",
                  fontFamily: "Fira Sans",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {Number(expPercentageIncrease) >= 0
                  ? `🔥 EXP até agora é ${expPercentageIncrease}% maior (entre ${days[0]} e ${days[1]})`
                  : `📉 EXP até agora é ${Math.abs(Number(expPercentageIncrease))}% menor (entre ${
                      days[0]
                    } e ${days[1]})`}
              </Typography>
            </CardContent>
          </Card>
        )}

        {history.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Não há dados para exibir.
          </Typography>
        ) : (
          days.map((day) => (
            <Accordion
              key={day}
              expanded={expandedDay === day}
              onChange={() => handleAccordionChange(day)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${day}-content`}
                id={`${day}-header`}
              >
                <Typography variant="h6">Dia: {day}</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 2,
                    color: "text.secondary",
                    fontFamily: "Fira Sans",
                  }}
                >
                  ({groupedHistory[day].length} registros)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {groupedHistory[day].map((entry, index) => (
                  <Card
                    key={entry.id}
                    sx={{ mb: 2, border: "1px solid #5A5A5A" }}
                  >
                    <CardContent>
                      <Typography gutterBottom variant="body1" component="div">
                        Hora: {entry.date.split(" ")[1]}
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
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "38px", color: "#4caf50" }}
                      >
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
                        {taskEmojis[entry.task as keyof typeof taskEmojis] ||
                          ""}
                      </Typography>
                      <Typography sx={{ mt: 4, fontFamily: "Fira Sans" }}>
                        {entry.task === "Água" &&
                          (() => {
                            // Filtra apenas as tarefas de água que ocorreram antes (incluindo a atual)
                            const waterEntries = groupedHistory[day]
                              .slice(0, index + 1)
                              .filter((e) => e.task === "Água");

                            // Obtém o número do pack
                            const packNumber = waterEntries.length;

                            return `Este é o ${packNumber}° pack de água tomado`;
                          })()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </AccordionDetails>
            </Accordion>
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
