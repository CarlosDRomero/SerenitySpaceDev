// /app/moduloGrupos/AdministradorUsuarios/ListaUsuarios.tsx

import { View, Text, FlatList, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListaUsuariosProps } from './types_AU';

export default function ListaUsuarios({ usuarios, onAsignar }: ListaUsuariosProps) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const roles = item.usuarios_roles?.map((r) => r.roles?.nombre).filter(Boolean) ?? [];

          return (
            <View
              style={{
                padding: 10,
                marginVertical: 6,
                borderBottomWidth: 1,
                borderColor: '#ccc',
                flexDirection: 'column',
                backgroundColor: '#f8f8f8',
                borderRadius: 10,
                marginHorizontal: 10,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                {item.avatar_url ? (
                  <Image
                    source={{ uri: item.avatar_url }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                  />
                ) : null}
                <View>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.full_name}</Text>
                  <Text style={{ fontSize: 14, color: '#444' }}>
                    Roles: {roles.length > 0 ? roles.join(', ') : 'invitado'}
                  </Text>
                </View>
              </View>

              <Button title="Asignar/Editar Roles" onPress={() => onAsignar(item)} />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
