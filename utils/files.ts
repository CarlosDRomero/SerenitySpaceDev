import { DocumentPickerAsset, getDocumentAsync } from "expo-document-picker";
import * as FileSystem from 'expo-file-system';

const EXTENSION_TO_MIME: Record<string, string> = {
  mp3:  'audio/mpeg',
  wav:  'audio/wav',
  m4a:  'audio/mp4',
  ogg:  'audio/ogg',
  aac:  'audio/aac',
  flac: 'audio/flac',
};

export type PrefijoArchivo = "audios" | "videos"

export interface ArchivoSubido{
  getUri(): string
  getName(): string
  getMimeType(): string | undefined
}

export class ArchivoDocumentPicker implements ArchivoSubido{
  archivo: DocumentPickerAsset
  constructor(archivo: DocumentPickerAsset){
    this.archivo = archivo
  }
  getUri(): string {
      return this.archivo.uri
  }
  getName(): string{
    return this.archivo.name
  }
  getMimeType(): string | undefined {
      return this.archivo.mimeType
  }
}

export class ArchivoURI implements ArchivoSubido{
  uri: string
  constructor(uri: string){
    this.uri = uri
  }
  getName(): string{
    return getUriName(this.uri)
  }
  getMimeType(): string | undefined{
    return getMimeType(this.getName())
  }
  getUri(): string {
    return this.uri
  }

}

export const getMimeType = (filename: string) => {
  const match = filename.match(/\.([^.]+)$/);
  if (!match) throw new Error("Nombre de archivo no valido");
  const ext = match[1].toLowerCase();
  return EXTENSION_TO_MIME[ext];
};

export const getUriName = (uri: string)=>{
  const partes = uri.split('/');
  return partes[partes.length - 1]
}

export const convertirABuffer = async (uri: string) => {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
};


export const pickPorTipo = async (type: string): Promise<DocumentPickerAsset | null> => {
  const result = await getDocumentAsync({ type });
  if (result.canceled || !result.assets?.[0]) return null;
  return result.assets[0];
}