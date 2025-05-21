import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useCargarGrupos } from './VisorListaGrupos/useCargarGrupos';
import CarruselGruposLista from './VisorListaGrupos/CarruselGruposLista';
import BuscadorGrupos from './VisorListaGrupos/BuscadorGrupos';
import SeccionResultados from './VisorListaGrupos/SeccionResultados';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import BotonTag from '../ui/BotonTag';

export default function ListaGrupos() {

  const {colors, fontSize} = useAjustes()
  
  const [pantalla, setPantalla] = useState<'inicio' | 'buscar'>('inicio');
  const [busqueda, setBusqueda] = useState('');
  const { grupos, gruposRecientes, gruposApoyo, cargando } = useCargarGrupos();
  const router = useRouter();

  const gruposFiltrados = grupos.filter((g) =>
    g.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (g.descripcion ?? '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const handlePressGrupo = (idGrupo: string) => {
    router.push({
      pathname: `/ModuloGrupos/VistaGrupo/[idGrupo]`,
      params: { idGrupo },
    } as any); // ← usamos `as any` temporalmente para evitar el error de tipado
  };
  const styles = getStyles(colors, fontSize)
  return (
    <View style={styles.container}>
      {/* Botones superiores */}
      <View style={styles.botonesTop}>
        <BotonTag texto = "Inicio" onPress={() => setPantalla('inicio')} active={pantalla === 'inicio'}/>
        <BotonTag texto = "buscar" onPress={() => setPantalla('buscar')} active={pantalla === 'buscar'}/>        
      </View>

      {/* Vista Inicio con carruseles */}
      {pantalla === 'inicio' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {cargando ? (
            <ActivityIndicator size="large" color="#3C63FF" />
          ) : (
            <>
              <CarruselGruposLista
                titulo="Últimos grupos creados"
                grupos={gruposRecientes}
                onPressGrupo={handlePressGrupo}
              />
              <CarruselGruposLista
                titulo="Grupos de apoyo"
                grupos={gruposApoyo}
                onPressGrupo={handlePressGrupo}
              />
              <CarruselGruposLista
                titulo="Todos los grupos"
                grupos={grupos}
                onPressGrupo={handlePressGrupo}
              />
            </>
          )}
        </ScrollView>
      )}

      {/* Vista Buscar */}
      {pantalla === 'buscar' && (
        <View style={styles.buscarContainer}>
          <BuscadorGrupos busqueda={busqueda} setBusqueda={setBusqueda} />
          <SeccionResultados
            grupos={gruposFiltrados}
            cargando={cargando}
            onPressGrupo={handlePressGrupo}
          />
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    botonesTop: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10,
    },    
    scrollContainer: {
      padding: 16,
    },
    buscarContainer: {
      flex: 1,
      padding: 16,
    },
  });
}