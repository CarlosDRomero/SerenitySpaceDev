// /app/moduloGrupos/AdministradorUsuarios/types_AU.ts

export type Rol = {
  id: number;
  nombre: 'invitado' | 'estudiante' | 'psicologo' | 'tutor' | 'admin';
};

export type UsuarioConRol = {
  id: string;
  full_name: string;
  avatar_url?: string;
  usuarios_roles?: {
    id_rol: number;
    roles: {
      nombre: string;
    };
  }[];
};

export type ListaUsuariosProps = {
  usuarios: UsuarioConRol[];
  onAsignar: (usuario: UsuarioConRol) => void;
};

export type Usuario = {
  id: string;
  full_name: string;
};

export type ModalAsignarRolProps = {
  visible: boolean;
  usuario: UsuarioConRol | null;
  onClose: () => void;
  refetch: () => void;
};

