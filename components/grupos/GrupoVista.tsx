/* // GrupoVista.tsx (fuera de GREstudioVisualPK)
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '@/utils/supabase';
import GrupoInfo from './GREstudioVisualPK/GrupoInfo';
import SidebarContenido from './GREstudioVisualPK/SidebarContenido';
import VistaContenido from './GREstudioVisualPK/VistaContenido';
import { GrupoType, ModuloType, TemaType } from './GREstudioVisualPK/estudioTypes';

export default function GrupoVista({ grupoId }: { grupoId: string }) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: TemaType[] }>({});
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaType | null>(null);

  useEffect(() => {
    cargarGrupo();
  }, []);

  const cargarGrupo = async () => {
    const { data: grupoData } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    if (grupoData) {
      setGrupo(grupoData);
      const { data: modulosData } = await supabase
        .from('gr_modulos')
        .select('*')
        .eq('grupo_id', grupoId)
        .order('orden');
      if (modulosData) {
        setModulos(modulosData);
        const temasPor: { [key: string]: TemaType[] } = {};
        for (const modulo of modulosData) {
          const { data: temas } = await supabase
            .from('gr_temas')
            .select('*')
            .eq('modulo_id', modulo.id)
            .order('orden');
          temasPor[modulo.id] = temas || [];
        }
        setTemasPorModulo(temasPor);
      }
    }
  };

  const handleSeleccionModulo = (moduloId: string) => {
    setModuloSeleccionado(moduloId);
    setTemaSeleccionado(null);
  };

  const handleSeleccionTema = (temaId: string) => {
    const temaEncontrado = Object.values(temasPorModulo)
      .flat()
      .find((t) => t.id === temaId);
    if (temaEncontrado) {
      setTemaSeleccionado(temaEncontrado);
    }
  };

  if (!grupo) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <SidebarContenido
          modulos={modulos}
          temasPorModulo={temasPorModulo}
          moduloSeleccionado={moduloSeleccionado}
          temaSeleccionado={temaSeleccionado?.id || null}
          onSeleccionarModulo={handleSeleccionModulo}
          onSeleccionarTema={handleSeleccionTema}
        />
      </View>
      <View style={styles.mainContent}>
        <GrupoInfo grupo={grupo} />
        <VistaContenido tema={temaSeleccionado} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  mainContent: {
    flex: 1,
    paddingTop: 10,
  },
});


 */


/* import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { supabase } from '@/utils/supabase';
import GrupoInfo from './GREstudioVisualPK/GrupoInfo';
import SidebarContenido from './GREstudioVisualPK/SidebarContenido';
import VistaContenido from './GREstudioVisualPK/VistaContenido';
import { GrupoType, ModuloType, TemaType } from './GREstudioVisualPK/estudioTypes';

export default function GrupoVista({ grupoId }: { grupoId: string }) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: TemaType[] }>({});
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaType | null>(null);

  useEffect(() => {
    cargarGrupo();
  }, []);

  const cargarGrupo = async () => {
    const { data: grupoData } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    if (grupoData) {
      setGrupo(grupoData);
      const { data: modulosData } = await supabase
        .from('gr_modulos')
        .select('*')
        .eq('grupo_id', grupoId)
        .order('orden');
      if (modulosData) {
        setModulos(modulosData);
        const temasPor: { [key: string]: TemaType[] } = {};
        for (const modulo of modulosData) {
          const { data: temas } = await supabase
            .from('gr_temas')
            .select('*')
            .eq('modulo_id', modulo.id)
            .order('orden');
          temasPor[modulo.id] = temas || [];
        }
        setTemasPorModulo(temasPor);
      }
    }
  };

  const handleSeleccionModulo = (moduloId: string) => {
    setModuloSeleccionado(moduloId);
    setTemaSeleccionado(null);
  };

  const handleSeleccionTema = (temaId: string) => {
    const temaEncontrado = Object.values(temasPorModulo).flat().find(t => t.id === temaId);
    if (temaEncontrado) setTemaSeleccionado(temaEncontrado);
  };

  if (!grupo) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <ScrollView contentContainerStyle={styles.scrollContenido}>
          <SidebarContenido
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado?.id || null}
            onSeleccionarModulo={handleSeleccionModulo}
            onSeleccionarTema={handleSeleccionTema}
          />
        </ScrollView>
      </View>
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContenido}>
        <GrupoInfo grupo={grupo} />
        {temaSeleccionado && <VistaContenido tema={temaSeleccionado} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContenido: {
    flexGrow: 1,
  },
});
 */

/* 
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import { supabase } from '@/utils/supabase';
import GrupoInfo from './GREstudioVisualPK/GrupoInfo';
import SidebarContenido from './GREstudioVisualPK/SidebarContenido';
import VistaContenido from './GREstudioVisualPK/VistaContenido';
import { GrupoType, ModuloType, TemaType } from './GREstudioVisualPK/estudioTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GrupoVista({ grupoId }: { grupoId: string }) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: TemaType[] }>({});
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaType | null>(null);
  const sidebarLeft = useState(new Animated.Value(0))[0];

  useEffect(() => {
    cargarGrupo();
  }, []);

  const cargarGrupo = async () => {
    const { data: grupoData } = await supabase.from('gr_grupos').select('*').eq('id', grupoId).single();
    if (grupoData) {
      setGrupo(grupoData);
      const { data: modulosData } = await supabase
        .from('gr_modulos')
        .select('*')
        .eq('grupo_id', grupoId)
        .order('orden');
      if (modulosData) {
        setModulos(modulosData);
        const temasPor: { [key: string]: TemaType[] } = {};
        for (const modulo of modulosData) {
          const { data: temas } = await supabase
            .from('gr_temas')
            .select('*')
            .eq('modulo_id', modulo.id)
            .order('orden');
          temasPor[modulo.id] = temas || [];
        }
        setTemasPorModulo(temasPor);
      }
    }
  };

  const handleSeleccionModulo = (moduloId: string) => {
    setModuloSeleccionado(moduloId);
    setTemaSeleccionado(null);
  };

  const handleSeleccionTema = (temaId: string) => {
    const temaEncontrado = Object.values(temasPorModulo).flat().find(t => t.id === temaId);
    if (temaEncontrado) setTemaSeleccionado(temaEncontrado);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < -30) {
        Animated.timing(sidebarLeft, {
          toValue: -SCREEN_WIDTH * 0.7,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else if (gestureState.dx > 30) {
        Animated.timing(sidebarLeft, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!grupo) return null;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarLeft }] }]}>
        <ScrollView contentContainerStyle={styles.scrollContenido}>
          <SidebarContenido
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado?.id || null}
            onSeleccionarModulo={handleSeleccionModulo}
            onSeleccionarTema={handleSeleccionTema}
          />
        </ScrollView>
      </Animated.View>
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContenido}>
        <GrupoInfo grupo={grupo} />
        {temaSeleccionado && <VistaContenido tema={temaSeleccionado} pantallaCompleta />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
  },
  sidebar: {
    width: 280,
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderColor: '#ddd',
    zIndex: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  mainContent: {
    flex: 1,
    marginLeft: 280,
    backgroundColor: '#fff',
  },
  scrollContenido: {
    flexGrow: 1,
  },
});
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import GrupoInfo from './GREstudioVisualPK/GrupoInfo';
import SidebarContenido from './GREstudioVisualPK/SidebarContenido';
import VistaContenido from './GREstudioVisualPK/VistaContenido';
import { GrupoType, ModuloType, TemaType } from './GREstudioVisualPK/estudioTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GrupoVista({ grupoId }: { grupoId: string }) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [key: string]: TemaType[] }>({});
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState<TemaType | null>(null);
  const sidebarLeft = useState(new Animated.Value(0))[0];

  useEffect(() => {
    cargarGrupo();
  }, []);

  const cargarGrupo = async () => {
    const { data: grupoData } = await supabase
      .from('gr_grupos')
      .select('*')
      .eq('id', grupoId)
      .single();
    if (grupoData) {
      setGrupo(grupoData);
      const { data: modulosData } = await supabase
        .from('gr_modulos')
        .select('*')
        .eq('grupo_id', grupoId)
        .order('orden');
      if (modulosData) {
        setModulos(modulosData);
        const temasPor: { [key: string]: TemaType[] } = {};
        for (const modulo of modulosData) {
          const { data: temas } = await supabase
            .from('gr_temas')
            .select('*')
            .eq('modulo_id', modulo.id)
            .order('orden');
          temasPor[modulo.id] = temas || [];
        }
        setTemasPorModulo(temasPor);
      }
    }
  };

  const handleSeleccionModulo = (moduloId: string) => {
    setModuloSeleccionado(moduloId);
    setTemaSeleccionado(null);
  };

  const handleSeleccionTema = (temaId: string) => {
    const temaEncontrado = Object.values(temasPorModulo)
      .flat()
      .find((t) => t.id === temaId);
    if (temaEncontrado) {
      setTemaSeleccionado(temaEncontrado);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx < -30) {
        Animated.timing(sidebarLeft, {
          toValue: -SCREEN_WIDTH * 0.7,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else if (gestureState.dx > 30) {
        Animated.timing(sidebarLeft, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (!grupo) return null;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Sidebar animado */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarLeft }] }]}>
        <ScrollView contentContainerStyle={styles.scrollContenido}>
          <SidebarContenido
            modulos={modulos}
            temasPorModulo={temasPorModulo}
            moduloSeleccionado={moduloSeleccionado}
            temaSeleccionado={temaSeleccionado?.id || null}
            onSeleccionarModulo={handleSeleccionModulo}
            onSeleccionarTema={handleSeleccionTema}
          />
        </ScrollView>
      </Animated.View>

      {/* Contenido principal scrollable */}
      <View style={styles.mainContainer}>
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator
        >
          <GrupoInfo grupo={grupo} />
          {temaSeleccionado && <VistaContenido tema={temaSeleccionado} />}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderColor: '#ddd',
    zIndex: 2,
  },
  mainContainer: {
    flex: 1,
    marginLeft: 0, // ya no se empuja con sidebar
    zIndex: 1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  scrollContenido: {
    padding: 10,
  },
});
