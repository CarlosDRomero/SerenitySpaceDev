import {supabase} from "./supabase"

export const getStreamToken = async ()=>{
  const { data } = await supabase.functions.invoke("get-stream-token")
  return data.token
}