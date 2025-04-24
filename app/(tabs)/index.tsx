import { supabase } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin'

const getUser = async ()=>{
  const {data: {session}} = await supabase.auth.getSession()
  if (session)
    return session.user
}

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>()

  useEffect(()=>{
    getUser().then(foundUser => {
      if (foundUser){
        setUser(foundUser)
      }
    })

  },[])

  return (
    <View className="justify-around items-center h-full">
      {
        user &&
        <View className="items-center gap-y-3 my-2">
            <Image className="w-24 h-24 rounded-full" src={user.user_metadata.picture}/>
            <Text className="text-white">
              {user.user_metadata.name}
            </Text>
          <Text className="text-white">
            {user.email}
          </Text>
            
          <TouchableHighlight className="bg-red-600 px-3 h-12 items-center justify-center rounded-lg" onPress={()=> {
            GoogleSignin.revokeAccess()
            GoogleSignin.signOut()
            supabase.auth.signOut()
            setUser(null)
          }}>
            <Text className="text-white font-bold">Cerrar sesión</Text>
          </TouchableHighlight>
        </View>
      }
      <Link href="/login" className='text-white underline text-xl '>Login</Link>
      <Link href="/(videocalls)" className='text-white underline text-xl '>Test video llamadas</Link>
    </View>
  );
}