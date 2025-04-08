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
        <BlurView
          intensity={10}
          
          experimentalBlurMethod='dimezisBlurView'
          className="w-56 h-56 mb-10 items-center justify-center rounded-full overflow-hidden elevation-md">
            <Image
              source={require('../../assets/images/logo.png')}
              style = {{}}
            className="w-full h-full logo-image bg-black/20"
            />

        </BlurView>
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