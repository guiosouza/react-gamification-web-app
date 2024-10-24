import React, { useState } from "react";
import { StyleSheet, View, TextInput, ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";

interface TarefaResultado {
  nome: string;
  nivel: number;
  packs: number;
  expTotal: number;
}

export default function ExpCalculatorScreen() {
  const [nivel, setNivel] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState("Todos");
  const [resultados, setResultados] = useState<TarefaResultado[]>([]);
  const [tempo, setTempo] = useState("");
  const [coposAgua, setCoposAgua] = useState("");

  const calcularEXP = (nivelInput: string, tarefa: string) => {
    const nivelNum = parseInt(nivelInput);
    
    const tarefas = ["The Water", "Exercícios", "Alimentação", "The Grind"];

    if (!nivelInput.trim()) {
      setResultados([]);
      return;
    }

    if (isNaN(nivelNum) || nivelNum < 0) {
      alert("Por favor, digite um nível válido (número inteiro não negativo).");
      return;
    }

    if (tarefa === "Todos") {
      const novosResultados = tarefas.map((t) =>
        calcularResultado(nivelNum, t)
      );
      setResultados(novosResultados);
    } else {
      const resultado = calcularResultado(nivelNum, tarefa);
      setResultados([resultado]);
    }
  };

  const calcularResultado = (nivelNum: number, tarefa: string) => {
    let packs = 1;
    if (tarefa === "The Grind") {
      if (nivelNum < 41) {
        packs = 1;
      } else {
        packs = Math.floor(nivelNum / 41);
      }
    } else if (nivelNum >= 14) {
      packs = 1 * Math.floor(nivelNum / 14);
    }
    if (nivelNum >= 14 && tarefa === "Alimentação") {
      packs = 9 * Math.floor(nivelNum / 14);
    }

    const expTotal = packs * 99998;

    return {
      nome: tarefa,
      nivel: nivelNum,
      packs,
      expTotal,
    };
  };

  const renderInputAdicional = () => {
    if (tarefaSelecionada === "Todos") {
      return null;
    }

    if (tarefaSelecionada === "The Water") {
      return (
        <TextInput
          style={styles.input}
          value={coposAgua}
          onChangeText={setCoposAgua}
          placeholder="Quantidade de copos"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
      );
    }

    return (
      <TextInput
        style={styles.input}
        value={tempo}
        onChangeText={(text) => {
          // Permite apenas o formato 00:00
          if (text.length <= 5) {
            const cleaned = text.replace(/[^0-9:]/g, '');
            if (text.length === 2 && tempo.length === 1) {
              setTempo(cleaned + ':');
            } else {
              setTempo(cleaned);
            }
          }
        }}
        placeholder="Tempo (00:00)"
        placeholderTextColor="#666"
        maxLength={5}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Calculadora de EXP</ThemedText>
        <TextInput
          style={styles.input}
          value={nivel}
          onChangeText={(text) => {
            setNivel(text);
            calcularEXP(text, tarefaSelecionada);
          }}
          placeholder="Digite seu nível"
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <Picker
          selectedValue={tarefaSelecionada}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setTarefaSelecionada(itemValue);
            setTempo("");
            setCoposAgua("");
            calcularEXP(nivel, itemValue);
          }}
        >
          <Picker.Item label="Todos" value="Todos" />
          <Picker.Item label="The Water" value="The Water" />
          <Picker.Item label="Exercícios" value="Exercícios" />
          <Picker.Item label="Alimentação" value="Alimentação" />
          <Picker.Item label="The Grind" value="The Grind" />
        </Picker>

        {renderInputAdicional()}
      </View>

      <ScrollView style={styles.resultadosContainer}>
        {resultados.map((resultado, index) => (
          <ThemedView key={index} style={styles.tarefaCard}>
            <ThemedText style={styles.tarefaNome}>{resultado.nome}</ThemedText>
            <ThemedText>Nível: {resultado.nivel}</ThemedText>
            <ThemedText>
              Número de packs para sortear: {resultado.packs}
            </ThemedText>
            <ThemedText>
              EXP total a ser sorteada: {resultado.expTotal.toLocaleString()}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  picker: {
    height: 50,
    marginVertical: 20,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  resultadosContainer: {
    flex: 1,
  },
  tarefaCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  tarefaNome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});