import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StreamChat, User } from 'stream-chat';
import { Chat, OverlayProvider } from 'stream-chat-expo';
import { supabase } from '@/utils/supabase'; 
import { getStreamToken } from '@/utils/token-provider';
import { useRouter } from 'expo-router';


const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_VIDEO_API_KEY!);

export default function ChatProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const navigation = useRouter()


  useEffect(() => {
    const connect = async () => {
      const {data: {user}} = await supabase.auth.getUser()
      if (!user) {
        console.log("Navigating")
        navigation.navigate("/(tabs)")
        return
      }
      const streamUser: User = {
        id: user.id,
        name: user.email,
        image: user.user_metadata.picture
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