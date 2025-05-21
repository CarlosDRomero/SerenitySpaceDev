// /components/ModuloGrupos/EditorVisual/SidebarMenu.tsx

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ModuloType, TemaType } from './editorTypes';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

interface SidebarMenuProps {
  grupoId: string;
  modulos: ModuloType[];
  temasPorModulo: { [key: string]: TemaType[] };
  onSeleccionar: (tipo: 'grupo' | 'modulo' | 'tema', id: string) => void;
  onAgregarModulo: () => void;
  onAgregarTema: (moduloId: string) => void;
  onCerrar: () => void;
}

export default function SidebarMenu({
  grupoId,
  modulos,
  temasPorModulo,
  onSeleccionar,
  onAgregarModulo,
  onAgregarTema,
  onCerrar,
}: SidebarMenuProps) {
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCerrar}>
        <Text style={styles.cerrar}>✖️ Cerrar</Text>
      </TouchableOpacity>

      <ScrollView>
        <TouchableOpacity onPress={() => onSeleccionar('grupo', grupoId)}>
          <Text style={styles.grupoTitulo}>Editar Grupo</Text>
        </TouchableOpacity>

        {modulos.map((modulo) => (
          <View key={modulo.id_m}>
            <TouchableOpacity onPress={() => onSeleccionar('modulo', modulo.id_m)}>
              <Text style={styles.moduloTitulo}>📁 {modulo.titulo}</Text>
            </TouchableOpacity>

            {(temasPorModulo[modulo.id_m] || []).map((tema) => (
              <TouchableOpacity
                key={tema.id_t}
                style={styles.temaItem}
                onPress={() => onSeleccionar('tema', tema.id_t)}
              >
                <Text style={styles.temaTexto}>- {tema.titulo}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity onPress={() => onAgregarTema(modulo.id_m)}>
              <Text style={styles.agregarTema}>➕ Agregar Tema</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity onPress={onAgregarModulo}>
          <Text style={styles.agregarModulo}>➕ Agregar Módulo</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme)=>{
 return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    cerrar: {
      color: '#FF4E4E',
      fontWeight: 'bold',
      marginBottom: 20,
      fontSize: fontSize.parrafo * 1.1
    },
    grupoTitulo: {
      color: colors.primary,
      fontSize: fontSize.subtitulo,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    moduloTitulo: {
      color: colors.text,
      fontSize: 16,
      marginTop: 10,
      marginBottom: 5,
    },
    temaItem: {
      paddingLeft: 20,
      marginBottom: 5,
    },
    temaTexto: {
      color: opposite.secondary,
      fontSize: 14,
    },
    agregarModulo: {
      color: colors.primary,
      fontWeight: 'bold',
      marginTop: 20,
    },
    agregarTema: {
      color: colors.primary,
      fontSize: 14,
      paddingLeft: 20,
      marginTop: 5,
    },
  });
}