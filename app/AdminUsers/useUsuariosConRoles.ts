// /app/moduloGrupos/AdministradorUsuarios/useUsuariosConRoles.ts

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { UsuarioConRol } from './types_AU';

export const useUsuariosConRoles = () => {
  const [usuarios, setUsuarios] = useState<UsuarioConRol[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const fetchUsuarios = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        usuarios_roles:usuarios_roles!usuarios_roles_id_profile_fkey (
          id_rol,
          roles (
            nombre
          )
        )
      `);

    if (error) {
      console.error('Error al cargar usuarios con roles:', error);
      setUsuarios([]);
    } else {
      setUsuarios(data as unknown as UsuarioConRol[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombre = u.full_name.toLowerCase();
    const roles = u.usuarios_roles?.map((r) => r.roles?.nombre.toLowerCase()) ?? [];
    const textoBusqueda = busqueda.toLowerCase();

    return (
        nombre.includes(textoBusqueda) ||
        roles.some((rol) => rol.includes(textoBusqueda))
    );
    });


  return {
    usuarios: usuariosFiltrados,
    loading,
    refetch: fetchUsuarios,
    setBusqueda,
    busqueda,
    todosUsuarios: usuarios, // Por si quieres usar la lista original para mostrar nuevos usuarios
  };
};
