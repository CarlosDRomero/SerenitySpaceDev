// TestVideoModule.tsx
import React, { useState, useEffect } from "react";
import { View, Button, Text } from "react-native";
import { supabase } from "@/utils/supabase";
import { StreamVideo, StreamCall, Call, StreamVideoClient, StreamTheme, CallContent, VideoRenderer } from "@stream-io/video-react-native-sdk";
import BotonFormulario from "@/components/ui/BotonFormulario";



export default function TestVideoModule() {
  const [streamToken, setStreamToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);

  // 1) Al montar, suscribirse al usuario
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (_, session) => {
      if (session) {
        // 2) Llamar a la función que genera el token
        const {data, error} = await supabase.functions.invoke("get-stream-token")
        if (error){
          console.log("Error: ")
          console.log(error)
        }
        setStreamToken(data.token);
        console.log("Token:")
        console.log(data)
        // 3) Inicializar cliente Stream Video
        const user = {
          id: session.user.id, name: session.user.email
        }
        const videoClient = new StreamVideoClient({
          apiKey: process.env.EXPO_PUBLIC_STREAM_VIDEO_API_KEY!,
        });
        // const {access_token,user: userG} = await videoClient.createGuestUser({user})
        // console.log(access_token)
        await videoClient.connectUser(
          user,
          data.token
        );
        setClient(videoClient);
      }
    });
  }, []);

  const startCall = async () => {
    if (!client) return;

    // 1) Crear/obtener la llamada con tipo y ID correctos
    const activeCall = client.call("development", "new");

    // 2) Crear y unirte en un solo paso
    await activeCall.join({ create: true });
    // 3) Actualizar estado local
    setCall(activeCall);
  };

  if (!client || !streamToken) {
    return <Text>Inicializando...</Text>;
  }

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
