import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import { ModuloType, TemaType } from './editorTypes';

interface Props {
  grupoId: string;
  modulos: ModuloType[];
  temasPorModulo: { [key: string]: TemaType[] };
  recargar: () => void;
  seleccionarTema: (temaId: string) => void;
}

export default function ModuloEditor({
  grupoId,
  modulos,
  temasPorModulo,
  recargar,
  seleccionarTema,
}: Props) {
  const [nuevoModulo, setNuevoModulo] = useState('');
  const [editando, setEditando] = useState<{ [id: string]: string }>({});

  const agregarModulo = async () => {
    if (!nuevoModulo.trim()) return;
    const { error } = await supabase.from('gr_modulos').insert({
      grupo_id: grupoId,
      nombre: nuevoModulo,
      orden: modulos.length + 1,
    });
    if (!error) {
      setNuevoModulo('');
      recargar();
    }
  };

  const eliminarModulo = async (moduloId: string) => {
    const { error } = await supabase.from('gr_modulos').delete().eq('id', moduloId);
    if (!error) recargar();
  };

  const guardarNombreModulo = async (moduloId: string) => {
    const nuevoNombre = editando[moduloId];
    const { error } = await supabase
      .from('gr_modulos')
      .update({ nombre: nuevoNombre })
      .eq('id', moduloId);
    if (!error) {
      const actualizado = { ...editando };
      delete actualizado[moduloId];
      setEditando(actualizado);
      recargar();
    }
  };

  return (
    <View>
      <Text style={styles.seccion}>📚 Módulos</Text>

      <TextInput
        value={nuevoModulo}
        onChangeText={setNuevoModulo}
        placeholder="Nombre del nuevo módulo"
        style={styles.input}
      />
      <Button title="Agregar módulo" onPress={agregarModulo} />

      {modulos.map((modulo) => (
        <View key={modulo.id} style={styles.moduloBox}>
          {editando[modulo.id] !== undefined ? (
            <>
              <TextInput
                value={editando[modulo.id]}
                onChangeText={(text) =>
                  setEditando((prev) => ({ ...prev, [modulo.id]: text }))
                }
                style={styles.input}
              />
              <View style={styles.inlineButtons}>
                <Button
                  title="Guardar"
                  onPress={() => guardarNombreModulo(modulo.id)}
                />
                <Button
                  title="Cancelar"
                  color="gray"
                  onPress={() => {
                    const copia = { ...editando };
                    delete copia[modulo.id];
                    setEditando(copia);
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.moduloTitulo}>{modulo.nombre}</Text>
              <View style={styles.inlineButtons}>
                <Button
                  title="Editar"
                  onPress={() =>
                    setEditando((prev) => ({ ...prev, [modulo.id]: modulo.nombre }))
                  }
                />
                <Button
                  title="Eliminar"
                  color="red"
                  onPress={() =>
                    Alert.alert('¿Eliminar módulo?', '', [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: () => eliminarModulo(modulo.id),
                      },
                    ])
                  }
                />
              </View>
            </>
          )}

          {/* Listar temas */}
          {temasPorModulo[modulo.id]?.map((tema) => (
            <TouchableOpacity key={tema.id} onPress={() => seleccionarTema(tema.id)}>
              <Text style={styles.temaItem}>↳ {tema.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  seccion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  moduloBox: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  moduloTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  temaItem: {
    paddingLeft: 12,
    fontSize: 14,
    color: '#555',
    paddingVertical: 4,
  },
});
