import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import { GrupoType } from './vistaTypes';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

interface Props {
  grupo: GrupoType;
}

export default function GrupoInfo({ grupo }: Props) {
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)
  return (
    <View style={styles.container}>
      {grupo.imagen_url ? (
        <ImageBackground
          source={{ uri: grupo.imagen_url }}
          style={styles.imagenFondo}
          imageStyle={{ borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
        >
          {/* Si quieres podrías poner algo sobre la imagen aquí */}
        </ImageBackground>
      ) : (
        <View style={styles.imagenPlaceholder}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.titulo}>{grupo.titulo}</Text>
        {grupo.descripcion ? (
          <Text style={styles.descripcion}>{grupo.descripcion}</Text>
        ) : (
          <Text style={styles.descripcion}>Sin descripción disponible.</Text>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors:ColorScheme, fontSize:FontSize, opposite: ColorScheme) => {
  return StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    imagenFondo: {
      height: 180,
      width: '100%',
      justifyContent: 'flex-end',
    },
    imagenPlaceholder: {
      height: 180,
      backgroundColor: '#2a2a2a',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    placeholderText: {
      color: colors.text,
      fontSize: fontSize.titulo,
    },
    infoContainer: {
      padding: 16,
    },
    titulo: {
      color: colors.text,
      fontSize: fontSize.titulo,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    descripcion: {
      color: colors.text,
      fontSize: fontSize.subtitulo,
    },
  });
}