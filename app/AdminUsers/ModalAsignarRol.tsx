// /app/moduloGrupos/AdministradorUsuarios/ModalAsignarRol.tsx

import { Modal, View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { ModalAsignarRolProps, Rol } from './types_AU';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ModalAsignarRol({
  visible,
  usuario,
  onClose,
  refetch,
}: ModalAsignarRolProps) {
  const [asignando, setAsignando] = useState(false);
  const [rolesDisponibles, setRolesDisponibles] = useState<Rol[]>([]);
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const { data, error } = await supabase.from('roles').select('*');
      if (data) setRolesDisponibles(data);
    };

    if (visible && usuario) {
      fetchRoles();

      const actuales = usuario.usuarios_roles?.map((r) => r.roles.nombre) ?? [];
      setRolesSeleccionados(actuales);
    }
  }, [visible, usuario]);

  const toggleRol = (nombre: string) => {
    if (rolesSeleccionados.includes(nombre)) {
      setRolesSeleccionados(rolesSeleccionados.filter((r) => r !== nombre));
    } else {
      setRolesSeleccionados([...rolesSeleccionados, nombre]);
    }
  };

  const guardarRoles = async () => {
    if (!usuario) return;
    setAsignando(true);

    // Obtener todos los roles para resolver sus IDs
    const { data: todosLosRoles } = await supabase.from('roles').select('id, nombre');

    const rolesAInsertar = todosLosRoles?.filter((r) =>
      rolesSeleccionados.includes(r.nombre)
    ) ?? [];

    // Borrar todos los roles actuales del usuario
    await supabase.from('usuarios_roles').delete().eq('id_profile', usuario.id);

    // Insertar roles seleccionados
    const { data: userData } = await supabase.auth.getUser();
    const asignado_por = userData?.user?.id;

    const inserts = rolesAInsertar.map((rol) => ({
      id_profile: usuario.id,
      id_rol: rol.id,
      asignado_por,
    }));

    if (inserts.length > 0) {
      await supabase.from('usuarios_roles').insert(inserts);
    }

    setAsignando(false);
    onClose();
    refetch();
  };

  return (
  <Modal visible={visible} animationType="slide">
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          Asignar roles a: {usuario?.full_name}
        </Text>

        {rolesDisponibles.map((rol) => {
          const seleccionado = rolesSeleccionados.includes(rol.nombre);

          return (
            <TouchableOpacity
              key={rol.id}
              style={{
                padding: 10,
                marginBottom: 6,
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: seleccionado ? '#8f8' : '#fff',
              }}
              onPress={() => toggleRol(rol.nombre)}
            >
              <Text style={{ fontSize: 16 }}>
                {seleccionado ? 'O' : 'X'} {rol.nombre}
              </Text>
            </TouchableOpacity>
          );
        })}

        <View style={{ marginTop: 20 }}>
          <Button title="Guardar" onPress={guardarRoles} disabled={asignando} />
          <Button title="Cancelar" onPress={onClose} color="gray" />
        </View>
      </ScrollView>
    </SafeAreaView>
  </Modal>
);
}
