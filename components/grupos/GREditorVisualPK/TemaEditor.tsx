import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/utils/supabase';
import { TemaType } from './editorTypes';

interface Props {
  moduloId: string;
  temas: TemaType[];
  recargar: () => void;
}

export default function TemaEditor({ moduloId, temas, recargar }: Props) {
  const [nuevoTema, setNuevoTema] = useState({
    titulo: '',
    descripcion: '',
    video_youtube_url: '',
    video_local: null as ImagePicker.ImagePickerAsset | null,
  });

  const [editando, setEditando] = useState<{
    [id: string]: TemaType & { video_local?: ImagePicker.ImagePickerAsset | null };
  }>({});

  const seleccionarVideo = async (modo: 'nuevo' | string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.length) {
      if (modo === 'nuevo') {
        setNuevoTema((prev) => ({ ...prev, video_local: result.assets[0] }));
      } else {
        setEditando((prev) => ({
          ...prev,
          [modo]: { ...prev[modo], video_local: result.assets[0] },
        }));
      }
    }
  };

  const subirVideo = async (video: ImagePicker.ImagePickerAsset) => {
    const ext = video.uri.split('.').pop();
    const nombreArchivo = `video_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('fotoyvideo').upload(
      nombreArchivo,
      decode(video.base64 || ''),
      {
        contentType: `video/${ext}`,
      }
    );
    if (error) throw new Error('Error al subir video');

    const { data } = supabase.storage.from('fotoyvideo').getPublicUrl(nombreArchivo);
    return data?.publicUrl || '';
  };

  const agregarTema = async () => {
    if (!nuevoTema.titulo.trim()) return;

    let videoUrl = '';
    if (nuevoTema.video_local) {
      try {
        videoUrl = await subirVideo(nuevoTema.video_local);
      } catch (err) {
        Alert.alert('Error al subir video');
        return;
      }
    }

    const { error } = await supabase.from('gr_temas').insert({
      modulo_id: moduloId,
      titulo: nuevoTema.titulo,
      descripcion: nuevoTema.descripcion,
      video_youtube_url: nuevoTema.video_youtube_url || null,
      video_supabase_url: videoUrl || null,
      orden: temas.length + 1,
    });

    if (!error) {
      setNuevoTema({
        titulo: '',
        descripcion: '',
        video_youtube_url: '',
        video_local: null,
      });
      recargar();
    }
  };

  const eliminarTema = async (temaId: string) => {
    Alert.alert('¿Eliminar tema?', '', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('gr_temas').delete().eq('id', temaId);
          if (!error) recargar();
        },
      },
    ]);
  };

  const guardarEdicion = async (temaId: string) => {
    const tema = editando[temaId];
    let videoUrl = tema.video_supabase_url || '';

    if (tema.video_local) {
      try {
        videoUrl = await subirVideo(tema.video_local);
      } catch {
        Alert.alert('Error al subir nuevo video');
        return;
      }
    }

    const { error } = await supabase.from('gr_temas').update({
      titulo: tema.titulo,
      descripcion: tema.descripcion,
      video_youtube_url: tema.video_youtube_url || null,
      video_supabase_url: videoUrl || null,
    }).eq('id', temaId);

    if (!error) {
      const copia = { ...editando };
      delete copia[temaId];
      setEditando(copia);
      recargar();
    }
  };

  return (
    <View>
      <Text style={styles.seccion}>📝 Temas</Text>

      <TextInput
        value={nuevoTema.titulo}
        onChangeText={(text) => setNuevoTema((prev) => ({ ...prev, titulo: text }))}
        placeholder="Título del nuevo tema"
        style={styles.input}
      />
      <TextInput
        value={nuevoTema.descripcion}
        onChangeText={(text) => setNuevoTema((prev) => ({ ...prev, descripcion: text }))}
        placeholder="Descripción"
        style={[styles.input, { height: 60 }]}
        multiline
      />
      <TextInput
        value={nuevoTema.video_youtube_url}
        onChangeText={(text) => setNuevoTema((prev) => ({ ...prev, video_youtube_url: text }))}
        placeholder="Enlace de YouTube (opcional)"
        style={styles.input}
      />
      <TouchableOpacity onPress={() => seleccionarVideo('nuevo')} style={styles.boton}>
        <Text style={styles.botonTexto}>🎥 Seleccionar video desde el celular</Text>
      </TouchableOpacity>
      {nuevoTema.video_local && (
        <Text style={{ marginBottom: 10 }}>📁 {nuevoTema.video_local.fileName || 'Video seleccionado'}</Text>
      )}
      <Button title="Agregar tema" onPress={agregarTema} />

      {temas.map((tema) => (
        <View key={tema.id} style={styles.temaBox}>
          {editando[tema.id] ? (
            <>
              <TextInput
                value={editando[tema.id].titulo}
                onChangeText={(text) =>
                  setEditando((prev) => ({ ...prev, [tema.id]: { ...prev[tema.id], titulo: text } }))
                }
                style={styles.input}
              />
              <TextInput
                value={editando[tema.id].descripcion}
                onChangeText={(text) =>
                  setEditando((prev) => ({ ...prev, [tema.id]: { ...prev[tema.id], descripcion: text } }))
                }
                style={[styles.input, { height: 60 }]}
                multiline
              />
              <TextInput
                value={editando[tema.id].video_youtube_url || ''}
                onChangeText={(text) =>
                  setEditando((prev) => ({ ...prev, [tema.id]: { ...prev[tema.id], video_youtube_url: text } }))
                }
                placeholder="URL de YouTube"
                style={styles.input}
              />
              <TouchableOpacity onPress={() => seleccionarVideo(tema.id)} style={styles.boton}>
                <Text style={styles.botonTexto}>🎥 Cambiar video desde celular</Text>
              </TouchableOpacity>
              {editando[tema.id].video_local && (
                <Text style={{ marginBottom: 10 }}>📁 {editando[tema.id].video_local?.fileName || 'Video cargado'}</Text>
              )}
              <View style={styles.inlineButtons}>
                <Button title="Guardar" onPress={() => guardarEdicion(tema.id)} />
                <Button
                  title="Cancelar"
                  color="gray"
                  onPress={() => {
                    const copia = { ...editando };
                    delete copia[tema.id];
                    setEditando(copia);
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.temaTitulo}>{tema.titulo}</Text>
              <Text style={{ color: '#666' }}>{tema.descripcion}</Text>
              {tema.video_youtube_url && <Text>🎥 YouTube: {tema.video_youtube_url}</Text>}
              {tema.video_supabase_url && <Text>📁 Video: {tema.video_supabase_url}</Text>}
              <View style={styles.inlineButtons}>
                <Button
                  title="Editar"
                  onPress={() => setEditando((prev) => ({ ...prev, [tema.id]: tema }))}
                />
                <Button title="Eliminar" color="red" onPress={() => eliminarTema(tema.id)} />
              </View>
            </>
          )}
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
  boton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonTexto: {
    color: '#fff',
  },
  temaBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  temaTitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
