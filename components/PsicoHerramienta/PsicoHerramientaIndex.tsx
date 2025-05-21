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
import BotonTag from "@/components/ui/BotonTag"
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

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
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
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
      <ScrollView style={styles.botonesTop} horizontal showsHorizontalScrollIndicator = { false }>
        {esEstudiante && (
          <>
            <BotonTag
              texto="Solicitar Apoyo"
              active={pantalla === 'solicitar'}
              onPress={() => setPantalla('solicitar')}
            />
            <BotonTag
              texto="Mis Sesiones"
              active={pantalla === 'ver-sesiones'}
              onPress={() => setPantalla('ver-sesiones')}
            />
            <BotonTag
              texto="Recomendaciones"
              active={pantalla === 'ver-recomendaciones'}
              onPress={() => setPantalla('ver-recomendaciones')}
            />
          </>
        )}

        {esPsicologo && (
          <>
            <BotonTag
              texto="Solicitudes Recibidas"
              active={pantalla === 'solicitudes'}
              onPress={() => setPantalla('solicitudes')}
            />
            <BotonTag
              texto="Registrar Sesión"
              active={pantalla === 'registrar-sesion'}
              onPress={() => setPantalla('registrar-sesion')}
            />
            <BotonTag
              texto="Historial Clínico"
              active={pantalla === 'ver-sesiones'}
              onPress={() => setPantalla('ver-sesiones')}
            />
            <BotonTag
              texto="Recomendar Grupo"
              active={pantalla === 'recomendar-grupo'}
              onPress={() => setPantalla('recomendar-grupo')}
            />
          </>
        )}
      </ScrollView>


      {/* Pantalla activa */}
      <View style={styles.scroll}>
        {pantalla === 'bienvenida' && <Text style={styles.mensaje}>Bienvenido a la PsicoHerramienta</Text>}
        {pantalla === 'solicitar' && <SolicitarApoyo />}
        {pantalla === 'solicitudes' && <SolicitudesRecibidas />}
        {pantalla === 'registrar-sesion' && <RegistrarSesion />}
        {pantalla === 'ver-sesiones' && (esEstudiante ? <VerSesionesEstudiante /> : <VerSesiones />)}
        {pantalla === 'ver-recomendaciones' &&
          (esEstudiante ? <VerRecomendacionesEstudiante /> : <Text style={styles.mensaje}>Tus recomendaciones</Text>)}
        {pantalla === 'recomendar-grupo' && (esPsicologo ? <CrearRecomendacion /> : <Text style={styles.mensaje}>Formulario para recomendar grupo</Text>)}
      </View>
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  botonesTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,

  },

  mensaje: {
    color: colors.text,
    fontSize: fontSize.subtitulo,
    textAlign: 'center',
    marginVertical: 20,
  },
  scroll: {
    paddingHorizontal: 16,
  },
});
}
