import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function AlertaUsuario() {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/5956/5956788.png',
        }}
        style={styles.icon}
      />      
      <Text style={styles.title}>Acceso Restringido</Text>
      <Text style={styles.message}>
        Actualmente no tienes los permisos necesarios para usar esta herramienta. 
        Si crees que esto es un error, por favor contacta con un administrador o tutor.
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
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
  },
});
