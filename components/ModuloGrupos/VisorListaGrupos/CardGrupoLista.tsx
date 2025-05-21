import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

interface CardGrupoListaProps {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  grupoApoyo: boolean;
  onPress?: () => void;
}

export default function CardGrupoLista({ titulo, descripcion, imagenUrl, grupoApoyo, onPress }: CardGrupoListaProps) {

  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{ uri: imagenUrl }}
        style={styles.image}
        imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
      >
        {grupoApoyo && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Apoyo</Text>
          </View>
        )}
      </ImageBackground>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{titulo}</Text>
        <Text style={styles.description} numberOfLines={2}>{descripcion}</Text>
      </View>
    </TouchableOpacity>
  );
}

const getStyles = (colors:ColorScheme, fontSize:FontSize, opposite: ColorScheme) => {
      return StyleSheet.create({
        card: {
          backgroundColor: opposite.background,
          borderRadius: 15,
          marginBottom: 16,
          overflow: 'hidden',
          elevation: 5,
        },
        image: {
          height: 150,
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          //padding: 8,
        },
        badge: {
          backgroundColor: opposite.primary,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        },
        badgeText: {
          color: 'white',
          fontSize: fontSize.subtitulo,
          fontWeight: 'bold',
        },
        info: {
          padding: 12,
        },
        title: {
          color: opposite.text,
          fontSize: fontSize.subtitulo,
          fontWeight: 'bold',
        },
        description: {
          color: opposite.text,
          fontSize: fontSize.parrafo,
          marginTop: 4,
        },
      });
}