import { cn } from "@/cn";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCalls } from "@stream-io/video-react-native-sdk";
import { Href, router, useSegments } from "expo-router";
import { PropsWithChildren, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CallProvider({children}: PropsWithChildren){
  const calls = useCalls()
  const call = calls[0]
  const segments = useSegments()
  const isOnCallScreen = segments[1] === "call";
  const {top} = useSafeAreaInsets()

  useEffect(()=>{
    if (!call)
      return
    
  }, [call, isOnCallScreen])
  
  return <>
    {children}
    {
      call && !isOnCallScreen && (
        <Pressable
          onPress={() => router.push(`/(messaging)/call` as Href)}
          className={cn("bg-stone-700 absolute h-12 w-full items-center px-4 flex-row justify-between")} style={{backgroundColor:"green", top: top + 55}}
        >
          <Text className="text-white font-bold text-xl">Llamada entrante...</Text>
          {/* <View className="gap-x-8 flex-row">
            <Ionicons name="call" size={20} color="red"/>
            <Pressable onPress={() => router.push(`/(messaging)/call/${call.id}` as Href)}>
              <Ionicons name="call" size={20} color="lightgreen"/>
            </Pressable>
          </View> */}
        </Pressable>
      )
    }
  </>
}