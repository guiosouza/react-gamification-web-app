// /app/screens/[name].tsx
import { useLocalSearchParams } from 'expo-router';
import ProgressScreen from './ProgressScreen';
import HomeScreen from './HomeScreen';

export default function Screen() {
  const { name } = useLocalSearchParams();
  
  switch (name) {
    case 'HomeScreen':
      return <HomeScreen />;
    case 'ProgressScreen':
      return <ProgressScreen />;
    default:
      return null;
  }
}