import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Fondo de pantalla */}
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

        {/* Footer flotante */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Image source={require('@/assets/Iconos/img_social.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('@/assets/Iconos/img_grupos.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require('@/assets/Iconos/img_mentores.png')} style={styles.icon} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  icon: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100, // altura fija para asegurar proporción
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // centra los íconos verticalmente
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
});

