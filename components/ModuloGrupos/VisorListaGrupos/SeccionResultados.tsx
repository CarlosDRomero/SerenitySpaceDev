import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import CardGrupoLista from './CardGrupoLista';

interface SeccionResultadosProps {
  grupos: any[];
  cargando: boolean;
  onPressGrupo: (idGrupo: string) => void;
}

export default function SeccionResultados({ grupos, cargando, onPressGrupo }: SeccionResultadosProps) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.tituloSeccion}>Resultados de búsqueda</Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#3C63FF" />
      ) : grupos.length > 0 ? (
        grupos.map((grupo) => (
          <CardGrupoLista
            key={grupo.id_g}
            titulo={grupo.titulo}
            descripcion={grupo.descripcion}
            imagenUrl={grupo.imagen_url}
            grupoApoyo={grupo.grupo_apoyo}
            onPress={() => onPressGrupo(grupo.id_g)}
          />
        ))
      ) : (
        <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
          No se encontraron grupos
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
});
