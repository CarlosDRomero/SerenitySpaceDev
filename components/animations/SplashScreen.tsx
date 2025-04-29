import { cn } from "@/cn";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  WithTimingConfig,
  withSpring,
  withSequence,
  Easing,
  withDelay
} from "react-native-reanimated";

/*
 * 
 * #E9D7FD -> rosa
 * #5B5DFA -> moradete
 * #A0E3D6 -> cyan
 * #97BBDD -> azul
 */

interface SplashScreenProps{
  completed_cb: ()=>void
}
const intro = require("../assets/sound/intro.wav")
export default function SplashScreen({completed_cb}: SplashScreenProps) {
  const current_offset = useSharedValue(80);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);
  const bottom_line_width = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const [ending, setEnding] = useState<Boolean>(false);
  const message = "Serenity Space";
  
  const sound = useRef(new Audio.Sound());
    const playIntro = async ()=>{
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded) return
      const result = await sound.current.loadAsync(intro, {});
      if (result.isLoaded === false) {
        console.log('Error in Loading Audio');
      } else {
        await sound.current.playAsync()
        completed_cb()
      }
    }
  
    // const stopTone = async ()=>{
    //   const result = await sound.current.getStatusAsync();
    //     if (result.isLoaded) {
    //       if (result.isPlaying === true) {
    //         sound.current.stopAsync();
    //       }
    //     }
    // }

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: current_offset.value,
    opacity: opacity.value,
  }));
  const animatedBottomLine = useAnimatedStyle(()=>({
    width: `${bottom_line_width.value}%`
  }))
  useEffect(() => {
    const timingConfig: WithTimingConfig = {
      duration: 30
    }
    current_offset.value = withTiming(0, timingConfig);
    opacity.value = withTiming(1, timingConfig, () => {
      if (index >= message.length){
        bottom_line_width.value = withDelay(500,
          withSequence(
            withTiming(50, {duration: 300, easing: Easing.in(Easing.cubic)}, ()=>runOnJS(setEnding)(true)),
            withTiming(0, {duration: 300})
          )
        )
        offset.value = withSequence(
          withTiming(40, { duration: 400, easing: Easing.out(Easing.quad) }),
          withSpring(0, { stiffness: 190, damping: 10 })
        )
        
        return
      }
        current_offset.value = 80;
        opacity.value = 0;
        runOnJS(setIndex)(index + 1);
      
    });
  }, [index]);

  return (
    <View className="w-full h-full bg-[#97BBDD] items-center justify-center">
      <View className="w-full items-center gap-y-4 px-4">
        <Animated.View className="flex-row" style={{bottom: offset}}>
          {message.substring(0, index + 1).split("").map((char, i) => {
            return(
            <Animated.Text
            key={index === i? "animated" : i}
            className="text-[#b994f6] text-6xl font-bold"
            style={[ index === i && animatedStyle ]}
            >
              {char}
            </Animated.Text>)
        })}
        </Animated.View>
        <View className={cn("w-full flex-row justify-center", {
          "justify-between": ending
        })}>
          <Animated.View className="border-t-4 border-[#E9D7FD]" style={animatedBottomLine}></Animated.View>
          <Animated.View className="border-t-4 border-[#E9D7FD]" style={animatedBottomLine}></Animated.View>
        </View>
      </View>
    </View>
  );
}
