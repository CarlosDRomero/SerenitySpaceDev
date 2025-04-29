import { Stack } from 'expo-router';
import { ImageBackground, StyleSheet } from 'react-native';

export default function DashboardLayout() {
  return (
    <ImageBackground
      source={require('@/assets/Iconos/fondoinicio.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Stack screenOptions={{ headerShown: false }} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'black', // respaldo en caso de que la imagen no cargue
  },
});
