import { router } from "expo-router";
import { ChannelList } from "stream-chat-expo";



export default function ChatsScreen(){
  return (
    <>
      <ChannelList
        onSelect={(channel) => router.push(`/(messaging)/chat/${channel.cid}`)}
      />
    </>
      
  )
}