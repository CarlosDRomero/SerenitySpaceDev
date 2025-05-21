// app/PsicoHerramienta/index.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import PsicoHerramientaIndex from '@/components/PsicoHerramienta/PsicoHerramientaIndex';
import useAjustes from '@/hooks/useAjustes';

export default function PsicoHerramientaScreen() {
  
  const {colors, fontSize} = useAjustes()
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.background}]}>
      <ScrollView contentContainerStyle={styles.container}>
        <PsicoHerramientaIndex />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
});
