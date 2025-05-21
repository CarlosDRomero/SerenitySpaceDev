// components/PsicoHerramienta/VerRecomendacionesEstudiante.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
interface Recomendacion {
  id: string;
  grupo_titulo: string;
  motivo: string;
  fecha: string;
}

export default function VerRecomendacionesEstudiante() {
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [usuarioId, setUsuarioId] = useState<string>('');
  
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)

  useEffect(() => {
    const fetchRecomendaciones = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData?.user?.id;
      if (!uid) return;
      setUsuarioId(uid);

      const { data, error } = await supabase
        .from('recomendaciones_grupo')
        .select(`
          id,
          motivo,
          fecha,
          mg_grupos(id_g, titulo)
        `)
        .eq('estudiante', uid)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error cargando recomendaciones:', error);
        return;
      }

      const formateadas = (data || []).map((r: any) => ({
        id: r.id,
        motivo: r.motivo,
        fecha: r.fecha,
        grupo_titulo: r.mg_grupos?.titulo || 'Sin título',
      }));

      setRecomendaciones(formateadas);
    };

    fetchRecomendaciones();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Recomendaciones de Grupo</Text>

      <ScrollView style={{ marginTop: 10 }}>
        {recomendaciones.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.grupoTitulo}>{r.grupo_titulo}</Text>
            <Text style={styles.motivo}>Motivo: {r.motivo || 'Sin motivo'}</Text>
            <Text style={styles.fecha}>{new Date(r.fecha).toLocaleDateString()}</Text>
          </View>
        ))}
        {recomendaciones.length === 0 && (
          <Text style={styles.mensaje}>No tienes recomendaciones de grupo.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
    container: {
      padding: 16,
    },
    titulo: {
      color: colors.text,
      fontSize: fontSize.subtitulo,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    card: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    grupoTitulo: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: fontSize.subtitulo,
    },
    motivo: {
      color: colors.text,
      marginTop: 6,
    },
    fecha: {
      color: '#888',
      marginTop: 4,
      fontStyle: 'italic',
    },
    mensaje: {
      color: '#ccc',
      textAlign: 'center',
      marginTop: 20,
    },
  });
}