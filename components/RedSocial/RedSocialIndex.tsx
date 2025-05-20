import { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

// Importa tus componentes desde la carpeta original sin modificar nada
import BuscarUsuarios from '@/app/RedSocial/buscar';
import Amigos from '@/app/RedSocial/amigos';
import Sugerencias from '@/app/RedSocial/sugerencias';
import Solicitudes from '@/app/RedSocial/solicitudes';
import MiPerfil from '@/app/RedSocial/mi-perfil';

export default function RedSocialIndex() {
  const [vistaActual, setVistaActual] = useState('menu');

  const renderVista = () => {
    switch (vistaActual) {
      case 'buscar':
        return <BuscarUsuarios />;
      case 'amigos':
        return <Amigos />;
      case 'sugerencias':
        return <Sugerencias />;
      case 'solicitudes':
        return <Solicitudes />;
      case 'mi-perfil':
        return <MiPerfil />;
      default:
        return (
          <View style={{ padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
              Red Social - SerenitySpace
            </Text>
            <Button title="Buscar Usuarios" onPress={() => setVistaActual('buscar')} />
            <Button title="Solicitudes" onPress={() => setVistaActual('solicitudes')} />
            <Button title="Mis Amigos" onPress={() => setVistaActual('amigos')} />
            <Button title="Sugerencias" onPress={() => setVistaActual('sugerencias')} />
            <Button title="Mi Perfil" onPress={() => setVistaActual('mi-perfil')} />
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderVista()}
    </View>

  );
}
