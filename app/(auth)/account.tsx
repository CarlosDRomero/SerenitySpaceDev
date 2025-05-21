/* import { supabase } from "@/utils/supabase"
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
} */

import { supabase } from "@/utils/supabase"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { User } from "@supabase/supabase-js"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Text,
  TouchableHighlight,
  View
} from "react-native"
import MiPerfil from "../RedSocial/mi-perfil"

export default function Account() {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)

  // Obtener usuario desde Supabase
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      }
      setLoadingUser(false)
    }

    getUser()
  }, [])

  // Cierre de sesión seguro
  const cerrarSesion = async () => {
    try {
      setCerrandoSesion(true)

      // Asegura configuración por si acaso
      GoogleSignin.configure({
        webClientId: 'TU_WEB_CLIENT_ID',
        offlineAccess: true,
      })

      await GoogleSignin.revokeAccess()
      await GoogleSignin.signOut()
    } catch (error) {
      console.log("Error cerrando sesión de Google:", error)
    }

    await supabase.auth.signOut()
    router.replace("/(auth)/login")
  }

  if (loadingUser) {
    return (
      <View className="w-full h-full items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View className="items-center gap-y-2 bg-black/50 p-5 rounded-lg" style={{ width: "100%" }}>
      <MiPerfil />

      <TouchableHighlight
        className="bg-red-600 px-3 h-12 items-center justify-center rounded-lg"
        onPress={cerrarSesion}
        disabled={cerrandoSesion}
      >
        <Text className="text-white font-bold">
          {cerrandoSesion ? "Cerrando sesión..." : "Cerrar sesión"}
        </Text>
      </TouchableHighlight>
    </View>
  )
}
