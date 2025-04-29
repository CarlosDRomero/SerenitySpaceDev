import { Text, View } from "react-native";
import { EmptyStateIndicator, EmptyStateProps } from "stream-chat-expo";

export default function EmptyChatsIndicator({}: EmptyStateProps){
  console.log("EmptyIndicator")
  return (
    <View className="justify-center items-center">
      <Text>No has iniciado ninguna conversación</Text>
    </View>
  )
}