import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { useGrupoCompleto } from './useGrupoCompleto';
import GrupoInfo from './GrupoInfo';
import SidebarContenido from './SidebarContenido';
import VistaContenido from './VistaContenido';

export default function GrupoVista() {
  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const {
    grupo,
    modulos,
    temasPorModulo,
    cargando,
  } = useGrupoCompleto(idGrupo || '');

  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<string | null>(null);
  const [mostrarSidebar, setMostrarSidebar] = useState(true);

  if (cargando || !grupo) {
    return (
      <View style={styles.center}>
        <Text style={styles.textoCargando}>Cargando grupo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>

      {/* Botón para mostrar el sidebar si está oculto */}
      {!mostrarSidebar && (
        <TouchableOpacity
          style={styles.botonMostrar}
          onPress={() => setMostrarSidebar(true)}
        >
          <Text style={styles.botonTexto}>☰ Temas</Text>
        </TouchableOpacity>
      )}

      {/* Sidebar */}
      {mostrarSidebar && (
        <View style={styles.sidebar}>
          <SidebarContenido
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado}
            onSeleccionarModulo={(id) => {
              setModuloSeleccionado(id);
              setTemaSeleccionado(null);
            }}
            onSeleccionarTema={(id) => {
              setTemaSeleccionado(id);
              setMostrarSidebar(false); // Oculta el panel al elegir un tema
            }}
          />
        </View>
      )}

      {/* Contenido del tema */}
      <View style={styles.contenido}>
        <GrupoInfo grupo={grupo} />
        <VistaContenido
          temasPorModulo={temasPorModulo}
          moduloSeleccionado={moduloSeleccionado}
          temaSeleccionado={temaSeleccionado}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 260,
    backgroundColor: '#1a1a1a',
    paddingTop: 10,
  },
  contenido: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
  textoCargando: {
    color: 'white',
    fontSize: 16,
  },
  botonMostrar: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: '#3C63FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
});

  
