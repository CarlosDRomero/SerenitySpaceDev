// components/PsicoHerramienta/VerSesiones.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import CustomSelector from './CustomSelector';

interface SesionClinica {
  id: string;
  estudiante: string;
  full_name: string;
  psicologo: string;
  autor_nombre: string;
  fecha: string;
  numero_sesion: number;
  recomendaciones: string;
  etapa: string;
  grupo_titulo?: string;
  categoria_dsm5?: string;
  descripcion?: string;
}

interface Estudiante {
  id: string;
  full_name: string;
  avatar_url?: string | null;
}

export default function VerSesiones() {
  const [usuarioId, setUsuarioId] = useState<string>('');
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [filtroEstudiante, setFiltroEstudiante] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState<Estudiante | null>(null);

  const [sesiones, setSesiones] = useState<SesionClinica[]>([]);
  const [detalleSesion, setDetalleSesion] = useState<SesionClinica | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    id: '',
    estudiante: '',
    numero_sesion: '',
    categoria_dsm5: '',
    descripcion: '',
    recomendaciones: '',
    grupo: '',
    etapa: 'evaluacion',
  });
  const [loading, setLoading] = useState(false);
  const [grupos, setGrupos] = useState<{ id_g: string; titulo: string }[]>([]);

  // Obtener usuario autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) setUsuarioId(data.user.id);
    };
    getUser();
  }, []);

  // Cargar estudiantes (solicitudes aceptadas) y grupos
  useEffect(() => {
    if (!usuarioId) return;

    const fetchEstudiantesYGrupos = async () => {
      // Estudiantes con solicitudes aceptadas para este psicólogo
      const { data: solicitudes, error: errSoli } = await supabase
        .from('solicitudes_apoyo')
        .select('de, profiles:de (id, full_name, avatar_url)')
        .eq('para', usuarioId)
        .eq('estado', 'aceptado');

      if (errSoli) {
        console.error('Error cargando solicitudes:', errSoli);
        Alert.alert('Error cargando estudiantes');
        return;
      }

      const estudiantesFiltrados = (solicitudes || []).map((s: any) => ({
        id: s.profiles?.id ?? s.de,
        full_name: s.profiles?.full_name ?? 'Desconocido',
        avatar_url: s.profiles?.avatar_url ?? null,
      }));

      setEstudiantes(estudiantesFiltrados);

      // Grupos de apoyo activos
      const { data: gruposData, error: errGrupos } = await supabase
        .from('mg_grupos')
        .select('id_g, titulo')
        .eq('grupo_apoyo', true);

      if (errGrupos) {
        console.error('Error cargando grupos:', errGrupos);
        Alert.alert('Error cargando grupos');
        return;
      }
      setGrupos(gruposData || []);
    };

    fetchEstudiantesYGrupos();
  }, [usuarioId]);

  // Cargar sesiones para estudiante seleccionado
  const fetchSesiones = async (idEstudiante: string) => {
    const { data, error } = await supabase
      .from('historial_clinico')
      .select(`
        id,
        estudiante,
        psicologo,
        fecha,
        numero_sesion,
        recomendaciones,
        etapa,
        categoria_dsm5,
        descripcion,
        id_grupo_recomendado,
        mg_grupos(id_g, titulo),
        autor:psicologo (id, full_name)
      `)
      .eq('estudiante', idEstudiante);

    if (error) {
      console.error('Error cargando sesiones:', error);
      Alert.alert('Error cargando sesiones');
      return;
    }

    const formateadas = (data || []).map((s: any) => ({
      id: s.id,
      estudiante: s.estudiante,
      full_name: estudianteSeleccionado?.full_name || 'Desconocido',
      psicologo: s.psicologo,
      autor_nombre: s.autor?.full_name || 'Otro profesional',
      fecha: s.fecha,
      numero_sesion: s.numero_sesion,
      recomendaciones: s.recomendaciones,
      etapa: s.etapa,
      grupo_titulo: s.mg_grupos?.titulo || undefined,
      categoria_dsm5: s.categoria_dsm5,
      descripcion: s.descripcion,
    }));

    setSesiones(formateadas);
  };

  // Cuando selecciona estudiante, carga sus sesiones
  const seleccionarEstudiante = (est: Estudiante) => {
    setEstudianteSeleccionado(est);
    fetchSesiones(est.id);
    setDetalleSesion(null);
    setModalVisible(false);
  };

  // Filtrar lista estudiantes para búsqueda
  const estudiantesFiltrados = estudiantes.filter((e) =>
    e.full_name.toLowerCase().includes(filtroEstudiante.toLowerCase())
  );

  // Filtrado de sesiones con filtro por etapa o autor (solo propias)
  const [soloMias, setSoloMias] = useState(true);
  const [filtroSesionNombre, setFiltroSesionNombre] = useState('');

  const sesionesFiltradas = sesiones.filter((s) => {
    const coincideNombre = s.full_name.toLowerCase().includes(filtroSesionNombre.toLowerCase());
    const esAutor = s.psicologo === usuarioId;
    return coincideNombre && (!soloMias || esAutor);
  });

  // Funciones edición/eliminación
  const editarSesion = (s: SesionClinica) => {
    setForm({
      id: s.id,
      estudiante: s.estudiante,
      numero_sesion: s.numero_sesion?.toString() || '',
      categoria_dsm5: s.categoria_dsm5 || '',
      descripcion: s.descripcion || '',
      recomendaciones: s.recomendaciones || '',
      grupo: s.grupo_titulo || '',
      etapa: s.etapa || 'evaluacion',
    });
    setModalVisible(true);
    setDetalleSesion(null);
  };

  const guardarSesionEditada = async () => {
    if (!form.estudiante || !form.etapa) {
      Alert.alert('Faltan campos obligatorios');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('historial_clinico')
      .update({
        estudiante: form.estudiante,
        numero_sesion: form.numero_sesion ? parseInt(form.numero_sesion) : null,
        categoria_dsm5: form.categoria_dsm5,
        descripcion: form.descripcion,
        recomendaciones: form.recomendaciones,
        id_grupo_recomendado: form.grupo || null,
        etapa: form.etapa,
      })
      .eq('id', form.id);

    if (error) {
      Alert.alert('Error', 'No se pudo actualizar la sesión.');
      console.error(error);
    } else {
      Alert.alert('Éxito', 'Sesión actualizada.');
      setModalVisible(false);
      fetchSesiones(form.estudiante);
    }

    setLoading(false);
  };

  const eliminarSesion = (id: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Quieres eliminar esta sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.from('historial_clinico').delete().eq('id', id);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar la sesión.');
              console.error(error);
            } else {
              Alert.alert('Éxito', 'Sesión eliminada.');
              setDetalleSesion(null);
              if (estudianteSeleccionado) fetchSesiones(estudianteSeleccionado.id);
            }
            setLoading(false);
          },
        },
      ],
    );
  };

  // Render principal

  if (detalleSesion) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.titulo}>Detalle de Sesión</Text>
        <Text style={styles.nombre}>{detalleSesion.full_name}</Text>
        <Text style={styles.info}>Sesión #{detalleSesion.numero_sesion}</Text>
        <Text style={styles.info}>Fecha: {new Date(detalleSesion.fecha).toLocaleString()}</Text>
        <Text style={styles.info}>Etapa: {detalleSesion.etapa}</Text>
        <Text style={styles.info}>Categoría DSM-5: {detalleSesion.categoria_dsm5 || 'No especificada'}</Text>
        <Text style={styles.info}>Grupo sugerido: {detalleSesion.grupo_titulo || 'Ninguno'}</Text>
        <Text style={styles.recomendacion}>Recomendaciones: {detalleSesion.recomendaciones}</Text>
        <Text style={styles.info}>Autor: {detalleSesion.autor_nombre} {detalleSesion.psicologo === usuarioId ? '(Yo)' : ''}</Text>
        <Text style={styles.descripcion}>Descripción privada: {detalleSesion.descripcion || 'Sin descripción'}</Text>

        {detalleSesion.psicologo === usuarioId && (
          <>
            <TouchableOpacity
              style={[styles.button, { marginTop: 20 }]}
              onPress={() => editarSesion(detalleSesion)}
            >
              <Text style={styles.buttonText}>Editar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff3b3b', marginTop: 10 }]}
              onPress={() => eliminarSesion(detalleSesion.id)}
            >
              <Text style={styles.buttonText}>Eliminar Sesión</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.volver} onPress={() => setDetalleSesion(null)}>
          <Text style={styles.volverTexto}>← Volver al historial</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // Si no hay estudiante seleccionado, mostrar lista de estudiantes
  if (!estudianteSeleccionado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Selecciona un estudiante</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar estudiante por nombre"
          placeholderTextColor="#888"
          value={filtroEstudiante}
          onChangeText={setFiltroEstudiante}
        />

        <ScrollView style={{ marginTop: 10 }}>
            {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((e) => (
                <TouchableOpacity
                    key={e.id}
                    style={[styles.card, styles.cardRow]}  // Aquí agregamos cardRow
                    onPress={() => seleccionarEstudiante(e)}
                >
                    {e.avatar_url ? (
                    <Image source={{ uri: e.avatar_url }} style={styles.avatar} />
                    ) : null}
                    <Text style={styles.nombre}>{e.full_name}</Text>
                </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.mensaje}>No tienes estudiantes asignados.</Text>
            )}
        </ScrollView>
      </View>
    );
  }

  // Mostrar historial y lista sesiones para estudiante seleccionado
  return (
    <View style={styles.container}>
      <View style={styles.headerEstudiante}>
        {estudianteSeleccionado.avatar_url ? (
          <Image source={{ uri: estudianteSeleccionado.avatar_url }} style={styles.avatarGrande} />
        ) : null}
        <Text style={styles.nombreEstudiante}>{estudianteSeleccionado.full_name}</Text>

        <TouchableOpacity
          style={styles.volver}
          onPress={() => {
            setEstudianteSeleccionado(null);
            setSesiones([]);
            setDetalleSesion(null);
            setFiltroSesionNombre('');
          }}
        >
          <Text style={styles.volverTexto}>← Cambiar estudiante</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Buscar sesiones por nombre"
        placeholderTextColor="#888"
        value={filtroSesionNombre}
        onChangeText={setFiltroSesionNombre}
      />

      <View style={styles.switchFila}>
        <Text style={styles.switchLabel}>Ver solo mis sesiones</Text>
        <Switch value={soloMias} onValueChange={setSoloMias} />
      </View>

      <ScrollView style={{ marginTop: 10 }}>
        {sesionesFiltradas.length > 0 ? (
          sesionesFiltradas.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.card}
              onPress={() => setDetalleSesion(s)}
            >
              <Text style={styles.nombre}>{s.full_name}</Text>
              <Text style={styles.info}>
                Sesión #{s.numero_sesion} - {new Date(s.fecha).toLocaleDateString()}
              </Text>
              <Text style={styles.info}>Etapa: {s.etapa}</Text>
              <Text style={styles.info}>
                Grupo sugerido: {s.grupo_titulo || 'Ninguno'}
              </Text>
              <Text style={styles.recomendacion}>Recomendaciones: {s.recomendaciones}</Text>
              <Text style={styles.autor}>
                Autor: {s.autor_nombre} {s.psicologo === usuarioId ? '(Yo)' : ''}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.mensaje}>No hay sesiones que coincidan.</Text>
        )}
      </ScrollView>

      {/* Modal para editar sesión */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Sesión</Text>

          <CustomSelector
            label="Estudiante"
            selectedValue={form.estudiante}
            onValueChange={(val) => setForm({ ...form, estudiante: val })}
            options={estudiantes.map((e) => ({ label: e.full_name, value: e.id }))}
          />

          <Text style={styles.label}>Número de sesión:</Text>
          <TextInput
            value={form.numero_sesion}
            onChangeText={(text) => setForm({ ...form, numero_sesion: text })}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Categoría DSM-5:</Text>
          <TextInput
            value={form.categoria_dsm5}
            onChangeText={(text) => setForm({ ...form, categoria_dsm5: text })}
            style={styles.input}
          />

          <Text style={styles.label}>Descripción (solo para el psicólogo):</Text>
          <TextInput
            value={form.descripcion}
            onChangeText={(text) => setForm({ ...form, descripcion: text })}
            multiline
            style={styles.textarea}
          />

          <Text style={styles.label}>Recomendaciones para el estudiante:</Text>
          <TextInput
            value={form.recomendaciones}
            onChangeText={(text) => setForm({ ...form, recomendaciones: text })}
            multiline
            style={styles.textarea}
          />

          <CustomSelector
            label="Grupo sugerido (opcional)"
            selectedValue={form.grupo}
            onValueChange={(val) => setForm({ ...form, grupo: val })}
            options={[{ label: 'Ninguno', value: '' }, ...grupos.map((g) => ({ label: g.titulo, value: g.id_g }))]}
          />

          <CustomSelector
            label="Etapa"
            selectedValue={form.etapa}
            onValueChange={(val) => setForm({ ...form, etapa: val })}
            options={[
              { label: 'Evaluación', value: 'evaluacion' },
              { label: 'Seguimiento', value: 'seguimiento' },
              { label: 'Alta', value: 'alta' },
            ]}
          />

          <View style={{ marginVertical: 20 }}>
            <TouchableOpacity style={styles.button} onPress={guardarSesionEditada} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#555', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
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
  label: {       // <- Aquí
    color: 'white',
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: 'white',
    padding: 10,
    borderRadius: 6,
  },
   textarea: {    // <- Y aquí
    backgroundColor: '#1c1c1c',
    color: 'white',
    padding: 10,
    borderRadius: 6,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  switchLabel: {
    color: 'white',
    marginRight: 10,
  },
  card: {
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  nombre: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 12,  // Agregado margen para separación de la foto
  },
  info: {
    color: 'white',
    marginTop: 4,
  },
  recomendacion: {
    color: '#bde0fe',
    marginTop: 6,
  },
  descripcion: {
    color: '#f5cfa1',
    marginTop: 8,
  },
  autor: {
    color: '#aaa',
    marginTop: 4,
    fontStyle: 'italic',
  },
  mensaje: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20,
  },
  volver: {
    marginTop: 20,
    alignItems: 'center',
  },
  volverTexto: {
    color: '#3C63FF',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3C63FF',
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  headerEstudiante: {
    flexDirection: 'column', // Cambiado a columna para apilar verticalmente
    alignItems: 'center',
    marginBottom: 12,
  },
  fotoNombreContainer: {
    flexDirection: 'row', // Foto y nombre al lado
    alignItems: 'center',
    marginBottom: 10,
  },
  nombreEstudiante: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  botonCambiar: {
    backgroundColor: '#3C63FF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  botonCambiarTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardRow: {          
    flexDirection: 'row',
    alignItems: 'center',
  },

});