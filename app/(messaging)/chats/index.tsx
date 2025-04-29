import EmptyChatsIndicator from "@/components/messaging/EmptyChatsIndicator";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { User } from "@supabase/supabase-js";
import { Link, router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChannelList } from "stream-chat-expo";



export default function ChatsScreen(){
  const [user, setUser] = useState<User | null>(null)

  useEffect(()=>{
    const getUser = async () =>{
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) return
      setUser(user)
    }
    getUser()
  }, [])
  return (
    <>
    <Stack.Screen
      options={{
        title: "Conversaciones",
        headerRight: ()=>{

          return  <View className="flex-row gap-x-8">
            <Link href="/(messaging)/chats/users"><Ionicons name="people" size={20} color="white"/></Link>
            <Link href="/"><Ionicons name="home" size={20} color="white"/></Link>
          </View>
        }
      }}
    />
      {
        !!user ?
        <ChannelList
          EmptyStateIndicator={()=>
            <SafeAreaView className="justify-center items-center"  edges={["bottom"]}>
                  <Ionicons name="chatbubble" size={80} color="gray"/>
                  <Text>No has iniciado ninguna conversación</Text>
                </SafeAreaView>
          }

          filters={{members: {$in: [user.id]}, last_message_at: {$exists: true}}}
          onSelect={(channel) => router.push(`/(messaging)/chat/${channel.cid}`)}
        />
        :
        <View className="h-full w-full items-center justify-center">
          <ActivityIndicator/>
        </View>
      }
    </>
      
  )
}