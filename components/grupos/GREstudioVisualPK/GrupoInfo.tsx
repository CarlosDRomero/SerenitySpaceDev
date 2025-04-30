// GREstudioVisualPK/GrupoInfo.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { GrupoType } from './estudioTypes';

interface Props {
  grupo: GrupoType;
}

export default function GrupoInfo({ grupo }: Props) {
  return (
    <View style={styles.container}>
      {grupo.imagen_url ? (
        <Image source={{ uri: grupo.imagen_url }} style={styles.imagen} />
      ) : null}
      <Text style={styles.nombre}>{grupo.nombre}</Text>
      {grupo.descripcion ? <Text style={styles.descripcion}>{grupo.descripcion}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
