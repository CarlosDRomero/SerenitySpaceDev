// components/PsicoHerramienta/SolicitarApoyo.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import BotonTag from "@/components/ui/BotonTag"
import TarjetaSolicitud from './TarjetaSolicitud';

export default function SolicitarApoyo() {
  const [psicologos, setPsicologos] = useState<any[]>([]);
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [old, setOld] = useState(true)
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const psicologoId = userData?.user?.id;
      if (!psicologoId) return;

      const { data, error } = await supabase
        .from('solicitudes_apoyo')
        .select('id, de, motivo, fecha, estado, profiles:de (id, full_name, avatar_url)')
        .eq('de', userData.user?.id)

      if (error) {
        console.error('Error al obtener solicitudes:', error);
      } else {
        setSolicitudes(data);
        setOld(false)
      }
    };

    if (old) obtenerSolicitudes();
  }, [old]);
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
    const {data} = await supabase.from('solicitudes_apoyo').select("de").eq("de", estudianteId).eq("para", seleccionado).neq("estado", "rechazado").single()
    if (data) {
      Alert.alert("Ya has enviado solicitud", "Espera a que tu solicitud sea atendida, por favor.")
      return;
    }
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
      setOld(true)
      setSeleccionado(null);
    }
  };
  return (
    <>
    {solicitudes.length > 0 ? (
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: 'row',
          paddingHorizontal: 10,
          gap: 12,
        }}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
      >
        {solicitudes.map((s) => (
          <View key={s.id} style={{ width: 280 }}>
            <TarjetaSolicitud solicitud={s} />
          </View>
        ))}
      </ScrollView>
    ) : (
      <Text>No has enviado ninguna solicitud que no haya sido atendida</Text>
    )}
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona un psicólogo disponible:</Text>
      {
        psicologos.map(item =>
          <BotonTag style={styles.item} key={item.id} active ={seleccionado === item.id} onPress={() => setSeleccionado(item.id)} texto = {item.full_name}/> 


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
    </>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
    container: {
      marginVertical: 20,
    },
    titulo: {
      color: colors.text,
      fontSize: fontSize.subtitulo,
      marginBottom: 10,
    },
    item: {
      padding: 10,
      marginVertical: 4,
      borderRadius: 8,
    },
    textarea: {
      borderColor: '#666',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      color: colors.text,
      marginTop: 20,
      minHeight: 80,
    },
    boton: {
      marginTop: 20,
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    botonTexto: {
      color: "white",
      fontWeight: 'bold',
      fontSize: fontSize.parrafo,
    },
  });
}