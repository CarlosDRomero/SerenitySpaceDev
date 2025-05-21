import { useFontSize } from "@/providers/FontSizeProvider"
import { useModeColor } from "./useModeColor"

export default function useAjustes(){
  const {colors, oppositeColors} = useModeColor()
  const {fontSize} = useFontSize()

  return {colors, oppositeColors, fontSize}
}