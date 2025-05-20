import { useEffect, useState } from 'react';
import {
  View, Text, Image, Button, ActivityIndicator,
  TextInput, TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { StyleSheet } from 'react-native';

export default function PerfilUsuario() {
  const { id } = useLocalSearchParams();
  const [perfil, setPerfil] = useState<any>(null);
  const [relacion, setRelacion] = useState<'amistad' | 'pendiente' | null>(null);
  const [yo, setYo] = useState<string>('');
  const [esPropio, setEsPropio] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [loading, setLoading] = useState(true);

  // contenido extendido
  const [bio, setBio] = useState('');
  const [intereses, setIntereses] = useState('');
  const [emocional, setEmocional] = useState('');

  useEffect(() => {
    const cargarPerfil = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const miId = userData?.user?.id;

      if (!miId || typeof id !== 'string') {
        setLoading(false);
        return;
      }

      setYo(miId);
      setEsPropio(miId === id);

      const { data: perfilData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', id)
        .single();

      setPerfil(perfilData);
      setNuevoNombre(perfilData?.full_name || '');

      const { data: contenidoData } = await supabase
        .from('perfil_contenido')
        .select('biografia, intereses, estado_emocional')
        .eq('id_profile', id)
        .single();

      if (contenidoData) {
        setBio(contenidoData.biografia || '');
        setIntereses(contenidoData.intereses || '');
        setEmocional(contenidoData.estado_emocional || '');
      }

      if (miId !== id) {
        const { data: relaciones } = await supabase
          .from('amistades')
          .select('de, para, estado')
          .or(`and(de.eq.${miId},para.eq.${id}),and(de.eq.${id},para.eq.${miId})`);

        const relacionExistente = relaciones?.[0];
        if (relacionExistente?.estado === 'aceptado') setRelacion('amistad');
        else if (relacionExistente?.estado === 'pendiente') setRelacion('pendiente');
        else setRelacion(null);
      }

      setLoading(false);
    };

    if (id) cargarPerfil();
  }, [id]);

  const enviarSolicitud = async () => {
    if (!yo || typeof id !== 'string') return;

    const { data: existentes } = await supabase
      .from('amistades')
      .select('id')
      .or(`and(de.eq.${yo},para.eq.${id}),and(de.eq.${id},para.eq.${yo})`);

    if (existentes && existentes.length > 0) return;

    const { error } = await supabase.from('amistades').insert({
      de: yo,
      para: id,
      estado: 'pendiente',
    });

    if (!error) setRelacion('pendiente');
  };

  const convertirABuffer = async (uri: string) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return Uint8Array.from(atob(file), (c) => c.charCodeAt(0)).buffer;
  };

  const cambiarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (result.canceled || !result.assets?.length) return;

    const uri = result.assets[0].uri;
    const path = `perfiles/avatar_${yo}.jpg`;
    const buffer = await convertirABuffer(uri);

    const { error: uploadError } = await supabase.storage
      .from('srtgrupos')
      .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from('srtgrupos').getPublicUrl(path);
      const avatar_url = `${data?.publicUrl}?v=${Date.now()}`;

      await supabase.from('profiles').update({ avatar_url }).eq('id', yo);
      setPerfil((prev: any) => ({ ...prev, avatar_url }));
    }
  };

  const guardarCambios = async () => {
    await supabase.from('profiles').update({ full_name: nuevoNombre }).eq('id', yo);
    // Actualiza el nombre localmente también
    setPerfil((prev: any) => ({ ...prev, full_name: nuevoNombre }));

    await supabase
      .from('perfil_contenido')
      .upsert({
        id_profile: yo,
        biografia: bio,
        intereses: intereses,
        estado_emocional: emocional,
        ultima_actualizacion: new Date(),
      });

    setEditando(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      {perfil?.avatar_url && (
        <Image source={{ uri: perfil.avatar_url }} style={{ width: 80, height: 80, borderRadius: 40, alignSelf: 'center' }} />
      )}
      {!editando ? (
        <>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 }}>
            {perfil?.full_name}
          </Text>
          <View style={{ marginTop: 20 }}>
            {bio ? <Text>📘 {bio}</Text> : null}
            {intereses ? <Text>🌱 {intereses}</Text> : null}
            {emocional ? <Text>💬 {emocional}</Text> : null}
          </View>
        </>
      ) : (
        <>
          
          
          <Text style={estilos.label}>Nombre</Text>          
          <TextInput          
            value={nuevoNombre}
            onChangeText={setNuevoNombre}
            placeholder="Tu nombre"
            style={estilos.input}
          />

          <Text style={estilos.label}>Biografía</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Escribe tu biografía"
            multiline
            style={estilos.input}
          />

          <Text style={estilos.label}>Intereses</Text>
          <TextInput
            value={intereses}
            onChangeText={setIntereses}
            placeholder="Tus intereses"
            multiline
            style={estilos.input}
          />

          <Text style={estilos.label}>Estado emocional</Text>
          <TextInput
            value={emocional}
            onChangeText={setEmocional}
            placeholder="¿Cómo te sientes últimamente?"
            multiline
            style={estilos.input}
          />
        </>
      )}

      {esPropio ? (
        <>
          {!editando ? (
            <>
              <Button title="Editar perfil" onPress={() => setEditando(true)} />
              <Button title="Cambiar imagen" onPress={cambiarImagen} color="#888" />
            </>
          ) : (
            <>
              <Button title="Guardar cambios" onPress={guardarCambios} />
              <Button title="Cancelar" color="gray" onPress={() => setEditando(false)} />
            </>
          )}
        </>
      ) : relacion === 'amistad' ? (
        <Text style={{ color: 'green', marginTop: 10 }}>Ya son amigos</Text>
      ) : relacion === 'pendiente' ? (
        <Text style={{ color: 'orange', marginTop: 10 }}>Solicitud enviada</Text>
      ) : (
        <Button title="Enviar solicitud de amistad" onPress={enviarSolicitud} />
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',         // asegúrate de que no sea blanco sobre blanco
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 12,
  },
});
