// /components/ModuloGrupos/BD/modulosDB.ts

import { supabase } from '@/utils/supabase';


/**
 * Trae todos los módulos relacionados a un grupo.
 */
export async function fetchModulos(grupoId: string) {
    // 1. Buscar en tabla grupos_modulos los id_m (módulos relacionados al grupo)
    const { data: relaciones, error: errorRelaciones } = await supabase
      .from('grupos_modulos')
      .select('id_m')
      .eq('id_g', grupoId);
  
    if (errorRelaciones) {
      console.error('Error al buscar relación grupos_modulos:', errorRelaciones.message);
      return [];
    }
  
    const moduloIds = relaciones?.map((rel) => rel.id_m) || [];
  
    if (moduloIds.length === 0) return [];
  
    // 2. Buscar los módulos reales en mg_modulos
    const { data: modulos, error: errorModulos } = await supabase
      .from('mg_modulos')
      .select('*')
      .in('id_m', moduloIds)
      .order('orden', { ascending: true });
  
    if (errorModulos) {
      console.error('Error al buscar módulos:', errorModulos.message);
      return [];
    }
  
    return modulos;
  }


/**
 * Crea un nuevo módulo vacío y lo asocia al grupo.
 */
export async function crearModulo(grupoId: string, titulo = 'Nuevo Módulo') {
    // 1. Crear el módulo primero
    const { data: nuevoModulo, error: errorModulo } = await supabase
      .from('mg_modulos')
      .insert({
        titulo: titulo,
        orden: 0,
      })
      .select()
      .single();
  
    if (errorModulo) {
      console.error('Error al crear módulo:', errorModulo.message);
      return null;
    }
  
    // 2. Asociarlo en la tabla grupos_modulos
    const { error: errorRelacion } = await supabase
      .from('grupos_modulos')
      .insert({
        id_g: grupoId,
        id_m: nuevoModulo.id_m,
      });
  
    if (errorRelacion) {
      console.error('Error al asociar módulo al grupo:', errorRelacion.message);
      return null;
    }
  
    return nuevoModulo;
  }
  




