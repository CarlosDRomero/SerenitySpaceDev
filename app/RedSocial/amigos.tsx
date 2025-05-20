// /app/RedSocial/amigos.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

// Tipos
type Perfil = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

type Amigo = {
  id: string;
  perfil: Perfil;
};

export default function Amigos() {
  const [miId, setMiId] = useState<string>('');
  const [amigos, setAmigos] = useState<Amigo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAmigos = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return;

      setMiId(uid);

      const { data: relaciones, error } = await supabase
        .from('amistades')
        .select('id, de, para')
        .eq('estado', 'aceptado')
        .or(`de.eq.${uid},para.eq.${uid}`);

      if (!relaciones || error) {
        console.error('Error cargando relaciones de amistad:', error);
        setLoading(false);
        return;
      }

      const idsAmigos = relaciones.map((r) => (r.de === uid ? r.para : r.de));

      const { data: perfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', idsAmigos);

      const amigosCompletos = relaciones.map((r) => {
        const idAmigo = r.de === uid ? r.para : r.de;
        return {
          id: r.id,
          perfil: perfiles?.find((p) => p.id === idAmigo) || {
            id: '',
            full_name: 'Desconocido',
            avatar_url: '',
          },
        };
      });

      setAmigos(amigosCompletos);
      setLoading(false);
    };

    cargarAmigos();
  }, []);

  const eliminarAmigo = async (id: string) => {
    Alert.alert(
      '¿Eliminar amistad?',
      'Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('amistades').delete().eq('id', id);
            setAmigos((prev) => prev.filter((a) => a.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
          Mis Amigos
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : amigos.length === 0 ? (
          <Text style={{ color: '#888' }}>No tienes amigos aún.</Text>
        ) : (
          amigos.map((a) => (
            <View
              key={a.id}
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
              {a.perfil.avatar_url ? (
                <Image
                  source={{ uri: a.perfil.avatar_url }}
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
                  {a.perfil.full_name || 'Sin nombre'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => eliminarAmigo(a.id)}
                style={{
                  backgroundColor: '#FF4E4E',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}