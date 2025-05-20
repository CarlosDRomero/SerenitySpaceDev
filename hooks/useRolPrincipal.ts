import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { TipoNombreRol, Roles } from '@/app/AdminUsers/types_AU';

const jerarquia: TipoNombreRol[] = ['admin', 'psicologo', 'tutor', 'estudiante', 'invitado'];

export const useRolPrincipal = () => {
  const [rolPrincipal, setRolPrincipal] = useState<TipoNombreRol | null>(null);
  const [rolesUsuario, setRolesUsuario] = useState<TipoNombreRol[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setCargando(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        // Usuario no autenticado
        setRolesUsuario(['invitado']);
        setRolPrincipal('invitado');
        setCargando(false);
        return;
      }

      const { data, error } = await supabase
        .from('usuarios_roles')
        .select('roles(nombre)')
        .eq('id_profile', userId);

      if (error) {
        console.error('Error obteniendo roles:', error);
        setRolesUsuario(['invitado']);
        setRolPrincipal('invitado');
        setCargando(false);
        return;
      }

      const nombres: TipoNombreRol[] = data
        .map((item: any) => item.roles?.nombre)
        .filter((nombre: TipoNombreRol | undefined) => typeof nombre === 'string');

      const rolesFinales = nombres.length > 0 ? nombres : [Roles[0]];
      const principal = jerarquia.find((r) => rolesFinales.includes(r)) ?? Roles[0];

      setRolesUsuario(rolesFinales);
      setRolPrincipal(principal);
      setCargando(false);
    };

    fetchRoles();
  }, []);

  return { rolPrincipal, rolesUsuario, cargando };
};



/* Como usar el hook, más o menos algo así */
/* import { useRolPrincipal } from '@/hooks/useRolPrincipal';
    const { rolPrincipal, rolesUsuario, cargando } = useRolPrincipal();

    if (cargando) return <Text>Cargando...</Text>;

    return (
    <View>
        <Text>Rol principal: {rolPrincipal}</Text>
        <Text>Todos los roles:</Text>
        {rolesUsuario.map((r) => (
        <Text key={r}>- {r}</Text>
        ))}
    </View>
    );
    
 */