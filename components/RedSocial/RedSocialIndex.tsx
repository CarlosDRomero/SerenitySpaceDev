import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

// Importa tus componentes desde la carpeta original sin modificar nada
import BuscarUsuarios from '@/app/RedSocial/buscar';
import Amigos from '@/app/RedSocial/amigos';
import Sugerencias from '@/app/RedSocial/sugerencias';
import Solicitudes from '@/app/RedSocial/solicitudes';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import { useFonts } from 'expo-font';

export default function RedSocialIndex() {
  const [vistaActual, setVistaActual] = useState('menu');
  const { colors, fontSize, oppositeColors } = useAjustes();
  const styles = getStyles(colors, fontSize, oppositeColors);

  const renderVista = () => {
    switch (vistaActual) {
      case 'buscar':
        return <BuscarUsuarios />;
      case 'amigos':
        return <Amigos />;
      case 'sugerencias':
        return <Sugerencias />;
      case 'solicitudes':
        return <Solicitudes />;
      case 'menu':
        return (
          <View style={styles.MenuContenedor}>
            <Text style={styles.TituloRedSocial}>
              Red Social - SerenitySpace
            </Text>
            <View style={styles.Grid}>
              <TouchableOpacity style={[styles.Boton,styles.ImagenPixelada]} onPress={() => setVistaActual('buscar')}>
                <Image
                  source={{ uri: 'https://img.icons8.com/?size=100&id=p3miLroKw4iR&format=png&color=000000' }}
                  style={styles.Icono}
                />
                <Text style={styles.TextoBoton}>Buscar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.Boton} onPress={() => setVistaActual('solicitudes')}>
                <Image
                  source={{ uri: 'https://img.icons8.com/?size=100&id=OBmVbH2qOGwK&format=png&color=000000' }}
                  style={styles.Icono}
                />
                <Text style={styles.TextoBoton}>Solicitudes</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.Boton} onPress={() => setVistaActual('amigos')}>
                <Image
                  source={{ uri: 'https://img.icons8.com/?size=100&id=XiQsZfNMl5CC&format=png&color=000000' }}
                  style={styles.Icono}
                />
                <Text style={styles.TextoBoton}>Amigos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.Boton} onPress={() => setVistaActual('sugerencias')}>
                <Image
                  source={{ uri: 'https://img.icons8.com/?size=100&id=hRlGryuq38s4&format=png&color=000000' }}
                  style={styles.Icono}
                />
                <Text style={styles.TextoBoton}>Sugerencias</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.Redfondo}>
      {vistaActual !== 'menu' && (
        <TouchableOpacity onPress={() => setVistaActual('menu')} style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={styles.VolerMenu}>← Volver al menú</Text>
        </TouchableOpacity>
      )}
      {renderVista()}
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme) => {
  return StyleSheet.create({
    TituloRedSocial: {
      fontFamily: 'PressStart2P',
      fontSize: fontSize.titulo,      
      marginBottom: 20,
      color: colors.text,
      textAlign: 'center',
    },
    Redfondo: {
      flex: 1,
      backgroundColor: colors.background,
    },
    VolerMenu: {
      color: '#3C63FF',
      fontFamily: 'PressStart2P',
      fontSize: fontSize.subtitulo,
    },
    MenuContenedor: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    Grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      gap: 20,
      marginTop: 20,
    },
    Boton: {
      width: '40%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: opposite.background,
      borderRadius: 16,
      padding: 10,
      elevation: 2,
    },
    Icono: {
      width: 48,
      height: 48,
      marginBottom: 8,
      resizeMode: 'contain',
    },
    TextoBoton: {
      fontFamily: 'PressStart2P',
      fontSize: fontSize.subtitulo,
      color: opposite.text,
      textAlign: 'center',
    },
    ImagenPixelada:{
      //width: 100,
      //height: 100,
      //transform:[{scale: 4}]
    },
  });
};