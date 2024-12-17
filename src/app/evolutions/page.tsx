"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { auth, onAuthStateChanged } from "../../lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Button, TextField } from "@mui/material";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

function Evolutions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error logging in", error);
      alert("E-mail or password incorrect.");
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

  if (!isLoggedIn) {
    return (
      <div>
        <h4>Por favor, faça login para ver os dados.</h4>
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
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ width: "100%" }}
          />
        </div>
        <Button
          sx={{ mt: 2, width: "100%" }}
          variant="contained"
          onClick={handleLogin}
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
      <h4>A demo of synchronized AreaCharts</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
      <p>Maybe some other content</p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          width={500}
          height={200}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="pv" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Evolutions;
