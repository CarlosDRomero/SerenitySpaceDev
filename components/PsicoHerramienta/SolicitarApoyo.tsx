// components/PsicoHerramienta/SolicitarApoyo.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function SolicitarApoyo() {
  const [psicologos, setPsicologos] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    const obtenerPsicologos = async () => {
        const { data: rolesData, error: rolesError } = await supabase
            .from('usuarios_roles')
            .select('id_profile')
            .eq('id_rol', 3); // 3 debe ser el ID del rol 'psicologo'

        if (rolesError) {
            console.error('Error obteniendo IDs de psicólogos:', rolesError);
            return;
        }

        const idsPsicologos = rolesData.map((r) => r.id_profile);

        const { data: perfiles, error: perfilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', idsPsicologos);

        if (perfilesError) {
            console.error('Error obteniendo perfiles:', perfilesError);
        } else {
            setPsicologos(perfiles);
        }
    };

    obtenerPsicologos();
  }, []);

  const enviarSolicitud = async () => {
    if (!seleccionado || !motivo.trim()) {
      Alert.alert('Campos incompletos', 'Selecciona un profesional y escribe un motivo.');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const estudianteId = userData?.user?.id;
    if (!estudianteId) return;

    const { error } = await supabase.from('solicitudes_apoyo').insert({
      de: estudianteId,
      para: seleccionado,
      tipo: 'psicologo',
      motivo,
    });

    if (error) {
      Alert.alert('Error', 'No se pudo enviar la solicitud.');
      console.error(error);
    } else {
      Alert.alert('Enviado', 'Tu solicitud ha sido enviada con éxito.');
      setMotivo('');
      setSeleccionado(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona un psicólogo disponible:</Text>
      {
        psicologos.map(item => 
          <TouchableOpacity
            key={item.id}
            style={[styles.item, seleccionado === item.id && styles.itemSeleccionado]}
            onPress={() => setSeleccionado(item.id)}
          >
            <Text style={styles.nombre}>{item.full_name}</Text>
          </TouchableOpacity>

        )
      }
      {/* <FlatList
        data={psicologos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, seleccionado === item.id && styles.itemSeleccionado]}
            onPress={() => setSeleccionado(item.id)}
          >
            <Text style={styles.nombre}>{item.full_name}</Text>
          </TouchableOpacity>
        )}
      /> */}

      <TextInput
        placeholder="Escribe el motivo de tu solicitud..."
        placeholderTextColor="#999"
        multiline
        style={styles.textarea}
        value={motivo}
        onChangeText={setMotivo}
      />

      <TouchableOpacity style={styles.boton} onPress={enviarSolicitud}>
        <Text style={styles.botonTexto}>Enviar Solicitud</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  titulo: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
  },
  itemSeleccionado: {
    backgroundColor: '#3C63FF',
  },
  nombre: {
    color: 'white',
    fontSize: 16,
  },
  textarea: {
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    color: 'white',
    marginTop: 20,
    minHeight: 80,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#3C63FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
