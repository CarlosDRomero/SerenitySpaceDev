// /app/RedSocial/_layout.tsx

import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';

export default function LayoutRedSocial() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}
