import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

interface GrupoCardProps {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  grupoApoyo: boolean;
  onPress?: () => void;
}

export default function GrupoCard({ titulo, descripcion, imagenUrl, grupoApoyo, onPress }: GrupoCardProps) {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
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
    padding: 8,
  },
  badge: {
    backgroundColor: '#3C63FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
});
