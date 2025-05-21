export interface Profile {
  id: string
  updated_at: string
  username: string
  full_name: string
  avatar_url: string
  website: string

  // Campos adicionales de perfil_contenido
  biografia?: string
  intereses?: string
  estado_emocional?: string

  // Campo extra si quieres mostrar el email del usuario autenticado
  email?: string
}
