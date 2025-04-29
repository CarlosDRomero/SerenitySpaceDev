import { supabase } from "@/utils/supabase"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { User } from "@supabase/supabase-js"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from "react-native"


export default function Account(){
  const [user, setUser] = useState<User | null>()
    const [loadingUser, setLoadingUser] = useState<boolean>(true)
  
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user){
        setUser(user)
      }
      setLoadingUser(false)
    }
  
    useEffect(()=>{
      getUser()
  
    },[])
  
    if (loadingUser){
      return <View className="w-full h-full items-center justify-center">
        <ActivityIndicator/>
      </View>
    }
    if (user)
    return (
      <View className="items-center gap-y-3 my-2  w-full bg-black/50 p-5 rounded-lg">
        <Image className="w-12 h-12 rounded-full" src={user.user_metadata.picture} />
        <Text className="text-white">
          {user.user_metadata.name}
        </Text>
        <Text className="text-white">
          {user.email}
        </Text>

        <TouchableHighlight className="bg-red-600 px-3 h-12 items-center justify-center rounded-lg" onPress={() => {
          GoogleSignin.revokeAccess()
          GoogleSignin.signOut()
          supabase.auth.signOut()
          setUser(null)
          router.replace("/(auth)/login")
        }}>
          <Text className="text-white font-bold">Cerrar sesión</Text>
        </TouchableHighlight>
      </View>
    )
}