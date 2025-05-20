import { Profile } from "@/components/messaging/interfaces";
import UserListItem from "@/components/messaging/UserListItem";
import { supabase } from "@/utils/supabase";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function UsersScreen() {
  const [users, setUsers] = useState<Profile[] | null>(null);

  useEffect(() => {
    const fetchAmigos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener amistades aceptadas donde esté involucrado el usuario
      const { data: amistades, error: err } = await supabase
        .from("amistades")
        .select("de, para, estado")
        .or(`de.eq.${user.id},para.eq.${user.id}`)
        .eq("estado", "aceptado");

      if (!amistades || amistades.length === 0) {
        setUsers([]);
        return;
      }

      // Sacar los IDs de los amigos
      const idsAmigos = amistades.map((rel) =>
        rel.de === user.id ? rel.para : rel.de
      );

      // Buscar sus perfiles
      const { data: perfiles, error: errPerfiles } = await supabase
        .from("profiles")
        .select("*")
        .in("id", idsAmigos);

      if (errPerfiles) {
        console.error("Error cargando perfiles:", errPerfiles);
        return;
      }

      setUsers(perfiles || []);
    };

    fetchAmigos();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Comunidad" }} />
      {users ? (
        <FlatList
          contentContainerStyle={{ backgroundColor: "#fff", flexGrow: 1 }}
          data={users}
          renderItem={({ item }) => <UserListItem user={item} />}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
              <Ionicons name="people" size={60} color="gray" />
              <Text style={{ marginTop: 10, color: "#666", textAlign: "center" }}>
                No tienes amigos aún o aún no hay datos.
              </Text>
            </View>
          }
        />
      ) : (
        <View className="w-full h-full items-center justify-center bg-white">
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}
