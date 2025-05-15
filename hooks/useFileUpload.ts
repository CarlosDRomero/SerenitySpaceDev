import { tipos_contenido } from "@/components/ModuloGrupos/EditorVisual/editorTypes";
import { ArchivoSubido, convertirABuffer, PrefijoArchivo } from "@/utils/files"
import { supabase } from "@/utils/supabase";
import { useCallback, useEffect, useState } from "react"
import { Alert } from "react-native";



export default function useSubirArchivo(prefijo: `${typeof tipos_contenido[number]}s`, archivo: ArchivoSubido | null){
  const [progreso, setProgreso] = useState(0);
  const [subiendo, setSubiendo] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const cancelar = async () => {
    if (fileUrl) {
      const path = fileUrl.split('/storage/v1/object/public/srtgrupos/')[1];
      await supabase.storage.from('srtgrupos').remove([path]);
      setFileUrl('');
    }
    setProgreso(0);
  };
  useEffect(()=>{
    const subirArchivo = async ()=>{
      if (!archivo) return
      setSubiendo(true);
      setProgreso(0);
      const nombre = `${prefijo}/${Date.now()}_${archivo.getName()}`
      console.log(`Subiendo archivo: ${nombre}`)
      try {
        const buffer = await convertirABuffer(archivo.getUri());

        const { error } = await supabase.storage
          .from('srtgrupos')
          .upload(nombre, buffer, {
            contentType: archivo.getMimeType(),
          });

        if (error) throw error;

        const { data } = supabase.storage.from('srtgrupos').getPublicUrl(nombre);
        setFileUrl(data.publicUrl);
        Alert.alert('✅ Archivo subido correctamente');
      } catch (e: any) {
        Alert.alert('❌ Error al subir el archivo', e.message || 'Desconocido');
      }

      setSubiendo(false);
      setProgreso(1);
    }
    subirArchivo()
  }, [archivo])

  return {fileUrl, progreso, subiendo, cancelar}
}