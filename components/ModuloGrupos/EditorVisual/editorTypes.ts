// /components/ModuloGrupos/EditorVisual/editorTypes.ts
/* 
export interface GrupoType {
    id_g: string;
    titulo: string;
    descripcion: string;
    imagen_url: string;
    icono_url: string; 
    grupo_apoyo: boolean;
    activo: boolean;
    fecha_creacion: string;
  }  
  
  export interface ModuloType {
    id_m: string;
    titulo: string;
    descripcion?: string;
    orden: number;
    fecha_creacion: string;
  }
  
  export interface TemaType {
    id_t: string;
    titulo: string;
    contenido_texto: string;
    tipo_video: 'ninguno' | 'youtube' | 'subido';
    media_url: string;
    orden: number;
    fecha_creacion: string;
  } */

  // /components/ModuloGrupos/EditorVisual/editorTypes.ts

export interface GrupoType {
    id_g: string;
    titulo: string;
    descripcion: string;
    imagen_url: string | null; // puede ser null
    icono_url: string | null;   // puede ser null
    grupo_apoyo: boolean;
    activo: boolean;
    fecha_creacion: string;
  }
  
  export interface ModuloType {
    id_m: string;
    titulo: string;
    descripcion: string | null; // también le añadimos el nuevo campo descripcion (puede ser null)
    orden: number;
    fecha_creacion: string;
  }
  
  export const tipos_contenido = ['ninguno', 'youtube', 'subido', 'audio'] as const
  export type tipo_contenido_tema = typeof tipos_contenido[number]

  export interface TemaType {
    id_t: string;
    titulo: string;
    contenido_texto: string;
    tipo_video: tipo_contenido_tema; // debe ser exactamente así
    media_url: string | null; // ahora media_url puede ser null
    orden: number;
    fecha_creacion: string;
  }
  
  