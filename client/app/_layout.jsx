import { Stack } from "expo-router";
import DataContextProvider  from './DataContextProvider';

export default function RootLayout() {
  return (
      <DataContextProvider>
      <Stack
        screenOptions={{ headerShown: false, }}>
        <Stack.Screen name="index" />
      </Stack>
    </DataContextProvider>

  )
}
