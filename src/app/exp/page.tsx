"use client";

import { useState } from "react";
import TaskCard from "@/components/task-card";
import { Autocomplete, TextField } from "@mui/material";

interface TaskOption {
  label: string;
}

interface TaskInfo {
  task: string;
  packs: number;
}

const options: TaskOption[] = [
  { label: "Todas" },
  { label: "The Grind" },
  { label: "The Water" },
  { label: "The Exercise" },
  { label: "The Nutrition" },
];

export default function Exp() {
  const [level, setLevel] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<TaskOption>(options[0]);

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

  const calculateAllPacks = (level: string): TaskInfo[] => {
    if (!level) return [];

    return options.slice(1).map((option) => ({
      task: option.label,
      packs: calculatePacksByTask(option.label, level),
    }));
  };

  return (
    <>
      <div className="task-selector">
        <TextField
          id="outlined-number"
          label="Level"
          type="number"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          sx={{ width: "100%" }}
        />
      </div>
      <div className="task-selector">
        <Autocomplete
          disablePortal
          options={options}
          value={selectedTask}
          onChange={(_, newValue: TaskOption | null) =>
            setSelectedTask(newValue || options[0])
          }
          sx={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Task" />}
        />
      </div>

      <div className="task-selector">
        {selectedTask.label === "Todas" ? (
          calculateAllPacks(level).map((taskInfo, index) => (
            <TaskCard
              key={index}
              taskName={taskInfo.task}
              level={level}
              packs={taskInfo.packs}
            />
          ))
        ) : (
          <TaskCard
            taskName={selectedTask.label}
            level={level}
            packs={calculatePacksByTask(selectedTask.label, level)}
          />
        )}
      </div>
    </>
  );
}
