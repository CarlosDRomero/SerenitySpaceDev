// app/redigir.tsx
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { useRolPrincipal } from '@/hooks/useRolPrincipal';

export default function RedigirScreen() {
  const { rolPrincipal, cargando } = useRolPrincipal();

  useEffect(() => {
    if (!cargando) {
      if (!rolPrincipal) {
        router.replace('/(auth)/login');
      } else {
        router.replace(`/roles/${rolPrincipal}/home` as any);
      }
    }
  }, [rolPrincipal, cargando]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="text-white mt-4">Redirigiendo a tu vista personalizada...</Text>
    </View>
  );
}
