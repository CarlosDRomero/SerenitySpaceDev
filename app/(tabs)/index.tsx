import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';


import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin'



export default function HomeScreen() {
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
  if (!user){
    return <Redirect href="/(auth)/login"/>
  }
  return <Redirect href="/home"/>
  // return (
  //   <View className="justify-around items-center h-full">
  //     {
  //       user &&
  //       <View className="items-center gap-y-3 my-2 flex-row w-full">
  //           <Image className="w-12 h-12 rounded-full" src={user.user_metadata.picture}/>
  //           <Text className="text-white">
  //             {user.user_metadata.name}
  //           </Text>
  //         <Text className="text-white">
  //           {user.email}
  //         </Text>
            
  //         <TouchableHighlight className="bg-red-600 px-3 h-12 items-center justify-center rounded-lg" onPress={()=> {
  //           GoogleSignin.revokeAccess()
  //           GoogleSignin.signOut()
  //           supabase.auth.signOut()
  //           setUser(null)
  //         }}>
  //           <Text className="text-white font-bold">Cerrar sesión</Text>
  //         </TouchableHighlight>
  //       </View>
  //     }
  //     <Link href="/login" className='text-white underline text-xl '>Login</Link>
  //     <Link href="/(messaging)/chats" className='text-white underline text-xl '>Test video llamadas</Link>
      
  //     {/*<Text>Componente de Insertar:</Text><InsertarDatos />*/}
  //     {/*<Text>Componente de Consulta:</Text><Consulta />*/}
  //     {/*<Link href="/components/grupos/insertar-datos" className='text-white underline text-xl '>PruebaIsert</Link>*/}
  //     {/*<Link href="/grupos/consulta" className='text-white underline text-xl '>Consulta</Link>*/}
  //     <Link href="/home" className='text-white underline text-xl '>Home</Link>
  //     <Link href="/PCrear" className='text-white underline text-xl '>Pcrear</Link>
  //   </View>
  // );
}