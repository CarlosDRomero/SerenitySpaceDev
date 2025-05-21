import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { cn } from '@/cn';
import { ThemedText } from '../ThemedText';
import TrackPlayer from "react-native-track-player"
import { PlayerProgressBar } from './Audio/PlayerProgressBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import useAjustes from '@/hooks/useAjustes';

export default function AudioPlayer({ audioUri }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: false },
      updatePlaybackStatus
    );
    setSound(sound);
    const status = await sound.getStatusAsync()
    if (status.isLoaded){
      setDuration(status.durationMillis || 0);
    }
  }
  useEffect(()=>{
    if (finished && position < duration) {
      setFinished(false)
    }
  }, [position])
  useEffect(() => {
    loadSound();
  }, [audioUri]);

  function updatePlaybackStatus(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      setPosition(status.positionMillis || 0);
      if (status.isPlaying) setIsPlaying(true)
      if (status.didJustFinish) {
        setIsPlaying(false);
        setFinished(true)
      }
    }
  }

  async function playSound() {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false)
    } else {
      if (finished){
        await sound.replayAsync()
      }else await sound.playAsync();
    }
  }

  const {colors, fontSize} = useAjustes()
  if (!sound) return <ActivityIndicator/>
  return (
    <View className="w-full rounded-lg p-4 mb-2 bg-gray-300 dark:bg-gray-700">
      <View className="flex-col items-center space-x-3">
        <PlayerProgressBar sound={sound} duration = {duration} position={position} style={{width: "100%"}}/>
        <TouchableOpacity
          onPress={playSound}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
          )}
          style = {{backgroundColor: colors.primary}}
        >
          {
            isPlaying? 
              <Ionicons name="pause" color="white" size={20}/>
            : finished ?
              <Ionicons name="repeat" color="white" size={20}/>
            : <Ionicons name="play" color="white" size={20}/>
          }
        </TouchableOpacity>

      </View>
    </View>
  );
}