// GrListaGrupos.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import { supabase } from '@/utils/supabase';

type Grupo = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
};

type Props = {
  onSeleccionarGrupo: (grupoId: string) => void;
  onVolver?: () => void;
};

export default function GrListaGrupos({ onSeleccionarGrupo, onVolver }: Props) {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    const { data, error } = await supabase
      .from('gr_grupos')
      .select('id, nombre, descripcion, imagen_url')
      .order('fecha_creacion', { ascending: false });

    if (!error && data) setGrupos(data as Grupo[]);
    setCargando(false);
  };

  const renderItem = ({ item }: { item: Grupo }) => (
    <TouchableOpacity
      style={{
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
      }}
      onPress={() => onSeleccionarGrupo(item.id)}
    >
      {item.imagen_url && (
        <Image
          source={{ uri: item.imagen_url }}
          style={{ width: '100%', height: 150, borderRadius: 8 }}
        />
      )}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 5 }}>{item.nombre}</Text>
      <Text style={{ color: '#555' }}>{item.descripcion}</Text>
    </TouchableOpacity>
  );

  if (cargando) return <ActivityIndicator style={{ marginTop: 20 }} size="large" />;

  return (
    <View style={{ padding: 20 }}>
      {onVolver && <Button title="Volver a crear" onPress={onVolver} />}
      <FlatList
        data={grupos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
