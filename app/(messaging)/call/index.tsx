// TestVideoModule.tsx
import React, { useState } from "react";
import { View } from "react-native";
import { StreamCall, Call, StreamTheme, CallContent, useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import BotonFormulario from "@/components/ui/BotonFormulario";



export default function TestVideoModule() {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);

  const startCall = async () => {
    if (!client) return;

    // 1) Crear/obtener la llamada con tipo y ID correctos
    const activeCall = client.call("development", "new");

    // 2) Crear y unirte en un solo paso
    await activeCall.join({ create: true });
    // 3) Actualizar estado local
    setCall(activeCall);
  };

  return (
    <View style={{ flex: 1 }}>
      {!call ? (
        <BotonFormulario texto="Iniciar Test Call" onPress={startCall} />
      ) : (
        <StreamCall call={call}>
          <StreamTheme>
              <CallContent onHangupCallHandler={()=>{
                call.endCall()
                setCall(null)
              }}/>
          </StreamTheme>
        </StreamCall>
      )}
    </View>
  );
}
