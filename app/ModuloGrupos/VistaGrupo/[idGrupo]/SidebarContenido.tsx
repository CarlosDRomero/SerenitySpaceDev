import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { ModuloType, TemaType } from './vistaTypes';
import { Audio } from 'expo-av';

interface Props {
  modulos: ModuloType[];
  temasPorModulo: { [moduloId: string]: TemaType[] };
  moduloSeleccionado: string | null;
  temaSeleccionado: string | null;
  onSeleccionarModulo: (moduloId: string) => void;
  onSeleccionarTema: (temaId: string) => void;
}

export default function SidebarContenido({
  modulos,
  temasPorModulo,
  moduloSeleccionado,
  temaSeleccionado,
  onSeleccionarModulo,
  onSeleccionarTema,
}: Props) {
  const reproducirSonido = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../assets/sound/click.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.log('Error al reproducir sonido:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {modulos.map((modulo) => {
        const esSeleccionado = modulo.id_m === moduloSeleccionado;
        const temas = temasPorModulo[modulo.id_m] || [];

        return (
          <View key={modulo.id_m} style={styles.moduloContainer}>
            <TouchableOpacity
              style={[
                styles.moduloItem,
                esSeleccionado && styles.moduloSeleccionado,
              ]}
              onPress={async () => {
                await reproducirSonido();
                onSeleccionarModulo(modulo.id_m);
              }}
            >
              <Text style={styles.moduloTexto}>{modulo.titulo}</Text>
            </TouchableOpacity>

            {esSeleccionado && temas.length > 0 && (
              <View style={styles.temaLista}>
                {temas.map((tema) => (
                  <TouchableOpacity
                    key={tema.id_t}
                    style={[
                      styles.temaItem,
                      tema.id_t === temaSeleccionado && styles.temaSeleccionado,
                    ]}
                    onPress={async () => {
                      await reproducirSonido();
                      onSeleccionarTema(tema.id_t);
                    }}
                  >
                    <Text style={styles.temaTexto}>{tema.titulo}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}

      {!moduloSeleccionado && (
        <Text style={styles.ayudaTexto}>Selecciona un módulo para ver los temas</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  moduloContainer: {
    marginBottom: 12,
  },
  moduloItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#3CA7FF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  moduloTexto: {
    color: '#fff',
    fontFamily: 'PressStart2P',
    fontSize: 10,
    textAlign: 'center',
  },
  moduloSeleccionado: {
    backgroundColor: '#2B80D0',
  },
  temaLista: {
    marginTop: 6,
  },
  temaItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 0,
    marginTop: 6,
  },
  temaTexto: {
    color: '#000',
    fontFamily: 'PressStart2P',
    fontSize: 8,
  },
  temaSeleccionado: {
    backgroundColor: '#D0E0FF',
  },
  ayudaTexto: {
    color: '#aaa',
    fontSize: 10,
    fontFamily: 'PressStart2P',
    padding: 10,
    textAlign: 'center',
  },
});
