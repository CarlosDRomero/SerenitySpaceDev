import { Image, Text, TouchableHighlight, View } from "react-native";
import { Profile } from "./interfaces";
import { useChatContext } from "stream-chat-expo";
import { supabase } from "@/utils/supabase";
import { router } from "expo-router";

interface UserListItemProps{
  user: Profile
}

export default function UserListItem({user}: UserListItemProps){
  const { client } = useChatContext()
  const onPress = async ()=>{
    const {data: {session}} = await supabase.auth.getSession()
    if (!session){
      return
    }
    const channel = client.channel("messaging", {
      members: [session.user.id, user.id]
    })
    await channel.watch()
    router.replace(`/(messaging)/chat/${channel.cid}`)
  }
  return(
    <TouchableHighlight className="w-full px-4 border-b-2 border-slate-200" onPress={onPress}>
        <View className="flex-row items-center gap-x-9 py-2">

        <Image className="w-12 h-12 rounded-full" src={user.avatar_url}/>
        <Text className="font-bold text-xl">{user.full_name}</Text>
        </View>
      </TouchableHighlight>
    )
}