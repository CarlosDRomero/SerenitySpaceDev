// /app/Mentores/perfil/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

export default function PerfilTutorPublico() {
  const { id } = useLocalSearchParams();
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (typeof id !== 'string') return;

      const { data: perfilBase } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', id)
        .single();

      const { data: detalles } = await supabase
        .from('perfil_tutor')
        .select('*')
        .eq('id_profile', id)
        .single();

      setPerfil({
        ...perfilBase,
        ...detalles,
      });

      setLoading(false);
    };

    cargarPerfil();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!perfil) {
    return <Text>No se encontró el perfil del tutor.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {perfil.foto_url ? (
          <Image source={{ uri: perfil.foto_url }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 20 }} />
        ) : perfil.avatar_url ? (
          <Image source={{ uri: perfil.avatar_url }} style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 20 }} />
        ) : null}

        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>{perfil.full_name}</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Especialidad:</Text> {perfil.especialidad || 'No especificada'}</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Experiencia:</Text> {perfil.experiencia || 'No especificada'}</Text>
        <Text style={{ fontSize: 16, marginBottom: 5 }}><Text style={{ fontWeight: 'bold' }}>Disponibilidad:</Text> {perfil.disponibilidad || 'No especificada'}</Text>
        <Text style={{ fontSize: 16, marginTop: 10 }}><Text style={{ fontWeight: 'bold' }}>Descripción:</Text> {"\n"}{perfil.descripcion || 'Este tutor aún no ha escrito una descripción.'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
