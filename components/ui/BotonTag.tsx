import { ColorScheme } from "@/constants/Colors";
import useAjustes from "@/hooks/useAjustes";
import { FontSize } from "@/providers/FontSizeProvider";
import { Text } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";

interface BotonTagProps extends TouchableOpacityProps{
  texto: string
  active: boolean
  onSecondary?: boolean
}

function getStyles(colors: ColorScheme, fontSize: FontSize, active: boolean, onSecondary: boolean) {
  return StyleSheet.create({
    boton: {
      ...styles.botonTop,
      backgroundColor: active ? colors.primary : onSecondary ? colors.background : colors.secondary,
    },
    texto: {
      ...styles.textoBoton,
      color: active ? "white" : colors.text,
      fontSize: fontSize.parrafo,
    },
  });
}

export default function BotonTag({texto, active, style, onSecondary, ...props}: BotonTagProps){
  const {colors, fontSize} = useAjustes()
  const dynamicStyles = getStyles(colors, fontSize, active, !!onSecondary)

  return (
    <TouchableOpacity style={[dynamicStyles.boton, style]} {...props}>
      <Text style={dynamicStyles.texto}>{texto}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  botonTop: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  textoBoton: {
    fontWeight: 'bold',
  },
});