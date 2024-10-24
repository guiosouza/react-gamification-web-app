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
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Bem-vindo!</ThemedText>
          <HelloWave />
        </ThemedView>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('HomeScreen')}
        >
          <ThemedView style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Home Screen</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Acesse a tela principal do aplicativo
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigateToScreen('ProgressScreen')}
        >
          <ThemedView style={styles.cardContent}>
            <ThemedText style={styles.cardTitle}>Progress Screen</ThemedText>
            <ThemedText style={styles.cardDescription}>
              Acompanhe seu progresso e estatísticas
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
    backgroundColor: '#A1CEDC', // Você pode ajustar isso baseado no seu tema
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
    borderRadius: 12,
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
    borderRadius: 12,
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