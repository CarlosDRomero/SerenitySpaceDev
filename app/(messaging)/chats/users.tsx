import { Profile } from "@/components/messaging/interfaces";
import UserListItem from "@/components/messaging/UserListItem";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Image, Text, TouchableHighlight, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";



export default function UsersScreen(){
  const [users, setUsers] = useState<Profile[]>([])

  useEffect(()=>{
    const fetchUsers = async ()=>{
      const {data: {session}} = await supabase.auth.getSession()

      const {data: profiles, error} = await supabase
        .from("profiles")
        .select("*")
        // .neq("id",session?.user.id)
      if (profiles)
        setUsers(profiles)
    }
    fetchUsers()
  }, [])

  return (
    <FlatList
      data={users}
      renderItem={({item}) =>
        <UserListItem user ={item}/>
      }   
    >
    </FlatList>
  )

}