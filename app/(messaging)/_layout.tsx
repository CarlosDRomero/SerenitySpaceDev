import AuthProvider from "@/providers/AuthProvider";
import CallProvider from "@/providers/CallProvider";
import ChatProvider from "@/providers/ChatProvider";
import VideoProvider from "@/providers/VideoProvider";
import { Slot } from "expo-router";

export default function MessagingLayout(){
  return (
    <AuthProvider>
      <ChatProvider>
        <VideoProvider>
          <CallProvider>
          {/* <SafeAreaView className="h-full w-full flex-col"> */}
            <Slot/>
          {/* </SafeAreaView> */}
          </CallProvider>
        </VideoProvider>
      </ChatProvider>
    </AuthProvider>
  )
}