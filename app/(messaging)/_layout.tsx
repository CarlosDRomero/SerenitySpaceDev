import ChatProvider from "@/providers/ChatProvider";
import VideoProvider from "@/providers/VideoProvider";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagingLayout(){
  return (
    <ChatProvider>
      <VideoProvider>
        {/* <SafeAreaView className="h-full w-full flex-col"> */}
          <Slot/>
        {/* </SafeAreaView> */}
      </VideoProvider>
    </ChatProvider>
  )
}