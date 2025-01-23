import { Typography } from "@mui/material";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { motion } from "framer-motion";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import TimerIcon from "@mui/icons-material/Timer";

interface TopItensProps {
  lives: number;
  isHeartAnimating: boolean;
  isDropAnimating: boolean;
  isTimerAnimating: boolean;
  drops: number;
  timeValueInSeconds: number;
  timers: number;
}

function HeaderItensRuns({
  lives,
  isHeartAnimating,
  isDropAnimating,
  drops,
  timeValueInSeconds,
  timers,
  isTimerAnimating,
}: TopItensProps) {
  return (
    <div
      className="generic-container"
      style={{ display: "flex", justifyContent: "space-evenly" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {lives}
        </Typography>
        <motion.div
          animate={isHeartAnimating ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <FavoriteIcon color="error" />
        </motion.div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {drops}
        </Typography>
        <motion.div
          animate={isDropAnimating ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <WaterDropIcon sx={{ color: "#90CAF9" }} />
        </motion.div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexDirection: "column",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {timers} {"(" + timeValueInSeconds + "s)"}
        </Typography>
        <motion.div
          animate={isTimerAnimating ? { scale: [1, 1.5, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <TimerIcon />
        </motion.div>
      </div>
    </div>
  );
}

export default HeaderItensRuns;
