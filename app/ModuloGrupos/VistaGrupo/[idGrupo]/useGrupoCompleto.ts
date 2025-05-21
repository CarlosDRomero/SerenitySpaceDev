import { useEffect, useState } from 'react';
import { fetchGrupoCompleto } from './grupoDB'; 
import { GrupoType, ModuloType, TemaType } from './vistaTypes';

export function useGrupoCompleto(idGrupo: string) {
  const [grupo, setGrupo] = useState<GrupoType | null>(null);
  const [modulos, setModulos] = useState<ModuloType[]>([]);
  const [temasPorModulo, setTemasPorModulo] = useState<{ [moduloId: string]: TemaType[] }>({});
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const { grupo, modulos, temas } = await fetchGrupoCompleto(idGrupo);

        setGrupo(grupo);
        setModulos(modulos);

        // Agrupar temas por módulo
        const agrupados: { [moduloId: string]: TemaType[] } = {};
        temas.forEach((tema) => {
          if (!agrupados[tema.id_m]) agrupados[tema.id_m] = [];
          agrupados[tema.id_m].push(tema);
        });

        setTemasPorModulo(agrupados);
      } catch (err) {
        console.error('Error cargando grupo completo:', err);
        setError('Hubo un problema al cargar el grupo.');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [idGrupo]);

  return { grupo, modulos, temasPorModulo, cargando, error };
}
