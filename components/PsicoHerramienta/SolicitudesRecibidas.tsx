// components/PsicoHerramienta/SolicitudesRecibidas.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import TarjetaSolicitud from './TarjetaSolicitud';

export default function SolicitudesRecibidas() {
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)
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
      {
        solicitudes.map(item => 
          <TarjetaSolicitud solicitud={item} key={item.id} actualizarEstado={actualizarEstado}/>
        )
      }
      {/* <FlatList
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
      /> */}
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme)=>{
  return StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    titulo: {
      color: colors.text,
      fontSize: fontSize.subtitulo,
      marginBottom: 10,
    }
  });
}