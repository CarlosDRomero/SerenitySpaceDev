// GREditorVisualPK/GrupoEditor.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/utils/supabase';
import { GrupoType } from './editorTypes';

export default function GrupoEditor({
  grupo,
  onVolver,
  recargar,
}: {
  grupo: GrupoType;
  onVolver: () => void;
  recargar: () => Promise<void>;
}) {
  const [nombre, setNombre] = useState(grupo.nombre);
  const [descripcion, setDescripcion] = useState(grupo.descripcion);
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.length) {
      setImagen(result.assets[0]);
    }
  };

  const guardarCambios = async () => {
    let imagen_url = grupo.imagen_url;

    if (imagen) {
      const ext = imagen.uri.split('.').pop();
      const nombreArchivo = `grupo_editado_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('fotoyvideo').upload(
        nombreArchivo,
        decode(imagen.base64 || ''),
        { contentType: `image/${ext}` }
      );
      if (error) return Alert.alert('Error al subir imagen');
      const { data } = supabase.storage.from('fotoyvideo').getPublicUrl(nombreArchivo);
      imagen_url = data?.publicUrl;
    }

    const actualizaciones: any = {};
    if (nombre !== grupo.nombre) actualizaciones.nombre = nombre;
    if (descripcion !== grupo.descripcion) actualizaciones.descripcion = descripcion;
    if (imagen_url !== grupo.imagen_url) actualizaciones.imagen_url = imagen_url;

    if (Object.keys(actualizaciones).length === 0) {
      Alert.alert('Sin cambios');
      return;
    }

    const { error: updateError } = await supabase.from('gr_grupos').update(actualizaciones).eq('id', grupo.id);
    if (!updateError) {
      Alert.alert('Cambios guardados');
      setImagen(null);
      await recargar();
    } else {
      Alert.alert('Error al actualizar');
    }
  };

  const eliminarGrupo = async () => {
    Alert.alert('Confirmar eliminación', '¿Estás seguro de eliminar este grupo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('gr_grupos').delete().eq('id', grupo.id);
          if (!error) {
            Alert.alert('Grupo eliminado');
            onVolver();
          } else {
            Alert.alert('Error al eliminar');
          }
        },
      },
    ]);
  };

  return (
    <View>
      <Text style={styles.titulo}>Editor del Grupo</Text>
      {imagen ? (
        <Image source={{ uri: imagen.uri }} style={styles.imagen} />
      ) : (
        grupo.imagen_url && <Image source={{ uri: grupo.imagen_url }} style={styles.imagen} />
      )}

      <TouchableOpacity onPress={seleccionarImagen} style={styles.botonImagen}>
        <Text style={{ color: '#fff' }}>{imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}</Text>
      </TouchableOpacity>

      <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del grupo" style={styles.input} />
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción"
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.botonesInferiores}>
        <Button title="Guardar cambios" onPress={guardarCambios} />
        <Button title="Eliminar grupo" color="red" onPress={eliminarGrupo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  botonImagen: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  botonesInferiores: {
    gap: 10,
    marginBottom: 20,
  },
});