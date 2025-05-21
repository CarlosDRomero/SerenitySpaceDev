/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useModeColor() {
  const theme = useColorScheme() ?? 'light';

  if (theme === "light") return {theme,colors: Colors.light, oppositeColors: Colors.dark}
  else return {theme, colors: Colors.dark, oppositeColors: Colors.light}
}
