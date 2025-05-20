// components/PsicoHerramienta/PsicoHerramientaIndex.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRolPrincipal } from '@/hooks/useRolPrincipal';
import SolicitarApoyo from './SolicitarApoyo';
import SolicitudesRecibidas from './SolicitudesRecibidas';
import RegistrarSesion from './RegistrarSesion';
import VerSesiones from './VerSesiones'; // Psicólogo
import VerSesionesEstudiante from './VerSesionesEstudiante'; // Estudiante
import VerRecomendacionesEstudiante from './VerRecomendacionesEstudiante'; // Estudiante
import CrearRecomendacion from './CrearRecomendacion'; // Psicólogo

export default function PsicoHerramientaIndex() {
  const { rolPrincipal, rolesUsuario, cargando } = useRolPrincipal();

  const [pantalla, setPantalla] = useState<
    | 'bienvenida'
    | 'solicitar'
    | 'ver-sesiones'
    | 'registrar-sesion'
    | 'ver-recomendaciones'
    | 'recomendar-grupo'
    | 'solicitudes'
    | null
  >(null);

  const esEstudiante = rolPrincipal === 'estudiante';
  const esPsicologo = rolPrincipal === 'psicologo';
  const esInvitado = rolPrincipal === 'invitado';

  useEffect(() => {
    if (cargando) return;

    const pantallaInicial = esEstudiante
      ? 'bienvenida'
      : esPsicologo
      ? 'bienvenida'
      : 'bienvenida';

    setPantalla(pantallaInicial);
  }, [cargando, rolPrincipal]);

  if (pantalla === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Cargando PsicoHerramienta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botones según rol */}
      <View style={styles.botonesTop}>
        {esEstudiante && (
          <>
            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'solicitar' && styles.botonActivo]}
              onPress={() => setPantalla('solicitar')}
            >
              <Text style={styles.textoBoton}>Solicitar Apoyo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'ver-sesiones' && styles.botonActivo]}
              onPress={() => setPantalla('ver-sesiones')}
            >
              <Text style={styles.textoBoton}>Mis Sesiones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'ver-recomendaciones' && styles.botonActivo]}
              onPress={() => setPantalla('ver-recomendaciones')}
            >
              <Text style={styles.textoBoton}>Recomendaciones</Text>
            </TouchableOpacity>
          </>
        )}

        {esPsicologo && (
          <>
            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'solicitudes' && styles.botonActivo]}
              onPress={() => setPantalla('solicitudes')}
            >
              <Text style={styles.textoBoton}>Solicitudes Recibidas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'registrar-sesion' && styles.botonActivo]}
              onPress={() => setPantalla('registrar-sesion')}
            >
              <Text style={styles.textoBoton}>Registrar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'ver-sesiones' && styles.botonActivo]}
              onPress={() => setPantalla('ver-sesiones')}
            >
              <Text style={styles.textoBoton}>Historial Clínico</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'recomendar-grupo' && styles.botonActivo]}
              onPress={() => setPantalla('recomendar-grupo')}
            >
              <Text style={styles.textoBoton}>Recomendar Grupo</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Pantalla activa */}
      <ScrollView style={styles.scroll}>
        {pantalla === 'bienvenida' && <Text style={styles.mensaje}>Bienvenido a la PsicoHerramienta</Text>}
        {pantalla === 'solicitar' && <SolicitarApoyo />}
        {pantalla === 'solicitudes' && <SolicitudesRecibidas />}
        {pantalla === 'registrar-sesion' && <RegistrarSesion />}
        {pantalla === 'ver-sesiones' && (esEstudiante ? <VerSesionesEstudiante /> : <VerSesiones />)}
        {pantalla === 'ver-recomendaciones' &&
          (esEstudiante ? <VerRecomendacionesEstudiante /> : <Text style={styles.mensaje}>Tus recomendaciones</Text>)}
        {pantalla === 'recomendar-grupo' && (esPsicologo ? <CrearRecomendacion /> : <Text style={styles.mensaje}>Formulario para recomendar grupo</Text>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  botonesTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  botonTop: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  botonActivo: {
    backgroundColor: '#3C63FF',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
  mensaje: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  scroll: {
    paddingHorizontal: 16,
  },
});

