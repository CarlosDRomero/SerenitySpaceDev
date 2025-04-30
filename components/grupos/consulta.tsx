import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '@/utils/supabase';

export default function Consulta() {
  useEffect(() => {
    const fetchDatos = async () => {
      const { data, error } = await supabase
        .from('prueba_insert')
        .select('*');

      if (error) {
        console.log('Error al consultar:', error.message);
      } else {
        console.log('Datos de prueba_insert:', data);
      }
    };

    fetchDatos();
  }, []);

  return (
    <View>
      <Text>Consulta enviada a Supabase. Revisa la consola.</Text>
    </View>
  );
}
