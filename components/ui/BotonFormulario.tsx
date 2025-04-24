import { Text, TouchableHighlight, TouchableHighlightProps } from "react-native";

interface BotonFormularioProps extends TouchableHighlightProps{
  texto: string
}

export default function BotonFormulario({ texto, ...props }: BotonFormularioProps){
  return (
    <TouchableHighlight className='bg-[#3C63FF88] rounded-lg justify-center items-center py-2.5 my-4' {...props}>
        <Text className="text-white text-xl">{texto}</Text>
      </TouchableHighlight>
  )
}