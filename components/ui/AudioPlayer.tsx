import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { cn } from '@/cn';
import { ThemedText } from '../ThemedText';
import TrackPlayer from "react-native-track-player"


export default function AudioPlayer({ audioUri }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
  }

  useEffect(() => {
    loadSound();
  }, [audioUri]);

  function updatePlaybackStatus(status: AVPlaybackStatus) {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);

      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    }
  }

  async function playSound() {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  function formatTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <View className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-2">
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          onPress={playSound}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-blue-500"
          )}
        >
          <View className={cn(
            isPlaying ? "w-3 h-4 bg-white rounded-sm" : "w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-white ml-1"
          )} />
        </TouchableOpacity>

        <View className="flex-1">
          <View className="h-1 bg-gray-300 dark:bg-gray-600 rounded-full">
            <View
              className="h-1 bg-blue-500 rounded-full"
              style={{ width: `${(position / duration) * 100}%` }}
            />
          </View>

          <View className="flex-row justify-between mt-1">
            <ThemedText className="text-xs">{formatTime(position)}</ThemedText>
            <ThemedText className="text-xs">{formatTime(duration)}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}