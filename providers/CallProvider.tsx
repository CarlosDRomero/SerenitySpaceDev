import { cn } from "@/cn";
import { useCalls } from "@stream-io/video-react-native-sdk";
import { Href, router, useSegments } from "expo-router";
import { PropsWithChildren, useEffect, useRef } from "react";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Audio } from 'expo-av';

const tono = require("../assets/sound/tone.mp3")

export default function CallProvider({children}: PropsWithChildren){
  const calls = useCalls()
  const call = calls[0]
  const segments = useSegments()
  const isOnCallScreen = segments[1] === "call";
  const {top} = useSafeAreaInsets()

  const sound = useRef(new Audio.Sound());
  const loadTone = async ()=>{
    const checkLoading = await sound.current.getStatusAsync();
    if (checkLoading.isLoaded) return
    const result = await sound.current.loadAsync(tono, {}, true);
    if (!result.isLoaded) {
      return console.log('Error in Loading Audio');
    }
    console.log("Tone Loaded")
    await sound.current.setIsLoopingAsync(true)
    await sound.current.setVolumeAsync(0.3)
  }
  const playTone = async ()=>{
    const checkLoading = await sound.current.getStatusAsync();
    if (!checkLoading.isLoaded){
      await loadTone()
    }
    if (checkLoading.isLoaded && !checkLoading.isPlaying)
      sound.current.playAsync()

  }
  const stopTone = async ()=>{
    const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying) {
          sound.current.stopAsync();
        }
      }
  }
  useEffect(()=>{
    loadTone()
    return () => {
      stopTone()
    }
  }, [])
  useEffect(()=>{
    if (!call){
      stopTone()
      return
    }
    if (!isOnCallScreen){
      if (call.state.callingState === "ringing"){
        playTone()
      } 
    }else{
      stopTone()
    }
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