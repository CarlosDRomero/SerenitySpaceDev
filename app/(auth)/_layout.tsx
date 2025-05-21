/* import { BlurView } from 'expo-blur';
import { Slot } from 'expo-router';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image
} from 'react-native';

export default function AuthPageLayout(){
  return (
    <ImageBackground
          source={require('../../assets/images/Background.png')}
          style={styles.background}
          blurRadius={1}
        >
        <View style={styles.container}>
        

        <Slot/>
        </View>
      </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  logo: {
    
  },
});  */


import React, { useEffect, useRef, useState } from 'react';
import { Slot } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';

export default function AuthPageLayout() {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState(false);

  const [fontsLoaded] = useFonts({
    PressStart2P: require('../../assets/fonts/PressStart2P-Regular.ttf'),
  });

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        await videoRef.current.playAsync();
      }
    };
    playVideo();
  }, []);

  const toggleMute = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted((prev) => !prev);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#fff" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🎥 Fondo en video */}
      <Video
        ref={videoRef}
        source={require('../../assets/videos/Efecto Completo.mp4')}
        style={styles.backgroundVideo}
        isLooping
        shouldPlay
        isMuted={isMuted}
        resizeMode={ResizeMode.COVER}
      />

      {/* 🌒 Capa de oscurecimiento opcional */}
      <View style={styles.overlay} />

      {/* 📱 Contenido principal */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* 🔇 Botón de mute/desmute */}
      <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
        <Text style={styles.muteButtonText}>
          {isMuted ? 'Activar música' : 'Silenciar música'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000055',
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 1,
  },
  muteButton: {
  position: 'absolute',
  bottom: 20,
  right: 20,
  backgroundColor: '#e0e0e0',
  borderColor: '#000',
  borderWidth: 2,
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 0,
  zIndex: 2,
  elevation: 5,

  // Estilo pixelado
  justifyContent: 'center',
  alignItems: 'center',

  // Extra: contorno grueso simulado
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 1,
  shadowRadius: 0,
  },

  muteButtonText: {
  color: '#000',
  fontSize: 10,
  fontFamily: 'PressStart2P', // Fuente pixel real
  letterSpacing: 1,
  textTransform: 'uppercase',
  textAlign: 'center',

  // Simula borde interior con sombra blanca
  textShadowColor: '#fff',
  textShadowOffset: { width: -1, height: -1 },
  textShadowRadius: 0,
  },
});
