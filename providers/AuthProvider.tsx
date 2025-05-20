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
import { useRolPrincipal } from '@/hooks/useRolPrincipal';
import { TipoNombreRol } from '@/app/AdminUsers/types_AU';


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
    supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (!session?.user) {
        console.log(`Session not found: ${session}`)
        setProfile(null);
        setFetching(false)
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        console.log(`Profile: ${data}`)
        setProfile(data);
      setFetching(false)
    });
  }, []);

  if (fetching) {
    return <ActivityIndicator/>
  }
  return (
    <AuthContext.Provider value={{ session, user: session?.user, profile}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);