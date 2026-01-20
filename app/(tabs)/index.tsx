import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import ChangeCalculator from '../../components/chageCalculator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ChangeCalculator />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // светъл фон
  },
});
