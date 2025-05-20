import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/utils/supabase';

type Rol = {
  id: number;
  nombre: string;
};

type UsuarioRolActivo = {
  id_rol: number;
  activo: boolean;
  roles: Rol; 
};

type SwitchRolesProps = {
  usuario: { id: string } | null;
};

export default function SwitchRoles({ usuario }: SwitchRolesProps) {
  const [rolesActivos, setRolesActivos] = useState<UsuarioRolActivo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRolesActivos = async () => {
      if (!usuario) return;
      setLoading(true);

      const { data, error } = await supabase
        .from('usuarios_roles_activos')
        .select(`
          id_rol,
          activo,
          roles (id, nombre)
        `)
        .eq('id_profile', usuario.id);

      if (error) {
        console.error('Error cargando roles activos:', error);
        setRolesActivos([]);
      } else {
        const formateados = (data || []).map((item: any) => ({
          id_rol: item.id_rol,
          activo: item.activo,
          roles: item.roles[0] || { id: 0, nombre: '' },
        }));
        setRolesActivos(formateados);
      }

      setLoading(false);
    };

    fetchRolesActivos();
  }, [usuario]);

  const toggleActivo = async (idRol: number) => {
    if (!usuario) return;

    const rolActual = rolesActivos.find((r) => r.id_rol === idRol);
    if (!rolActual) return;

    const nuevoActivo = !rolActual.activo;
    setRolesActivos((prev) =>
      prev.map((r) => (r.id_rol === idRol ? { ...r, activo: nuevoActivo } : r))
    );

    const { error } = await supabase
      .from('usuarios_roles_activos')
      .upsert(
        [
          {
            id_profile: usuario.id,
            id_rol: idRol,
            activo: nuevoActivo,
            fecha_actualizacion: new Date().toISOString(),
          },
        ],
        {
          onConflict: 'id_profile,id_rol',
        }
      );

    if (error) {
      console.error('Error actualizando rol activo:', error);
      setRolesActivos((prev) =>
        prev.map((r) => (r.id_rol === idRol ? { ...r, activo: rolActual.activo } : r))
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3C63FF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activar / Desactivar Roles</Text>
      {rolesActivos.length === 0 && <Text>No tienes roles activos asignados.</Text>}

      {rolesActivos.map((rol) => (
        <View key={rol.id_rol} style={styles.row}>
          <Text style={styles.label}>{rol.roles.nombre}</Text>
          <Switch
            value={rol.activo}
            onValueChange={() => toggleActivo(rol.id_rol)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: 'black' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
  },
  label: { fontSize: 18, color: '#333' },
});
