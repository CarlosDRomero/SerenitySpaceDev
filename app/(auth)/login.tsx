import FormInput from '@/components/ui/FormInput';
import GoogleButton from '@/components/ui/GoogleButton';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  TouchableHighlight,
  Text
} from 'react-native';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí implementa la lógica de autenticación con email y contraseña
    console.log('Iniciar sesión con correo:', email, 'contraseña:', password);
  };

  const handleGoogleLogin = async () => {
    // Aquí puedes implementar la lógica de autenticación con Google
    console.log('Iniciar sesión con Google');
  };

  return (
    <View className="w-full bg-[#3ca7ff88] rounded-2xl p-5">
      
      <Text className='text-white text-center text-3xl font-bold mb-4 drop-shadow-glow'>
        Bienvenido a SerenitySpace
      </Text>
      <FormInput
        className='mb-3'
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormInput
        className='mb-3'
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text className='text-white'>¿No tienes una cuenta? <Link className='underline' href="/sign-up">Registrate</Link></Text>
      <TouchableHighlight className='bg-[#3C63FF88] rounded-lg justify-center items-center py-2.5 my-4' onPress={handleLogin}>
        <Text className="text-white text-xl">Inicia sesión</Text>
      </TouchableHighlight>
      <View className="items-center m-1">
        <GoogleButton/>
      </View>
    </View>

  );
}


