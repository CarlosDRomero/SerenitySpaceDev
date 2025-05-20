// Tipos para el paquete VistaGrupo

import { tipo_contenido_tema } from "@/components/ModuloGrupos/EditorVisual/editorTypes";

export interface GrupoType {
    id_g: string;
    titulo: string;
    descripcion: string;
    imagen_url: string | null;
    icono_url: string | null;
    grupo_apoyo: boolean;
    activo: boolean;
    fecha_creacion: string;
  }
  
  export interface ModuloType {
    id_m: string;
    titulo: string;
    descripcion: string | null;
    orden: number;
    fecha_creacion: string;
  }
  
  export interface TemaType {
    id_t: string;
    titulo: string;
    contenido_texto: string;
    tipo_video: tipo_contenido_tema; 
    media_url: string | null;
    orden: number;
    fecha_creacion: string;
  }
  
  // Opcional si quieres manejar temas agrupados más fácil
  export interface TemaConModulo extends TemaType {
    id_m: string; // id del módulo al que pertenece
  }
  