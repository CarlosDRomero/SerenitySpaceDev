import { supabase } from '@/utils/supabase'; // Ajusta si tu supabase está en otra ruta
import { GrupoType, ModuloType, TemaType } from './vistaTypes';

/**
 * Trae toda la información de un grupo: grupo, módulos y temas.
 */
export async function fetchGrupoCompleto(idGrupo: string): Promise<{
  grupo: GrupoType;
  modulos: ModuloType[];
  temas: (TemaType & { id_m: string })[]; // Tema más el id del módulo al que pertenece
}> {
  // 1. Cargar el grupo
  const { data: grupoData, error: grupoError } = await supabase
    .from('mg_grupos')
    .select('*')
    .eq('id_g', idGrupo)
    .single();

  if (grupoError || !grupoData) {
    throw new Error('No se pudo cargar el grupo.');
  }

  // 2. Cargar los módulos relacionados al grupo
  const { data: modulosRelacionados, error: modulosRelacionadosError } = await supabase
    .from('grupos_modulos')
    .select('id_m')
    .eq('id_g', idGrupo);

  if (modulosRelacionadosError || !modulosRelacionados) {
    throw new Error('No se pudieron cargar los módulos del grupo.');
  }

  const idsModulos = modulosRelacionados.map((relacion) => relacion.id_m);

  if (idsModulos.length === 0) {
    return { grupo: grupoData as GrupoType, modulos: [], temas: [] };
  }

  // 3. Cargar la información de los módulos
  const { data: modulosData, error: modulosError } = await supabase
    .from('mg_modulos')
    .select('*')
    .in('id_m', idsModulos)
    .order('orden', { ascending: true });

  if (modulosError || !modulosData) {
    throw new Error('No se pudo cargar la información de los módulos.');
  }

  // 4. Cargar los temas asociados a los módulos
  const { data: temasRelacionados, error: temasRelacionadosError } = await supabase
    .from('modulos_temas')
    .select('id_m, id_t')
    .in('id_m', idsModulos);

  if (temasRelacionadosError || !temasRelacionados) {
    throw new Error('No se pudieron cargar las relaciones módulo-tema.');
  }

  const idsTemas = temasRelacionados.map((relacion) => relacion.id_t);

  let temasCompletos: (TemaType & { id_m: string })[] = [];

  if (idsTemas.length > 0) {
    const { data: temasData, error: temasError } = await supabase
      .from('mg_temas')
      .select('*')
      .in('id_t', idsTemas)
      .order('orden', { ascending: true });

    if (temasError || !temasData) {
      throw new Error('No se pudo cargar la información de los temas.');
    }

    // Unimos cada tema con su módulo correspondiente
    temasCompletos = temasRelacionados.map((relacion) => {
      const temaInfo = temasData.find((t) => t.id_t === relacion.id_t);
      if (temaInfo) {
        return { ...temaInfo, id_m: relacion.id_m };
      }
    }).filter(Boolean) as (TemaType & { id_m: string })[];
  }

  return {
    grupo: grupoData as GrupoType,
    modulos: modulosData as ModuloType[],
    temas: temasCompletos,
  };
}
