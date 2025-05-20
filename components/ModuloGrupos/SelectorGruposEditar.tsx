import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchGrupos } from './BD/gruposDB';
import GrupoCard from './GrupoCard';
import EditorVisualGrupo from './EditorVisual/EditorVisualGrupo';

export default function SelectorGruposEditar() {
  const [grupos, setGrupos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string | null>(null);
  const [modoEditorActivo, setModoEditorActivo] = useState(false); // 🚀

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const data = await fetchGrupos();
      //console.log('Grupos cargados:', data);
      setGrupos(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const seleccionarGrupo = (id: string) => {
    console.log('Grupo seleccionado:', id);
    setGrupoSeleccionado(id);
    setModoEditorActivo(true); // Ahora activamos modo editor seguro
  };

  const volverAlSelector = () => {
    setGrupoSeleccionado(null);
    setModoEditorActivo(false); // Al volver desactivamos modo editor
  };

  if (modoEditorActivo && grupoSeleccionado) {
    return (
      <EditorVisualGrupo
        grupoId={grupoSeleccionado}
        onVolver={volverAlSelector}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Selecciona un grupo para editar:</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cargando ? (
          <ActivityIndicator size="large" color="#3C63FF" />
        ) : (
          grupos.map((grupo) => (
            <GrupoCard
              key={grupo.id_g}
              titulo={grupo.titulo}
              descripcion={grupo.descripcion}
              imagenUrl={grupo.imagen_url}
              grupoApoyo={grupo.grupo_apoyo}
              onPress={() => seleccionarGrupo(grupo.id_g)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    padding: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollContainer: {
    paddingBottom: 50,
  },
});
