import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';

export default function CrearGrupo() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [iconoUrl, setIconoUrl] = useState<string | null>(null);
  const [grupoApoyo, setGrupoApoyo] = useState(false);

  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoIcono, setSubiendoIcono] = useState(false);
  const [progresoImagen, setProgresoImagen] = useState(0);
  const [progresoIcono, setProgresoIcono] = useState(0);

  const puedeCrear = !subiendoImagen && !subiendoIcono && titulo.trim() && descripcion.trim();

  const convertirABuffer = async (uri: string, onProgress: (bytes: number, total: number) => void) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const total = fileInfo.exists && 'size' in fileInfo ? fileInfo.size! : 0;
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const byteArray = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));
    let uploaded = 0;
    const chunkSize = 10000;
    for (let i = 0; i < byteArray.length; i += chunkSize) {
      uploaded += chunkSize;
      onProgress(Math.min(uploaded, total), total);
    }
    return byteArray.buffer;
  };

  const subirArchivo = async (
    uri: string,
    carpeta: string,
    nombre: string,
    tipo: 'imagen' | 'icono',
    setUrl: (url: string | null) => void,
    setSubiendo: (v: boolean) => void,
    setProgreso: (v: number) => void
  ) => {
    try {
      setSubiendo(true);
      setProgreso(0);
      const buffer = await convertirABuffer(uri, (subido, total) => {
        setProgreso(subido / 1024);
      });

      const { error } = await supabase.storage
        .from('srtgrupos')
        .upload(`${carpeta}/${nombre}`, buffer, {
          contentType: 'image/jpeg',
        });

      if (error) {
        Alert.alert('Error al subir', error.message);
        setSubiendo(false);
        return;
      }

      const { data } = supabase.storage.from('srtgrupos').getPublicUrl(`${carpeta}/${nombre}`);
      setUrl(data.publicUrl);
    } catch (e) {
      Alert.alert('Error', 'No se pudo subir');
    } finally {
      setSubiendo(false);
    }
  };

  const seleccionarImagen = async (tipo: 'imagen' | 'icono') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // ✅ permite recortar
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const nombre = `${tipo}_${Date.now()}.jpg`;
    const carpeta = tipo === 'imagen' ? 'imagenesgrupos' : 'iconosgrupos';

    subirArchivo(
      uri,
      carpeta,
      nombre,
      tipo,
      tipo === 'imagen' ? setImagenUrl : setIconoUrl,
      tipo === 'imagen' ? setSubiendoImagen : setSubiendoIcono,
      tipo === 'imagen' ? setProgresoImagen : setProgresoIcono
    );
  };

  const cancelar = async () => {
    const eliminar = async (url: string | null) => {
      if (!url) return;
      const path = url.split('/storage/v1/object/public/srtgrupos/')[1];
      await supabase.storage.from('srtgrupos').remove([path]);
    };
    await eliminar(imagenUrl);
    await eliminar(iconoUrl);

    setTitulo('');
    setDescripcion('');
    setImagenUrl(null);
    setIconoUrl(null);
    setGrupoApoyo(false);
    setProgresoImagen(0);
    setProgresoIcono(0);
  };

  const crearGrupo = async () => {
    if (!puedeCrear) return;

    const { error } = await supabase.from('mg_grupos').insert({
      titulo,
      descripcion,
      imagen_url: imagenUrl,
      icono_url: iconoUrl,
      grupo_apoyo: grupoApoyo,
      activo: true,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Grupo creado');
      cancelar();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Título del grupo"
          placeholderTextColor="#aaa"
          value={titulo}
          onChangeText={setTitulo}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Descripción"
          placeholderTextColor="#aaa"
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <TouchableOpacity style={styles.button} onPress={() => seleccionarImagen('imagen')}>
          <Text style={styles.buttonText}>Subir imagen</Text>
        </TouchableOpacity>
        {imagenUrl && <Image source={{ uri: imagenUrl }} style={styles.preview} />}
        {subiendoImagen && <Text style={styles.progress}>{progresoImagen.toFixed(1)} KB subidos</Text>}

        <TouchableOpacity style={styles.button} onPress={() => seleccionarImagen('icono')}>
          <Text style={styles.buttonText}>Subir ícono</Text>
        </TouchableOpacity>
        {iconoUrl && <Image source={{ uri: iconoUrl }} style={styles.previewSmall} />}
        {subiendoIcono && <Text style={styles.progress}>{progresoIcono.toFixed(1)} KB subidos</Text>}

        <View style={styles.switchContainer}>
          <Text style={styles.label}>¿Grupo de apoyo emocional?</Text>
          <Switch value={grupoApoyo} onValueChange={setGrupoApoyo} />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: puedeCrear ? '#3C63FF' : '#888' }]}
          disabled={!puedeCrear}
          onPress={crearGrupo}
        >
          <Text style={styles.buttonText}>Crear grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF4E4E' }]} onPress={cancelar}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  container: {
    padding: 20,
    backgroundColor: '#0c0c0c',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3C63FF',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  preview: { width: '100%', height: 150, borderRadius: 10, marginTop: 10 },
  previewSmall: { width: 80, height: 80, borderRadius: 10, marginTop: 10 },
  progress: { color: '#aaa', fontSize: 12, marginTop: 5 },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  label: { color: 'white', fontSize: 16 },
});