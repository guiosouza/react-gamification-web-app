import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface CircularProgressWithLabelProps extends CircularProgressProps {
  countdownSeconds: number; // Tempo total do contador
  onComplete: () => void; // Função chamada ao finalizar o contador
  isExerciseStarted: boolean
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  countdownSeconds,
  onComplete,
  isExerciseStarted,
  ...props
}) => {
  const [secondsLeft, setSecondsLeft] = React.useState(countdownSeconds);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (secondsLeft > 0 && isExerciseStarted) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
        setProgress((prev) => prev + 100 / countdownSeconds);
      }, 1000);
      return () => clearInterval(interval);
    } else if (secondsLeft === 0) {
      onComplete(); // Só chama quando `secondsLeft` é exatamente 0
    }
  }, [secondsLeft, countdownSeconds, onComplete, isExerciseStarted]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" value={progress} {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {secondsLeft > 0 ? `${secondsLeft} (s)` : "0 (s)"}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel;
