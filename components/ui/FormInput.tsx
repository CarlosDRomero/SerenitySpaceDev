import { cn } from "@/cn";
import { TextInput, TextInputProps } from "react-native";


export default function FormInput({className, ...props}: TextInputProps){
  return (
    <TextInput
      className={cn('border-b-2 border-gray-300 h-9  p-2 px-3 placeholder:text-gray-300 font-bold text-white drop-shadow-md outline-none focus:border-white', className)}
            {...props}
          />
  )
}