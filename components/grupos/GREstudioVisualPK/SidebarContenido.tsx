// GREstudioVisualPK/SidebarContenido.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ModuloType, TemaType } from './estudioTypes';

interface Props {
  modulos: ModuloType[];
  temasPorModulo: { [moduloId: string]: TemaType[] };
  moduloSeleccionado: string | null;
  temaSeleccionado: string | null;
  onSeleccionarModulo: (moduloId: string) => void;
  onSeleccionarTema: (temaId: string) => void;
}

export default function SidebarContenido({
  modulos,
  temasPorModulo,
  moduloSeleccionado,
  temaSeleccionado,
  onSeleccionarModulo,
  onSeleccionarTema,
}: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {modulos.map((modulo) => (
        <View key={modulo.id} style={styles.moduloContainer}>
          <TouchableOpacity
            style={[
              styles.moduloItem,
              modulo.id === moduloSeleccionado && styles.moduloSeleccionado,
            ]}
            onPress={() => onSeleccionarModulo(modulo.id)}
          >
            <Text style={styles.moduloTexto}>{modulo.nombre}</Text>
          </TouchableOpacity>
          {temasPorModulo[modulo.id]?.map((tema) => (
            <TouchableOpacity
              key={tema.id}
              style={[
                styles.temaItem,
                tema.id === temaSeleccionado && styles.temaSeleccionado,
              ]}
              onPress={() => onSeleccionarTema(tema.id)}
            >
              <Text style={styles.temaTexto}>{tema.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  moduloContainer: {
    marginBottom: 10,
  },
  moduloItem: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  moduloTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  moduloSeleccionado: {
    backgroundColor: '#005BB5',
  },
  temaItem: {
    marginTop: 5,
    padding: 8,
    paddingLeft: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  temaTexto: {
    color: '#333',
  },
  temaSeleccionado: {
    backgroundColor: '#d0e0ff',
  },
});
