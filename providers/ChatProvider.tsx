import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StreamChat, User } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { supabase } from '@/utils/supabase'; 
import { getStreamToken } from '@/utils/token-provider';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthProvider';


const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_VIDEO_API_KEY!);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const navigation = useRouter()
  const {profile} = useAuth()

  useEffect(() => {
    const connect = async () => {
      if (!profile) {
        console.log("Navigating")
        navigation.navigate("/(tabs)")
        return
      }
      const streamUser: User = {
        id: profile.id,
        name: profile.full_name,
        image: profile.avatar_url
      }
      await client.connectUser(
        streamUser,
        getStreamToken
      );
      console.log(`Connecting  ChatClient`)
      setIsReady(true);       
    };
    
    if (!isReady) {
      connect();
    }

    return () => {
      if (isReady) {
        console.log("Disconnecting  ChatClient")
        client.disconnectUser();
        setIsReady(false);
      }
    }
  }, [isReady]);
  

  if (!isReady) {
    return <View className="w-full h-full items-center justify-center">
      <ActivityIndicator/>
    </View>;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>
        {children}
      </Chat>
    </OverlayProvider>
  );
}