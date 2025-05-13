/*
es necesario volver a crear la apk con la nuevas librerías eas build --profile development --platform android
npm install @supabase/supabase-js
npx expo install expo-document-picker expo-image-picker
npx expo install expo-image-picker
npx expo install expo-document-picker
npx expo install expo-file-system
npm install buffer
npm install --save-dev @types/node
npm install base64-arraybuffer
npm install react-native-collapsible


*/

import React, { useState } from 'react';
import {
  ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, Image,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';
import { decode } from 'base64-arraybuffer';
import { useRouter } from 'expo-router';

export default function GCrear() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenLocal, setImagenLocal] = useState('');
  const [imagenNombre, setImagenNombre] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const router = useRouter();

  const convertirABuffer = async (uri: string) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return decode(file);
  };

  const subirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setImagenLocal(file.uri);
      setImagenNombre(file.fileName || `grupo_${Date.now()}.jpg`);
    }
  };

  const guardarGrupo = async () => {
    if (!nombre.trim()) {
      Alert.alert('Debe ingresar un nombre para el grupo');
      return;
    }

    setSubiendo(true);
    try {
      let urlPublica = null;

      if (imagenLocal) {
        const buffer = await convertirABuffer(imagenLocal);
        const { error } = await supabase.storage
          .from('fotoyvideo') // ✅ nombre correcto del bucket
          .upload(imagenNombre, buffer, { contentType: 'image/jpeg' });

        if (error) throw new Error(`Error al subir imagen: ${error.message}`);

        const { data } = supabase.storage
          .from('fotoyvideo')
          .getPublicUrl(imagenNombre);

        urlPublica = data.publicUrl;
      }

      const { error } = await supabase.from('g_grupos').insert({
        nombre,
        descripcion,
        imagen_url: urlPublica,
        fijo: false,
        creador_id: null, // 🔐 se completará con el id del usuario autenticado en el futuro
      });

      if (error) throw new Error(`Error al insertar grupo: ${error.message}`);

      Alert.alert('✅ Grupo creado exitosamente');
      setNombre('');
      setDescripcion('');
      setImagenLocal('');
      setImagenNombre('');
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Ocurrió un error desconocido');
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nombre del grupo</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.label}>Imagen (opcional)</Text>
      {imagenLocal ? (
        <>
          <Image source={{ uri: imagenLocal }} style={styles.imagen} />
          <Text style={styles.nombreArchivo}>📁 {imagenNombre}</Text>
        </>
      ) : (
        <Button title="Seleccionar Imagen" onPress={subirImagen} />
      )}

      {subiendo && <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Crear Grupo" onPress={guardarGrupo} color="#007AFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: 'hsla(230, 4.80%, 49.00%, 0.07)',
  },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginVertical: 10,
  },
  nombreArchivo: {
    fontStyle: 'italic',
    color: '#444',
    marginBottom: 10,
  },
});
