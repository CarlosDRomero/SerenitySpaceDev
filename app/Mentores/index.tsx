// /app/RedSocial/mentores.tsx

// /app/Mentores/index.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';

type Mentor = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

export default function Mentores() {
  const [miId, setMiId] = useState('');
  const [mentores, setMentores] = useState<Mentor[]>([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarMentores = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return;

      setMiId(uid);

      // 1. Obtener todos los IDs con rol 'tutor'
      const { data: tutoresRoles } = await supabase
        .from('usuarios_roles')
        .select('id_profile, roles(nombre)')
        .eq('roles.nombre', 'tutor');

      const idsTutores = tutoresRoles?.map((r) => r.id_profile) ?? [];

      if (idsTutores.length === 0) {
        setMentores([]);
        setLoading(false);
        return;
      }

      // 2. Obtener perfiles de esos tutores
      const { data: perfiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', idsTutores)
        .neq('id', uid); // excluirme

      setMentores(perfiles || []);
      setLoading(false);
    };

    cargarMentores();
  }, []);

  const enviarSolicitud = async (idDestino: string) => {
    if (!miId) return;

    const { data: existentes } = await supabase
      .from('amistades')
      .select()
      .or(`and(de.eq.${miId},para.eq.${idDestino}),and(de.eq.${idDestino},para.eq.${miId})`);

    if (existentes && existentes.length > 0) return;

    await supabase.from('amistades').insert({
      de: miId,
      para: idDestino,
      estado: 'pendiente',
    });

    setMentores((prev) => prev.filter((u) => u.id !== idDestino));
  };

  const mentoresFiltrados = mentores.filter((m) =>
    m.full_name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
          Mentores disponibles
        </Text>

        <TextInput
          placeholder="Buscar mentor por nombre"
          onChangeText={setFiltro}
          value={filtro}
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
          }}
        />

        {loading ? (
          <ActivityIndicator />
        ) : mentoresFiltrados.length === 0 ? (
          <Text style={{ color: '#888' }}>No hay mentores disponibles.</Text>
        ) : (
          mentoresFiltrados.map((m) => (
            <View
              key={m.id}
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
              {m.avatar_url ? (
                <Image
                  source={{ uri: m.avatar_url }}
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
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{m.full_name}</Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#3C63FF',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 6,
                }}
                onPress={() => enviarSolicitud(m.id)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Contactar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
