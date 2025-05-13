import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { supabase } from '@/utils/supabase';

export default function InsertarDatos() {
  const [texto, setTexto] = useState('');
  const [conexion, setConexion] = useState<'verificando' | 'exitosa' | 'fallida' | null>(null);

  const insertar = async () => {
    console.log('Intentando insertar:', texto);

    const { data, error } = await supabase
      .from('prueba_insert')
      .insert({ texto });

    if (error) {
      console.log('Error al insertar:', error.message);
      Alert.alert('Error al insertar', error.message);
    } else {
      console.log('Inserción exitosa:', data);
      Alert.alert('Éxito', 'Dato insertado correctamente');
      setTexto('');
    }
  };

  const probarConexion = async () => {
    setConexion('verificando');
    const { data, error } = await supabase.from('prueba_insert').select('*').limit(1);

    if (error) {
      console.log('Error de conexión real:', error.message);
      setConexion('fallida');
      Alert.alert('Error Supabase', error.message);
    } else {
      console.log('Conectado correctamente desde celular:', data);
      setConexion('exitosa');
      Alert.alert('Conexión exitosa', 'Supabase está conectado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Texto a insertar en Supabase</Text>
      <TextInput
        style={styles.input}
        placeholder="Escribe algo..."
        value={texto}
        onChangeText={setTexto}
      />

      <TouchableOpacity style={styles.btnInsertar} onPress={insertar}>
        <Text style={styles.btnTexto}>📤 Insertar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnProbar} onPress={probarConexion}>
        <Text style={styles.btnTexto}>🔌 Probar conexión</Text>
      </TouchableOpacity>

      {conexion === 'verificando' && <Text style={styles.estado}>⏳ Verificando conexión...</Text>}
      {conexion === 'exitosa' && <Text style={[styles.estado, { color: 'green' }]}>Conexión exitosa</Text>}
      {conexion === 'fallida' && <Text style={[styles.estado, { color: 'red' }]}>Conexión fallida</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnInsertar: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnProbar: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  estado: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
