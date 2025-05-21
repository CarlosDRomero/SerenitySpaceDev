import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, ToastAndroid, Platform } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { cn } from '@/cn';
import AudioPlayer from './AudioPlayer';
import useAjustes from '@/hooks/useAjustes';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';

interface AudioRecorderProps {
  onAudioSaved: (uri: string) => void
}
export default function AudioRecorder({ onAudioSaved }: AudioRecorderProps) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(()=>{
    return ()=>{
      if (recordingRef.current){
        recordingRef.current.stopAndUnloadAsync()
      }
      if (sound){
        sound.stopAsync()
      }
    }
  }, [recordingRef, sound])

  async function startRecording() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log("Recording")
      setIsRecording(true);
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      if (recordingRef.current){
        await recordingRef.current.stopAndUnloadAsync();
      }
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    if (!recordingRef.current) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await recordingRef.current.stopAndUnloadAsync();
    const uri = recordingRef.current.getURI();
    if (recordingRef.current._finalDurationMillis < 500){
      if (Platform.OS === "android") ToastAndroid.show("Mantén presionado mas tiempo para grabar tu audio", ToastAndroid.SHORT)
    }else{
      setAudioUri(uri);
    }
    
    recordingRef.current = null
  }

  async function playSound() {
    if (!audioUri) return;

    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true }
    );

    newSound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
      }
    });

    setSound(newSound);
    setIsPlaying(true);

    await newSound.playAsync();
  }

  async function pauseSound() {
    if (!sound) return;

    await sound.pauseAsync();
    setIsPlaying(false);
  }

  async function discardRecording() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    setAudioUri(null);
    setIsPlaying(false);
  }

  async function saveRecording() {
    if (!audioUri) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }

    // Pass the URI to the parent component  
    onAudioSaved(audioUri);

    // Reset the state  
    setAudioUri(null);
    setIsPlaying(false);
  }
  return (
    <View className="w-full">
      {!audioUri ? (
        <TouchableOpacity
          onPressIn={startRecording}
          onPressOut={stopRecording}
          delayPressIn={500}
          delayPressOut={500}
          pressRetentionOffset={10000}
          className={cn(
            "h-16 rounded-full flex-row items-center px-4 gap-x-2",
            isRecording ? "bg-red-500" : "bg-gray-300 dark:bg-gray-700"
          )}
        >
          <View className={cn(
            isRecording ? "w-8 h-8 rounded-sm bg-white" : "w-8 h-8 rounded-full bg-red-500"
          )} />
          <Text className='dark:text-white font-bold text-wrap'>
            {
              isRecording? "Grabando..." : "Mantén pulsado para grabar audio"

            }
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full space-y-4">
          <View className="flex-col justify-between items-center ">
            <AudioPlayer audioUri={audioUri}/>

            <View className="flex-row gap-x-3">
              <TouchableOpacity
                onPress={discardRecording}
                className="bg-red-500 p-3 rounded-full"
              >
                <Text className="text-white font-medium">Descartar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveRecording}
                className="bg-green-500 p-3 rounded-full"
              >
                <Text className="text-white font-medium">Subir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}