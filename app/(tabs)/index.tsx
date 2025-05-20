// app/(tabs)/index.tsx
import { View, Text, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { User } from '@supabase/supabase-js';
import { router } from 'expo-router';


export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
      setLoadingUser(false);
    };
    getUser();
  }, []);

  if (loadingUser) {
    return (
      <View className="w-full h-full items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="w-full h-full items-center justify-center">
        <Text className="text-lg font-bold text-white mb-4">No has iniciado sesión</Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          className="bg-blue-500 px-6 py-3 rounded"
        >
          <Text className="text-white">Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center space-y-6 bg-black">
      <Text className="text-2xl text-white font-bold mb-6">Pantalla de Prueba</Text>

      <TouchableOpacity
        onPress={() => router.push('/home')}
        className="bg-green-500 px-6 py-3 rounded"
      >
        <Text className="text-white text-lg">Ir a Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('../../AdminUsers')}
        className="bg-purple-500 px-6 py-3 rounded"
      >
        <Text className="text-white text-lg">Ir a Admin</Text>
      </TouchableOpacity>

      {/* Botón de Redirigir por Rol */}
      <TouchableOpacity
        onPress={() => router.push('/redigir')}
        className="bg-yellow-500 px-6 py-3 rounded">
        <Text className="text-white text-lg">Ir a mi herramienta</Text>
      </TouchableOpacity>
      
    </View>
  );
}
