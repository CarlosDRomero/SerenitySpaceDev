// archivo: estudioTypes.ts
export interface TemaType {
    id: string;
    titulo: string;
    descripcion?: string;
    video_youtube_url?: string;
    video_supabase_url?: string;
  }
  
  export interface ModuloType {
    id: string;
    nombre: string;
    orden: number;
    grupo_id: string;
  }
  
  export interface GrupoType {
    id: string;
    nombre: string;
    descripcion?: string;
    imagen_url?: string;
  }
  
  export interface GrupoConContenido {
    grupo: GrupoType;
    modulos: ModuloType[];
    temasPorModulo: {
      [moduloId: string]: TemaType[];
    };
  }
  