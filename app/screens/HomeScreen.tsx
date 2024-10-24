import { Image, StyleSheet, Platform, Button, FlatList, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as SQLite from 'expo-sqlite';

interface Item {
  id: number;
  text: string;
  created_at: string;
}

export default function HomeScreen() {
  const [message, setMessage] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  
  useEffect(() => {
    initDatabase();
    loadItems();
  }, []);

  const initDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('testdb.db');
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (error) {
      setMessage('Erro ao inicializar banco: ' + error);
    }
  };

  const loadItems = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('testdb.db');
      const rows = await db.getAllAsync<Item>('SELECT * FROM items ORDER BY id DESC');
      setItems(rows);
      setMessage('');
    } catch (error) {
      setMessage('Erro ao carregar itens: ' + error);
    }
  };

  const addItem = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('testdb.db');
      const testText = 'Teste ' + new Date().toISOString();
      await db.runAsync(
        'INSERT INTO items (text) VALUES (?)',
        testText
      );
      setMessage('Item inserido com sucesso');
      loadItems();
    } catch (error) {
      setMessage('Erro ao inserir: ' + error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const db = await SQLite.openDatabaseAsync('testdb.db');
      const result = await db.runAsync(
        'DELETE FROM items WHERE id = ?',
        id
      );
      setMessage(`Item ${id} deletado`);
      loadItems();
    } catch (error) {
      setMessage('Erro ao deletar: ' + error);
    }
  };

  const renderHeader = () => (
    <View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Teste SQLite!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Button title="Adicionar Item" onPress={addItem} />
        <ThemedText style={styles.messageText}>{message}</ThemedText>
      </ThemedView>
    </View>
  );

  const renderItem = ({ item }: { item: Item }) => (
    <ThemedView style={styles.itemContainer}>
      <ThemedText>ID: {item.id}</ThemedText>
      <ThemedText>{item.text}</ThemedText>
      <ThemedText style={styles.dateText}>
        {new Date(item.created_at).toLocaleString()}
      </ThemedText>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <ThemedText style={styles.deleteButtonText}>Deletar</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/partial-react-logo.png')}
        style={styles.reactLogo}
      />
      
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A1CEDC',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    paddingTop: 60, // Espaço para o header
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
});