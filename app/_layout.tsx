import 'react-native-gesture-handler';
import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
    useFrameworkReady();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
        </GestureHandlerRootView>
    );
}
