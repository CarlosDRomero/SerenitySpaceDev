// GREditorVisualPK/editorTypes.ts

export interface GrupoType {
    id: string;
    nombre: string;
    descripcion: string;
    imagen_url?: string;
    creado_por?: string;
    fecha_creacion?: string;
    activo?: boolean;
  }
  
  export interface ModuloType {
    id: string;
    grupo_id: string;
    nombre: string;
    orden?: number;
    activo?: boolean;
  }
  
  export interface TemaType {
    id: string;
    modulo_id: string;
    titulo: string;
    descripcion?: string;
    video_youtube_url?: string;
    video_supabase_url?: string;
    orden?: number;
  }
  