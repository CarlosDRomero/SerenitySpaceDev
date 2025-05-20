// /app/RedSocial/sugerencias.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';
//import Toast from 'react-native-toast-message';

type Perfil = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

export default function Sugerencias() {
  const [miId, setMiId] = useState<string>('');
  const [usuarios, setUsuarios] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSugerencias = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;

      if (!uid) {
        setLoading(false);
        return;
      }

      setMiId(uid);

      const { data: relaciones } = await supabase
        .from('amistades')
        .select('de, para')
        .or(`de.eq.${uid},para.eq.${uid}`);

      const idsRelacionados = new Set<string>();
      relaciones?.forEach((rel) => {
        if (rel.de !== uid) idsRelacionados.add(rel.de);
        if (rel.para !== uid) idsRelacionados.add(rel.para);
      });

      const { data: usuariosTodos, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .neq('id', uid);

      if (!error && usuariosTodos) {
        const sugeridos = usuariosTodos.filter((u) => !idsRelacionados.has(u.id));
        setUsuarios(sugeridos);
      }

      setLoading(false);
    };

    cargarSugerencias();
  }, []);

  const enviarSolicitud = async (idDestino: string) => {
    if (!miId) return;

    const { data: existentes } = await supabase
      .from('amistades')
      .select('id')
      .or(`and(de.eq.${miId},para.eq.${idDestino}),and(de.eq.${idDestino},para.eq.${miId})`);

    if (existentes && existentes.length > 0) {
      console.log({
        type: 'info',
        text1: 'Ya existe una relación',
        text2: 'No puedes enviar una solicitud duplicada.',
      });
      return;
    }

    const { error } = await supabase.from('amistades').insert({
      de: miId,
      para: idDestino,
      estado: 'pendiente',
    });

    if (error) {
       console.log({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo enviar la solicitud.',
      });
    } else {
      console.log({
        type: 'success',
        text1: 'Solicitud enviada',
        text2: 'Se ha enviado correctamente.',
      });
      setUsuarios((prev) => prev.filter((u) => u.id !== idDestino));
    }
  };

  const ignorar = (idIgnorado: string) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== idIgnorado));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
          Sugerencias de amistad
        </Text>

        {loading ? (
          <ActivityIndicator />
        ) : usuarios.length === 0 ? (
          <Text style={{ color: '#888' }}>No hay sugerencias por ahora.</Text>
        ) : (
          usuarios.map((u) => (
            <View
              key={u.id}
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
              {u.avatar_url ? (
                <Image
                  source={{ uri: u.avatar_url }}
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
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{u.full_name}</Text>
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
                  onPress={() => enviarSolicitud(u.id)}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Solicitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#ccc',
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                  }}
                  onPress={() => ignorar(u.id)}
                >
                  <Text style={{ fontWeight: 'bold' }}>Ignorar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
