import { supabase } from "@/utils/supabase";
import { getStreamToken } from "@/utils/token-provider";
import { StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "./AuthProvider";

export default function VideoProvider({children}: PropsWithChildren){
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)
  const {profile} = useAuth()
  useEffect(()=>{
    const initVideoClient = async () => {
      if (!profile) return
      
      const user: User = {
        id: profile.id,
        name: profile.full_name,
        image: profile.avatar_url
      }
      const client = new StreamVideoClient({
        apiKey: process.env.EXPO_PUBLIC_STREAM_VIDEO_API_KEY!,
        tokenProvider: getStreamToken,
        user
      });
      console.log(`Connecting VideoClient`)
      setVideoClient(client)
    }
    if (!videoClient) {
      initVideoClient()
    }

    return () => {
      if (videoClient){
        console.log("Disconnecting VideoClient")
        videoClient.disconnectUser()
        setVideoClient(null)
      }
    }
  }, [videoClient])
  if (!videoClient) {
    return <View className="items-center h-full pt-12">
      <ActivityIndicator/>
    </View>
  }
  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  )
}