// TestVideoModule.tsx
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StreamCall, Call, StreamTheme, CallContent, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import BotonFormulario from "@/components/ui/BotonFormulario";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";



export default function TestVideoModule() {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const { id } = useLocalSearchParams<{id: string}>()
  const startCall = async () => {
    if (!client || !id) return;

    // 1) Crear/obtener la llamada con tipo y ID correctos
    const activeCall = client.call("development", id);

    // 2) Crear y unirte en un solo paso
    await activeCall.join();
    // 3) Actualizar estado local
    setCall(activeCall);
  };
  useEffect(()=>{
    startCall()
  }, [id])

  return (
    <View style={{ flex: 1 }}>
      {!call ? (
        <View className="w-full h-full items-center justify-center">
          <Ionicons name="call" className="animate-ping" color="black" size={80}/>
        </View>
      ) : (
        <StreamCall call={call}>
          <StreamTheme>
              <CallContent onHangupCallHandler={()=>{
                call.endCall()
                setCall(null)
                router.back()
              }}/>
          </StreamTheme>
        </StreamCall>
      )}
    </View>
  );
}
