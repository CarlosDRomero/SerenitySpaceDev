import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useCargarGrupos } from './VisorListaGrupos/useCargarGrupos';
import CarruselGruposLista from './VisorListaGrupos/CarruselGruposLista';
import BuscadorGrupos from './VisorListaGrupos/BuscadorGrupos';
import SeccionResultados from './VisorListaGrupos/SeccionResultados';

export default function ListaGrupos() {
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

  return (
    <View style={styles.container}>
      {/* Botones superiores */}
      <View style={styles.botonesTop}>
        <TouchableOpacity
          style={[styles.botonTop, pantalla === 'inicio' && styles.botonActivo]}
          onPress={() => setPantalla('inicio')}
        >
          <Text style={styles.textoBoton}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botonTop, pantalla === 'buscar' && styles.botonActivo]}
          onPress={() => setPantalla('buscar')}
        >
          <Text style={styles.textoBoton}>Buscar</Text>
        </TouchableOpacity>
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
  scrollContainer: {
    padding: 16,
  },
  buscarContainer: {
    flex: 1,
    padding: 16,
  },
});
