// /app/RedSocial/index.tsx
import { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';

export default function RedSocialIndex() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = async () => {
      const { data: userData, error } = await supabase.auth.getUser();
      if (!error && userData.user) {
        setUser(userData.user);
      }
      setLoading(false);
    };
    cargarUsuario();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Red Social - SerenitySpace
      </Text>

      <View style={{ gap: 10, marginBottom: 30 }}>
        <Button title="Buscar Usuarios" onPress={() => router.push('/RedSocial/buscar')} />
        <Button title="Solicitudes" onPress={() => router.push('/RedSocial/solicitudes')} />
        <Button title="Mis Amigos" onPress={() => router.push('/RedSocial/amigos')} />
        <Button title="Sugerencias" onPress={() => router.push('/RedSocial/sugerencias')} />
        <Button
          title="Mi Perfil"
          onPress={() =>
            router.push({
              pathname: '/RedSocial/perfil/[id]',
              params: { id: user.id },
            })
          }
        />
      </View>
    </SafeAreaView>
  );
}
