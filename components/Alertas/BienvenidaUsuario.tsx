import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

export default function BienvenidaUsuario() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' }}
        style={styles.icon}
      />
      <Text className="" style={styles.title}>¡Bienvenido a SerenitySpace!</Text>
      <Text style={styles.message}>
        Explora las secciones disponibles según tu rol.{"\n"}
        Usa el menú inferior o superior para acceder a las herramientas diseñadas para tu bienestar académico y emocional.
      </Text>
    </View>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  icon: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
