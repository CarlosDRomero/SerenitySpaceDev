// components/PsicoHerramienta/CustomSelector.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function CustomSelector({ label, options, selectedValue, onValueChange }: Props) {
  const [visible, setVisible] = useState(false);
  const {colors, fontSize} = useAjustes()
  const styles = getStyles(colors, fontSize)
  const selectedLabel = options.find((opt) => opt.value === selectedValue)?.label || 'Seleccionar...';

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
        <Text style={styles.text}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Selecciona una opción</Text>
            <ScrollView>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.opcion}
                  onPress={() => {
                    onValueChange(option.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.text}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelar} onPress={() => setVisible(false)}>
              <Text style={styles.cancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors: ColorScheme, fontSize: FontSize)=>{
 return StyleSheet.create({
    label: {
      color: colors.text,
      marginBottom: 4,
    },
    selector: {
      backgroundColor: colors.secondary,
      padding: 10,
      borderRadius: 6,
    },
    text: {
      color: colors.text,
    },
    modalFondo: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
      padding: 20,
    },
    modalBox: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 20,
      maxHeight: '80%',
    },
    modalTitulo: {
      color: colors.text,
      fontSize: fontSize.parrafo,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    opcion: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    cancelar: {
      marginTop: 10,
      alignItems: 'center',
    },
    cancelarTexto: {
      color: '#a44',
    },
  });
}