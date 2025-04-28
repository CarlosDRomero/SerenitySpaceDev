import { supabase } from "@/utils/supabase";
import { getStreamToken } from "@/utils/token-provider";
import { StreamVideo, StreamVideoClient, User } from "@stream-io/video-react-native-sdk";
import { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function VideoProvider({children}: PropsWithChildren){
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null)

  useEffect(()=>{
    const initVideoClient = async () => {
      const {data} = await supabase.auth.getSession()
      if (!data.session) return
      
      const user: User = {
        id: data.session.user.id,
        name: data.session.user.email,
        image: data.session.user.user_metadata.picture
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
      {children}
    </View>
  }
  return (
    <StreamVideo client={videoClient}>
      {children}
    </StreamVideo>
  )
}