/* import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '@/utils/supabase';

export default function GrEditorVisual({ grupoId, onVolver }: { grupoId: string, onVolver: () => void }) {
  const [grupo, setGrupo] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [original, setOriginal] = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: any[] }>({});
  const [nuevoModulo, setNuevoModulo] = useState('');
  const [nuevoTema, setNuevoTema] = useState<{ [key: string]: { titulo: string; descripcion: string } }>({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [seleccionado, setSeleccionado] = useState<{ tipo: 'grupo' | 'modulo' | 'tema', id: string } | null>(null);
  const [moduloEditando, setModuloEditando] = useState<{ [id: string]: string }>({});
  const [temaEditando, setTemaEditando] = useState<{ [id: string]: { titulo: string; descripcion: string } }>({});

  useEffect(() => {
    cargarGrupo();
  }, []);

  const cargarGrupo = async () => {
    const { data, error } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    if (!error && data) {
      setGrupo(data);
      setNombre(data.nombre);
      setDescripcion(data.descripcion);
      setOriginal(data);
      cargarModulos(data.id);
    }
  };

  const cargarModulos = async (grupo_id: string) => {
    const { data: mods } = await supabase.from('gr_modulos').select('*').eq('grupo_id', grupo_id).order('orden');
    setModulos(mods || []);
    if (mods) {
      const temasPor = {} as { [key: string]: any[] };
      for (const m of mods) {
        const { data: temas } = await supabase.from('gr_temas').select('*').eq('modulo_id', m.id).order('orden');
        temasPor[m.id] = temas || [];
      }
      setTemasPorModulo(temasPor);
    }
  };

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.length) {
      setImagen(result.assets[0]);
    }
  };

  const guardarCambios = async () => {
    let imagen_url = grupo.imagen_url;

    if (imagen) {
      const ext = imagen.uri.split('.').pop();
      const nombreArchivo = `grupo_editado_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('fotoyvideo').upload(
        nombreArchivo,
        decode(imagen.base64 || ''),
        { contentType: `image/${ext}` }
      );
      if (error) return Alert.alert('Error al subir imagen');
      const { data } = supabase.storage.from('fotoyvideo').getPublicUrl(nombreArchivo);
      imagen_url = data?.publicUrl;
    }

    const actualizaciones: any = {};
    if (nombre !== original.nombre) actualizaciones.nombre = nombre;
    if (descripcion !== original.descripcion) actualizaciones.descripcion = descripcion;
    if (imagen_url !== original.imagen_url) actualizaciones.imagen_url = imagen_url;

    if (Object.keys(actualizaciones).length === 0) {
      Alert.alert('Sin cambios');
      return;
    }

    const { error: updateError } = await supabase.from('gr_grupos').update(actualizaciones).eq('id', grupoId);
    if (!updateError) {
      Alert.alert('Cambios guardados');
      setImagen(null);
      cargarGrupo();
    } else {
      Alert.alert('Error al actualizar');
    }
  };

  const descartarCambios = () => {
    setNombre(original.nombre);
    setDescripcion(original.descripcion);
    setImagen(null);
  };

  const eliminarGrupo = async () => {
    Alert.alert('Confirmar eliminación', '¿Estás seguro de eliminar este grupo?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('gr_grupos').delete().eq('id', grupoId);
          if (!error) {
            Alert.alert('Grupo eliminado');
            onVolver();
          } else {
            Alert.alert('Error al eliminar');
          }
        }
      }
    ]);
  };

  const agregarModulo = async () => {
    if (!nuevoModulo.trim()) return;
    const { error } = await supabase.from('gr_modulos').insert({
      grupo_id: grupoId,
      nombre: nuevoModulo,
      orden: modulos.length + 1,
    });
    if (!error) {
      setNuevoModulo('');
      cargarGrupo();
    }
  };

  const agregarTema = async (moduloId: string) => {
    const tema = nuevoTema[moduloId];
    if (!tema?.titulo?.trim()) return;
    const { error } = await supabase.from('gr_temas').insert({
      modulo_id: moduloId,
      titulo: tema.titulo,
      descripcion: tema.descripcion || '',
      orden: temasPorModulo[moduloId]?.length + 1 || 1,
    });
    if (!error) {
      setNuevoTema((prev) => ({ ...prev, [moduloId]: { titulo: '', descripcion: '' } }));
      cargarGrupo();
    }
  };

  const eliminarModulo = async (moduloId: string) => {
    const { error } = await supabase.from('gr_modulos').delete().eq('id', moduloId);
    if (!error) cargarGrupo();
  };

  const eliminarTema = async (temaId: string) => {
    const { error } = await supabase.from('gr_temas').delete().eq('id', temaId);
    if (!error) cargarGrupo();
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Modal animationType="slide" transparent visible={menuVisible}>
        <View style={styles.menuLateral}>
          <Pressable onPress={() => setMenuVisible(false)} style={styles.cerrarMenu}><Text>✖</Text></Pressable>
          <Text style={styles.menuTitulo}>Menú del Grupo</Text>
          <TouchableOpacity onPress={() => setSeleccionado({ tipo: 'grupo', id: grupoId })}>
            <Text style={styles.menuItem}>Grupo</Text>
          </TouchableOpacity>
          {modulos.map((m) => (
            
            

          ))}
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuAbrir}>☰ Abrir herramientas</Text>
        </TouchableOpacity>

        {seleccionado?.tipo === 'grupo' && (
          <>
            <Text style={styles.titulo}>Editor Visual del Grupo</Text>
            {imagen ? (
              <Image source={{ uri: imagen.uri }} style={styles.imagen} />
            ) : (
              grupo.imagen_url && <Image source={{ uri: grupo.imagen_url }} style={styles.imagen} />
            )}

            <TouchableOpacity onPress={seleccionarImagen} style={styles.botonImagen}>
              <Text style={{ color: '#fff' }}>{imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}</Text>
            </TouchableOpacity>

            <TextInput value={nombre} onChangeText={setNombre} placeholder="Nombre del grupo" style={styles.input} />
            <TextInput value={descripcion} onChangeText={setDescripcion} placeholder="Descripción" style={[styles.input, { height: 80 }]} multiline />

            <View style={styles.botonesInferiores}>
              <Button title="Guardar cambios" onPress={guardarCambios} />
              <Button title="Descartar cambios" color="orange" onPress={descartarCambios} />
              <Button title="Eliminar grupo" color="red" onPress={eliminarGrupo} />
            </View>
          </>
        )}

        {seleccionado?.tipo === 'modulo' && (
          <View>
            <Text style={styles.seccion}>📚 Módulos</Text>
            <TextInput
              value={nuevoModulo}
              onChangeText={setNuevoModulo}
              placeholder="Nombre del nuevo módulo"
              style={styles.input}
            />
            <Button title="Agregar módulo" onPress={agregarModulo} />

            {modulos.map((modulo) => (
              <View key={modulo.id} style={styles.moduloBox}>
                <Text style={styles.moduloTitulo}>{modulo.nombre}</Text>
                <Button title="Eliminar módulo" color="red" onPress={() => eliminarModulo(modulo.id)} />

                <TextInput
                  placeholder="Título del nuevo tema"
                  value={nuevoTema[modulo.id]?.titulo || ''}
                  onChangeText={(text) => setNuevoTema((prev) => ({ ...prev, [modulo.id]: { ...prev[modulo.id], titulo: text } }))}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Descripción del nuevo tema"
                  value={nuevoTema[modulo.id]?.descripcion || ''}
                  onChangeText={(text) => setNuevoTema((prev) => ({ ...prev, [modulo.id]: { ...prev[modulo.id], descripcion: text } }))}
                  style={[styles.input, { height: 60 }]}
                  multiline
                />
                <Button title="Agregar tema" onPress={() => agregarTema(modulo.id)} />

                {temasPorModulo[modulo.id]?.map((tema) => (
                  <View key={tema.id} style={styles.temaBox}>
                    <Text style={styles.temaTitulo}>{tema.titulo}</Text>
                    <Text style={{ color: '#555' }}>{tema.descripcion}</Text>
                    {tema.video_youtube_url && <Text>🎥 YouTube: {tema.video_youtube_url}</Text>}
                    {tema.video_supabase_url && <Text>📁 Video: {tema.video_supabase_url}</Text>}
                    <Button title="Eliminar tema" color="red" onPress={() => eliminarTema(tema.id)} />
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  botonImagen: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  botonesInferiores: {
    gap: 10,
    marginBottom: 20,
  },
  seccion: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  moduloBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  moduloTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  temaBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  temaTitulo: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuLateral: {
    backgroundColor: '#fff',
    padding: 20,
    width: 280,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  menuTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubitem: {
    paddingLeft: 15,
    paddingVertical: 4,
    fontSize: 14,
    color: '#666',
  },
  cerrarMenu: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  menuAbrir: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007AFF',
  },
});
 */




import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import { GrupoType, ModuloType, TemaType } from './GREditorVisualPK/editorTypes';
import SidebarMenu from './GREditorVisualPK/SidebarMenu';
import GrupoEditor from './GREditorVisualPK/GrupoEditor';
import ModuloEditor from './GREditorVisualPK/ModuloEditor';
import TemaEditor from './GREditorVisualPK/TemaEditor';

export default function GrEditorVisual({
  grupoId,
  onVolver,
}: {
  grupoId: string;
  onVolver: () => void;
}) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: TemaType[] }>({});
  const [menuVisible, setMenuVisible] = useState(false);
  const [seleccionado, setSeleccionado] = useState<{ tipo: 'grupo' | 'modulo' | 'tema'; id: string } | null>(null);

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    const { data: grupoData } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    setGrupo(grupoData);

    const { data: mods } = await supabase.from('gr_modulos').select('*').eq('grupo_id', grupoId).order('orden');
    setModulos(mods || []);

    const temasPor: { [key: string]: TemaType[] } = {};
    for (const m of mods || []) {
      const { data: temas } = await supabase.from('gr_temas').select('*').eq('modulo_id', m.id).order('orden');
      temasPor[m.id] = temas || [];
    }
    setTemasPorModulo(temasPor);
  };

  const handleSeleccionar = (tipo: 'grupo' | 'modulo' | 'tema', id: string) => {
    setSeleccionado({ tipo, id });
    setMenuVisible(false);
  };

  const handleAgregarModulo = async () => {
    const { error } = await supabase.from('gr_modulos').insert({
      grupo_id: grupoId,
      nombre: 'Nuevo Módulo',
      orden: modulos.length + 1,
    });
    if (!error) cargarTodo();
  };

  const handleAgregarTema = async (moduloId: string) => {
    const { error } = await supabase.from('gr_temas').insert({
      modulo_id: moduloId,
      titulo: 'Nuevo Tema',
      descripcion: '',
      orden: (temasPorModulo[moduloId]?.length || 0) + 1,
    });
    if (!error) cargarTodo();
  };

  const moduloActual = modulos.find((m) => m.id === seleccionado?.id);
  const temaActual = Object.values(temasPorModulo)
    .flat()
    .find((t) => t.id === seleccionado?.id);

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <Modal animationType="slide" transparent visible={menuVisible}>
        <SidebarMenu
          grupoId={grupoId}
          modulos={modulos}
          temasPorModulo={temasPorModulo}
          onSeleccionar={handleSeleccionar}
          onAgregarModulo={handleAgregarModulo}
          onAgregarTema={handleAgregarTema}
          onCerrar={() => setMenuVisible(false)}
        />
      </Modal>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuAbrir}>☰ Abrir herramientas</Text>
        </TouchableOpacity>

        {seleccionado?.tipo === 'grupo' && grupo && (
          <GrupoEditor grupo={grupo} onVolver={onVolver} recargar={cargarTodo} />
        )}

        {seleccionado?.tipo === 'modulo' && (
          <ModuloEditor
            grupoId={grupoId}
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            recargar={cargarTodo}
            seleccionarTema={(id) => handleSeleccionar('tema', id)}
          />
        )}

        {seleccionado?.tipo === 'tema' && temaActual && (
          <TemaEditor
            moduloId={temaActual.modulo_id}
            temas={temasPorModulo[temaActual.modulo_id]}
            recargar={cargarTodo}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  menuAbrir: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007AFF',
  },
});
