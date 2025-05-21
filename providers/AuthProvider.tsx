import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase'; 
import { Profile } from '@/components/messaging/interfaces';
import { ActivityIndicator } from 'react-native';

type AuthContext = {
  session: Session | null;
  user?: User | null;
  profile?: Profile | null;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>();
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const unsubscribe = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session?.user) {
        setProfile(null);
        setFetching(false);
        return;
      }

      const userId = session.user.id;

      // 1. Traer perfil base
      const { data: perfilBase, error: errorBase } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (errorBase || !perfilBase) {
        console.error("Error cargando perfil base:", errorBase);
        setFetching(false);
        return;
      }

      // 2. Traer perfil extendido o crear uno vacío si no existe
      let extra = null;
      const { data: contenido, error: errorExtra } = await supabase
        .from('perfil_contenido')
        .select('biografia, intereses, estado_emocional, ultima_actualizacion')
        .eq('id_profile', userId)
        .single();

      if (errorExtra) {
        console.warn("No se encontró perfil_contenido, creando uno nuevo");

        const { error: insertError } = await supabase
          .from('perfil_contenido')
          .insert({
            id_profile: userId,
            biografia: '',
            intereses: '',
            estado_emocional: '',
            ultima_actualizacion: new Date(),
          });

        if (!insertError) {
          extra = {
            biografia: '',
            intereses: '',
            estado_emocional: '',
          };
        } else {
          console.error("Error insertando perfil_contenido:", insertError.message);
        }
      } else {
        extra = contenido;
      }

      // 3. Unir todo y guardar en contexto
      setProfile({
        ...perfilBase,
        email: session.user.email,
        ...extra,
      });

      setFetching(false);
    });

    // Cleanup al desmontar
    return () => {
      unsubscribe.data?.subscription?.unsubscribe?.();
    };
  }, []);

  if (fetching) {
    return <ActivityIndicator />;
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
