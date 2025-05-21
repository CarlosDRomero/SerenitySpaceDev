import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useGrupoCompleto } from './useGrupoCompleto';
import GrupoInfo from './GrupoInfo';
import SidebarContenido from './SidebarContenido';
import VistaContenido from './VistaContenido';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

export default function GrupoVista() {

  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)


  const { idGrupo } = useLocalSearchParams<{ idGrupo: string }>();
  const {
    grupo,
    modulos,
    temasPorModulo,
    cargando,
  } = useGrupoCompleto(idGrupo || '');

  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<string | null>(null);
  const [mostrarSidebar, setMostrarSidebar] = useState(true);
  const scale = useRef(new Animated.Value(1)).current; 

  const reproducirSonido = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../../assets/sound/click.mp3')
    );
    await sound.playAsync();
  };

  const animarYMostrarSidebar = async () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    await reproducirSonido();
    setMostrarSidebar(true);
  };

  if (cargando || !grupo) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.textoCargando}>Cargando grupo...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contenedor}>

        {!mostrarSidebar && (
          <Animated.View style={[styles.botonMostrar, { transform: [{ scale }] }]}>
            <Pressable onPress={animarYMostrarSidebar}>
              <Text style={styles.botonTexto}>☰ Temas</Text>
            </Pressable>
          </Animated.View>
        )}

        {mostrarSidebar && (
          <View style={styles.sidebar}>
            <SidebarContenido
              modulos={modulos}
              temasPorModulo={temasPorModulo}
              moduloSeleccionado={moduloSeleccionado}
              temaSeleccionado={temaSeleccionado}
              onSeleccionarModulo={(id) => {
                setModuloSeleccionado(id);
                setTemaSeleccionado(null);
              }}
              onSeleccionarTema={(id) => {
                setTemaSeleccionado(id);
                setMostrarSidebar(false);
              }}
            />
          </View>
        )}

        <View style={styles.contenido}>
          <GrupoInfo grupo={grupo} />
          <VistaContenido
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors:ColorScheme, fontSize:FontSize, opposite: ColorScheme) => {
  return  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#0c0c0c',
    },
    contenedor: {
      flex: 1,
      flexDirection: 'row',
    },
    sidebar: {
      width: 260,
      backgroundColor: '#1a1a1a',
      paddingTop: 10,
    },
    contenido: {
      flex: 1,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    textoCargando: {
      color: 'white',
      fontSize: fontSize.titulo,
      fontFamily: 'PressStart2P',
    },
    botonMostrar: {
      position: 'absolute',
      top: 20,
      left: 10,
      zIndex: 10,
      backgroundColor: '#3CA7FF',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 0,
      borderWidth: 2,
      borderColor: '#000',
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 4,
    },
    botonTexto: {
      color: '#fff',
      fontFamily: 'PressStart2P',
      fontSize: 10,
      textTransform: 'uppercase',
    },
  });
}