import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';


export default function EstudianteHome() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido, Estudiante</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/RedSocial')}>
        <Text style={styles.buttonText}>Red Social</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/ModuloGrupos/VisorListaGrupos')}>
        <Text style={styles.buttonText}>Grupos Académicos y de Apoyo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/MiCuenta')}>
        <Text style={styles.buttonText}>Mi Cuenta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/ApoyoEmocional')}>
        <Text style={styles.buttonText}>Historial de Apoyo Emocional</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/Ajustes')}>
        <Text style={styles.buttonText}>Ajustes</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#000',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 10,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
