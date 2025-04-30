import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, TextInput, Button, StyleSheet,
  TouchableOpacity, Alert, FlatList
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import { supabase } from '@/utils/supabase';

export default function GTemas() {
  const [modulos, setModulos] = useState<any[]>([]);
  const [temas, setTemas] = useState<{ [moduloId: string]: any[] }>({});
  const [modulosAbiertos, setModulosAbiertos] = useState<{ [moduloId: string]: boolean }>({});
  const [nuevoTema, setNuevoTema] = useState<{ [moduloId: string]: string }>({});

  const cargarModulos = async () => {
    const { data, error } = await supabase.from('g_modulos').select('*').order('orden');
    if (error) Alert.alert('Error', error.message);
    else setModulos(data);
  };

  const cargarTemasPorModulo = async (moduloId: string) => {
    const { data, error } = await supabase
      .from('g_temas')
      .select('*')
      .eq('modulo_id', moduloId)
      .order('orden');

    if (error) Alert.alert('Error al cargar temas', error.message);
    else setTemas(prev => ({ ...prev, [moduloId]: data }));
  };

  const toggleModulo = (moduloId: string) => {
    const nuevoEstado = !modulosAbiertos[moduloId];
    setModulosAbiertos({ ...modulosAbiertos, [moduloId]: nuevoEstado });

    if (nuevoEstado && !temas[moduloId]) {
      cargarTemasPorModulo(moduloId);
    }
  };

  const agregarTema = async (moduloId: string) => {
    const titulo = nuevoTema[moduloId];
    if (!titulo?.trim()) return Alert.alert('Tema sin título');

    const { error } = await supabase.from('g_temas').insert({
      modulo_id: moduloId,
      titulo,
      descripcion: '',
    });

    if (error) Alert.alert('Error al crear tema', error.message);
    else {
      setNuevoTema(prev => ({ ...prev, [moduloId]: '' }));
      cargarTemasPorModulo(moduloId);
    }
  };

  const eliminarTema = async (id: string, moduloId: string) => {
    const { error } = await supabase.from('g_temas').delete().eq('id', id);
    if (error) Alert.alert('Error al eliminar tema', error.message);
    else cargarTemasPorModulo(moduloId);
  };

  useEffect(() => {
    cargarModulos();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {modulos.map((modulo) => (
        <View key={modulo.id} style={styles.cardModulo}>
          <TouchableOpacity onPress={() => toggleModulo(modulo.id)} style={styles.moduloCabecera}>
            <Text style={styles.tituloModulo}>{modulo.nombre}</Text>
          </TouchableOpacity>

          <Collapsible collapsed={!modulosAbiertos[modulo.id]}>
            {temas[modulo.id]?.map((tema) => (
              <View key={tema.id} style={styles.temaItem}>
                <Text style={styles.temaTitulo}>{tema.titulo}</Text>
                <TouchableOpacity onPress={() => eliminarTema(tema.id, modulo.id)}>
                  <Text style={styles.btnEliminar}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.nuevoTemaContainer}>
              <TextInput
                placeholder="Nuevo tema"
                style={styles.input}
                value={nuevoTema[modulo.id] || ''}
                onChangeText={(text) => setNuevoTema(prev => ({ ...prev, [modulo.id]: text }))}
              />
              <Button title="Agregar Tema" onPress={() => agregarTema(modulo.id)} />
            </View>
          </Collapsible>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  cardModulo: {
    marginBottom: 12,
    backgroundColor: '#eef',
    borderRadius: 10,
    padding: 10,
  },
  moduloCabecera: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
  },
  tituloModulo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  temaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginTop: 4,
    borderRadius: 5,
  },
  temaTitulo: {
    fontSize: 16,
  },
  btnEliminar: {
    fontSize: 18,
    color: '#f00',
  },
  nuevoTemaContainer: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    borderRadius: 6,
  },
});
