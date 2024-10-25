import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface TarefaResultado {
  nome: string;
  nivel: number;
  packs: number;
  expTotal: number;
}

export default function ExpCalculator() {
  const [nivel, setNivel] = useState("");
  const [tarefaSelecionada, setTarefaSelecionada] = useState("Todos");
  const [resultados, setResultados] = useState<TarefaResultado[]>([]);
  const [tempo, setTempo] = useState("");
  const [coposAgua, setCoposAgua] = useState("");
  const [alimentacao, setAlimentacao] = useState("")
  const [sorteioRealizado, setSorteioRealizado] = useState(false);
  const [resultadoSorteio, setResultadoSorteio] = useState<{
    totalGanhadores: number;
    numerosGanhadores: number[];
  }>({ totalGanhadores: 0, numerosGanhadores: [] });

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

  const calcularPacksRealizados = (resultado: TarefaResultado) => {
    if (tarefaSelecionada === "The Water") {
      const coposNum = parseInt(coposAgua) || 0;
      return coposNum * resultado.packs;
    } else if(tarefaSelecionada === "Alimentação") {
      const alimentacaoNum = parseInt(alimentacao) || 0;
      return alimentacaoNum * resultado.packs;
    }
    else {
      const [horas, minutos] = tempo.split(":").map(Number);
      const totalMinutos = (horas || 0) * 60 + (minutos || 0);
      const packsTempo = Math.floor(totalMinutos / 10); // Divide o tempo em "packs" de 10 minutos
      return packsTempo * resultado.packs;
    }
  };

  const realizarSorteioFunc = (quantidade: number) => {
    const numerosSorteados: number[] = [];
    let ganhadores: number[] = [];

    for (let i = 0; i < quantidade; i++) {
      const numeroSorteado = Math.floor(Math.random() * 100) + 1; // Sorteia entre 1 e 100
      numerosSorteados.push(numeroSorteado);
      if (numeroSorteado >= 1 && numeroSorteado <= 50) {
        ganhadores.push(numeroSorteado); // Os ganhadores estão entre 1 e 50
      }
    }

    return {
      totalGanhadores: ganhadores.length,
      numerosGanhadores: numerosSorteados,
    };
  };

  const handleSorteio = () => {
    const packsTotal = resultados.reduce(
      (acc, resultado) => acc + calcularPacksRealizados(resultado),
      0
    );
    const sorteio = realizarSorteioFunc(packsTotal);
    setResultadoSorteio(sorteio);
    setSorteioRealizado(true);
  };

  const renderNumerosSorteio = () => {
    return (
      <View style={styles.numerosContainer}>
        {resultadoSorteio.numerosGanhadores.map((numero, index) => {
          const isGanhador = numero >= 1 && numero <= 50;
          return (
            <View
              key={index}
              style={[
                styles.bolinha,
                isGanhador ? styles.verde : styles.vermelho,
              ]}
            >
              <Text style={styles.numeroTexto}>{numero}</Text>
            </View>
          );
        })}
      </View>
    );
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

    if (tarefaSelecionada === "Alimentação") {
      return (
        <TextInput
          style={styles.input}
          value={alimentacao}
          onChangeText={setAlimentacao}
          placeholder="Alimentação"
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
          if (text.length <= 5) {
            const cleaned = text.replace(/[^0-9:]/g, "");
            if (text.length === 2 && tempo.length === 1) {
              setTempo(cleaned + ":");
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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

          {/* Botão para realizar o sorteio */}
          <TouchableOpacity onPress={handleSorteio} style={styles.botaoSorteio}>
            <Text style={styles.textoBotao}>SORTEAR EXP</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.resultadosContainer}>
          {resultados.map((resultado, index) => {
            const packsRealizados = calcularPacksRealizados(resultado);

            return (
              <ThemedView key={index} style={styles.tarefaCard}>
                <ThemedText style={styles.tarefaNome}>
                  {resultado.nome}
                </ThemedText>
                <ThemedText>Nível: {resultado.nivel}</ThemedText>
                <ThemedText>Packs por execução: {resultado.packs}</ThemedText>
                <ThemedText>
                  EXP total a ser sorteada:{" "}
                  {resultado.expTotal.toLocaleString()}
                </ThemedText>
                <ThemedText>
                  Packs pelo que realizou: {packsRealizados}
                </ThemedText>
              </ThemedView>
            );
          })}

          {/* Mostrar o resultado do sorteio apenas após a realização */}
          {sorteioRealizado && (
            <View>
              <ThemedText>
                Ganhadores: {resultadoSorteio.totalGanhadores}
              </ThemedText>
              {renderNumerosSorteio()}
            </View>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  botaoSorteio: {
    backgroundColor: "#4CAF50", 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    alignItems: "center", 
    justifyContent: "center",
    marginVertical: 10, 
    fontWeight: "bold",
    height: 60
  },
  textoBotao: {
    color: "#FFFFFF", 
    fontSize: 16,
    fontWeight: "bold",
  },
  
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
    height: 60,
    borderWidth: 1,
    color: "#fff",
    borderColor: "#ccc",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#000",
    marginVertical: 8,
  },
  picker: {
    height: 50,
    color: "#000",
    marginVertical: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
  },
  tarefaCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#000", // Fundo branco nos cards
    borderColor: "#ffff", // Borda leve para os cards
    borderWidth: 1,
  },
  tarefaNome: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 700,
    color: "#fff", // Texto escuro nos títulos das tarefas
  },
  resultadosContainer: {
    marginTop: 20,
  },
  numerosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  bolinha: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  verde: {
    backgroundColor: "green",
  },
  vermelho: {
    backgroundColor: "red",
  },
  numeroTexto: {
    color: "white",
    fontWeight: "bold",
  },
});
