import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ListaGrupos from './ListaGrupos';
import CrearGrupo from './CrearGrupo';
import SelectorGruposEditar from './SelectorGruposEditar';
import { useRolPrincipal } from '@/hooks/useRolPrincipal';
import AlertaUsuario from '@/components/Alertas/AlertaUsuario';
import BienvenidaUsuario from '@/components/Alertas/BienvenidaUsuario';

export default function ModuloGruposIndex() {
  const { rolPrincipal, rolesUsuario, cargando } = useRolPrincipal();

  const puedeVerLista = rolPrincipal === 'admin' || rolPrincipal === 'estudiante';
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

  // Mostrar mensaje mientras se carga
  if (pantalla === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Cargando vista inicial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botones superiores */}
      <View style={styles.botonesTop}>
        {puedeVerLista && (
          <TouchableOpacity
            style={[styles.botonTop, pantalla === 'lista' && styles.botonActivo]}
            onPress={() => setPantalla('lista')}
          >
            <Text style={styles.textoBoton}>Explorar Grupos</Text>
          </TouchableOpacity>
        )}
        {puedeCrearEditar && (
          <>
            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'crear' && styles.botonActivo]}
              onPress={() => setPantalla('crear')}
            >
              <Text style={styles.textoBoton}>Crear Grupo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonTop, pantalla === 'editar' && styles.botonActivo]}
              onPress={() => setPantalla('editar')}
            >
              <Text style={styles.textoBoton}>Editar Grupos</Text>
            </TouchableOpacity>
          </>
        )}
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
    backgroundColor: '#0c0c0c',
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
    backgroundColor: '#2a2a2a',
  },
  botonActivo: {
    backgroundColor: '#3C63FF',
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

