import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { fetchGrupos } from './BD/gruposDB';  //importar correctamente
import GrupoCard from './GrupoCard'; // Importamos la card visual
import GrupoCarrusel from './GrupoCarrusel';

export default function ListaGrupos() {
  const [pantalla, setPantalla] = useState<'inicio' | 'buscar'>('inicio');
  const [busqueda, setBusqueda] = useState('');
  const [grupos, setGrupos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      const data = await fetchGrupos();
      setGrupos(data);
      setCargando(false);
    };
    cargar();
  }, []);

  const gruposFiltrados = grupos.filter(g =>
    g.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    (g.descripcion ?? '').toLowerCase().includes(busqueda.toLowerCase())
  );

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

      {/* Vista dinámica */}
      {pantalla === 'inicio' && (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {cargando ? (
            <ActivityIndicator size="large" color="#3C63FF" />
          ) : (
            <>
              <GrupoCarrusel titulo="Últimos grupos creados" grupos={grupos} />

              {/* Aquí podrías duplicar para otras secciones luego */}
              {/* <GrupoCarrusel titulo="Nuestros mejores grupos" grupos={grupos.slice(0, 5)} /> */}
            </>
          )}
        </ScrollView>
      )}

      {pantalla === 'buscar' && (
        <View style={styles.buscarContainer}>
          <TextInput
            placeholder="¿Qué grupo quieres encontrar?"
            placeholderTextColor="#aaa"
            style={styles.inputBuscar}
            value={busqueda}
            onChangeText={setBusqueda}
          />

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.tituloSeccion}>Resultados de búsqueda</Text>

            {cargando ? (
              <ActivityIndicator size="large" color="#3C63FF" />
            ) : gruposFiltrados.length > 0 ? (
              gruposFiltrados.map((grupo) => (
                <GrupoCard
                  key={grupo.id_g}
                  titulo={grupo.titulo}
                  descripcion={grupo.descripcion}
                  imagenUrl={grupo.imagen_url}
                  grupoApoyo={grupo.grupo_apoyo}
                  onPress={() => console.log('Ir al detalle del grupo', grupo.id_g)}
                />
              ))
            ) : (
              <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No se encontraron grupos</Text>
            )}
          </ScrollView>
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
  tituloSeccion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  buscarContainer: {
    flex: 1,
    padding: 16,
  },
  inputBuscar: {
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
  },
});
