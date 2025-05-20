import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import CardGrupoLista from './CardGrupoLista';

interface CarruselGruposListaProps {
  titulo: string;
  grupos: any[]; // Cambia a GrupoType[] si ya lo estás usando
  onPressGrupo: (idGrupo: string) => void;
}

export default function CarruselGruposLista({ titulo, grupos, onPressGrupo }: CarruselGruposListaProps) {
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

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  titulo: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingLeft: 8,
  },
  cardContainer: {
    width: 240,
    marginRight: 12,
  },
});
