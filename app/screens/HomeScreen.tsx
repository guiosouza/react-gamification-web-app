import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {Picker} from '@react-native-picker/picker';


interface TarefaResultado {
  nome: string;
  nivel: number;
  packs: number;
  expTotal: number;
}

export default function ExpCalculatorScreen() {
  const [nivel, setNivel] = useState('');
  const [tarefaSelecionada, setTarefaSelecionada] = useState('The Water');
  const [resultados, setResultados] = useState<TarefaResultado[]>([]);
  
  const calcularEXP = (nivelInput: string, tarefa: string) => {
    const nivelNum = parseInt(nivelInput);
    const expPorPack = 99998;
    
    if (!nivelInput.trim()) {
      setResultados([]);
      return;
    }

    if (isNaN(nivelNum) || nivelNum < 0) {
      alert("Por favor, digite um nível válido (número inteiro não negativo).");
      return;
    }

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

    const expTotal = packs * expPorPack;

    const resultado = {
      nome: tarefa,
      nivel: nivelNum,
      packs,
      expTotal,
    };

    setResultados([resultado]);
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

        {/* Picker para selecionar a tarefa */}
        <Picker
          selectedValue={tarefaSelecionada}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setTarefaSelecionada(itemValue);
            calcularEXP(nivel, itemValue);  // Recalcular com a tarefa selecionada
          }}
        >
          <Picker.Item label="The Water" value="The Water" />
          <Picker.Item label="Exercícios" value="Exercícios" />
          <Picker.Item label="Alimentação" value="Alimentação" />
          <Picker.Item label="The Grind" value="The Grind" />
        </Picker>
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
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tarefaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
