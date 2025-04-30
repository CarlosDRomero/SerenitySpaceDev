import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface BuscadorGruposProps {
  busqueda: string;
  setBusqueda: (texto: string) => void;
}

export default function BuscadorGrupos({ busqueda, setBusqueda }: BuscadorGruposProps) {
  return (
    <TextInput
      placeholder="¿Qué grupo quieres encontrar?"
      placeholderTextColor="#aaa"
      style={styles.inputBuscar}
      value={busqueda}
      onChangeText={setBusqueda}
    />
  );
}

const styles = StyleSheet.create({
  inputBuscar: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
});
