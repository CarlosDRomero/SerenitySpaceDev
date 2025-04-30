// /components/ModuloGrupos/BD/gruposDB.ts
import { supabase } from '@/utils/supabase';
import { GrupoType } from '../EditorVisual/editorTypes';

/**
 * Consulta todos los grupos activos en Supabase.
 */
export async function fetchGrupos() {
  const { data, error } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('activo', true)
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error('Error al obtener grupos:', error.message);
    return [];
  }

  return data;
}

/**
 * Trae un grupo específico por su ID.
 */
export async function fetchGrupo(grupoId: string) {
  const { data, error } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('id_g', grupoId)
    .single();

  if (error) {
    console.error('Error al cargar grupo:', error.message);
    return null;
  }
  return data;
}

export async function fetchGruposVisor(): Promise<GrupoType[]> {
  const { data, error } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('activo', true)
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error('Error al obtener grupos (visor):', error.message);
    return [];
  }

  return (data ?? []) as GrupoType[];
}


export async function fetchGruposRecientes(limit: number = 10): Promise<GrupoType[]> {
  const { data, error } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('activo', true)
    .order('fecha_creacion', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error al obtener grupos recientes:', error.message);
    return [];
  }

  return (data ?? []) as GrupoType[];
}

export async function fetchGruposApoyo(): Promise<GrupoType[]> {
  const { data, error } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('activo', true)
    .eq('grupo_apoyo', true)
    .order('fecha_creacion', { ascending: false });

  if (error) {
    console.error('Error al obtener grupos de apoyo:', error.message);
    return [];
  }

  return (data ?? []) as GrupoType[];
}
