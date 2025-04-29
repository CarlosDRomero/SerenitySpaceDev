// /components/ModuloGrupos/BD/gruposDB.ts
import { supabase } from '@/utils/supabase';

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
