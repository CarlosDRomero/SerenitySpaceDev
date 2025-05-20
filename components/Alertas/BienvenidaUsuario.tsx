import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function BienvenidaUsuario() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' }}
        style={styles.icon}
      />
      <Text style={styles.title}>¡Bienvenido a SerenitySpace!</Text>
      <Text style={styles.message}>
        Explora las secciones disponibles según tu rol.{"\n"}
        Usa el menú inferior o superior para acceder a las herramientas diseñadas para tu bienestar académico y emocional.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 130,
    height: 130,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
