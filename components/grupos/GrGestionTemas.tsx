// GrGestionTemas.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

type Tema = {
  id: string;
  modulo_id: string;
  titulo: string;
  descripcion: string;
  video_youtube_url?: string | null;
  video_supabase_url?: string | null;
  orden: number;
};

type Props = {
  moduloId: string;
  onVolver: () => void;
};

export default function GrGestionTemas({ moduloId, onVolver }: Props) {
  const [temas, setTemas] = useState<Tema[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [supabaseVideoUrl, setSupabaseVideoUrl] = useState('');

  useEffect(() => {
    cargarTemas();
  }, []);

  const cargarTemas = async () => {
    const { data, error } = await supabase
      .from('gr_temas')
      .select('*')
      .eq('modulo_id', moduloId)
      .order('orden');

    if (!error && data) setTemas(data as Tema[]);
  };

  const seleccionarYSubirVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled || !result.assets?.length) return;

    const video = result.assets[0];
    const fileExt = video.name.split('.').pop();
    const fileName = `video_${Date.now()}.${fileExt}`;

    const base64 = await FileSystem.readAsStringAsync(video.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error } = await supabase.storage
      .from('fotoyvideo')
      .upload(fileName, decode(base64), {
        contentType: video.mimeType || 'video/mp4',
      });

    if (error) {
      Alert.alert('Error al subir el video');
      return;
    }

    const { data } = supabase.storage.from('fotoyvideo').getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;

    if (publicUrl) {
      setSupabaseVideoUrl(publicUrl);
      Alert.alert('Video cargado correctamente');
    }
  };

  const agregarTema = async () => {
    if (!titulo.trim()) return Alert.alert('El título es obligatorio');

    const { error } = await supabase.from('gr_temas').insert({
      modulo_id: moduloId,
      titulo,
      descripcion,
      video_youtube_url: youtubeUrl || null,
      video_supabase_url: supabaseVideoUrl || null,
      orden: temas.length + 1,
    });

    if (!error) {
      setTitulo('');
      setDescripcion('');
      setYoutubeUrl('');
      setSupabaseVideoUrl('');
      cargarTemas();
    } else {
      Alert.alert('Error al agregar tema');
    }
  };

  const eliminarTema = async (id: string) => {
    const { error } = await supabase.from('gr_temas').delete().eq('id', id);
    if (!error) cargarTemas();
    else Alert.alert('Error al eliminar tema');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Volver a módulos" onPress={onVolver} />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Administrar Temas</Text>

      <TextInput
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="URL de YouTube (opcional)"
        value={youtubeUrl}
        onChangeText={setYoutubeUrl}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Subir video desde el celular" onPress={seleccionarYSubirVideo} />
      {supabaseVideoUrl ? (
        <Text style={{ color: 'green', marginTop: 5 }}>Video subido correctamente</Text>
      ) : null}

      <Button title="Agregar tema" onPress={agregarTema} />

      <FlatList
        data={temas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: { item: Tema }) => (
          <View
            style={{
              backgroundColor: '#f4f4f4',
              padding: 10,
              marginVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>{item.titulo}</Text>
            <Text>{item.descripcion}</Text>

            {item.video_youtube_url ? (
              <Text style={{ color: 'blue' }}>🎥 YouTube: {item.video_youtube_url}</Text>
            ) : null}

            {item.video_supabase_url ? (
              <Text style={{ color: 'green' }}>📁 Video subido: {item.video_supabase_url}</Text>
            ) : null}

            <TouchableOpacity onPress={() => eliminarTema(item.id)}>
              <Text style={{ color: 'red', marginTop: 5 }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
