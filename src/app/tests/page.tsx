"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Grid2 } from "@mui/material";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { TextField, Backdrop, CircularProgress } from "@mui/material";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "@/lib/firebase"; // Certifique-se de exportar `database` do arquivo de configuração do Firebase.
import Link from "next/link";

// Definindo a interface para as props do Bar
interface BarProps {
  filled?: boolean;
}

// Modificando a definição do Bar para usar a interface
const Bar = styled("div")<BarProps>(({ filled }) => ({
  width: "20px",
  height: "22px",
  margin: "0 2px",
  backgroundColor: filled ? "#784af4" : "#e0e0e0",
  borderRadius: "2px",
  transition: "background-color 0.3s ease",
}));

// Container das barras
const BarsContainer = styled("div")({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  height: "50px", // Define a altura total do componente
});

function ProgressSignal({ totalBars = 8, filledBars = 2 }) {
  return (
    <Box>
      <BarsContainer>
        {Array.from({ length: totalBars }, (_, index) => (
          <Bar key={index} filled={index < filledBars} />
        ))}
      </BarsContainer>
    </Box>
  );
}

interface Exercise {
  title: string;
  exerciseImage?: string;
  tests: { completed: boolean }[];
}

export default function Tests() {
  const [isLogged, setIsLogged] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [exercises, setExercises] = React.useState<Exercise[]>([]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user && setIsLogged(true);
    } catch (error) {
      console.error("Error saving login data", error);
      alert("E-mail ou senha incorretos.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsLogged(false);
    } catch (error) {
      console.error("Error on logout", error);
      alert("Erro ao deslogar.");
    }
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLogged(true);
        await fetchExercises(user.uid);
        setIsLoading(false);
      } else {
        setIsLogged(false);
        setExercises([]);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchExercises = async (userId: string) => {
    setIsLoading(true);
    try {
      const userRef = ref(database, `users/${userId}/exercisesTests`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setExercises(data);
      } else {
        console.warn("No data found!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div>
      {isLogged ? (
        <>
          <div className="generic-container">
            <Button variant="outlined" onClick={logout} sx={{ width: "100%" }}>
              DESLOGAR
            </Button>
          </div>
          <Grid2 container spacing={2} mt={6}>
            {exercises.map((exercise, index) => {
              const totalBars = exercise.tests.length;
              const filledBars = exercise.tests.filter(
                (test) => test.completed
              ).length;
              return (
                <Grid2 size={6} key={index}>
                  <Card>
                    <CardMedia
                      sx={{ padding: 2 }}
                      component="img"
                      alt={exercise.title}
                      height="160"
                      image={
                        exercise.exerciseImage || "/images/placeholder.jpg"
                      }
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {exercise.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {`Pregresso de testes: ${filledBars}/${totalBars}`}
                      </Typography>
                      <ProgressSignal
                        totalBars={totalBars}
                        filledBars={filledBars}
                      />
                    </CardContent>
                    <CardActions>
                      <Link
                        href={`/tests/${index}`}
                      >
                        <Button size="small">Ver</Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>
        </>
      ) : (
        <>
          <div className="generic-container">
            <h4>Por favor, faça login para ver os dados.</h4>
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
