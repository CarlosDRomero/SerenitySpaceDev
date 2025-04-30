/* // GREstudioVisualPK/VideoRender.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  videoYouTube?: string;
  videoSupabase?: string;
}

export default function VideoRender({ videoYouTube, videoSupabase }: Props) {
  if (videoYouTube) {
    // Extraer ID de YouTube si es un enlace completo
    const videoId = videoYouTube.includes('youtube.com')
      ? new URLSearchParams(new URL(videoYouTube).search).get('v')
      : videoYouTube.includes('youtu.be')
        ? videoYouTube.split('/').pop()
        : videoYouTube;

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <WebView
        style={styles.video}
        source={{ uri: youtubeEmbedUrl }}
        allowsFullscreenVideo
      />
    );
  }

  if (videoSupabase) {
    return (
      <WebView
        style={styles.video}
        source={{ uri: videoSupabase }}
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
      />
    );
  }

  return <View style={styles.placeholder} />;
}

const styles = StyleSheet.create({
  video: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  placeholder: {
    width: Dimensions.get('window').width - 40,
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
  },
});
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Video, ResizeMode } from 'expo-av';

// Obtener dimensiones de la pantalla
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface Props {
  videoYouTube?: string;
  videoSupabase?: string;
}

export default function VideoRender({ videoYouTube, videoSupabase }: Props) {
  const videoHeight = screenWidth * (9 / 16); // Mantener la relación 16:9

  if (videoYouTube) {
    // Obtener ID del video de YouTube
    const videoId = videoYouTube.includes('youtube.com')
      ? new URLSearchParams(new URL(videoYouTube).search).get('v')
      : videoYouTube.includes('youtu.be')
      ? videoYouTube.split('/').pop()
      : videoYouTube;

    const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <WebView
        style={{
          width: screenWidth,
          height: videoHeight,
          backgroundColor: '#000',
          borderRadius: 10,
        }}
        source={{ uri: youtubeEmbedUrl }}
        allowsFullscreenVideo
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    );
  }

  if (videoSupabase) {
    return (
      <Video
        source={{ uri: videoSupabase }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={false}
        useNativeControls
        style={{
          width: screenWidth,
          height: videoHeight,
          borderRadius: 10,
        }}
      />
    );
  }

  return <View style={[styles.placeholder, { width: screenWidth, height: videoHeight }]} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

