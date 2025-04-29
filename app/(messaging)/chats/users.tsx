import { Profile } from "@/components/messaging/interfaces";
import UserListItem from "@/components/messaging/UserListItem";
import { supabase } from "@/utils/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useChatContext } from "stream-chat-expo";



export default function UsersScreen(){
  const [users, setUsers] = useState<Profile[] | null>(null)
  const {client} = useChatContext()
  useEffect(()=>{
    const fetchUsers = async ()=>{
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) return
      const userChannels = await client.queryChannels({members: {$in: [user.id]}, last_message_at: {$exists: true}})
      const channelsWith = await Promise.all(userChannels.map(async c => {
        const members = await c.queryMembers({})
        return members.members
        .map(m => m.user_id).filter(id => id !== user.id)
      }))
      const {data: profiles, error} = await supabase
        .from("profiles")
        .select("*")
        .not("id", "in", `(${channelsWith.flat().concat([user.id]).join(",")})`)

      setUsers(profiles)
    }
    fetchUsers()
  }, [])

  return (
    <>
      <Stack.Screen
            options={{
              title: "Comunidad",
            }}
          
      />
      {
        !!users ?
        <FlatList
        contentContainerClassName="bg-white h-full w-full"
          data={users}
          renderItem={({item}) =>
            <UserListItem user ={item}/>
          }   
          ListEmptyComponent={
            <View className="w-full h-full justify-center items-center">
              <Text className="text-slate-500 text-xl text-center">Parece que no hay mas personas que puedas añadir a tu red</Text>
            </View>
          }
          
          >
        </FlatList>
        :
        <View className="w-full h-full items-center justify-center bg-white">
          <ActivityIndicator/>
        </View>
      }

    </>
  )

}