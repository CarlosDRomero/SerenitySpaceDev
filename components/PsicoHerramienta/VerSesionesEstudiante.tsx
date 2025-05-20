// components/PsicoHerramienta/VerSesionesEstudiante.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase';

interface SesionClinica {
  id: string;
  fecha: string;
  numero_sesion: number;
  recomendaciones: string;
  etapa: string;
  grupo_titulo?: string;
}

export default function VerSesionesEstudiante() {
  const [sesiones, setSesiones] = useState<SesionClinica[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>('');

  useEffect(() => {
    const fetchSesiones = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return;
      setUsuarioId(uid);

      const { data, error } = await supabase
        .from('historial_clinico')
        .select(`
          id,
          fecha,
          numero_sesion,
          recomendaciones,
          etapa,
          mg_grupos(id_g, titulo),
          estudiante
        `)
        .eq('estudiante', uid);

      if (error) {
        console.error('Error cargando sesiones:', error);
        return;
      }

      const formateadas = (data || []).map((s: any) => ({
        id: s.id,
        fecha: s.fecha,
        numero_sesion: s.numero_sesion,
        recomendaciones: s.recomendaciones,
        etapa: s.etapa,
        grupo_titulo: s.mg_grupos?.titulo || undefined,
      }));

      setSesiones(formateadas);
    };

    fetchSesiones();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Sesiones Clínicas</Text>

      <ScrollView style={{ marginTop: 10 }}>
        {sesiones.map((s) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.info}>Sesión #{s.numero_sesion} - {new Date(s.fecha).toLocaleDateString()}</Text>
            <Text style={styles.info}>Etapa: {s.etapa}</Text>
            <Text style={styles.info}>Grupo sugerido: {s.grupo_titulo || 'Ninguno'}</Text>
            <Text style={styles.recomendacion}>Recomendaciones: {s.recomendaciones}</Text>
          </View>
        ))}
        {sesiones.length === 0 && <Text style={styles.mensaje}>No hay sesiones registradas.</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titulo: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  info: {
    color: 'white',
    marginTop: 4,
  },
  recomendacion: {
    color: '#bde0fe',
    marginTop: 6,
  },
  mensaje: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
});
