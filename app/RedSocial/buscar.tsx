// /app/RedSocial/buscar.tsx
import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'expo-router';

type Usuario = {
  id: string;
  full_name: string;
  avatar_url?: string;
};

export default function BuscarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const buscar = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .ilike('full_name', `%${busqueda}%`);

    if (!error && data) {
      setUsuarios(data);
    } else {
      console.error('Error buscando usuarios:', error);
      setUsuarios([]);
    }

    setCargando(false);
  };

  useEffect(() => {
    if (busqueda.length > 1) {
      buscar();
    } else {
      setUsuarios([]);
    }
  }, [busqueda]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: "white" }}>Buscar Usuarios</Text>
      <TextInput
      placeholderTextColor={"#aaa"}
        placeholder="Escribe un nombre..."
        value={busqueda}
        onChangeText={setBusqueda}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginBottom: 20,
          borderRadius: 8,
          color: "white"
        }}
      />

      {cargando ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() =>
                    router.push({ pathname: '/RedSocial/perfil/[id]', params: { id: item.id } })
                }
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                    backgroundColor: '#fff',
                    padding: 10,
                    borderRadius: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                }}
                >
                {item.avatar_url ? (
                    <Image
                    source={{ uri: item.avatar_url }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                    />
                ) : (
                    <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        marginRight: 12,
                        backgroundColor: '#ccc',
                    }}
                    />
                )}
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.full_name}</Text>
                </TouchableOpacity>

          )}
        />
      )}
    </SafeAreaView>
  );
}
