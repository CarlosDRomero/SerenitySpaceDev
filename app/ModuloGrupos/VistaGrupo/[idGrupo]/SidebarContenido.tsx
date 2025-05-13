import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ModuloType, TemaType } from './vistaTypes';

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
        <View key={modulo.id_m} style={styles.moduloContainer}>
          <TouchableOpacity
            style={[
              styles.moduloItem,
              modulo.id_m === moduloSeleccionado && styles.moduloSeleccionado,
            ]}
            onPress={() => onSeleccionarModulo(modulo.id_m)}
          >
            <Text style={styles.moduloTexto}>{modulo.titulo}</Text>
          </TouchableOpacity>

          {temasPorModulo[modulo.id_m]?.map((tema) => (
            <TouchableOpacity
              key={tema.id_t}
              style={[
                styles.temaItem,
                tema.id_t === temaSeleccionado && styles.temaSeleccionado,
              ]}
              onPress={() => onSeleccionarTema(tema.id_t)}
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
