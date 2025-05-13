/* import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import GrCrearGrupo from './GrCrearGrupo';
import GrListaGrupos from './GrListaGrupos';
import GrDetalleGrupo from './GrDetalleGrupo';
import GrGestionTemas from './GrGestionTemas';
import GrupoVista from './GrupoVista';
import GREditorVisual from './GrEditorVisual';

export default function GruposIndex() {
  const [vista, setVista] = useState<'crear' | 'lista' | 'detalle' | 'temas' | 'vista' | 'editor'>('lista');
  const [grupoIdSeleccionado, setGrupoIdSeleccionado] = useState<string | null>(null);
  const [moduloIdSeleccionado, setModuloIdSeleccionado] = useState<string | null>(null);

  const mostrarDetalleGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('detalle');
  };

  const mostrarTemas = (moduloId: string) => {
    setModuloIdSeleccionado(moduloId);
    setVista('temas');
  };

  const mostrarVistaGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('vista');
  };

  const mostrarEditorGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('editor');
  };

  const volverALista = () => {
    setGrupoIdSeleccionado(null);
    setVista('lista');
  };

  const volverADetalle = () => {
    setModuloIdSeleccionado(null);
    setVista('detalle');
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.btn, vista === 'lista' && styles.btnActivo]}
          onPress={() => setVista('lista')}
        >
          <Text style={styles.textoBtn}>Grupos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'crear' && styles.btnActivo]}
          onPress={() => setVista('crear')}
        >
          <Text style={styles.textoBtn}>Crear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'vista' && styles.btnActivo]}
          onPress={() => grupoIdSeleccionado && mostrarVistaGrupo(grupoIdSeleccionado)}
          disabled={!grupoIdSeleccionado}
        >
          <Text style={styles.textoBtn}>Vista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'editor' && styles.btnActivo]}
          onPress={() => grupoIdSeleccionado && mostrarEditorGrupo(grupoIdSeleccionado)}
          disabled={!grupoIdSeleccionado}
        >
          <Text style={styles.textoBtn}>Editor</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contenido}>
        {vista === 'crear' && (
          <GrCrearGrupo onFinish={() => setVista('lista')} />
        )}
        {vista === 'lista' && (
          <GrListaGrupos onSeleccionarGrupo={mostrarDetalleGrupo} />
        )}
        {vista === 'detalle' && grupoIdSeleccionado && (
          <GrDetalleGrupo
            grupoId={grupoIdSeleccionado}
            onVolver={volverALista}
            onGestionarTemas={mostrarTemas}
          />
        )}
        {vista === 'temas' && moduloIdSeleccionado && (
          <GrGestionTemas
            moduloId={moduloIdSeleccionado}
            onVolver={volverADetalle}
          />
        )}
        {vista === 'vista' && grupoIdSeleccionado && (
          <GrupoVista grupoId={grupoIdSeleccionado} />
        )}
        {vista === 'editor' && grupoIdSeleccionado && (
          <GREditorVisual grupoId={grupoIdSeleccionado} onVolver={volverALista} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  btnActivo: {
    backgroundColor: '#007AFF',
  },
  textoBtn: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
 */


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import GrCrearGrupo from './GrCrearGrupo';
import GrListaGrupos from './GrListaGrupos';
import GrDetalleGrupo from './GrDetalleGrupo';
import GrGestionTemas from './GrGestionTemas';
import GrEditorVisual from './GrEditorVisual'; // << ESTE es el que edita
import GrupoVista from './GrupoVista'; // << ESTE es el que visualiza

export default function GruposIndex() {
  const [vista, setVista] = useState<'crear' | 'lista' | 'detalle' | 'temas' | 'vista' | 'editor'>('lista');
  const [grupoIdSeleccionado, setGrupoIdSeleccionado] = useState<string | null>(null);
  const [moduloIdSeleccionado, setModuloIdSeleccionado] = useState<string | null>(null);

  const mostrarDetalleGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('detalle');
  };

  const mostrarEditorGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('editor');
  };

  const mostrarVistaGrupo = (grupoId: string) => {
    setGrupoIdSeleccionado(grupoId);
    setVista('vista');
  };

  const mostrarTemas = (moduloId: string) => {
    setModuloIdSeleccionado(moduloId);
    setVista('temas');
  };

  const volverALista = () => {
    setGrupoIdSeleccionado(null);
    setVista('lista');
  };

  const volverADetalle = () => {
    setModuloIdSeleccionado(null);
    setVista('detalle');
  };

  return (
    <View style={styles.contenedor}>
      <View style={styles.botones}>
        <TouchableOpacity
          style={[styles.btn, vista === 'lista' && styles.btnActivo]}
          onPress={() => setVista('lista')}
        >
          <Text style={styles.textoBtn}>Grupos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'crear' && styles.btnActivo]}
          onPress={() => setVista('crear')}
        >
          <Text style={styles.textoBtn}>Crear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'vista' && styles.btnActivo]}
          onPress={() => grupoIdSeleccionado && mostrarVistaGrupo(grupoIdSeleccionado)}
          disabled={!grupoIdSeleccionado}
        >
          <Text style={styles.textoBtn}>Vista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, vista === 'editor' && styles.btnActivo]}
          onPress={() => grupoIdSeleccionado && mostrarEditorGrupo(grupoIdSeleccionado)}
          disabled={!grupoIdSeleccionado}
        >
          <Text style={styles.textoBtn}>Editar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contenido}>
        {vista === 'crear' && (
          <GrCrearGrupo onFinish={volverALista} />
        )}
        {vista === 'lista' && (
          <GrListaGrupos onSeleccionarGrupo={mostrarDetalleGrupo} />
        )}
        {vista === 'detalle' && grupoIdSeleccionado && (
          <GrDetalleGrupo
            grupoId={grupoIdSeleccionado}
            onVolver={volverALista}
            onGestionarTemas={mostrarTemas}
          />
        )}
        {vista === 'temas' && moduloIdSeleccionado && (
          <GrGestionTemas
            moduloId={moduloIdSeleccionado}
            onVolver={volverADetalle}
          />
        )}
        {vista === 'vista' && grupoIdSeleccionado && (
          <GrupoVista grupoId={grupoIdSeleccionado} />
        )}
        {vista === 'editor' && grupoIdSeleccionado && (
          <GrEditorVisual grupoId={grupoIdSeleccionado} onVolver={volverALista} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    marginBottom: 5,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  btnActivo: {
    backgroundColor: '#007AFF',
  },
  textoBtn: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
