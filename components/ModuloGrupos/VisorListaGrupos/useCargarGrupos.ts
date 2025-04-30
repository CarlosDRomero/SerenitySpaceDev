import { useEffect, useState } from 'react';
import {
  fetchGrupos,
  fetchGruposRecientes,
  fetchGruposApoyo
} from '../BD/gruposDB';
import { GrupoType } from './visorTypes';

export function useCargarGrupos() {
  const [grupos, setGrupos] = useState<GrupoType[]>([]);
  const [gruposRecientes, setGruposRecientes] = useState<GrupoType[]>([]);
  const [gruposApoyo, setGruposApoyo] = useState<GrupoType[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const [todos, recientes, apoyo] = await Promise.all([
          fetchGrupos(),
          fetchGruposRecientes(),
          fetchGruposApoyo()
        ]);

        setGrupos(todos);
        setGruposRecientes(recientes);
        setGruposApoyo(apoyo);
      } catch (err) {
        console.error('Error cargando grupos:', err);
        setError('Hubo un problema al cargar los grupos.');
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  return {
    grupos,
    gruposRecientes,
    gruposApoyo,
    cargando,
    error
  };
}
