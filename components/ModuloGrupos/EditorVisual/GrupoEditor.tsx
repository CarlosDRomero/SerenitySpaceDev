// /components/ModuloGrupos/EditorVisual/GrupoEditor.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';
import { GrupoType } from './editorTypes';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

interface GrupoEditorProps {
  grupo: GrupoType;
  onVolver: () => void;
  recargar: () => void;
}

export default function GrupoEditor({ grupo, onVolver, recargar }: GrupoEditorProps) {
  const [titulo, setTitulo] = useState(grupo.titulo);
  const [descripcion, setDescripcion] = useState(grupo.descripcion || '');
  const [imagenUrl, setImagenUrl] = useState<string | null>(grupo.imagen_url);
  const [iconoUrl, setIconoUrl] = useState<string | null>(grupo.icono_url);

  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [subiendoIcono, setSubiendoIcono] = useState(false);
  const [progresoImagen, setProgresoImagen] = useState(0);
  const [progresoIcono, setProgresoIcono] = useState(0);

  const puedeGuardar = !subiendoImagen && !subiendoIcono && titulo.trim() && descripcion.trim();
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)

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
        setProgreso(subido / 1024); // KB
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
      allowsEditing: true,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const nombre = `${tipo}_${Date.now()}.jpg`;
    const carpeta = tipo === 'imagen' ? 'imagenesgrupos' : 'iconosgrupos';

    await subirArchivo(
      uri,
      carpeta,
      nombre,
      tipo,
      tipo === 'imagen' ? setImagenUrl : setIconoUrl,
      tipo === 'imagen' ? setSubiendoImagen : setSubiendoIcono,
      tipo === 'imagen' ? setProgresoImagen : setProgresoIcono
    );
  };

  const eliminarArchivo = async (url: string | null, tipo: 'imagen' | 'icono') => {
    if (!url) return;
    const path = url.split('/storage/v1/object/public/srtgrupos/')[1];
    await supabase.storage.from('srtgrupos').remove([path]);
    if (tipo === 'imagen') setImagenUrl(null);
    else setIconoUrl(null);
  };

  const cancelarCambios = async () => {
    await eliminarArchivo(imagenUrl, 'imagen');
    await eliminarArchivo(iconoUrl, 'icono');
    onVolver();
  };

  const guardarCambios = async () => {
    if (!puedeGuardar) return;

    const { error } = await supabase
      .from('mg_grupos')
      .update({
        titulo,
        descripcion,
        imagen_url: imagenUrl,
        icono_url: iconoUrl,
      })
      .eq('id_g', grupo.id_g);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('✅ Grupo actualizado');
      recargar();
      onVolver();
    }
  };


  const confirmarEliminar = () => {
    Alert.alert(
      'Eliminar Grupo',
      '¿Seguro que quieres eliminar este grupo? Se borrarán todos sus módulos y temas asociados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: eliminarGrupo,
        },
      ]
    );
  };
  
  const eliminarGrupo = async () => {
    const { error } = await supabase
      .from('mg_grupos')
      .delete()
      .eq('id_g', grupo.id_g);
  
    if (error) {
      Alert.alert('Error al eliminar grupo', error.message);
    } else {
      Alert.alert('✅ Grupo eliminado');
      recargar();
      onVolver();
    }
  };
  


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título del grupo"
          placeholderTextColor="#aaa"
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción del grupo"
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={() => seleccionarImagen('imagen')}>
          <Text style={styles.buttonText}>Subir Imagen</Text>
        </TouchableOpacity>
        {imagenUrl && <Image source={{ uri: imagenUrl }} style={styles.preview} />}
        {subiendoImagen && <Text style={styles.progress}>{progresoImagen.toFixed(1)} KB subidos</Text>}

        <TouchableOpacity style={styles.button} onPress={() => seleccionarImagen('icono')}>
          <Text style={styles.buttonText}>Subir Ícono</Text>
        </TouchableOpacity>
        {iconoUrl && <Image source={{ uri: iconoUrl }} style={styles.previewSmall} />}
        {subiendoIcono && <Text style={styles.progress}>{progresoIcono.toFixed(1)} KB subidos</Text>}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: puedeGuardar ? colors.primary : '#888' }]}
          onPress={guardarCambios}
          disabled={!puedeGuardar}
        >
          <Text style={styles.buttonText}>Guardar Cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: '#FF4E4E' }]} onPress={cancelarCambios}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.button, { backgroundColor: '#FF0000' }]}
            onPress={confirmarEliminar}
            >
            <Text style={styles.buttonText}>Eliminar Grupo</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme)=>{
 return StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      paddingBottom: 50,
    },
    container: {
      padding: 20,
      backgroundColor: colors.secondary,
      borderRadius: 10,
    },
    input: {
      backgroundColor: colors.background,
      color: colors.text,
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      marginBottom: 15,
      fontSize: fontSize.parrafo
    },
    button: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: fontSize.parrafo
    },
    preview: {
      width: '100%',
      height: 150,
      borderRadius: 10,
      marginTop: 10,
    },
    previewSmall: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginTop: 10,
    },
    progress: {
      color: opposite.secondary,
      fontSize: fontSize.parrafo,
      marginTop: 5,
      
    },
  });
}
