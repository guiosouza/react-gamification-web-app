"use client";

import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button, Alert } from "@mui/material";
import TaskCard from "@/components/task-card";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import LevelCard from "@/components/level-card";

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

const options: TaskOption[] = [
  { label: "Todas" },
  { label: "Dias de NF" },
  { label: "Sono" },
  // { label: "The Grind" },
  { label: "The Water" },
  { label: "The Exercise" },
  { label: "The Nutrition" },
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

    const baseMultiplier = Math.floor(levelNumber / 14);

    switch (taskName) {
      case "The Grind":
        return Math.floor(levelNumber / 40);
      case "The Nutrition":
        return baseMultiplier * 9;
      case "The Exercise":
        return baseMultiplier;
      case "The Water":
        return baseMultiplier;
      case "Dias de NF": {
        const daysPassed = calculateDaysSinceStart(startDate);
        return daysPassed * 782;
      }
      case "Sono": {
        const daysPassed = calculateDaysSinceStart(startDate);
        return daysPassed * 782;
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

    if (selectedTask.label === "Dias de NF") {
      return basePacks;
    }

    if (selectedTask.label === "Sono") {
      return basePacks;
    }

    if (
      selectedTask.label === "The Water" ||
      selectedTask.label === "The Nutrition"
    ) {
      return basePacks * (taskInput.quantity || 0);
    }

    if (
      selectedTask.label === "The Exercise" ||
      selectedTask.label === "The Grind"
    ) {
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

    setDrawResults({
      task: selectedTask.label,
      packs: totalPacks,
      wonPacks,
    });

    setDisableInput(false);
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
      selectedTask.label === "The Water" ||
      selectedTask.label === "The Nutrition"
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
          label={
            selectedTask.label === "The Water"
              ? "Quantidade de copos"
              : "Vezes que se alimentou"
          }
          value={taskInput.quantity || ""}
          onChange={(e) => setTaskInput({ quantity: Number(e.target.value) })}
          sx={{ width: "100%", marginTop: "24px", marginBottom: "24px" }}
        />
      );
    }

    if (
      selectedTask.label === "The Exercise" ||
      selectedTask.label === "The Grind"
    ) {
      return (
        <TextField
          type="time"
          label="Tempo de execução"
          value={taskInput.time || ""}
          onChange={(e) => setTaskInput({ time: e.target.value })}
          sx={{ width: "100%", marginTop: "24px", marginBottom: "24px" }}
          InputLabelProps={{ shrink: true }}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    checkIfThereIsQuantityStored({ label: actualTask });
  }, [actualTask]);

  return (
    <>
      <div style={{ marginBottom: "96px" }}>
        <LevelCard
          level={level}
          exp={exp}
          onExpChange={(newExp: number) => setExp(newExp)}
        />
      </div>
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
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Task" />}
        />
      </div>

      {(selectedTask.label === "Dias de NF" ||
        selectedTask.label === "Sono") && (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
          <div style={{ marginTop: "24px", marginBottom: "24px" }}>
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
          sx={{ width: "100%", marginY: 2 }}
        >
          Sortear
        </Button>
      )}
      <div className="generic-container">
        {selectedTask.label === "Todas" ? (
          options
            .slice(1)
            .map((option, index) => (
              <TaskCard
                key={index}
                taskName={option.label}
                level={level}
                packs={calculatePacksByTask(option.label, level)}
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
          />
        )}
      </div>
    </>
  );
}
