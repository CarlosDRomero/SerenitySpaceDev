import ChatProvider from "@/providers/ChatProvider";
import VideoProvider from "@/providers/VideoProvider";
import { Link, Slot } from "expo-router";
import { Text, TouchableHighlight, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsLayout(){
  return (
    <>
      <View className="h-12 items-center bg-slate-900 flex-row justify-between px-4">
        <Text className="text-white font-bold h-full align-middle text-xl">Chats</Text>
        <Link className="text-white" href="/(tabs)">Home</Link>
      </View>
      <View className="flex-grow">
        <Slot/>
      </View>
      <Link href="/(messaging)/chats/users" className="h-12 items-center bg-slate-900">
        <Text className="text-white font-bold h-full align-middle text-xl">Chats</Text>
      </Link>
    </>
  )
}