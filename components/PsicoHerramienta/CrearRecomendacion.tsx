// components/PsicoHerramienta/CrearRecomendacion.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import CustomSelector from './CustomSelector';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

interface Recomendacion {
  id: string;
  estudiante: string;
  id_grupo: string;
  motivo: string;
  grupo_titulo?: string;
  estudiante_nombre?: string;
}

export default function CrearRecomendacion() {
  const [estudiantes, setEstudiantes] = useState<{ id: string; full_name: string }[]>([]);
  const [grupos, setGrupos] = useState<{ id_g: string; titulo: string }[]>([]);
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: '', // para editar
    estudiante: '',
    grupo: '',
    motivo: '',
  });

  const [modalVisible, setModalVisible] = useState(false);

  // Obtener psicólogo id globalmente
  const [psicologoId, setPsicologoId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const pid = userData?.user?.id;
      if (!pid) return;
      setPsicologoId(pid);

      // Solicitudes aceptadas para estudiantes
      const { data: solicitudes, error: errorSolicitudes } = await supabase
        .from('solicitudes_apoyo')
        .select('de, profiles:de (id, full_name)')
        .eq('para', pid)
        .eq('estado', 'aceptado');

      if (errorSolicitudes) {
        console.error('Error obteniendo solicitudes:', errorSolicitudes);
      } else {
        setEstudiantes(
          (solicitudes || []).map((s: any) => ({
            id: s.profiles?.id ?? '',
            full_name: s.profiles?.full_name ?? '',
          }))
        );
      }

      // Grupos activos
      const { data: gruposData, error: errorGrupos } = await supabase
        .from('mg_grupos')
        .select('id_g, titulo')
        .eq('grupo_apoyo', true);

      if (errorGrupos) {
        console.error('Error obteniendo grupos:', errorGrupos);
      } else {
        setGrupos(gruposData || []);
      }

      // Cargar recomendaciones existentes
      await cargarRecomendaciones(pid);

      setLoading(false);
    };

    fetchData();
  }, []);

  const cargarRecomendaciones = async (pid: string) => {
    const { data, error } = await supabase
      .from('recomendaciones_grupo')
      .select('id, estudiante, psicologo, motivo, id_grupo, mg_grupos(id_g, titulo)')
      .eq('psicologo', pid)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error cargando recomendaciones:', error);
      return;
    }

    // Mapear para facilitar lectura
    const recomendacionesMapeadas = (data || []).map((r: any) => ({
      id: r.id,
      estudiante: r.estudiante,
      motivo: r.motivo,
      id_grupo: r.id_grupo,
      grupo_titulo: r.mg_grupos?.titulo || 'Sin título',
    }));

    setRecomendaciones(recomendacionesMapeadas);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const limpiarFormulario = () => {
    setForm({
      id: '',
      estudiante: '',
      grupo: '',
      motivo: '',
    });
    setModalVisible(false);
  };

  const guardarRecomendacion = async () => {
    if (!form.estudiante || !form.grupo || !form.motivo.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);

    if (form.id) {
      // Actualizar recomendación existente
      const { error } = await supabase
        .from('recomendaciones_grupo')
        .update({
          estudiante: form.estudiante,
          id_grupo: form.grupo,
          motivo: form.motivo.trim(),
        })
        .eq('id', form.id);

      if (error) {
        Alert.alert('Error', 'No se pudo actualizar la recomendación.');
        console.error('Error actualizando recomendación:', error);
      } else {
        Alert.alert('Éxito', 'Recomendación actualizada.');
        limpiarFormulario();
        await cargarRecomendaciones(psicologoId);
      }
    } else {
      // Crear nueva recomendación
      const { error } = await supabase.from('recomendaciones_grupo').insert({
        psicologo: psicologoId,
        estudiante: form.estudiante,
        id_grupo: form.grupo,
        motivo: form.motivo.trim(),
      });

      if (error) {
        Alert.alert('Error', 'No se pudo guardar la recomendación.');
        console.error('Error insertando recomendación:', error);
      } else {
        Alert.alert('Éxito', 'Recomendación guardada.');
        limpiarFormulario();
        await cargarRecomendaciones(psicologoId);
      }
    }

    setLoading(false);
  };

  const editarRecomendacion = (rec: Recomendacion) => {
    setForm({
      id: rec.id,
      estudiante: rec.estudiante,
      grupo: rec.id_grupo,
      motivo: rec.motivo,
    });
    setModalVisible(true);
  };

  const eliminarRecomendacion = async (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro quieres eliminar esta recomendación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.from('recomendaciones_grupo').delete().eq('id', id);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar la recomendación.');
              console.error('Error eliminando recomendación:', error);
            } else {
              Alert.alert('Éxito', 'Recomendación eliminada.');
              await cargarRecomendaciones(psicologoId);
            }
            setLoading(false);
          },
        },
      ]
    );
  };
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Crear o Editar Recomendación</Text>

      <CustomSelector
        label="Seleccionar Estudiante"
        selectedValue={form.estudiante}
        onValueChange={(val) => handleChange('estudiante', val)}
        options={estudiantes.map((e) => ({ label: e.full_name, value: e.id }))}
      />

      <CustomSelector
        label="Seleccionar Grupo"
        selectedValue={form.grupo}
        onValueChange={(val) => handleChange('grupo', val)}
        options={grupos.map((g) => ({ label: g.titulo, value: g.id_g }))}
      />

      <Text style={styles.label}>Motivo</Text>
      <TextInput
        style={styles.textarea}
        multiline
        numberOfLines={4}
        value={form.motivo}
        onChangeText={(text) => handleChange('motivo', text)}
        placeholder="Describe la razón de la recomendación"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={guardarRecomendacion} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{form.id ? 'Actualizar Recomendación' : 'Guardar Recomendación'}</Text>}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Mis Recomendaciones</Text>

      {recomendaciones.length === 0 && <Text style={styles.mensaje}>No tienes recomendaciones creadas.</Text>}

      {recomendaciones.map((rec) => (
        <View key={rec.id} style={styles.card}>
          <Text style={styles.cardTitle}>{rec.grupo_titulo}</Text>
          <Text style={styles.cardSubtitle}>Motivo: {rec.motivo}</Text>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => editarRecomendacion(rec)}>
              <Text style={styles.buttonSmallText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.deleteButton} onPress={() => eliminarRecomendacion(rec.id)}>
              <Text style={styles.buttonSmallText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Recomendación</Text>

            <CustomSelector
              label="Seleccionar Estudiante"
              selectedValue={form.estudiante}
              onValueChange={(val) => handleChange('estudiante', val)}
              options={estudiantes.map((e) => ({ label: e.full_name, value: e.id }))}
            />

            <CustomSelector
              label="Seleccionar Grupo"
              selectedValue={form.grupo}
              onValueChange={(val) => handleChange('grupo', val)}
              options={grupos.map((g) => ({ label: g.titulo, value: g.id_g }))}
            />

            <Text style={styles.label}>Motivo</Text>
            <TextInput
              style={styles.textarea}
              multiline
              numberOfLines={4}
              value={form.motivo}
              onChangeText={(text) => handleChange('motivo', text)}
              placeholder="Describe la razón de la recomendación"
              placeholderTextColor="#888"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.button} onPress={guardarRecomendacion} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  limpiarFormulario();
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
    container: {
      padding: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: fontSize.subtitulo,
      marginVertical: 12,
    },
    label: {
      color: colors.text,
      fontSize: fontSize.parrafo,
      marginTop: 10,
      marginBottom: 6,
    },
    textarea: {
      backgroundColor: colors.secondary,
      color: colors.text,
      borderRadius: 6,
      padding: 10,
      textAlignVertical: 'top',
    },
    button: {
      marginTop: 20,
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    mensaje: {
      color: '#ccc',
      textAlign: 'center',
      marginVertical: 20,
    },
    card: {
      backgroundColor: colors.secondary,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    cardTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: fontSize.titulo,
    },
    cardSubtitle: {
      color: colors.text,
      fontSize: fontSize.subtitulo,
      marginTop: 6,
    },
    buttonsRow: {
      flexDirection: 'row',
      marginTop: 10,
    },
    editButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginRight: 10,
    },
    deleteButton: {
      backgroundColor: '#ff3b3b',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
    },
    buttonSmallText: {
      color: colors.text,
      fontSize: fontSize.parrafo,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 20,
    },
    modalTitle: {
      color: colors.text,
      fontWeight: 'bold',
      fontSize: fontSize.subtitulo,
      marginBottom: 12,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    cancelButton: {
      backgroundColor: '#555',
    },
  });
}