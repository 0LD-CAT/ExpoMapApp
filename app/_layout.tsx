import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, title: 'Карта' }} />
            <Stack.Screen name="marker/[id]" options={{ headerShown: true, title: 'Информация о маркере' }} />
        </Stack>
        <StatusBar style="dark" />
    </>
  );
}
