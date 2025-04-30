// 💡 React Native + Expo app para manejo de grupos con Supabase
// Estructura: Crear grupo, ver lista, administrar módulos y temas (como Platzi móvil)

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/utils/supabase';

type Props = {
  onFinish: () => void;
};

export default function GrCrearGrupo({ onFinish }: Props) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagen(result.assets[0]);
    }
  };

  const crearGrupo = async () => {
    if (!nombre.trim()) return Alert.alert('Nombre requerido', 'Debes ingresar un nombre para el grupo.');

    let imagenUrl = null;

    if (imagen) {
      const uri = imagen.uri;
      const fileExt = uri.split('.').pop();
      const fileName = `grupo_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('fotoyvideo')
        .upload(fileName, decode(imagen.base64 || ''), {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) {
        console.error('Error al subir imagen:', uploadError);
        return Alert.alert('Error al subir imagen');
      }

      const { data: urlData } = supabase.storage.from('fotoyvideo').getPublicUrl(fileName);
      imagenUrl = urlData?.publicUrl || null;
    }

    const { error: insertError } = await supabase.from('gr_grupos').insert({
      nombre,
      descripcion,
      imagen_url: imagenUrl,
    });

    if (insertError) {
      console.error('Error al crear grupo:', insertError);
      return Alert.alert('Error al crear grupo');
    }

    Alert.alert('✅ Grupo creado con éxito');
    setNombre('');
    setDescripcion('');
    setImagen(null);

    // Cambiar a vista de lista sin router
    onFinish();
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Crear nuevo grupo</Text>

      <TextInput
        placeholder="Nombre del grupo"
        value={nombre}
        onChangeText={setNombre}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />

      <TouchableOpacity onPress={pickImage} style={{ marginBottom: 10 }}>
        <Text style={{ color: 'blue' }}>
          {imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Text>
      </TouchableOpacity>

      {imagen?.uri && (
        <Image
          source={{ uri: imagen.uri }}
          style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 10 }}
        />
      )}

      <Button title="Crear grupo" onPress={crearGrupo} />
    </ScrollView>
  );
}
