// components/PsicoHerramienta/SolicitudesRecibidas.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function SolicitudesRecibidas() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const psicologoId = userData?.user?.id;
      if (!psicologoId) return;

      const { data, error } = await supabase
        .from('solicitudes_apoyo')
        .select('id, de, motivo, fecha, profiles:de (id, full_name, avatar_url)')
        .eq('para', psicologoId)
        .eq('estado', 'pendiente');

      if (error) {
        console.error('Error al obtener solicitudes:', error);
      } else {
        setSolicitudes(data);
      }
    };

    obtenerSolicitudes();
  }, []);

  const actualizarEstado = async (id: string, nuevoEstado: 'aceptado' | 'rechazado') => {
    const { error } = await supabase
      .from('solicitudes_apoyo')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar la solicitud.');
    } else {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Solicitudes Pendientes:</Text>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nombre}>{item.profiles?.full_name}</Text>
            <Text style={styles.motivo}>Motivo: {item.motivo}</Text>
            <Text style={styles.fecha}>Fecha: {new Date(item.fecha).toLocaleString()}</Text>
            <View style={styles.botonesFila}>
              <TouchableOpacity
                style={[styles.boton, styles.aceptar]}
                onPress={() => actualizarEstado(item.id, 'aceptado')}
              >
                <Text style={styles.botonTexto}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.boton, styles.rechazar]}
                onPress={() => actualizarEstado(item.id, 'rechazado')}
              >
                <Text style={styles.botonTexto}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  card: {
    backgroundColor: '#1c1c1c',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  nombre: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  motivo: {
    color: 'white',
    marginTop: 4,
  },
  fecha: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  botonesFila: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  boton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  aceptar: {
    backgroundColor: '#3CFF63',
  },
  rechazar: {
    backgroundColor: '#FF3C63',
  },
  botonTexto: {
    color: '#000',
    fontWeight: 'bold',
  },
});