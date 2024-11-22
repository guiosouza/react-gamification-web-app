"use client";

import { useEffect, useState } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import TaskCard from "@/components/task-card";

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
  { label: "The Grind" },
  { label: "The Water" },
  { label: "The Exercise" },
  { label: "The Nutrition" },
];

export default function Exp() {
  const [selectedTask, setSelectedTask] = useState<TaskOption>(options[0]);
  const [taskInput, setTaskInput] = useState<TaskInput>({});
  const [drawResults, setDrawResults] = useState<TaskInfo | null>(null);
  const [level, setLevel] = useState<string>("");

  useEffect(() => {
    const savedLevel = localStorage.getItem("userLevel");
    if (savedLevel) {
      setLevel(savedLevel);
    }
  }, []);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    localStorage.setItem("userLevel", newLevel);
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
      default:
        return 0;
    }
  };

  const calculateTotalPacks = (): number => {
    const basePacks = calculatePacksByTask(selectedTask.label, level);

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

  const drawPacks = () => {
    const totalPacks = calculateTotalPacks();
    let wonPacks = 0;

    for (let i = 0; i < totalPacks; i++) {
      if (Math.random() < 0.5) {
        // 50% chance
        wonPacks++;
      }
    }

    setDrawResults({
      task: selectedTask.label,
      packs: totalPacks,
      wonPacks,
    });
  };

  const renderTaskInput = () => {
    if (
      selectedTask.label === "The Water" ||
      selectedTask.label === "The Nutrition"
    ) {
      return (
        <TextField
          type="number"
          label={
            selectedTask.label === "The Water"
              ? "Quantidade de copos"
              : "Vezes que se alimentou"
          }
          value={taskInput.quantity || ""}
          onChange={(e) => setTaskInput({ quantity: Number(e.target.value) })}
          sx={{ width: "100%", marginY: 2 }}
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
          sx={{ width: "100%", marginY: 2 }}
          InputLabelProps={{ shrink: true }}
        />
      );
    }

    return null;
  };

  return (
    <>
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
          }}
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Task" />}
        />
      </div>

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
          />
        )}
      </div>
    </>
  );
}
