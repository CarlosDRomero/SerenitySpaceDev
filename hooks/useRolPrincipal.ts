import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

const jerarquia = ['admin', 'psicologo', 'tutor', 'estudiante', 'invitado'];

export const useRolPrincipal = () => {
  const [rolPrincipal, setRolPrincipal] = useState<string | null>(null);
  const [rolesUsuario, setRolesUsuario] = useState<string[]>([]);
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

      const nombres: string[] = data
        .map((item: any) => item.roles?.nombre)
        .filter((nombre: string | undefined) => typeof nombre === 'string');

      const rolesFinales = nombres.length > 0 ? nombres : ['invitado'];
      const principal = jerarquia.find((r) => rolesFinales.includes(r)) ?? 'invitado';

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