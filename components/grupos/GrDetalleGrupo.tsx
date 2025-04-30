// GrDetalleGrupo.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { supabase } from '@/utils/supabase';

// Tipos
type Modulo = {
  id: string;
  grupo_id: string;
  nombre: string;
  orden: number;
  activo: boolean;
};

type Grupo = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string | null;
  creado_por?: string;
  fecha_creacion?: string;
  activo?: boolean;
};

type Props = {
  grupoId: string;
  onVolver: () => void;
  onGestionarTemas: (moduloId: string) => void;
};

export default function GrDetalleGrupo({ grupoId, onVolver, onGestionarTemas }: Props) {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [nombreModulo, setNombreModulo] = useState('');
  const [grupo, setGrupo] = useState<Grupo | null>(null);

  useEffect(() => {
    cargarGrupo();
    cargarModulos();
  }, []);

  const cargarGrupo = async () => {
    const { data, error } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    if (!error) setGrupo(data);
    else console.error(error);
  };

  const cargarModulos = async () => {
    const { data, error } = await supabase
      .from('gr_modulos')
      .select('*')
      .eq('grupo_id', grupoId)
      .order('orden');

    if (!error && data) setModulos(data);
    else console.error(error);
  };

  const agregarModulo = async () => {
    if (!nombreModulo.trim()) return Alert.alert('Ingresa un nombre para el módulo');

    const { error } = await supabase.from('gr_modulos').insert({
      grupo_id: grupoId,
      nombre: nombreModulo,
      orden: modulos.length + 1,
    });

    if (!error) {
      setNombreModulo('');
      cargarModulos();
    } else {
      Alert.alert('Error al agregar módulo');
    }
  };

  const eliminarModulo = async (moduloId: string) => {
    const { error } = await supabase.from('gr_modulos').delete().eq('id', moduloId);
    if (!error) cargarModulos();
    else Alert.alert('Error al eliminar módulo');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Volver a grupos" onPress={onVolver} />

      {grupo && (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{grupo.nombre}</Text>
          <Text style={{ marginBottom: 20 }}>{grupo.descripcion}</Text>
        </>
      )}

      <Text style={{ fontWeight: 'bold' }}>Agregar nuevo módulo</Text>
      <TextInput
        placeholder="Nombre del módulo"
        value={nombreModulo}
        onChangeText={setNombreModulo}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Agregar módulo" onPress={agregarModulo} />

      <Text style={{ fontSize: 18, marginTop: 20, marginBottom: 10 }}>Módulos del grupo:</Text>
      <FlatList
        data={modulos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Modulo }) => (
          <View
            style={{
              marginBottom: 15,
              padding: 10,
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16 }}>{item.nombre}</Text>

            <TouchableOpacity onPress={() => eliminarModulo(item.id)}>
              <Text style={{ color: 'red', marginTop: 5 }}>Eliminar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onGestionarTemas(item.id)}>
              <Text style={{ color: 'blue', marginTop: 5 }}>Administrar temas</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
