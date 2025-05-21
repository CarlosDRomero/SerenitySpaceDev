import { supabase } from "@/utils/supabase"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { User } from "@supabase/supabase-js"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from "react-native"
import MiPerfil from "../RedSocial/mi-perfil"

export default function Account(){
    return (
      <View className="items-center gap-y-2 bg-black/50 p-5 rounded-lg" style={{width: "100%"}}>
        <MiPerfil/>
        <TouchableHighlight className="bg-red-600 px-3 h-12 items-center justify-center rounded-lg" onPress={async () => {
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
          await supabase.auth.signOut()
          router.replace("/(auth)/login")
        }}>
          <Text className="text-white font-bold">Cerrar sesión</Text>
        </TouchableHighlight>
      </View>
    )
}