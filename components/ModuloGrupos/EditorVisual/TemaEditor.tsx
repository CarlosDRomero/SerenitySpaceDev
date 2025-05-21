// /components/ModuloGrupos/EditorVisual/TemaEditor.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import { supabase } from '@/utils/supabase';
import { TemaType, tipo_contenido_tema, tipos_contenido } from './editorTypes';
import AudioRecorder from '@/components/ui/AudioRecorder';
import { ArchivoDocumentPicker, ArchivoSubido, ArchivoURI, pickPorTipo } from '@/utils/files';
import useSubirArchivo from '@/hooks/useFileUpload';
import { cn } from '@/cn';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import BotonTag from '@/components/ui/BotonTag';
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
  const [tipoArchivo, setTipoArchivo] = useState<tipo_contenido_tema>('ninguno');
  const [archivo, setArchivo] = useState<ArchivoSubido | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const {fileUrl, progreso, subiendo} = useSubirArchivo(`${tipoArchivo}s`, archivo)
  useEffect(()=>{
    if (fileUrl) {
      setArchivo(null)
      setMediaUrl(fileUrl)
    }
  }, [fileUrl])
  useEffect(() => {
    const encontrado = temas.find((t) => t.id_t === temaSeleccionadoId);
    if (encontrado) {
      setTemaActual(encontrado);
      setTitulo(encontrado.titulo);
      setContenido(encontrado.contenido_texto || '');
      setTipoArchivo(encontrado.tipo_video || 'ninguno');
      setMediaUrl(encontrado.media_url || '');
    }
  }, [temaSeleccionadoId, temas]);

  const seleccionarArchivo = async () => {
    const archivo = await pickPorTipo(`${tipoArchivo}/*`)
    if (archivo === null) return
    setArchivo(new ArchivoDocumentPicker(archivo))
  };
  

  const guardarCambios = async () => {
    if (!temaActual) return;

    const campos = {
      titulo,
      contenido_texto: contenido,
      tipo_video: tipoArchivo,
      media_url: tipoArchivo !== 'ninguno' ? mediaUrl : '',
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
  const isYoutubeValid = youtubeUrl.startsWith("https://youtube.com/") || youtubeUrl.startsWith("https://youtu.be/")
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
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
          <ScrollView style={styles.optionsRow} horizontal showsHorizontalScrollIndicator = {false}>
            {tipos_contenido.map((tipo) => (
              <BotonTag texto={tipo} key={tipo} active = {tipoArchivo === tipo} onSecondary onPress={() => setTipoArchivo(tipo)}/>
            ))}
          </ScrollView>

          {tipoArchivo === 'video' && (
            <>
              <Text style={styles.label}>URL de YouTube</Text>
              <View className="flex-row gap-x-2 items-center justify-between w-full">

                <TextInput
                className='w-56'
                  style={styles.input}
                  value={youtubeUrl}
                  onChangeText={setYoutubeUrl}
                  placeholder="https://youtube.com/..."
                  placeholderTextColor="#888"
                  />
                <TouchableOpacity className={cn("bg-emerald-500 rounded-lg p-3", (subiendo || !isYoutubeValid) && "bg-slate-600")} 
                disabled = {subiendo || !isYoutubeValid} onPress={()=>{
                  if (isYoutubeValid)
                    setMediaUrl(youtubeUrl)
                }}>
                  <Text className='text-white align-middle font-bold'>Aceptar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.boton, (subiendo) && { backgroundColor: '#888' }]}
                onPress={seleccionarArchivo}
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
          {tipoArchivo === 'audio' && (
            <>
              <AudioRecorder onAudioSaved={(uri: string)=>{
                setArchivo(new ArchivoURI(uri))
              }}/>
              <TouchableOpacity
                style={[styles.boton, subiendo && { backgroundColor: '#888' }]}
                onPress={seleccionarArchivo}
                disabled={subiendo}
              >
                <Text style={styles.botonTexto}>{subiendo ? 'Subiendo...' : 'Subir audio'}</Text>
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
        <Text style={{ color: colors.text }}>No hay tema seleccionado.</Text>
      )}
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
    container: { padding: 20, backgroundColor: colors.secondary, borderRadius: 10 },
    label: { color: colors.text, fontSize: fontSize.parrafo, fontWeight: 'bold', marginTop: 10 },
    input: { backgroundColor: colors.background, color: colors.text, fontSize: fontSize.parrafo, borderRadius: 10, padding: 10, marginTop: 5, marginBottom: 10 },
    optionsRow: { flexDirection: 'row', marginVertical: 10 },
    optionButton: { flex: 1, paddingVertical: 10, marginHorizontal: 5, borderRadius: 10, backgroundColor: '#1a1a1a', alignItems: 'center' },
    optionSelected: { backgroundColor: '#3C63FF' },
    optionText: { color: 'white' },
    boton: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
    botonTexto: { color: 'white', fontWeight: 'bold' },
    progressText: { color: '#aaa', fontSize: 12, marginTop: 5 },
    miniaturaContainer: { backgroundColor: '#1a1a1a', padding: 10, borderRadius: 8, marginTop: 10 },
});
}
