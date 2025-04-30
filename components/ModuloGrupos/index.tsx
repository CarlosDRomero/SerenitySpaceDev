import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ListaGrupos from './ListaGrupos';
import CrearGrupo from './CrearGrupo';
import SelectorGruposEditar from './SelectorGruposEditar';

export default function ModuloGruposIndex() {
  const [pantalla, setPantalla] = useState<'lista' | 'crear' | 'editar'>('lista');

  return (
    <View style={styles.container}>
      {/* Botones superiores */}
      <View style={styles.botonesTop}>
        <TouchableOpacity
          style={[styles.botonTop, pantalla === 'lista' && styles.botonActivo]}
          onPress={() => setPantalla('lista')}
        >
          <Text style={styles.textoBoton}>Lista Grupos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonTop, pantalla === 'crear' && styles.botonActivo]}
          onPress={() => setPantalla('crear')}
        >
          <Text style={styles.textoBoton}>Crear Grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonTop, pantalla === 'editar' && styles.botonActivo]}
          onPress={() => setPantalla('editar')}
        >
          <Text style={styles.textoBoton}>Editar Grupos</Text>
        </TouchableOpacity>
      </View>

      {/* Pantallas dinámicas */}
      {pantalla === 'lista' && (
        <ScrollView>
          <ListaGrupos />
        </ScrollView>
      )}

      {pantalla === 'crear' && (
        <ScrollView>
          <CrearGrupo />
        </ScrollView>
      )}

      {pantalla === 'editar' && (
        <SelectorGruposEditar />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  botonesTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  botonTop: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  botonActivo: {
    backgroundColor: '#3C63FF',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

