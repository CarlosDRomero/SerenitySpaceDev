// /app/RedSocial/solicitudes.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

// Tipos
type Perfil = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

type Solicitud = {
  id: string;
  perfil: Perfil;
};

export default function Solicitudes() {
  const [miId, setMiId] = useState<string>('');
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;

      if (!uid) {
        setLoading(false);
        return;
      }

      setMiId(uid);

      // Paso 1: Obtener solicitudes pendientes (solo IDs)
      const { data: solicitudesData, error } = await supabase
        .from('amistades')
        .select('id, de')
        .eq('para', uid)
        .eq('estado', 'pendiente');

      console.log('solicitudesData:', solicitudesData);

      if (!solicitudesData || error) {
        console.error('Error cargando solicitudes:', error);
        setLoading(false);
        return;
      }

      const emisores = solicitudesData.map((s) => s.de);

      const { data: perfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', emisores);

      console.log('perfiles encontrados:', perfiles);

      const solicitudesCompletas = solicitudesData.map((s) => ({
        id: s.id,
        perfil: perfiles?.find((p) => p.id === s.de) || {
          id: '',
          full_name: 'Desconocido',
          avatar_url: '',
        },
      }));

      setSolicitudes(solicitudesCompletas);
      setLoading(false);
    };

    cargarSolicitudes();
  }, []);

  const aceptar = async (id: string) => {
    await supabase.from('amistades').update({ estado: 'aceptado' }).eq('id', id);
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  const rechazar = async (id: string) => {
    await supabase.from('amistades').delete().eq('id', id);
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: "white" }}>
          Solicitudes de amistad
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : solicitudes.length === 0 ? (
          <Text style={{ color: '#888' }}>No tienes solicitudes pendientes.</Text>
        ) : (
          solicitudes.map((s) => (
            <View
              key={s.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
                padding: 12,
                backgroundColor: '#fff',
                borderRadius: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {s.perfil.avatar_url ? (
                <Image
                  source={{ uri: s.perfil.avatar_url }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                    backgroundColor: '#ccc',
                  }}
                />
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  {s.perfil.full_name || 'Sin nombre'}
                </Text>
              </View>

              <View style={{ gap: 6 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#3C63FF',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    marginBottom: 4,
                  }}
                  onPress={() => aceptar(s.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#ccc',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                  onPress={() => rechazar(s.id)}
                >
                  <Text style={{ fontWeight: 'bold' }}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}