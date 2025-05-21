import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import {useRolPrincipal} from "@/hooks/useRolPrincipal"
import {Ionicons} from "@expo/vector-icons"

interface TarjetaSolicitud {
  solicitud: any
  actualizarEstado?: (id: string, estado: "aceptado" | "rechazado") => void
}

export default function TarjetaSolicitud({solicitud, actualizarEstado}: TarjetaSolicitud){
  const {rolPrincipal, cargando} = useRolPrincipal()
  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)

  const esPsicologo = rolPrincipal === "psicologo"
  if (cargando) return
  return (
    <View style={styles.card} key={solicitud.id}>
      <Text style={styles.nombre}>{solicitud.profiles?.full_name}</Text>
      <Text style={styles.motivo}>Motivo: {solicitud.motivo}</Text>
      <Text style={styles.fecha}>Fecha: {new Date(solicitud.fecha).toLocaleString()}</Text>
      { 
        esPsicologo && actualizarEstado && 
        <View style={styles.botonesFila}>
          <TouchableOpacity
            style={[styles.boton, styles.aceptar]}
            onPress={() => actualizarEstado(solicitud.id, 'aceptado')}
          >
            <Text style={styles.botonTexto}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.boton, styles.rechazar]}
            onPress={() => actualizarEstado(solicitud.id, 'rechazado')}
          >
            <Text style={styles.botonTexto}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      }
      {
        !esPsicologo && 
        <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 10, width:"100%"}}>
          {solicitud.estado === "pendiente"? <ActivityIndicator/> : <Ionicons name="ellipse" size={20} color={solicitud.estado==="aceptado"? "#00d270" : "#f21146"}/>}
          
          <Text style={[styles.nombre, {textAlign: "right"}]}>{solicitud.estado.toLocaleUpperCase()}</Text>
        </View>
      }
    </View>
  )
}


const getStyles = (colors: ColorScheme, fontSize: FontSize, opposite: ColorScheme)=>{
  return StyleSheet.create({
    card: {
      backgroundColor: colors.secondary,
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    nombre: {
      color: colors.text,
      fontSize: fontSize.parrafo,
      fontWeight: 'bold',
    },
    motivo: {
      color: colors.text,
      marginTop: 4,
    },
    fecha: {
      color: opposite.secondary,
      fontSize: 12,
      marginTop: 4,
    },
    botonesFila: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'space-between',
    },
    boton: {
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    aceptar: {
      backgroundColor: '#3CFF63',
    },
    rechazar: {
      backgroundColor: '#FF3C63',
    },
    botonTexto: {
      color: '#000',
      fontWeight: 'bold',
    },
  });
}