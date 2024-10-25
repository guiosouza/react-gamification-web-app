// /app/screens/[name].tsx
import { useLocalSearchParams } from 'expo-router';
import ProgressScreen from './ProgressScreen';
import ExpCalculator from './ExpCalculator';

export default function Screen() {
  const { name } = useLocalSearchParams();
  
  switch (name) {
    case 'ExpCalculator':
      return <ExpCalculator />;
    case 'ProgressScreen':
      return <ProgressScreen />;
    default:
      return null;
  }
}