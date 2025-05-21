// components/PsicoHerramienta/RegistrarSesion.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase';
import CustomSelector from './CustomSelector';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

export default function RegistrarSesion() {
  const [estudiantes, setEstudiantes] = useState<{ id: string; full_name: string }[]>([]);
  const [grupos, setGrupos] = useState<{ id_g: string; titulo: string }[]>([]);
  const [form, setForm] = useState({
    estudiante: '',
    numero_sesion: '',
    categoria_dsm5: '',
    descripcion: '',
    recomendaciones: '',
    grupo: '',
    etapa: 'evaluacion',
  });
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)
  useEffect(() => {
    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const psicologoId = userData?.user?.id;
      if (!psicologoId) return;

      const { data: solicitudes } = await supabase
        .from('solicitudes_apoyo')
        .select('de, profiles:de (id, full_name)')
        .eq('para', psicologoId)
        .eq('estado', 'aceptado');

      setEstudiantes(
        (solicitudes || []).map((s: any) => ({
            id: s.profiles?.id ?? '',
            full_name: s.profiles?.full_name ?? '',
        }))
        );


      const { data: gruposData } = await supabase
        .from('mg_grupos')
        .select('id_g, titulo')
        .eq('grupo_apoyo', true);

      setGrupos(gruposData || []);
    };

    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const guardarSesion = async () => {
    if (!form.estudiante || !form.etapa) {
      Alert.alert('Faltan campos obligatorios');
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const psicologoId = userData?.user?.id;

    const { error } = await supabase.from('historial_clinico').insert({
      estudiante: form.estudiante,
      psicologo: psicologoId,
      numero_sesion: form.numero_sesion ? parseInt(form.numero_sesion) : null,
      categoria_dsm5: form.categoria_dsm5,
      descripcion: form.descripcion,
      recomendaciones: form.recomendaciones,
      id_grupo_recomendado: form.grupo || null,
      etapa: form.etapa,
    });

    if (error) {
      console.error('Error insertando sesión:', error);
      Alert.alert('Error', 'No se pudo registrar la sesión.');
    } else {
      Alert.alert('Éxito', 'Sesión registrada exitosamente.');
      setForm({
        estudiante: '',
        numero_sesion: '',
        categoria_dsm5: '',
        descripcion: '',
        recomendaciones: '',
        grupo: '',
        etapa: 'evaluacion',
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CustomSelector
        label="Estudiante"
        selectedValue={form.estudiante}
        onValueChange={(value: string) => handleChange('estudiante', value)}
        options={estudiantes.map((e) => ({ label: e.full_name, value: e.id }))}
      />

      <Text style={styles.label}>Número de sesión:</Text>
      <TextInput
        value={form.numero_sesion}
        onChangeText={(text) => handleChange('numero_sesion', text)}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Categoría DSM-5:</Text>
      <TextInput
        value={form.categoria_dsm5}
        onChangeText={(text) => handleChange('categoria_dsm5', text)}
        style={styles.input}
      />

      <Text style={styles.label}>Descripción (solo para el psicólogo):</Text>
      <TextInput
        value={form.descripcion}
        onChangeText={(text) => handleChange('descripcion', text)}
        multiline
        style={styles.textarea}
      />

      <Text style={styles.label}>Recomendaciones para el estudiante:</Text>
      <TextInput
        value={form.recomendaciones}
        onChangeText={(text) => handleChange('recomendaciones', text)}
        multiline
        style={styles.textarea}
      />

      <CustomSelector
        label="Grupo sugerido (opcional)"
        selectedValue={form.grupo}
        onValueChange={(value: string) => handleChange('grupo', value)}
        options={[{ label: 'Ninguno', value: '' }, ...grupos.map((g) => ({ label: g.titulo, value: g.id_g }))]}
      />

      <CustomSelector
        label="Etapa"
        selectedValue={form.etapa}
        onValueChange={(value: string) => handleChange('etapa', value)}
        options={[
          { label: 'Evaluación', value: 'evaluacion' },
          { label: 'Seguimiento', value: 'seguimiento' },
          { label: 'Alta', value: 'alta' },
        ]}
      />

      <TouchableOpacity style={styles.boton} onPress={guardarSesion}>
        <Text style={styles.botonTexto}>Registrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme)=>{
 return StyleSheet.create({
    container: {
      paddingBottom: 50,
      paddingHorizontal: 16,
    },
    label: {
      color: colors.text,
      fontSize: fontSize.parrafo,
      marginTop: 10,
      marginBottom: 4,
    },
    input: {
      borderColor: '#555',
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      color: 'white',
    },
    textarea: {
      borderColor: '#555',
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
      color: 'white',
      minHeight: 80,
    },
    boton: {
      backgroundColor: colors.primary,
      padding: 12,
      marginTop: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    botonTexto: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
}