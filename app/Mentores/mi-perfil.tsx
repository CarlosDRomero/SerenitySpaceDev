import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '@/utils/supabase';

export default function MiPerfilTutor() {
  const [perfil, setPerfil] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [esTutor, setEsTutor] = useState(false);

  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;

      if (!uid) return;

      // Verificar rol tutor
      const { data: roles } = await supabase
        .from('usuarios_roles')
        .select('id_rol, roles(nombre)')
        .eq('id_profile', uid);

      const tieneRolTutor = roles?.some((r) => r.nombre === 'tutor');
      setEsTutor(tieneRolTutor);

      if (!tieneRolTutor) {
        setCargando(false);
        return;
      }

      // Cargar perfil general
      const { data: base } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', uid)
        .single();

      // Cargar perfil extendido tutor
      const { data: tutor } = await supabase
        .from('perfil_tutor')
        .select('*')
        .eq('id_profile', uid)
        .single();

      setPerfil(base);
      setEspecialidad(tutor?.especialidad || '');
      setDescripcion(tutor?.descripcion || '');
      setExperiencia(tutor?.experiencia || '');
      setDisponibilidad(tutor?.disponibilidad || '');
      setFotoUrl(tutor?.foto_url || null);

      setCargando(false);
    };

    cargarDatos();
  }, []);

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const nombre = `tutor_${Date.now()}.jpg`;

    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const buffer = Uint8Array.from(atob(file), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from('srtgrupos')
      .upload(`tutores/${nombre}`, buffer, {
        contentType: 'image/jpeg',
      });

    if (error) {
      Alert.alert('Error', 'No se pudo subir la imagen');
      return;
    }

    const { data } = supabase.storage.from('srtgrupos').getPublicUrl(`tutores/${nombre}`);
    setFotoUrl(data.publicUrl);
  };

  const guardar = async () => {
    if (!perfil?.id) return;
    setGuardando(true);

    const { data: existente } = await supabase
      .from('perfil_tutor')
      .select('id_profile')
      .eq('id_profile', perfil.id)
      .single();

    const datos = {
      especialidad,
      descripcion,
      experiencia,
      disponibilidad,
      foto_url: fotoUrl,
    };

    let error;

    if (existente) {
      ({ error } = await supabase
        .from('perfil_tutor')
        .update(datos)
        .eq('id_profile', perfil.id));
    } else {
      ({ error } = await supabase
        .from('perfil_tutor')
        .insert({ id_profile: perfil.id, ...datos }));
    }

    if (error) {
      Alert.alert('Error', 'No se pudo guardar');
    } else {
      Alert.alert('Perfil actualizado');
    }

    setGuardando(false);
  };

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!esTutor) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-lg">
          Solo los usuarios con rol <Text className="font-bold">tutor</Text> pueden editar este perfil.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
          Editar perfil como tutor
        </Text>

        <TouchableOpacity onPress={seleccionarImagen}>
          <Image
            source={{ uri: fotoUrl || perfil?.avatar_url }}
            style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 20 }}
          />
          <Text style={{ textAlign: 'center', color: '#3C63FF', marginBottom: 20 }}>
            Cambiar imagen
          </Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Especialidad"
          value={especialidad}
          onChangeText={setEspecialidad}
          style={estilo.input}
        />
        <TextInput
          placeholder="Experiencia"
          value={experiencia}
          onChangeText={setExperiencia}
          style={estilo.input}
        />
        <TextInput
          placeholder="Disponibilidad"
          value={disponibilidad}
          onChangeText={setDisponibilidad}
          style={estilo.input}
        />
        <TextInput
          placeholder="Descripción"
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          numberOfLines={4}
          style={[estilo.input, { height: 100 }]}
        />

        <TouchableOpacity
          onPress={guardar}
          disabled={guardando}
          style={{
            backgroundColor: '#3C63FF',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilo = {
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
};
