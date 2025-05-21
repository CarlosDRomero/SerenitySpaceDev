import { useState } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';

// Importa tus componentes desde la carpeta original sin modificar nada
import BuscarUsuarios from '@/app/RedSocial/buscar';
import Amigos from '@/app/RedSocial/amigos';
import Sugerencias from '@/app/RedSocial/sugerencias';
import Solicitudes from '@/app/RedSocial/solicitudes';

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
      case 'menu':
        return (
          <View style={{ padding: 20, gap: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: "white", textAlign: 'center' }}>
              Red Social - SerenitySpace
            </Text>
            <Button title="Buscar Usuarios" onPress={() => setVistaActual('buscar')} />
            <Button title="Solicitudes" onPress={() => setVistaActual('solicitudes')} />
            <Button title="Mis Amigos" onPress={() => setVistaActual('amigos')} />
            <Button title="Sugerencias" onPress={() => setVistaActual('sugerencias')} />
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0c0c0c'}}>
      { vistaActual !== 'menu' &&
        <TouchableOpacity onPress={()=>setVistaActual('menu')} style={{marginTop: 20, alignItems: 'center'}}>
        
        <Text style = {{color: '#3C63FF', fontWeight: 'bold'}}>← Volver al menú</Text>
      </TouchableOpacity>}
      {renderVista()}
    </View>

  );
}
