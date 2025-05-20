// components/messaging/ChatContent.tsx
import { Text, View } from 'react-native';

export default function ChatContent() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Contenido del chat aquí...</Text>
      {/* Puedes importar ChannelList, MessageList, etc. si deseas */}
    </View>
  );
}
