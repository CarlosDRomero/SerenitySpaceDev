// /app/moduloGrupos/AdministradorUsuarios/index.tsx

import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useUsuariosConRoles } from './useUsuariosConRoles';
import ListaUsuarios from './ListaUsuarios';
import ModalAsignarRol from './ModalAsignarRol';
import { UsuarioConRol } from './types_AU';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminPanel() {
  const {
    usuarios,
    loading,
    refetch,
    busqueda,
    setBusqueda,
    todosUsuarios
  } = useUsuariosConRoles();

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioConRol | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const abrirModal = (usuario: UsuarioConRol) => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setUsuarioSeleccionado(null);
  };

  // Filtrar nuevos usuarios sin roles
  const nuevosUsuarios = todosUsuarios.filter((u) => !u.usuarios_roles?.length);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Gestión de Usuarios</Text>

        <TextInput
          placeholder="Buscar usuario por nombre o Rol"
          value={busqueda}
          onChangeText={setBusqueda}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginVertical: 12,
          }}
        />

        {/* Nuevos usuarios */}
        {nuevosUsuarios.length > 0 ? (
            <View style={{ backgroundColor: '#ffe8e8', padding: 10, borderRadius: 8, marginBottom: 12 }}>
                <Text style={{ color: '#c00', fontWeight: 'bold', marginBottom: 6 }}>
                Nuevos usuarios sin rol asignado:
                </Text>
                {nuevosUsuarios.map((u) => (
                <View
                    key={u.id}
                    style={{
                    marginBottom: 6,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    }}
                >
                    <Text style={{ flex: 1, color: '#000' }}>• {u.full_name}</Text>
                    <Text
                    onPress={() => abrirModal(u)}
                    style={{
                        color: '#007bff',
                        textDecorationLine: 'underline',
                        fontWeight: 'bold',
                        paddingHorizontal: 6,
                    }}
                    >
                    Asignar rol
                    </Text>
                </View>
                ))}
            </View>
            ) : (
            <Text style={{ color: 'green', marginBottom: 12 }}>
                Todos los usuarios tienen al menos un rol asignado.
            </Text>
            )}



        {loading ? (
          <Text>Cargando usuarios...</Text>
        ) : (
          <ListaUsuarios usuarios={usuarios} onAsignar={abrirModal} />
        )}

        <ModalAsignarRol
          visible={modalVisible}
          usuario={usuarioSeleccionado}
          onClose={cerrarModal}
          refetch={refetch}
        />
      </View>
    </SafeAreaView>
  );
}
