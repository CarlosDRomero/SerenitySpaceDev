// /app/Mentores/_layout.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot } from 'expo-router';

export default function LayoutMentores() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Slot />
    </SafeAreaView>
  );
}
