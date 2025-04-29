import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import GrupoCard from './GrupoCard';

interface Props {
  titulo: string;
  grupos: any[];
}

export default function GrupoCarrusel({ titulo, grupos }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.titulo}>{titulo}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {grupos.map((grupo) => (
          <View key={grupo.id_g} style={styles.cardContainer}>
            <GrupoCard
              titulo={grupo.titulo}
              descripcion={grupo.descripcion}
              imagenUrl={grupo.imagen_url}
              grupoApoyo={grupo.grupo_apoyo}
              onPress={() => console.log('Ir al detalle de:', grupo.id_g)}
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
