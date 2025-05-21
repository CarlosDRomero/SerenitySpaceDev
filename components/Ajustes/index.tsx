import {View, TouchableOpacity, Text, Appearance, ScrollView} from "react-native"
import {Ionicons} from "@expo/vector-icons"
import {useFontSize} from "@/providers/FontSizeProvider"
import { useModeColor } from "@/hooks/useModeColor"

export const diccionario_temas = {
  light: "modo claro",
  dark: "modo oscuro"
}


export default function PantallaAjustes(){
  const {theme, colors, oppositeColors} = useModeColor()
  const {fontSize, setMultiplicador} = useFontSize()
  const tema_cambio = theme === "light"? "dark" : "light"
  if (!setMultiplicador) return
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, gap: 20}}>
      <Text style={{fontSize: fontSize.titulo, color: colors.text, textAlign: "center", fontWeight: "bold"}}>Ajustes</Text>
      <ScrollView contentContainerStyle={{gap: 10, justifyContent: "space-around", flexGrow: 1}}>
        <TouchableOpacity onPress = {()=> Appearance.setColorScheme(tema_cambio)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: oppositeColors.background, borderRadius: 30, padding: 4, width: "100%"}}>
          <Ionicons name="contrast-outline" size={30} color={colors.background}/>
          <Text style={{color: oppositeColors.text, fontWeight: "bold", fontSize: fontSize.parrafo}}>Cambiar a {diccionario_temas[tema_cambio]}</Text>
        </TouchableOpacity>

        <View style={{flexDirection: "row", gap: 20}}>
          <Ionicons name="text-outline" size={30} color={colors.text}/>
          <ScrollView horizontal contentContainerStyle = {{flexDirection: "row", gap: 30}} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress = {()=> setMultiplicador(0.75)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: fontSize.parrafo}}>Pequeño</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {()=> setMultiplicador(1)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: fontSize.parrafo}}>Mediano</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress = {()=> setMultiplicador(1.25)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: fontSize.parrafo}}>Grande</Text>
          </TouchableOpacity>
          </ScrollView>
        </View>

      </ScrollView>

    </View>
  )
}