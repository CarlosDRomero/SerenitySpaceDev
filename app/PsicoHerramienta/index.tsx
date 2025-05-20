// app/PsicoHerramienta/index.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import PsicoHerramientaIndex from '@/components/PsicoHerramienta/PsicoHerramientaIndex';

export default function PsicoHerramientaScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <PsicoHerramientaIndex />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0c0c0c',
  },
  container: {
    padding: 16,
  },
});
