import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { supabase } from '@/utils/supabase';

type Grupo = {
  id: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
};

export default function GBuscador() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarGrupos();
  }, []);

  const cargarGrupos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('grupos_apoyo')
      .select('*')
      .eq('activo', true)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error cargando grupos:', error.message);
    } else {
      setGrupos(data || []);
    }
    setCargando(false);
  };

  const gruposFiltrados = grupos.filter((grupo) =>
    grupo.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }: { item: Grupo }) => (
    <View style={styles.card}>
      {item.imagen_url ? (
        <Image source={{ uri: item.imagen_url }} style={styles.imagen} />
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text>Sin imagen</Text>
        </View>
      )}
      <Text style={styles.titulo}>{item.nombre}</Text>
      <Text style={styles.descripcion}>{item.descripcion}</Text>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <TextInput
          placeholder="🔍 Buscar grupo..."
          value={busqueda}
          onChangeText={setBusqueda}
          style={styles.input}
        />
      </View>

      {cargando ? (
        <ActivityIndicator size="large" />
      ) : gruposFiltrados.length === 0 ? (
        <Text style={styles.mensajeVacio}>
          Actualmente no hay grupos creados o no se encontraron coincidencias.
        </Text>
      ) : (
        <FlatList
          data={gruposFiltrados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 10,
  },
  card: {
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    elevation: 2,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagenPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  mensajeVacio: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});