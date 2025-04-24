import { BlurView } from "expo-blur";
import { Image } from "react-native";

export default function LogoAutenticacion(){
  return (
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
  )
} 