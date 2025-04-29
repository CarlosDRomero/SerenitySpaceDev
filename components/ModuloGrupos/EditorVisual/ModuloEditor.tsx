import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { ModuloType, TemaType } from './editorTypes';
import { supabase } from '@/utils/supabase';

interface ModuloEditorProps {
  grupoId: string;
  moduloSeleccionadoId: string;
  modulos: ModuloType[];
  temasPorModulo: { [key: string]: TemaType[] };
  recargar: () => void;
  seleccionarTema: (id: string) => void;
  onVolver: () => void;
}

export default function ModuloEditor({
  grupoId,
  moduloSeleccionadoId,
  modulos,
  temasPorModulo,
  recargar,
  seleccionarTema,
  onVolver,
}: ModuloEditorProps) {
  const [moduloActual, setModuloActual] = useState<ModuloType | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [orden, setOrden] = useState('0');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const encontrado = modulos.find((m) => m.id_m === moduloSeleccionadoId);
    if (encontrado) {
      setModuloActual(encontrado);
      setTitulo(encontrado.titulo);
      setDescripcion(encontrado.descripcion || '');
      setOrden(encontrado.orden.toString());
    }
  }, [moduloSeleccionadoId, modulos]);

  const guardarCambios = async () => {
    if (!moduloActual) return;

    setGuardando(true);
    const { error } = await supabase
      .from('mg_modulos')
      .update({
        titulo,
        descripcion,
        orden: parseInt(orden),
      })
      .eq('id_m', moduloActual.id_m);

    setGuardando(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Módulo actualizado');
      recargar();
    }
  };

  const eliminarModulo = async () => {
    if (!moduloActual) return;

    Alert.alert(
      '¿Eliminar módulo?',
      'Esto eliminará también todos los temas asociados. ¿Seguro que deseas continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.from('modulos_temas').delete().eq('id_m', moduloActual.id_m);

              const temas = temasPorModulo[moduloActual.id_m] || [];
              if (temas.length > 0) {
                await supabase.from('mg_temas').delete().in(
                  'id_t',
                  temas.map((t) => t.id_t)
                );
              }

              await supabase.from('grupos_modulos').delete().eq('id_m', moduloActual.id_m);

              const { error } = await supabase
                .from('mg_modulos')
                .delete()
                .eq('id_m', moduloActual.id_m);

              if (error) {
                Alert.alert('Error al eliminar módulo', error.message);
              } else {
                Alert.alert('✅ Módulo eliminado');
                recargar();
                onVolver();
              }
            } catch (err: any) {
              Alert.alert('Error inesperado', err.message || 'Error desconocido');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {moduloActual ? (
        <>
          <Text style={styles.label}>Título del módulo</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Título del módulo"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción del módulo"
            placeholderTextColor="#888"
            multiline
          />

          <Text style={styles.label}>Orden</Text>
          <TextInput
            style={styles.input}
            value={orden}
            onChangeText={setOrden}
            placeholder="Orden"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.botonGuardar} onPress={guardarCambios} disabled={guardando}>
            <Text style={styles.botonTexto}>{guardando ? 'Guardando...' : 'Guardar cambios'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonGuardar, { backgroundColor: '#FF4E4E' }]}
            onPress={eliminarModulo}
          >
            <Text style={styles.botonTexto}>🗑️ Eliminar módulo</Text>
          </TouchableOpacity>

          <Text style={styles.subtitulo}>Temas de este módulo:</Text>
          {temasPorModulo[moduloActual.id_m]?.map((tema) => (
            <TouchableOpacity key={tema.id_t} onPress={() => seleccionarTema(tema.id_t)}>
              <Text style={styles.temaItem}>- {tema.titulo}</Text>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <Text style={{ color: 'white' }}>No hay módulo seleccionado.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0c0c0c',
    borderRadius: 10,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  botonGuardar: {
    backgroundColor: '#3C63FF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitulo: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  temaItem: {
    color: '#aaa',
    marginLeft: 10,
    marginBottom: 5,
  },
});
