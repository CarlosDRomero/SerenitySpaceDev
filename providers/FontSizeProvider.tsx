import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface FontSize{
  titulo: number,
  subtitulo: number,
  parrafo: number
}

const baseValues: FontSize = {
  titulo: 24,
  subtitulo: 18,
  parrafo: 14
}
type FontSizeContext = {
  fontSize: FontSize,
  multiplicador: number
  setMultiplicador: React.Dispatch<React.SetStateAction<number>> | null
};

const FontSizeContext = createContext<FontSizeContext>({
  fontSize: baseValues,
  multiplicador: 1,
  setMultiplicador: null
});

export default function FontSizeProvider({ children }: PropsWithChildren) {
  const [fontSize, setFontSize] = useState(baseValues)
  const [multiplicador, setMultiplicador] = useState(1)

  useEffect(()=>{
    setFontSize({
      titulo: baseValues.titulo * multiplicador,
      subtitulo: baseValues.subtitulo * multiplicador,
      parrafo: baseValues.parrafo * multiplicador,
    })
  }, [multiplicador])

  return (
    <FontSizeContext.Provider value={{ fontSize, multiplicador, setMultiplicador }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export const useFontSize = () => useContext(FontSizeContext);