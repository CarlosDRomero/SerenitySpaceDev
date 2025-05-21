import { useEffect, useState } from 'react';
import {
  View, Text, Image, ActivityIndicator, Button,
  TextInput, ScrollView, Alert, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/utils/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '@/providers/AuthProvider';
import { Profile } from '@/components/messaging/interfaces';

export default function MiPerfil() {
  const [perfil, setPerfil] = useState<Profile | null>(null);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [email, setEmail] = useState('');

  // Contenido extendido
  const [bio, setBio] = useState('');
  const [intereses, setIntereses] = useState('');
  const [emocional, setEmocional] = useState('');
  const {profile} = useAuth()
  useEffect(()=>{
    console.log("Profile loaded")
    if (profile)
    setPerfil(profile)
  }, [profile])
  const actualizarPerfil = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) return;

    await supabase
      .from('profiles')
      .update({ full_name: nuevoNombre })
      .eq('id', uid);

    const { error: errExtra } = await supabase
      .from('perfil_contenido')
      .upsert({
        id_profile: uid,
        biografia: bio,
        intereses: intereses,
        estado_emocional: emocional,
        ultima_actualizacion: new Date(),
      });

    if (!errExtra) {
      setPerfil((prev: any) => ({ ...prev, full_name: nuevoNombre }));
      Alert.alert('Éxito', 'Perfil actualizado');
      setEditando(false);
    } else {
      console.error('Error al guardar info adicional:', errExtra);
    }
  };

  const convertirABuffer = async (uri: string) => {
    const file = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return Uint8Array.from(atob(file), (c) => c.charCodeAt(0)).buffer;
  };

  const cambiarImagen = async () => {
    if (!perfil) return
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1,1]
    });

    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri; 
    const path = `perfiles/avatar_${perfil.id}.jpg`;
    const buffer = await convertirABuffer(uri);

    const { error: uploadError } = await supabase.storage
      .from('srtgrupos')
      .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });

    if (!uploadError) {
      const { data } = supabase.storage.from('srtgrupos').getPublicUrl(path);
      const avatar_url = `${data?.publicUrl}?v=${Date.now()}`;

      await supabase.from('profiles').update({ avatar_url }).eq('id', perfil.id);
      setPerfil((prev: any) => ({ ...prev, avatar_url }));
    }
  };

  return (
    // <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: "#00000060", borderRadius: 10, minWidth: "100%"}}>
        {(
          <View style={{ alignItems: 'center', gap: 10 }}>
            {perfil?.avatar_url && (
              <Image
                
                source={{ uri: perfil.avatar_url }}
                style={{ width: 80, height: 80, borderRadius: 40 , borderColor: "white", borderWidth: 2}}
              />
            )}

            {!editando ? (
              <>
                <Text style={styles.nombre}>{perfil?.full_name}</Text>
                <Text style={styles.email}>{email}</Text>
                <Text style={styles.campo}>{bio}</Text>
                <Text style={styles.campo}>{intereses}</Text>
                <Text style={styles.campo}>{emocional}</Text>
                <Button title="Editar perfil" onPress={() => setEditando(true)} />
              </>
            ) : (
              <>
                <TextInput
                  placeholderTextColor={"#eee"}
                  value={nuevoNombre}
                  onChangeText={setNuevoNombre}
                  placeholder="Tu nombre"
                  style={styles.input}
                />
                <TextInput
                  placeholderTextColor={"#eee"}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Biografía"
                  style={styles.input}
                  multiline
                />
                <TextInput
                  placeholderTextColor={"#eee"}
                  value={intereses}
                  onChangeText={setIntereses}
                  placeholder="Intereses"
                  style={styles.input}
                  multiline
                />
                <TextInput
                  placeholderTextColor={"#eee"}
                  value={emocional}
                  onChangeText={setEmocional}
                  placeholder="Estado emocional"
                  style={styles.input}
                  multiline
                />
                <Button title="Guardar cambios" onPress={actualizarPerfil} />
                <Button title="Cambiar foto de perfil" onPress={cambiarImagen} color="#888" disabled={perfil === null}/>
                <Button title="Cancelar" color="gray" onPress={() => setEditando(false)} />
              </>
            )}
          </View>
        )}
      </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  boton:{width: "100%"},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 10,
    color: "#fff",
    
  },
  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: "white"
  },
  email: {
    color: '#555',
    marginBottom: 10,
  },
  campo: {
    marginVertical: 4,
    fontSize: 14,
    color: '#333',
  },
});