import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const startDate = new Date("2024-10-06T00:00:00");
const endDate = new Date("2025-02-06T00:00:00");

// Lista de marcos (dias após a data inicial)
const milestones = [7, 12, 19, 25, 32, 70, 90, 121]; // Em dias

const ProgressScreen: React.FC = () => {
  const [progress, setProgress] = useState<number>(0);
  const [daysElapsed, setDaysElapsed] = useState<number>(0);

  useEffect(() => {
    const updateProgress = () => {
      const currentDate = new Date();
      const totalTime = endDate.getTime() - startDate.getTime();
      const timeElapsed = currentDate.getTime() - startDate.getTime();
      const progressPercentage = Math.min(
        Math.max((timeElapsed / totalTime) * 100, 0),
        100
      );

      // Calcular o número de dias passados
      const days = Math.floor(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      setProgress(progressPercentage);
      setDaysElapsed(days);
    };

    // Atualizar a cada segundo
    const interval = setInterval(updateProgress, 60);

    // Limpar intervalo ao desmontar o componente
    return () => clearInterval(interval);
  }, []);

  // Função para renderizar o Stepper em formato vertical
  const renderStepper = () => {
    return (
      <View style={styles.stepperContainer}>
        {milestones.map((milestone, index) => {
          const isCompleted = daysElapsed >= milestone; // Verifica se o marco foi atingido
          return (
            <View key={index} style={styles.step}>
              <View
                style={[
                  styles.circle,
                  isCompleted ? styles.completed : styles.pending,
                ]}
              >
                {isCompleted && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.stepLabel}>Day {milestone}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Grind</Text>

      {/* Stepper vertical */}
      {renderStepper()}

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={["#4CAF50", "#4CAF50", "#4CAF50"]}
          start={[0, 0]}
          end={[1, 0]}
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>

      <Text style={styles.progressText}>{progress.toFixed(8)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "#fff",
  },
  progressContainer: {
    width: "80%",
    height: 30,
    backgroundColor: "#e0e0e0",
    borderRadius: 0,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },

  // Estilos para o Stepper (agora em formato vertical)
  stepperContainer: {
    flexDirection: "column", // Alinhamento vertical
    alignItems: "flex-start", // Centralizar os itens horizontalmente
    marginBottom: 20,
  },
  step: {
    flexDirection: "row", // Alinhar os círculos e textos horizontalmente
    alignItems: "center", // Alinhar os itens no centro verticalmente
    marginBottom: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10, // Espaçamento entre o círculo e o texto
  },
  completed: {
    backgroundColor: "#56ab2f",
  },
  pending: {
    backgroundColor: "#e0e0e0",
  },
  checkmark: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 16,
    color: "#fff",
  },
});

export default ProgressScreen;
