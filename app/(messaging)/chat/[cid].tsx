import { Href, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StatusBar, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Channel as ChannelType } from 'stream-chat';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  Channel,
  MessageInput,
  MessageList,
  useChatContext,
} from 'stream-chat-expo';
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk';
import { Profile } from '@/components/messaging/interfaces';
import { supabase } from '@/utils/supabase';
import * as Crypto from 'expo-crypto';

export default function ChannelScreen() {
  const [channel, setChannel] = useState<ChannelType | null>(null);
  const [other, setOther] = useState<Profile | null>(null);
  const { cid } = useLocalSearchParams<{ cid: string }>();
  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid });
      setChannel(channels[0]);
    };

    fetchChannel();
  }, [cid]);

  useEffect(() => {
    const fetchOtherInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (channel && user) {
        for (const id in channel.state.members) {
          if (id !== user.id) {
            const { data: profile } = await supabase.from("profiles").select("*").eq("id", id);
            if (!profile) return;
            console.log("URL de imagen de perfil desde Supabase:", profile[0].avatar_url);
            setOther(profile[0]);
          }
        }
      }
    };
    fetchOtherInfo();
  }, [channel]);

  const joinCall = async () => {
    if (!channel || !videoClient) {
      console.warn("No channel or video client");
      return;
    }

    const members = Object.values(channel.state.members).map((member) => ({
      user_id: member.user_id!,
    }));

    const call = videoClient.call('development', Crypto.randomUUID());

    await call.getOrCreate({
      ring: true,
      data: {
        members,
      },
    });

    router.push("/(messaging)/call" as Href);
  };

  if (!channel || !other) {
    return (
      <View className="w-full h-full items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <Channel channel={channel} audioRecordingEnabled>
        <View className="bg-slate-200 w-full items-center flex-row justify-between px-4" style={{ paddingHorizontal: 10, paddingTop: StatusBar.currentHeight }}>
          <View className="flex-row items-center gap-x-2 py-2">
            <Image
              source={{ uri: other.avatar_url }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
            <View>
              <Text className="font-bold text-xl">{other.full_name}</Text>              
            </View>
          </View>
          <Ionicons name="call" size={20} color="gray" onPress={joinCall} />
        </View>

        <MessageList />
        <SafeAreaView edges={['bottom']}>
          <MessageInput />
        </SafeAreaView>
      </Channel>
    </>
  );
}
