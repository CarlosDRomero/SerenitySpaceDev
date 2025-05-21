import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { WebView } from 'react-native-webview';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { TemaType } from './vistaTypes';
import AudioPlayer from '@/components/ui/AudioPlayer';
import { ColorScheme } from '@/constants/Colors';
import { FontSize } from '@/providers/FontSizeProvider';
import useAjustes from '@/hooks/useAjustes';

interface Props {
  temasPorModulo: { [moduloId: string]: TemaType[] };
  moduloSeleccionado: string | null;
  temaSeleccionado: string | null;
}

const getYouTubeEmbedUrl = (url: string) => {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
};

export default function VistaContenido({
  temasPorModulo,
  moduloSeleccionado,
  temaSeleccionado,
}: Props) {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("")
  const videoRef = useRef<Video>(null);

  const {colors, fontSize, oppositeColors} = useAjustes()
  const styles = getStyles(colors, fontSize, oppositeColors)

  const temasDelModulo = moduloSeleccionado
    ? temasPorModulo[moduloSeleccionado] || []
    : [];

  const temaActual = temasDelModulo.find((tema) => tema.id_t === temaSeleccionado) || null;

  useEffect(() => {
    const generarMiniatura = async () => {
      if (temaActual?.tipo_video === 'video' && temaActual.media_url) {
        const embed = getYouTubeEmbedUrl(temaActual.media_url)
        if (embed){
          setYoutubeEmbedUrl(embed)
          return
        }
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(temaActual.media_url, {
            time: 1500,
          });
          setThumbnailUri(uri);
          setMostrarVideo(false); // Reinicia el estado cuando cambia el tema
        } catch (e) {
          console.warn('Error generando miniatura:', e);
        }
      } else {
        setThumbnailUri(null);
        setMostrarVideo(false);
      }
    };

    generarMiniatura();
  }, [temaActual]);

  if (!moduloSeleccionado || !temaSeleccionado) {
    return (
      <View style={styles.center}>
        <Text style={styles.instruccion}>Selecciona un tema para ver el contenido.</Text>
      </View>
    );
  }

  if (!temaActual) {
    return (
      <View style={styles.center}>
        <Text style={styles.instruccion}>Tema no encontrado.</Text>
      </View>
    );
  }

  const { contenido_texto, tipo_video, media_url } = temaActual;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>{temaActual.titulo}</Text>
      <Text style={styles.contenido}>{contenido_texto || 'Sin contenido.'}</Text>
      {
        media_url &&
        <>
          {tipo_video === 'video' && (
            <>
              {
                youtubeEmbedUrl && 
                <View style={styles.videoContainer}>
                  <WebView
                    source={{ uri: youtubeEmbedUrl }}
                    style={styles.webView}
                    javaScriptEnabled
                    domStorageEnabled
                  />
                </View>
              }
              {!mostrarVideo && thumbnailUri && (
                <TouchableOpacity
                  onPress={() => {
                    setMostrarVideo(true);
                    setTimeout(() => {
                      videoRef.current?.playAsync();
                    }, 100);
                  }}
                >
                  <Image
                    source={{ uri: thumbnailUri }}
                    style={styles.miniaturaImagen}
                    resizeMode="cover"
                  />
                  <Text style={styles.miniaturaTexto}>▶ Presiona para reproducir</Text>
                </TouchableOpacity>
              )}
  
              {mostrarVideo && (
                <Video
                  ref={videoRef}
                  source={{ uri: media_url }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  style={styles.video}
                  onPlaybackStatusUpdate={(status) => {
                    if (status.isLoaded && status.didJustFinish) {
                      setMostrarVideo(false); // Reiniciar cuando termina
                    }
                  }}
                />
              )}
            </>
          )
          }
          {
            tipo_video === "audio" &&
            <AudioPlayer audioUri={media_url}/>
          }
        </>
      }
      {/* Video */}

    </ScrollView>
  );
}


const getStyles = (colors:ColorScheme, fontSize:FontSize, opposite: ColorScheme) => {
  return StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.background,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      padding: 16,
    },
    titulo: {
      fontSize: fontSize.titulo,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 10,
    },
    contenido: {
      fontSize: fontSize.subtitulo,
      color: colors.text,
      marginBottom: 20,
    },
    instruccion: {
      fontSize: fontSize.subtitulo,
      color: colors.text,
      textAlign: 'center',
    },
    videoContainer: {
      width: '100%',
      height: 200,
      marginTop: 10,
      borderRadius: 10,
      overflow: 'hidden',
    },
    webView: {
      flex: 1,
      borderRadius: 10,
    },
    video: {
      width: Dimensions.get('window').width - 32,
      height: 200,
      borderRadius: 10,
    },
    miniaturaImagen: {
      width: Dimensions.get('window').width - 32,
      height: 160,
      borderRadius: 8,
      marginBottom: 6,
    },
    miniaturaTexto: {
      color: colors.text,
      textAlign: 'center',
      marginBottom: 10,
      fontSize: fontSize.subtitulo,
    },
  });
}
