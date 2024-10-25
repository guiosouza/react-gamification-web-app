import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  const router = useRouter();

  const navigateToScreen = (screenName: string) => {
    router.push(`/screens/${screenName}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Roger that</ThemedText>
          <HelloWave />
        </ThemedView>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('ExpCalculator')}
        >
          <ThemedView style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>EXP Calculator</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Calcule a EXP
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('ProgressScreen')}
        >
          <ThemedView style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Evolução</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Acompanhe seu progresso
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 200,
    backgroundColor: '#000', 
    justifyContent: 'flex-end',
    padding: 16,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    zIndex: 1,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  cardsContainer: {
    gap: 16,
    padding: 16,
  },

  card: {
    borderRadius: 0,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  cardContent: {
    padding: 16,
    borderRadius: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});