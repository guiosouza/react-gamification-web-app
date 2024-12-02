"use client";
import {
  Autocomplete,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

interface ExerciseOption {
  label: string;
}

const style = {
  marginTop: 4,
  marginBottom: 4,
};

function Exercises() {
  const exerciseOptions: ExerciseOption[] = [
    { label: "Flexão" },
    { label: "Barra" },
    { label: "Abdominal" },
    { label: "Agachamento" },
    { label: "Agachamento (1 perna)" },
    { label: "Bícepes" },
    { label: "Trícepes" },
    { label: "Ombro" },
    { label: "Costas" },
    { label: "Antebraço" },
    { label: "Nádegas" },
  ];

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseOption | null>(exerciseOptions[0]);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("month")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSelectedExerciseChange = (
    _: React.SyntheticEvent,
    value: ExerciseOption | null
  ) => {
    setSelectedExercise(value);
    console.log("Selected Exercise:", value);
  };

  const onStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
  };

  const onEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsLogged(true);
      else setIsLogged(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
    //   localStorage.setItem("email", email);
    //   localStorage.setItem("password", password);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Usuário autenticado:", userCredential.user);
      setIsLogged(true);
    } catch (error) {
      console.error("Error saving login data", error);
      alert("E-mail ou senha incorretos.");
    }
  };

  const logout = async () => {
    try {
    //   localStorage.removeItem("email");
    //   localStorage.removeItem("password");

      await signOut(auth);

      setIsLogged(false);
      console.log("Usuário deslogado.");
    } catch (error) {
      console.error("Error on logout", error);
      alert("Erro ao deslogar.");
    }
  };

  return (
    <div>
      {isLogged ? (
        <>
          <div className="generic-container">
            <Button variant="outlined" onClick={logout} sx={{ width: "100%" }}>
              DESLOGAR
            </Button>
          </div>
          <div className="generic-container">
            <Typography gutterBottom variant="h5" component="div">
              Escolha o exercício
            </Typography>
          </div>

          <div className="generic-container">
            <Autocomplete
              disablePortal
              options={exerciseOptions}
              value={selectedExercise}
              onChange={onSelectedExerciseChange}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} label="Exercises" />
              )}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-number"
              label="Peso"
              type="number"
              value={0}
              onChange={() => {}}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-number"
              label="Quantas falhou ou usou negativa"
              type="number"
              value={0}
              onChange={() => {}}
              sx={{ width: "100%" }}
            />
          </div>
          <Button
            variant="contained"
            onClick={() => {}}
            sx={{ width: "100%", marginY: 2 }}
          >
            Enviar
          </Button>
          <Divider sx={style}>RECORDES</Divider>
          <p>Para ver os 3 últimos recordes, selecione o período.</p>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <div className="generic-container">
              <DatePicker
                sx={{ width: "100%" }}
                label="Data inicial"
                value={startDate}
                onChange={onStartDateChange}
                format="DD/MM/YYYY"
              />
            </div>
            <div className="generic-container">
              <DatePicker
                sx={{ width: "100%" }}
                label="Data final"
                value={endDate}
                onChange={onEndDateChange}
                format="DD/MM/YYYY"
              />
            </div>
          </LocalizationProvider>

          {selectedExercise && startDate && endDate && (
            <Card sx={{ marginBottom: 2, marginTop: 4 }}>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {selectedExercise.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="generic-container">
            <Typography gutterBottom variant="h5" component="div">
              Logar
            </Typography>
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-email-input"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="generic-container">
            <TextField
              id="outlined-password-input"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ width: "100%" }}
            />
          </div>
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{ width: "100%", marginY: 2 }}
          >
            Logar
          </Button>
        </>
      )}
    </div>
  );
}

export default Exercises;
