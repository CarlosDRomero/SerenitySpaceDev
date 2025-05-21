// app/(dashboard)/home.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ModuloGrupos from '@/components/ModuloGrupos/index';
import ModuloGruposIndex from '@/components/ModuloGrupos/index';
import RedSocialIndex from '@/components/RedSocial/RedSocialIndex';
import { useRolPrincipal } from '@/hooks/useRolPrincipal';
import AlertaUsuario from '@/components/Alertas/AlertaUsuario';
import { router } from 'expo-router';
import PantallaAjustes from '@/components/Ajustes';
import BienvenidaUsuario from '@/components/Alertas/BuenvenidaHome';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {

  const { rolPrincipal, rolesUsuario, cargando } = useRolPrincipal();
  
    const puedeVerLista = rolPrincipal === 'admin' || rolPrincipal === 'estudiante';

    // No olvidad borrar estudiante mas adelante
    const puedeCrearEditar = rolPrincipal === 'admin' || rolPrincipal === 'psicologo' || rolPrincipal === 'tutor' || rolPrincipal === 'estudiante';


    const esInvitado = rolPrincipal === 'invitado';
    const tieneRolValido = ['admin', 'psicologo', 'tutor', 'estudiante'].includes(rolPrincipal || '');



  const [pantalla, setPantalla] = useState<'inicio' | 'grupos' | 'grupos2' | 'redsocial' | 'psicologia' | 'ajustes'>('inicio');

  /** MODIFICADOS:
   * ModuloGruposIndex
   * CardGrupoLista
   * CarruselGrupoLista
   * SelectorGruposEditar
   * GrupoCard
   * GrupoVista
   * EditorVisualGrupo
   * SideBarMenu
   * GrupoEditor
   * VistaContenido
   * TemaEditor
   * AudioRecorder
   * AudioPlayer
   * GrupoInfo
   * PsicoHerramienta (completo)
   * SolicitudesRecibidas
   * RegistrarSesiones
   * SolicitarApoyo
   * useGrupoCompleto.ts -- error en un import
   * Redsocial - Components
   */


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/Iconos/fondoinicio.png')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Encabezado flotante */}
          <View style={styles.header}>


            <TouchableOpacity
              onPress={() => {
                if (puedeCrearEditar){
                  router.push('../../AdminUsers')
                }else if (esInvitado) {
                  router.push('/roles/invitado/AlertaUsuario')
                } else {
                  router.push('/switchRoles')
                }
              }}
            >           
              <Image source={require('@/assets/Iconos/img_personal.png')} style={styles.icon} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => router.push('/switchRoles')}>              
              <Image source={require('@/assets/Iconos/img_personal.png')} style={styles.icon} />
            </TouchableOpacity> */}



            <TouchableOpacity onPress={() => router.push("/(auth)/account")}>
              <Image source={require('@/assets/Iconos/img_mi_cuenta.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(messaging)/chats")}>
              <Image source={require('@/assets/Iconos/img_chats.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>

          {/* Contenido dinámico */}
          <View style={styles.contenido}>
            {pantalla === 'grupos' && <ModuloGruposIndex />}
            {pantalla === 'grupos2' && <ModuloGrupos />}   
            {pantalla === 'redsocial' && <RedSocialIndex />}
            {pantalla === 'ajustes' && <PantallaAjustes/>}  
            {pantalla === 'inicio' && <BienvenidaUsuario/>}                  
          </View>


          {/* Footer flotante */}
          <View style={styles.footer}>
            {/* <TouchableOpacity onPress={() => setPantalla('inicio')}>
              <Image source={require('@/assets/Iconos/img_social.png')} style={styles.icon} />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => setPantalla('redsocial')}>
              <Image source={require('@/assets/Iconos/img_social.png')} style={styles.icon} />
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setPantalla('grupos')}>
              <Image source={require('@/assets/Iconos/img_grupos.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/Mentores')}>
              <Image source={require('@/assets/Iconos/img_mentores.png')} style={styles.icon} />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => setPantalla('grupos2')}>
              <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3524/3524659.png' }} // Icono de prueba
                style={styles.icon}
              />
            </TouchableOpacity>
 */}
            <TouchableOpacity onPress={() => router.push('/PsicoHerramienta')}>
              <Image source={require('@/assets/Iconos/img_apoyo_emocional.png')} style={styles.icon} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setPantalla('ajustes')}>
              <Image source={require('@/assets/Iconos/img_ajustes.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff'},
  container: { flex: 1, width: "100%"},
  background: { flex: 1, width: '100%', height: '100%' },
  icon: { width: 65, height: 65, resizeMode: 'contain' },
  header: {
    position: 'absolute',
    top: 0, // ya no necesitas tanto espacio porque SafeAreaView lo respeta
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(60, 99, 255, 0.2)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'rgba(60, 99, 255, 0.2)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 10,
  },
  contenido: {
    flex: 1,
    width: "100%",
    paddingTop: 80,     // espacio para el header flotante
    paddingBottom: 80,  // espacio para el footer flotante
    
    paddingHorizontal: 5,    
    //backgroundColor: 'rgba(255,255,255,0.8)', // fondo blanco con 80% de opacidad
  },
});
