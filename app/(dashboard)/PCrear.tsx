import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';

export default function PCrear() {
  const [fotoLista, setFotoLista] = useState(false);
  const [videoLista, setVideoLista] = useState(false);
  const [imagenUrl, setImagenUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const convertirABuffer = async (uri: string) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const byteArray = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));
    return byteArray.buffer;
  };

  const subirArchivo = async (uri: string, nombre: string): Promise<string | null> => {
    try {
      const buffer = await convertirABuffer(uri);
      const { error } = await supabase.storage
        .from('fotoyvideo')
        .upload(nombre, buffer, {
          contentType: nombre.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
        });

      if (error) {
        Alert.alert('Error al subir archivo', error.message);
        return null;
      }

      const { data } = supabase.storage.from('fotoyvideo').getPublicUrl(nombre);
      return data.publicUrl;
    } catch (err: any) {
      Alert.alert('Error al preparar archivo', err.message || 'Desconocido');
      return null;
    }
  };

  const subirImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const nombre = `foto_${Date.now()}.jpg`;
    const url = await subirArchivo(uri, nombre);

    if (url) {
      setImagenUrl(url);
      setFotoLista(true);
      Alert.alert('✅ Imagen subida correctamente');
    }
  };

  const subirVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });

    if (!result || !result.assets?.[0]) return;

    const uri = result.assets[0].uri;
    const nombre = `video_${Date.now()}.mp4`;
    const url = await subirArchivo(uri, nombre);

    if (url) {
      setVideoUrl(url);
      setVideoLista(true);
      Alert.alert('Video subido correctamente');
    }
  };

  const guardarEnBD = async () => {
    if (!imagenUrl && !videoUrl) {
      Alert.alert('Debes subir al menos una imagen o un video');
      return;
    }

    const { error } = await supabase.from('foto_y_video').insert({
      imagen_url: imagenUrl || null,
      video_url: videoUrl || null,
    });

    if (error) {
      Alert.alert('Error al insertar en la base de datos', error.message);
    } else {
      Alert.alert('Registro guardado en base de datos');
      setFotoLista(false);
      setVideoLista(false);
      setImagenUrl('');
      setVideoUrl('');
    }
  };

  const verificarSupabase = async () => {
    const { error } = await supabase.from('foto_y_video').select('*').limit(1);
    if (error) Alert.alert('Error con Supabase', error.message);
    else Alert.alert('✅ Conexión a Supabase exitosa');
  };

  const verificarBucket = async () => {
    const { error } = await supabase.storage.from('fotoyvideo').list('');
    if (error) Alert.alert('Error con bucket', error.message);
    else Alert.alert('✅ Conexión al bucket exitosa');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Verificar conexión a Supabase" onPress={verificarSupabase} />
      <Button title="Verificar conexión al Bucket" onPress={verificarBucket} />
      <Button title="Subir Foto" onPress={subirImagen} />
      <Button title="Subir Video" onPress={subirVideo} />
      <Button title="Confirmar en base de datos" onPress={guardarEnBD} />

      <Text style={{ marginTop: 10 }}>
        {fotoLista ? '📸 Foto lista para guardar' : 'Foto no cargada'}
      </Text>
      <Text>
        {videoLista ? '🎥 Video listo para guardar' : 'Video no cargado'}
      </Text>
    </View>
  );
}
