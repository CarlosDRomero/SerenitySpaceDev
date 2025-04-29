usuarios
    id_u
    nombre_u
    correo
    contraseña
    foto_perfil
    rol
    fecha_creacion

mg_grupos
    id_g
    titulo
    icono_url 
    descripcion
    imagen_url    
    fecha_creacion
    activo
    grupo_apoyo

mg_modulos
    id_m
    titulo
    orden
    fecha_creacion

mg_temas
    id_t
    titulo
    contenido_texto
    video_url
    orden
    fecha_creacion

us_creador_grupo
    id_uscg
    id_u
    id_g

inscripciones
    id_insc
    id_u
    id_g    
    fecha_inscripcion
    progreso

progreso_temas
    id_pt
    usuario_id
    id_t
    completado
    fecha_completado

comentarios
    id_c
    id_u
    id_t
    comentario
    fecha_creacion

grupos_modulos
    id_gm
    id_g
    id_m

modulos_temas
    id_mt
    id_m
    id_t



-- Obtener y eliminar todas las tablas excepto 'profiles'
do $$
declare
  r record;
begin
  for r in (select tablename from pg_tables where schemaname = 'public' and tablename != 'profiles') loop
    execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
  end loop;
end $$;
