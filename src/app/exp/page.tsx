"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import TaskCard from "@/components/task-card";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LevelCard from "@/components/level-card";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

interface TaskOption {
  label: string;
}

interface TaskInfo {
  task: string;
  packs: number;
  wonPacks: number;
}

interface TaskInput {
  quantity?: number;
  time?: string;
}

interface Draw {
  id: string; // Adicione este campo
  date: string;
  task: string;
  totalDraws: number;
  wonDraws: number;
}

const options: TaskOption[] = [
  { label: "Todas" },
  { label: "Projeto" },
  { label: "Sono" },
  { label: "Grind" },
  { label: "Água" },
  { label: "Exercícios" },
  { label: "Nutrição" },
  { label: "Sem Álcool" },
  { label: "Controle" },
];

export default function Exp() {
  const [selectedTask, setSelectedTask] = useState<TaskOption>(options[0]);
  const [taskInput, setTaskInput] = useState<TaskInput>({});
  const [drawResults, setDrawResults] = useState<TaskInfo | null>(null);
  const [level, setLevel] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [exp, setExp] = useState<number>(0);
  const EXP_PER_LEVEL = 500000;
  const [disableInput, setDisableInput] = useState(false);
  const [actualTask, setActualTask] = useState<string>("");
  const [shouldRemoveAlerts, setShouldRemoveAlerts] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<string>("");

  useEffect(() => {
    const savedLevel = localStorage.getItem("userLevel");
    const savedStartDate = localStorage.getItem("startDate");

    if (savedLevel) {
      setLevel(savedLevel);
    }
    if (savedStartDate) {
      setStartDate(dayjs(savedStartDate));
    }
  }, []);

  useEffect(() => {
    const savedLevel = localStorage.getItem("userLevel");
    const savedStartDate = localStorage.getItem("startDate");
    const savedExp = localStorage.getItem("currentExp");

    if (savedLevel) {
      setLevel(savedLevel);
    }
    if (savedStartDate) {
      setStartDate(dayjs(savedStartDate));
    }
    if (savedExp) {
      setExp(parseInt(savedExp));
    }
  }, []);

  useEffect(() => {
    // Inicializar o histórico se não existir
    const historyKey = "drawHistory";
    if (!localStorage.getItem(historyKey)) {
      localStorage.setItem(historyKey, JSON.stringify([]));
    }

    const savedLevel = localStorage.getItem("userLevel");
    const savedStartDate = localStorage.getItem("startDate");
    const savedExp = localStorage.getItem("currentExp");

    if (savedLevel) {
      setLevel(savedLevel);
    }
    if (savedStartDate) {
      setStartDate(dayjs(savedStartDate));
    }
    if (savedExp) {
      setExp(parseInt(savedExp));
    }
  }, []);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    localStorage.setItem("userLevel", newLevel);
  };

  const calculateDaysSinceStart = (startDate: Dayjs | null): number => {
    if (!startDate) return 0;
    const today = dayjs();
    return today.diff(startDate, "day");
  };

  const calculatePacksByTask = (taskName: string, level: string): number => {
    const levelNumber = Number(level);
    if (!levelNumber) return 0;

    const baseMultiplier = Math.floor(levelNumber / 8);

    const baseMultiplierForWater = Math.floor(levelNumber / 12);

    const baseMultiplierForControlMindset = Math.floor(levelNumber / 34);

    switch (taskName) {
      case "Grind":
        return Math.floor(levelNumber / 80);
      case "Nutrição":
        return baseMultiplier * 5;
      case "Sem Álcool":
        return baseMultiplier * 8;
      case "Exercícios":
        return baseMultiplier;
      case "Água":
        return baseMultiplierForWater;
      case "Controle":
        return baseMultiplierForControlMindset;
      case "Projeto": {
        const daysPassed = calculateDaysSinceStart(startDate);
        return daysPassed * 398;
      }
      case "Sono": {
        const daysPassed = calculateDaysSinceStart(startDate);
        return daysPassed * 422;
      }
      default:
        return 0;
    }
  };

  const handleStartDateChange = (newValue: Dayjs | null) => {
    setStartDate(newValue);
    if (newValue) {
      localStorage.setItem("startDate", newValue.toISOString());
    }
  };

  const calculateTotalPacks = (): number => {
    const basePacks = calculatePacksByTask(selectedTask.label, level);

    if (selectedTask.label === "Projeto") {
      return basePacks;
    }

    if (selectedTask.label === "Sono") {
      return basePacks;
    }

    if (
      selectedTask.label === "Água" ||
      selectedTask.label === "Nutrição" ||
      selectedTask.label === "Sem Álcool" ||
      selectedTask.label === "Controle"
    ) {
      return basePacks * (taskInput.quantity || 0);
    }

    if (selectedTask.label === "Exercícios" || selectedTask.label === "Grind") {
      if (!taskInput.time) return 0;
      const [hours, minutes] = taskInput.time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return basePacks * Math.floor(totalMinutes / 10);
    }

    return 0;
  };

  const calculateExp = (wonPacks: number) => {
    return wonPacks * 19999.6;
  };

  const drawPacks = () => {
    setShouldRemoveAlerts(true);

    const totalPacks = calculateTotalPacks();
    let wonPacks = 0;

    for (let i = 0; i < totalPacks; i++) {
      if (Math.random() < 0.5) {
        wonPacks++;
      }
    }

    const newExp = calculateExp(wonPacks);
    let currentExp = parseInt(localStorage.getItem("currentExp") || "0");
    currentExp += newExp;

    let currentLevel = parseInt(level);

    setPreviousLevel(level);

    // Loop para ajustar níveis enquanto EXP for suficiente
    while (currentExp >= EXP_PER_LEVEL) {
      currentExp -= EXP_PER_LEVEL;
      currentLevel += 1;
    }

    // Atualizar estado e armazenamento local
    setLevel(currentLevel.toString());
    setExp(currentExp);
    localStorage.setItem("userLevel", currentLevel.toString());
    localStorage.setItem("currentExp", currentExp.toString());

    const newDrawResult = {
      date: dayjs().format("DD/MM/YYYY HH:mm:ss"),
      task: selectedTask.label,
      totalDraws: totalPacks,
      wonDraws: wonPacks,
    };

    

    // Atualizar o histórico no localStorage
    updateDrawHistory(newDrawResult);

    setDrawResults({
      task: selectedTask.label,
      packs: totalPacks,
      wonPacks,
    });

    setDisableInput(false);
    setOpenModal(true);
  };

  // Função para atualizar o histórico
  const updateDrawHistory = (newDraw: Omit<Draw, "id">) => {
    const historyKey = "drawHistory";

    // Adiciona um ID único ao novo sorteio
    const newDrawWithId = { ...newDraw, id: Date.now().toString() };

    

    const storedHistory = localStorage.getItem(historyKey);
    const drawHistory: Draw[] = storedHistory ? JSON.parse(storedHistory) : [];

    // Adiciona o novo sorteio ao histórico
    drawHistory.push(newDrawWithId);

    console.log("drawHistory:", drawHistory);

    // Atualiza o localStorage com o histórico recente
    localStorage.setItem(historyKey, JSON.stringify(drawHistory));
  };

  const checkIfThereIsQuantityStored = (taskToCheck: TaskOption | null) => {
    if (!taskToCheck) {
      console.log("Nenhuma tarefa foi selecionada.");
      return;
    }

    const taskKey = taskToCheck.label.toLowerCase().replace(" ", "");
    setActualTask(taskKey);
    const storedQuantity = localStorage.getItem(taskKey);

    if (Number(storedQuantity) > 0) {
      setDisableInput(true);
      setTaskInput({ quantity: Number(storedQuantity) || 0 });
    } else {
      setDisableInput(false);
    }
  };

  const renderTaskInput = () => {
    if (
      selectedTask.label === "Água" ||
      selectedTask.label === "Nutrição" ||
      selectedTask.label === "Sem Álcool" ||
      selectedTask.label === "Controle"
    ) {
      return disableInput ? (
        <div style={{ marginTop: "32px", marginBottom: "16px" }}>
          <Alert variant="outlined" severity="warning">
            Sorteie primeiro o que está abaixo para liberar o campo.
          </Alert>
        </div>
      ) : (
        <TextField
          type="number"
          label={(() => {
            switch (selectedTask.label) {
              case "Água":
                return "Quantidade de copos";
              case "Nutrição":
                return "Vezes que se alimentou";
              case "Sem Álcool":
                return "Vezes que não bebeu";
              default:
                return "Quantidade";
            }
          })()}
          value={taskInput.quantity || ""}
          onChange={(e) => setTaskInput({ quantity: Number(e.target.value) })}
          sx={{ width: "100%", marginBottom: "4px" }}
        />
      );
    }

    if (selectedTask.label === "Exercícios" || selectedTask.label === "Grind") {
      return (
        <TextField
          type="time"
          label="Tempo de execução"
          value={taskInput.time || ""}
          onChange={(e) => setTaskInput({ time: e.target.value })}
          sx={{ width: "100%", marginBottom: "4px" }}
          InputLabelProps={{ shrink: true }}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    checkIfThereIsQuantityStored({ label: actualTask });
  }, [actualTask]);

  const handleCardClick = (taskName: string) => {
    const matchedOption = options.find((option) => option.label === taskName);
    if (matchedOption) {
      setSelectedTask(matchedOption);
      setTaskInput({});
      setDrawResults(null);
      checkIfThereIsQuantityStored(matchedOption);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "96px" }}>
        <LevelCard
          level={level}
          exp={exp}
          onExpChange={(newExp: number) => setExp(newExp)}
        />
      </div>
      <Box sx={{ backgroundColor: "#2D2D2D", padding: "16px",  borderRadius: "0px", marginBottom: "96px" }}>
        <div className="generic-container">
          <TextField
            id="outlined-number"
            label="Level"
            type="number"
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
            sx={{ width: "100%" }}
          />
        </div>
        <div className="generic-container">
          <Autocomplete
            disablePortal
            options={options}
            value={selectedTask}
            onChange={(_, newValue: TaskOption | null) => {
              setSelectedTask(newValue || options[0]);
              setTaskInput({});
              setDrawResults(null);
              checkIfThereIsQuantityStored(newValue);
            }}
            sx={{ width: "100%", marginBottom: "24px", backgroundColor: "-moz-initial"  }}
            renderInput={(params) => <TextField {...params} label="Task" />}
          />
        </div>
      </Box>

      {(selectedTask.label === "Projeto" || selectedTask.label === "Sono") && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <div style={{ marginTop: "24px", marginBottom: "8px" }}>
            <DatePicker
              sx={{ width: "100%" }}
              label="Data da queda"
              value={startDate}
              onChange={handleStartDateChange}
              format="DD/MM/YYYY"
            />
          </div>
        </LocalizationProvider>
      )}
      {selectedTask.label !== "Todas" && renderTaskInput()}

      {selectedTask.label !== "Todas" && (
        <Button
          variant="contained"
          onClick={drawPacks}
          sx={{ width: "100%", marginBottom: "64px", height: "54px", marginTop: "8px", backgroundColor: "#A6E765" }}
        >
          Sortear
        </Button>
      )}
      <div
        className="generic-container"
        style={{
          backgroundColor: "#5A5A5A",
          padding: "12px",
          borderRadius: "0px",
        }}
      >
        {selectedTask.label === "Todas" ? (
          options
            .slice(1)
            .map((option, index) => (
              <TaskCard
                key={index}
                taskName={option.label}
                level={level}
                packs={calculatePacksByTask(option.label, level)}
                onCardClick={handleCardClick}
              />
            ))
        ) : (
          <TaskCard
            taskName={selectedTask.label}
            level={level}
            packs={calculatePacksByTask(selectedTask.label, level)}
            drawResults={drawResults}
            selectedNow={selectedTask.label}
            shouldRemoveAlerts={shouldRemoveAlerts}
            setShouldRemoveAlerts={setShouldRemoveAlerts}
            onCardClick={handleCardClick}
          />
        )}
      </div>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Level Up!</DialogTitle>
        <DialogContent>
          <p>
            Você subiu do nível {previousLevel} para o nível {level}!
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
