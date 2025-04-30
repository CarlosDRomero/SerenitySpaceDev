import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useGrupoCompleto } from './useGrupoCompleto';
import SidebarContenido from './SidebarContenido';
import VistaContenido from './VistaContenido'; // Vista central (la crearemos ahorita)
import GrupoInfo from './GrupoInfo'; // Encabezado del grupo

interface Props {
  idGrupo: string;
}

export default function GrupoVista({ idGrupo }: Props) {
  const { grupo, modulos, temasPorModulo, cargando, error } = useGrupoCompleto(idGrupo);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<string | null>(null);

  if (cargando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3C63FF" />
      </View>
    );
  }

  if (error || !grupo) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>Error al cargar el grupo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado del grupo */}
      <GrupoInfo grupo={grupo} />

      <View style={styles.contenido}>
        {/* Sidebar: módulos y temas */}
        <View style={styles.sidebar}>
          <SidebarContenido
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado}
            onSeleccionarModulo={(id) => {
              setModuloSeleccionado(id);
              setTemaSeleccionado(null); // Al cambiar módulo, reseteamos tema seleccionado
            }}
            onSeleccionarTema={(id) => {
              setTemaSeleccionado(id);
            }}
          />
        </View>

        {/* Vista central: contenido del tema */}
        <View style={styles.vistaContenido}>
          <VistaContenido
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  contenido: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '40%',
    backgroundColor: '#1a1a1a',
    borderRightWidth: 1,
    borderRightColor: '#333',
  },
  vistaContenido: {
    flex: 1,
    padding: 16,
  },
});
