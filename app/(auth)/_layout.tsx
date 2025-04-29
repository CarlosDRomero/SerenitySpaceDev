import LogoAutenticacion from '@/components/logos/logo';
import { BlurView } from 'expo-blur';
import { Slot } from 'expo-router';
import {
  ImageBackground,
  StyleSheet,
  View,
  Image
} from 'react-native';

export default function AuthPageLayout(){
  return (
    <ImageBackground
          source={require('../../assets/images/Background.png')}
          style={styles.background}
          blurRadius={1}
        >
        <View style={styles.container}>
        <LogoAutenticacion/>

        <Slot/>
        </View>
      </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    
  },
});