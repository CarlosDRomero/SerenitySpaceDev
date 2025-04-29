import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModuloGrupos from '@/components/ModuloGrupos/index';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [pantalla, setPantalla] = useState<'inicio' | 'grupos' | 'grupos2'>('inicio');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/Iconos/fondoinicio.png')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Encabezado flotante */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_personal.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_mi_cuenta.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_chats.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Contenido dinámico */}
          <View style={styles.contenido}>
            {pantalla === 'grupos' && <GruposIndex />}
            {pantalla === 'grupos2' && <ModuloGrupos />}
          </View>

          {/* Footer flotante */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => setPantalla('inicio')}>
              <Image source={require('@/assets/Iconos/img_social.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPantalla('grupos')}>
              <Image source={require('@/assets/Iconos/img_grupos.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_mentores.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPantalla('grupos2')}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' }} // Icono de prueba
                style={styles.icon}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_apoyo_emocional.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image source={require('@/assets/Iconos/img_ajustes.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff'},
  container: { flex: 1},
  background: { flex: 1, width: '100%', height: '100%' },
  icon: { width: 65, height: 65, resizeMode: 'contain' },
  header: {
    position: 'absolute',
    top: 0, // ya no necesitas tanto espacio porque SafeAreaView lo respeta
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 99, 255, 0.2)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(60, 99, 255, 0.2)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  contenido: {
    flex: 1,
    paddingTop: 120,     // espacio para el header flotante
    paddingBottom: 100,  // espacio para el footer flotante
    paddingHorizontal: 16,    
    //backgroundColor: 'rgba(255,255,255,0.8)', // fondo blanco con 80% de opacidad
  },
});
