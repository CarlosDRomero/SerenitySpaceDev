// TestVideoModule.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import { StreamCall, StreamTheme, useCalls, RingingCallContent, CallContent } from "@stream-io/video-react-native-sdk";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";



export default function TestVideoModule() {
  const calls = useCalls()
  const call = calls[0]
  
  if (!call){
    router.back()
  }

  return (
    <View style={{ flex: 1 }}>
      {!call ? (
        <View className="w-full h-full items-center justify-center">
          <Ionicons name="call" className="animate-ping" color="black" size={80}/>
        </View>
      ) : (
        <StreamCall call={call}>
          <StreamTheme>
              <RingingCallContent CallContent={() => 
                <CallContent onHangupCallHandler={()=>{
                  call.endCall()
                }}/>
              }/>
          </StreamTheme>
        </StreamCall>
      )}
    </View>
  );
}
