"use client";
import {
  AreaChart,
  Area,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged, database } from "../../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import {
  Alert,
  Button,
  Card,
  TextField,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { TooltipProps } from "recharts";

const colors = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ff7300", // Orange
  "#ffc658", // Yellow
  "#ff0000", // Red
  "#00aaff", // Blue
  "#ff6347", // Tomato
  "#32cd32", // Lime Green
  "#ff1493", // Deep Pink
  "#8a2be2", // Blue Violet
  "#a52a2a", // Brown
  "#7fff00", // Chartreuse
  "#d2691e", // Chocolate
  "#c71585", // Medium Violet Red
  "#20b2aa", // Light Sea Green
  "#dda0dd", // Plum
  "#ff4500", // Orange Red
  "#6a5acd", // Slate Blue
  "#90ee90", // Light Green
  "#ffb6c1", // Light Pink
];

interface ExerciseHistory {
  date: string;
  totalWeightLifted: number;
}

interface Exercise {
  title: string;
  history: ExerciseHistory[];
}

function Evolutions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs("2024-12-01"));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [exerciseData, setExerciseData] = useState<Exercise[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      if (user) fetchExerciseData(user.uid); // Fetch data on login
      setIsLoading(false); // Set loading to false after auth state change
    });
    return () => unsubscribe();
  }, []);

  const fetchExerciseData = async (userId: string) => {
    try {
      setIsLoading(true); // Set loading to true while fetching data
      const userRef = ref(database, `users/${userId}/data`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const rawData = snapshot.val();
        setExerciseData(rawData);
      } else {
        console.log("No data available");
        setExerciseData([]);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false); // Set loading to false after data fetch
    }
  };

  const filterDataByDate = (history: ExerciseHistory[]) => {
    if (!startDate || !endDate) return history;

    const start = startDate.startOf("day").valueOf();
    const end = endDate.endOf("day").valueOf();

    return history.filter((item) => {
      const itemDate = dayjs(item.date, "DD/MM/YYYY - HH:mm").valueOf();
      return itemDate >= start && itemDate <= end;
    });
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true); // Set loading to true while logging in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in", error);
      alert("E-mail or password incorrect.");
    } finally {
      setIsLoading(false); // Set loading to false after login attempt
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out", error);
      alert("Error logging out.");
    }
  };

  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const { date, totalWeight } = payload[0].payload as {
        date: string;
        totalWeight: number;
      };
      return (
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            color: "black",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "5px",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>{date}</p>
          <p style={{ margin: 0 }}>{`${totalWeight} kg no total`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Backdrop
        open={true}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isLoggedIn) {
    return (
      <div>
        <h4>Por favor, faça login para ver os dados.</h4>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ width: "100%", mb: 2 }}
        />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ width: "100%", mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          sx={{ width: "100%" }}
        >
          Logar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="generic-container">
        <Button variant="outlined" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <div className="generic-container">
          <DatePicker
            sx={{ width: "100%" }}
            label="Data inicial"
            value={startDate}
            onChange={(date) => setStartDate(date)}
            format="DD/MM/YYYY"
          />
        </div>
        <div className="generic-container">
          <DatePicker
            sx={{ width: "100%" }}
            label="Data final"
            value={endDate}
            onChange={(date) => setEndDate(date)}
            format="DD/MM/YYYY"
          />
        </div>
      </LocalizationProvider>

      {exerciseData.map((exercise, index) => {
        const filteredHistory = filterDataByDate(exercise.history);
        const color = colors[index % colors.length];
        return (
          <Card key={index} sx={{ mb: 2, p: 2, mt: 2 }}>
            <h4>
              {exercise.title
                .split(" ")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </h4>

            {filteredHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={filteredHistory
                    .sort(
                      (a, b) =>
                        dayjs(a.date, "DD/MM/YYYY - HH:mm").valueOf() -
                        dayjs(b.date, "DD/MM/YYYY - HH:mm").valueOf()
                    )
                    .map((item) => ({
                      date: item.date,
                      totalWeight: item.totalWeightLifted,
                    }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis />
                  <Tooltip content={CustomTooltip} />
                  <Area
                    type="monotone"
                    dataKey="totalWeight"
                    stroke={color} // Aplique a cor no gráfico
                    fill={color} // Aplique a cor no gráfico
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Alert color="info" variant="outlined">
                Sem dados nesse período
              </Alert>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default Evolutions;
