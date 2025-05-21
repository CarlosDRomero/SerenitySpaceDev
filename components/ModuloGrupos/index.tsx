import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ListaGrupos from './ListaGrupos';
import CrearGrupo from './CrearGrupo';
import SelectorGruposEditar from './SelectorGruposEditar';
import { useRolPrincipal } from '@/hooks/useRolPrincipal';
import AlertaUsuario from '@/components/Alertas/AlertaUsuario';
import BienvenidaUsuario from '@/components/Alertas/BienvenidaUsuario';
import { useModeColor } from '@/hooks/useModeColor';
import { useFontSize } from '@/providers/FontSizeProvider';
import { getIndicatorTypeForFileState } from 'stream-chat-expo';
import BotonTag from '../ui/BotonTag';

export default function ModuloGruposIndex() {
  const { rolPrincipal, rolesUsuario, cargando } = useRolPrincipal();

  const puedeVerLista = rolPrincipal === 'admin' || rolPrincipal === 'estudiante' || rolPrincipal === "psicologo";
  const puedeCrearEditar = rolPrincipal === 'admin' || rolPrincipal === 'psicologo' || rolPrincipal === 'tutor';
  const esInvitado = rolPrincipal === 'invitado';
  const tieneRolValido = ['admin', 'psicologo', 'tutor', 'estudiante'].includes(rolPrincipal || '');


  const [pantalla, setPantalla] = useState<'lista' | 'crear' | 'editar' | 'bienvenida' | 'alerta' | null>(null);

  useEffect(() => {
    if (cargando) return;

    const esSoloInvitado = rolesUsuario.length === 1 && rolesUsuario[0] === 'invitado';

    const pantallaInicial: 'lista' | 'crear' | 'editar' | 'bienvenida' | 'alerta' =
    tieneRolValido ? 'bienvenida' :
    esInvitado ? 'alerta' :
    puedeVerLista ? 'lista' :
    puedeCrearEditar ? 'crear' :    
    'alerta';

    setPantalla(pantallaInicial);
  }, [cargando, rolesUsuario, rolPrincipal]);
  const {colors, oppositeColors} = useModeColor()
  const {fontSize} = useFontSize()
  // Mostrar mensaje mientras se carga
  if (pantalla === null) {
    return (
      <View style={[styles.container, {alignItems: "center", justifyContent: "center", backgroundColor: colors.background}]}>
        <ActivityIndicator/>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      {/* Botones superiores */}
      <View style={styles.botonesTop}>
        
        
        <ScrollView contentContainerStyle={{flexDirection: 'row', overflow: "scroll"}} horizontal={true} showsHorizontalScrollIndicator={false}>
          {puedeVerLista && (
            <BotonTag texto='Explorar grupos' onPress={() => setPantalla('lista')} active = {pantalla === 'lista'}/>
          )}
          {puedeCrearEditar && (
          <>
            <BotonTag texto='Crear Grupo' onPress={() => setPantalla('crear')} active = {pantalla === 'crear'}/>
            <BotonTag texto='Editar Grupos' onPress={() => setPantalla('editar')} active = {pantalla === 'editar'}/>
          </>
        )}
        </ScrollView>

        
      </View>

      {/* Pantallas dinámicas */}
      {pantalla === 'lista' && (
        <ScrollView>
          <ListaGrupos />
        </ScrollView>
      )}

      {pantalla === 'crear' && (
        <ScrollView>
          <CrearGrupo />
        </ScrollView>
      )}

      {pantalla === 'editar' && (
        <SelectorGruposEditar />
      )}

      {pantalla === 'alerta' && (
        <AlertaUsuario />
      )}

      {pantalla === 'bienvenida' && (
        <BienvenidaUsuario />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  botonesTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  botonTop: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  botonActivo: {
    backgroundColor: '#3C63FF',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

