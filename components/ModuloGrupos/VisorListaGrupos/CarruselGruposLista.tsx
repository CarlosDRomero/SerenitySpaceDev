import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import CardGrupoLista from './CardGrupoLista';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';


interface CarruselGruposListaProps {
  titulo: string;
  grupos: any[]; // Cambia a GrupoType[] si ya lo estás usando
  onPressGrupo: (idGrupo: string) => void;
}

export default function CarruselGruposLista({ titulo, grupos, onPressGrupo }: CarruselGruposListaProps) {

  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
  return (
    <View style={styles.section}>
      <Text style={styles.titulo}>{titulo}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {grupos.map((grupo) => (
          <View key={grupo.id_g} style={styles.cardContainer}>
            <CardGrupoLista
              titulo={grupo.titulo}
              descripcion={grupo.descripcion}
              imagenUrl={grupo.imagen_url}
              grupoApoyo={grupo.grupo_apoyo}
              onPress={() => onPressGrupo(grupo.id_g)} // Ahora sí navega
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


const getStyles = (colors:ColorScheme, fontSize:FontSize) => {

    return StyleSheet.create({
    section: {
      marginBottom: 20,
    },
    titulo: {
      color: colors.text,
      fontSize: fontSize.titulo,
      fontWeight: 'bold',
      marginBottom: 10,
      paddingLeft: 8,
    },
    cardContainer: {
      width: 240,
      marginRight: 12,
    },
  });

}
