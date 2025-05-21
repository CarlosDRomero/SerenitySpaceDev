import {View, TouchableOpacity, Text, Appearance, ScrollView} from "react-native"
import {Ionicons} from "@expo/vector-icons"
import {useTheme} from '@react-navigation/native'
import {useFontSize} from "@/providers/FontSizeProvider"
export const diccionario_temas = {
  light: "modo claro",
  dark: "modo oscuro"
}


export default function PantallaAjustes(){
  const {colors, dark, fonts} = useTheme()
  const {fontSize, setMultiplicador} = useFontSize()
  const tema_cambio = dark ? 'light' : 'dark'
  if (!setMultiplicador) return
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 20, gap: 20}}>
      <Text style={{fontSize: fontSize.titulo, color: colors.text, textAlign: "center", fontWeight: fonts.heavy.fontWeight}}>Ajustes</Text>
      <TouchableOpacity onPress = {()=> Appearance.setColorScheme(tema_cambio)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.text, borderRadius: 30, padding: 4}}>
        <Ionicons name="contrast-outline" size={30} color={colors.background}/>
        <Text style={{color: colors.background, fontWeight: fonts.heavy.fontWeight, fontSize: fontSize.parrafo}}>Cambiar a {diccionario_temas[tema_cambio]}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: "row", gap: 20}}>
        <Ionicons name="text-outline" size={30} color={colors.text}/>
        <ScrollView horizontal={true} contentContainerStyle = {{flexDirection: "row", gap: 30}}>
        <TouchableOpacity onPress = {()=> setMultiplicador(0.75)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
          <Text style={{color: colors.background, fontWeight: fonts.heavy.fontWeight, fontSize: fontSize.parrafo}}>Pequeño</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=> setMultiplicador(1)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
          <Text style={{color: colors.background, fontWeight: fonts.heavy.fontWeight, fontSize: fontSize.parrafo}}>Mediano</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = {()=> setMultiplicador(1.25)} style = {{flexDirection:'row', gap: 20, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 30, padding: 6}}>
          <Text style={{color: colors.background, fontWeight: fonts.heavy.fontWeight, fontSize: fontSize.parrafo}}>Grande</Text>
        </TouchableOpacity>
        </ScrollView>

      </View>

    </View>
  )
}