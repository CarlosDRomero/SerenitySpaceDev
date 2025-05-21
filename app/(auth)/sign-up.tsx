import FormInput from '@/components/ui/FormInput';
import GoogleButton from '@/components/ui/GoogleButton';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  TouchableHighlight,
  Text,
} from 'react-native';
import { supabase } from '@/utils/supabase';
import alert from '@/utils/alert';
// Si vas a implementar Google Sign-In, puedes usar expo-auth-session o expo-google-app-auth
// import * as Google from 'expo-auth-session/providers/google';
import LogoAutenticacion from '@/components/logos/logo';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    // Aquí implementa la lógica de autenticación con email y contraseña
    const {
      data: {session},
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error){
      alert(error.message)
    }
    if (!session){
      alert('Please check your inbox for email verification!')
      
    }

  };

  const handleGoogleLogin = async () => {
    // Aquí puedes implementar la lógica de autenticación con Google
    console.log('Iniciar sesión con Google');
  };

  return (
    <>
      <LogoAutenticacion/>
      
      <View className="w-full bg-[#3ca7ff88] rounded-2xl p-5">

        <Text className='text-white text-center text-2xl font-bold mb-4 drop-shadow-glow'>
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
        <FormInput
          className='mb-3'
          placeholder="Confirmar contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text className='text-white'>¿Ya tienes una cuenta? <Link className='underline' href="/login">Inicia sesión</Link></Text>

        <TouchableHighlight className='bg-[#3C63FF88] rounded-lg justify-center items-center py-2.5 my-4' onPress={handleSignUp}>
          <Text className="text-white text-xl">Registrarse</Text>
        </TouchableHighlight>
        <View className="items-center m-1">
          <GoogleButton onPress={handleGoogleLogin}/>
        </View>
      </View>
    </>

  );
}


