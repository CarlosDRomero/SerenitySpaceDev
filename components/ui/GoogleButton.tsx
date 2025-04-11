import { Text, TouchableHighlight, TouchableHighlightProps, View } from "react-native";
import { GoogleIcon } from "./GoogleIcon";
import { cn } from "@/cn";

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin'
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import appConfig from "@/app.config";

export default function GoogleButton({className, ...props}: TouchableHighlightProps){
  const navigation = useRouter()
  useEffect(()=>{
    GoogleSignin.configure({
      webClientId: appConfig.googleWebClientId
    })
  },[])
  const googleSignIn = async () => {
      try {
        await GoogleSignin.hasPlayServices()
        const userInfo = await GoogleSignin.signIn()
        if (userInfo.data?.idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: userInfo.data.idToken,
          })
          if (!error && data.session)
            navigation.navigate("/(tabs)")
        } else {
          throw new Error('no ID token present!')
        }
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
          // operation (e.g. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          // play services not available or outdated
        } else {
          // some other error happened
        }
      }
  }

  return (
    // <GoogleSigninButton
    //   onPress={googleSignIn}
    // />
    <TouchableHighlight {...props} 
      onPress={googleSignIn}
     className={cn("h-16 rounded-full bg-white justify-center items-center drop-shadow-2xl hover:bg-gray-400 outline-none", className)}
     >
      <View className="flex-row items-center gap-x-2 p-4">
        <GoogleIcon />
        <Text className="font-bold text-blue-700">Iniciar sesión con google</Text>
      </View>
    </TouchableHighlight>
  )
}