import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MarkerProvider } from '../contexts/MarkerContext';

export default function RootLayout() {
  return (
    <MarkerProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Карта' }} />
        <Stack.Screen name="marker/[id]" options={{ headerShown: true, title: 'Информация о маркере' }} />
      </Stack>
      <StatusBar style="dark" />
    </MarkerProvider>
  );
}
