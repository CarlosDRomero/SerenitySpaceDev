// /components/ModuloGrupos/EditorVisual/TemaEditor.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';
import { TemaType } from './editorTypes';

interface TemaEditorProps {
  temas: TemaType[];
  temaSeleccionadoId: string;
  recargar: () => void;
  onVolver: () => void;
}

export default function TemaEditor({ temas, temaSeleccionadoId, recargar, onVolver }: TemaEditorProps) {
  const [temaActual, setTemaActual] = useState<TemaType | null>(null);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [tipoVideo, setTipoVideo] = useState<'ninguno' | 'youtube' | 'subido'>('ninguno');
  const [mediaUrl, setMediaUrl] = useState('');
  const [progreso, setProgreso] = useState(0);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    const encontrado = temas.find((t) => t.id_t === temaSeleccionadoId);
    if (encontrado) {
      setTemaActual(encontrado);
      setTitulo(encontrado.titulo);
      setContenido(encontrado.contenido_texto || '');
      setTipoVideo(encontrado.tipo_video || 'ninguno');
      setMediaUrl(encontrado.media_url || '');
    }
  }, [temaSeleccionadoId, temas]);

  const convertirABuffer = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
  };

  const subirVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'video/*' });
    if (result.canceled || !result.assets?.[0]) return;

    const archivo = result.assets[0];
    const uri = archivo.uri;
    const nombre = `videos/${Date.now()}_${archivo.name || 'video.mp4'}`;

    setSubiendo(true);
    setProgreso(0);

    try {
      const buffer = await convertirABuffer(uri);

      const { error } = await supabase.storage
        .from('srtgrupos')
        .upload(nombre, buffer, {
          contentType: archivo.mimeType || 'video/mp4',
        });

      if (error) throw error;

      const { data } = supabase.storage.from('srtgrupos').getPublicUrl(nombre);
      setMediaUrl(data.publicUrl);
      Alert.alert('✅ Video subido correctamente');
    } catch (e: any) {
      Alert.alert('❌ Error al subir video', e.message || 'Desconocido');
    }

    setSubiendo(false);
    setProgreso(1);
  };

  const cancelar = async () => {
    if (mediaUrl) {
      const path = mediaUrl.split('/storage/v1/object/public/srtgrupos/')[1];
      await supabase.storage.from('srtgrupos').remove([path]);
      setMediaUrl('');
    }
    setProgreso(0);
  };

  const guardarCambios = async () => {
    if (!temaActual) return;

    const campos = {
      titulo,
      contenido_texto: contenido,
      tipo_video: tipoVideo,
      media_url: tipoVideo !== 'ninguno' ? mediaUrl : '',
    };

    const { error } = await supabase
      .from('mg_temas')
      .update(campos)
      .eq('id_t', temaActual.id_t);

    if (error) {
      Alert.alert('Error al guardar', error.message);
    } else {
      Alert.alert('✅ Cambios guardados');
      recargar();
    }
  };

  const eliminarTema = async () => {
    if (!temaActual) return;

    Alert.alert(
      '¿Eliminar tema?',
      'Esta acción no se puede deshacer. ¿Seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('mg_temas')
              .delete()
              .eq('id_t', temaActual.id_t);

            if (error) {
              Alert.alert('Error al eliminar', error.message);
            } else {
              Alert.alert('✅ Tema eliminado');
              recargar();
              onVolver();
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {temaActual ? (
        <>
          {/* FORMULARIO */}
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Título del tema"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Contenido</Text>
          <TextInput
            style={[styles.input, { height: 120 }]}
            value={contenido}
            onChangeText={setContenido}
            multiline
            placeholder="Contenido"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Tipo de contenido</Text>
          <View style={styles.optionsRow}>
            {['ninguno', 'youtube', 'subido'].map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[styles.optionButton, tipoVideo === tipo && styles.optionSelected]}
                onPress={() => setTipoVideo(tipo as any)}
              >
                <Text style={styles.optionText}>{tipo}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {tipoVideo === 'youtube' && (
            <>
              <Text style={styles.label}>URL de YouTube</Text>
              <TextInput
                style={styles.input}
                value={mediaUrl}
                onChangeText={setMediaUrl}
                placeholder="https://youtube.com/..."
                placeholderTextColor="#888"
              />
            </>
          )}

          {tipoVideo === 'subido' && (
            <>
              <TouchableOpacity
                style={[styles.boton, subiendo && { backgroundColor: '#888' }]}
                onPress={subirVideo}
                disabled={subiendo}
              >
                <Text style={styles.botonTexto}>{subiendo ? 'Subiendo...' : 'Subir video'}</Text>
              </TouchableOpacity>

              {progreso > 0 && progreso < 1 && (
                <Text style={styles.progressText}>
                  Subiendo: {(progreso * 100).toFixed(1)}%
                </Text>
              )}

              {mediaUrl !== '' && (
                <View style={styles.miniaturaContainer}>
                  <Text style={{ color: '#aaa', fontSize: 12 }}>
                    {mediaUrl.split('/').pop()}
                  </Text>
                </View>
              )}
            </>
          )}

          {/* BOTONES */}
          <TouchableOpacity style={styles.boton} onPress={guardarCambios}>
            <Text style={styles.botonTexto}>Guardar Cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.boton, { backgroundColor: '#FF4E4E' }]} onPress={eliminarTema}>
            <Text style={styles.botonTexto}>🗑️ Eliminar Tema</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.boton, { backgroundColor: '#888' }]} onPress={onVolver}>
            <Text style={styles.botonTexto}>🔙 Volver</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={{ color: 'white' }}>No hay tema seleccionado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#0c0c0c', borderRadius: 10 },
  label: { color: 'white', fontWeight: 'bold', marginTop: 10 },
  input: { backgroundColor: '#1a1a1a', color: 'white', borderRadius: 10, padding: 10, marginTop: 5, marginBottom: 10 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
  optionButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 10, backgroundColor: '#1a1a1a', alignItems: 'center' },
  optionSelected: { backgroundColor: '#3C63FF' },
  optionText: { color: 'white' },
  boton: { backgroundColor: '#3C63FF', padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
  botonTexto: { color: 'white', fontWeight: 'bold' },
  progressText: { color: '#aaa', fontSize: 12, marginTop: 5 },
  miniaturaContainer: { backgroundColor: '#1a1a1a', padding: 10, borderRadius: 8, marginTop: 10 },
});
