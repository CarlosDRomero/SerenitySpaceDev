import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ModuloType, TemaType } from './editorTypes';

interface Props {
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
}: Props) {
  return (
    <View style={styles.menuLateral}>
      <TouchableOpacity onPress={onCerrar} style={styles.cerrarMenu}>
        <Text>✖</Text>
      </TouchableOpacity>

      <Text style={styles.menuTitulo}>Menú del Grupo</Text>

      <TouchableOpacity onPress={() => onSeleccionar('grupo', grupoId)} style={styles.filaItem}>
        <Text style={styles.menuItem}>Grupo</Text>
        <TouchableOpacity onPress={onAgregarModulo}>
          <Text style={styles.masBtn}>＋</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      <ScrollView>
        {modulos.map((m) => (
          <View key={m.id}>
            <View style={styles.filaItem}>
              <TouchableOpacity onPress={() => onSeleccionar('modulo', m.id)}>
                <Text style={styles.menuItem}>📁 {m.nombre}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onAgregarTema(m.id)}>
                <Text style={styles.masBtn}>＋</Text>
              </TouchableOpacity>
            </View>

            {temasPorModulo[m.id]?.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => onSeleccionar('tema', t.id)}
              >
                <Text style={styles.menuSubitem}>↳ {t.titulo}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  menuLateral: {
    backgroundColor: '#fff',
    padding: 20,
    width: 280,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  cerrarMenu: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  menuTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  filaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItem: {
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  menuSubitem: {
    paddingLeft: 20,
    paddingVertical: 4,
    fontSize: 14,
    color: '#666',
  },
  masBtn: {
    fontSize: 18,
    color: '#007AFF',
    paddingHorizontal: 5,
  },
});
