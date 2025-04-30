/* // GREstudioVisualPK/VistaContenido.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TemaType } from './estudioTypes';
import VideoRender from './VideoRender';

interface Props {
  tema: TemaType | null;
}

export default function VistaContenido({ tema }: Props) {
  if (!tema) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderTexto}>Selecciona un tema para comenzar</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoRender
        videoYouTube={tema.video_youtube_url}
        videoSupabase={tema.video_supabase_url}
      />
      <Text style={styles.titulo}>{tema.titulo}</Text>
      {tema.descripcion ? (
        <Text style={styles.descripcion}>{tema.descripcion}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderTexto: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});


 */

// GREstudioVisualPK/VistaContenido.tsx
import React, { useState } from 'react'; 
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'; 
import { TemaType } from './estudioTypes'; 
import VideoRender from './VideoRender';

interface Props {
  tema: TemaType | null;
}

export default function VistaContenido({ tema }: Props) {
  const [pantallaCompleta, setPantallaCompleta] = useState(false); // Estado para manejar el modo de pantalla completa

  if (!tema) {
    return (
      <View style={pantallaCompleta ? styles.placeholderFull : styles.placeholder}>
        <Text style={styles.placeholderTexto}>Selecciona un tema para comenzar</Text>
      </View>
    );
  }

  const toggleFullScreen = () => {
    setPantallaCompleta(!pantallaCompleta); // Cambiar el estado para poner o quitar pantalla completa
  };

  return (
    <View style={pantallaCompleta ? styles.containerFull : styles.container}>
      <VideoRender
        videoYouTube={tema.video_youtube_url}
        videoSupabase={tema.video_supabase_url}
      />
      <Text style={styles.titulo}>{tema.titulo}</Text>
      {tema.descripcion ? (
        <Text style={styles.descripcion}>{tema.descripcion}</Text>
      ) : null}

      {/* Botón para activar/desactivar pantalla completa */}
      <Button
        title={pantallaCompleta ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
        onPress={toggleFullScreen}
      />
    </View>
  );
}

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  containerFull: {
    width: screenWidth,
    height: screenHeight, // Para ocupar toda la pantalla
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderFull: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  placeholderTexto: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});
