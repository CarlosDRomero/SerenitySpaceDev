import EmptyChatsIndicator from "@/components/messaging/EmptyChatsIndicator";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { User } from "@supabase/supabase-js";
import { Link, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChannelList } from "stream-chat-expo";

export default function ChatsScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Conversaciones",
          headerRight: () => (
            <View className="flex-row gap-x-8">
              <Link href="/(messaging)/chats/users">
                <Ionicons name="people" size={20} color="white" />
              </Link>
              <Link href="/">
                <Ionicons name="home" size={20} color="white" />
              </Link>
            </View>
          ),
        }}
      />
      {user ? (
        <ChannelList
          filters={{
            members: { $in: [user.id] },
            last_message_at: { $exists: true },
          }}
          onSelect={(channel) => router.push(`/(messaging)/chat/${channel.cid}`)}
          
          // ✅ Mostrar nombre desde Supabase
          PreviewTitle={({ channel }) => {
            const [nombre, setNombre] = useState("Cargando...");

            useEffect(() => {
              const fetchNombre = async () => {
                const otherId = Object.values(channel.state.members).find(
                  (m) => m.user?.id !== user.id
                )?.user?.id;

                if (otherId) {
                  const { data } = await supabase
                    .from("profiles")
                    .select("full_name")
                    .eq("id", otherId)
                    .single();

                  if (data?.full_name) {
                    setNombre(data.full_name);
                  }
                }
              };
              fetchNombre();
            }, [channel]);

            return <Text style={{ fontWeight: "bold" }}>{nombre}</Text>;
          }}

          // ✅ Mostrar avatar desde Supabase
          PreviewAvatar={({ channel }) => {
            const [avatar, setAvatar] = useState<string | null>(null);

            useEffect(() => {
              const fetchAvatar = async () => {
                const otherId = Object.values(channel.state.members).find(
                  (m) => m.user?.id !== user.id
                )?.user?.id;

                if (otherId) {
                  const { data } = await supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq("id", otherId)
                    .single();

                  if (data?.avatar_url) {
                    setAvatar(data.avatar_url);
                  }
                }
              };
              fetchAvatar();
            }, [channel]);

            return (
              <Image
                source={{ uri: avatar || "https://via.placeholder.com/40" }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            );
          }}

          EmptyStateIndicator={() => (
            <SafeAreaView className="justify-center items-center" edges={["bottom"]}>
              <Ionicons name="chatbubble" size={80} color="gray" />
              <Text>No has iniciado ninguna conversación</Text>
            </SafeAreaView>
          )}
        />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}