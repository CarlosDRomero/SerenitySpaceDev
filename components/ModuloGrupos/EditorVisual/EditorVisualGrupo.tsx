import React, { useEffect, useState } from 'react';
import { View, ScrollView, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import SidebarMenu from './SidebarMenu';
import { GrupoType, ModuloType, TemaType } from './editorTypes';
import { fetchGrupo } from '../BD/gruposDB';
import { fetchModulos } from '../BD/modulosDB';
import { fetchTemas } from '../BD/temasDB';
import { crearModulo } from '../BD/modulosDB';
import { crearTema } from '../BD/temasDB';
import GrupoEditor from './GrupoEditor';
import ModuloEditor from './ModuloEditor';
import TemaEditor from './TemaEditor';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

export default function EditorVisualGrupo({
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
    try {
      const grupoData = await fetchGrupo(grupoId);
      setGrupo(grupoData);

      const mods = await fetchModulos(grupoId);
      setModulos(mods || []);

      const temasPor: { [key: string]: TemaType[] } = {};
      for (const mod of mods || []) {
        const temas = await fetchTemas(mod.id_m);
        temasPor[mod.id_m] = temas || [];
      }
      setTemasPorModulo(temasPor);
    } catch (error) {
      console.error('Error cargando información del grupo:', error);
    }
  };

  const handleSeleccionar = (tipo: 'grupo' | 'modulo' | 'tema', id: string) => {
    setSeleccionado({ tipo, id });
    setMenuVisible(false);
  };

  const handleAgregarModulo = async () => {
    const nuevoModulo = await crearModulo(grupoId);
    if (nuevoModulo) {
      cargarTodo();
    }
  };

  const handleAgregarTema = async (moduloId: string) => {
    const nuevoTema = await crearTema(moduloId);
    if (nuevoTema) {
      cargarTodo();
    }
  };

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
        
        {/* Botón Volver */}
        <TouchableOpacity onPress={onVolver} style={styles.botonVolver}>
          <Text style={styles.textoBotonVolver}>← Volver</Text>
        </TouchableOpacity>

        {/* Botón para abrir menú */}
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuAbrir}>☰ Abrir herramientas</Text>
        </TouchableOpacity>

        {/* Render dinámico según selección */}
        {seleccionado?.tipo === 'grupo' && grupo && (
          <GrupoEditor grupo={grupo} onVolver={() => setSeleccionado(null)} recargar={cargarTodo} />
        )}
        {seleccionado?.tipo === 'modulo' && (
          <ModuloEditor
            grupoId={grupoId}
            modulos={modulos}
            moduloSeleccionadoId={seleccionado.id} 
            temasPorModulo={temasPorModulo}
            recargar={cargarTodo}
            seleccionarTema={(id) => handleSeleccionar('tema', id)}
            onVolver={() => setSeleccionado(null)}
          />        
        )}
        {seleccionado?.tipo === 'tema' && (
          <TemaEditor
            temas={Object.values(temasPorModulo).flat()}
            temaSeleccionadoId={seleccionado.id}
            recargar={cargarTodo}
            onVolver={() => setSeleccionado(null)}
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
  botonVolver: {
    backgroundColor: '#FF4E4E',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  textoBotonVolver: {
    color: 'white',
    fontWeight: 'bold',
  },
  menuAbrir: {
    fontSize: 16,
    marginBottom: 10,
    color: '#007AFF',
  },
});