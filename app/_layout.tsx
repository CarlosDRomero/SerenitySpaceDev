import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import '../global.css';


import { useColorScheme } from '@/hooks/useColorScheme';
import SplashScreen from '@/components/animations/SplashScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [animationCompleted, setAnimationComplete] = useState<Boolean>(false);
  
  const animationCompletedCB = ()=>{
    setAnimationComplete(true)
  }

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      ExpoSplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto"/>
      {
        !animationCompleted? <SplashScreen completed_cb={animationCompletedCB}/> : <Slot/>
      }
      
    </ThemeProvider>
  );
}
