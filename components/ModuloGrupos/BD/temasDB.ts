// /components/ModuloGrupos/BD/temasDB.ts

import { supabase } from '@/utils/supabase';

/**
 * Trae todos los temas asociados a un módulo.
 */
export async function fetchTemas(moduloId: string) {
  // Primero trae los IDs asociados en modulos_temas
  const { data: relaciones, error: errorRelaciones } = await supabase
    .from('modulos_temas')
    .select('id_t')
    .eq('id_m', moduloId);

  if (errorRelaciones) {
    console.error('Error al buscar relación modulos_temas:', errorRelaciones.message);
    return [];
  }

  const temaIds = relaciones?.map((rel) => rel.id_t) || [];

  if (temaIds.length === 0) return [];

  const { data: temas, error: errorTemas } = await supabase
    .from('mg_temas')
    .select('*')
    .in('id_t', temaIds)
    .order('orden', { ascending: true });

  if (errorTemas) {
    console.error('Error al buscar temas:', errorTemas.message);
    return [];
  }

  return temas;
}

/**
 * Crea un nuevo tema vacío y lo asocia al módulo.
 */
export async function crearTema(moduloId: string, titulo = 'Nuevo Tema') {
  // 1. Crear el tema
  const { data: nuevoTema, error } = await supabase
    .from('mg_temas')
    .insert({
      titulo: titulo,
      contenido_texto: '',
      tipo_video: 'ninguno',     
      media_url: '',            
      orden: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error al crear tema:', error.message);
    return null;
  }

  // 2. Asociarlo en la tabla modulos_temas
  const { error: errorRelacion } = await supabase
    .from('modulos_temas')
    .insert({
      id_m: moduloId,
      id_t: nuevoTema.id_t,
    });

  if (errorRelacion) {
    console.error('Error al asociar tema al módulo:', errorRelacion.message);
    return null;
  }

  return nuevoTema;
}
