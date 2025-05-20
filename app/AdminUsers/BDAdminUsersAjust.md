-- ============================
-- CREACIÓN DE TABLAS
-- ============================

-- 1. Tabla de usuarios
create table if not exists usuarios (
  id_u uuid primary key default gen_random_uuid(),
  nombre_u text not null,
  correo text not null,
  contraseña text,
  foto_perfil text,
  rol text not null,
  fecha_creacion timestamp default current_timestamp
);

-- 2. Tabla de grupos
create table if not exists mg_grupos (
  id_g uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  imagen_url text,
  fecha_creacion timestamp default current_timestamp,
  activo boolean default true,
  grupo_apoyo boolean default false
);

-- 3. Tabla de modulos
create table if not exists mg_modulos (
  id_m uuid primary key default gen_random_uuid(),
  titulo text not null,
  orden integer default 0,
  fecha_creacion timestamp default current_timestamp
);

-- 4. Tabla de temas
create table if not exists mg_temas (
  id_t uuid primary key default gen_random_uuid(),
  titulo text not null,
  contenido_texto text,
  video_url text,
  orden integer default 0,
  fecha_creacion timestamp default current_timestamp
);

-- 5. Relación usuario-creador-grupo
create table if not exists us_creador_grupo (
  id_uscg uuid primary key default gen_random_uuid(),
  id_u uuid not null references usuarios(id_u) on delete cascade,
  id_g uuid not null references mg_grupos(id_g) on delete cascade
);

-- 6. Inscripciones a grupos
create table if not exists inscripciones (
  id_insc uuid primary key default gen_random_uuid(),
  id_u uuid not null references usuarios(id_u) on delete cascade,
  id_g uuid not null references mg_grupos(id_g) on delete cascade,
  fecha_inscripcion timestamp default current_timestamp,
  progreso integer default 0
);

-- 7. Progreso en temas
create table if not exists progreso_temas (
  id_pt uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references usuarios(id_u) on delete cascade,
  id_t uuid not null references mg_temas(id_t) on delete cascade,
  completado boolean default false,
  fecha_completado timestamp
);

-- 8. Comentarios en grupos
create table if not exists comentarios (
  id_c uuid primary key default gen_random_uuid(),
  id_u uuid not null references usuarios(id_u) on delete cascade,
  id_t uuid not null references mg_temas(id_t) on delete cascade,
  comentario text not null,
  fecha_creacion timestamp default current_timestamp
);

-- 9. Relación grupos - modulos
create table if not exists grupos_modulos (
  id_gm uuid primary key default gen_random_uuid(),
  id_g uuid not null references mg_grupos(id_g) on delete cascade,
  id_m uuid not null references mg_modulos(id_m) on delete cascade
);

-- 10. Relación modulos - temas
create table if not exists modulos_temas (
  id_mt uuid primary key default gen_random_uuid(),
  id_m uuid not null references mg_modulos(id_m) on delete cascade,
  id_t uuid not null references mg_temas(id_t) on delete cascade
);

-- ============================
-- ACTIVACIÓN DE RLS Y POLÍTICAS ABIERTAS
-- ============================

-- Activar RLS
alter table usuarios enable row level security;
alter table mg_grupos enable row level security;
alter table mg_modulos enable row level security;
alter table mg_temas enable row level security;
alter table us_creador_grupo enable row level security;
alter table inscripciones enable row level security;
alter table progreso_temas enable row level security;
alter table comentarios enable row level security;
alter table grupos_modulos enable row level security;
alter table modulos_temas enable row level security;

-- Políticas para usuarios
create policy "Permitir SELECT" on usuarios for select using (true);
create policy "Permitir INSERT" on usuarios for insert with check (true);
create policy "Permitir UPDATE" on usuarios for update using (true) with check (true);
create policy "Permitir DELETE" on usuarios for delete using (true);

-- Políticas para mg_grupos

-- Permitir INSERT sin restricción
alter table mg_grupos enable row level security;

create policy "Permitir todos los INSERTS en mg_grupos"
on mg_grupos for insert
with check (true);
create policy "Permitir SELECT" on mg_grupos for select using (true);
create policy "Permitir INSERT" on mg_grupos for insert with check (true);
create policy "Permitir UPDATE" on mg_grupos for update using (true) with check (true);
create policy "Permitir DELETE" on mg_grupos for delete using (true);

-- Políticas para mg_modulos
create policy "Permitir SELECT" on mg_modulos for select using (true);
create policy "Permitir INSERT" on mg_modulos for insert with check (true);
create policy "Permitir UPDATE" on mg_modulos for update using (true) with check (true);
create policy "Permitir DELETE" on mg_modulos for delete using (true);

-- Políticas para mg_temas
create policy "Permitir SELECT" on mg_temas for select using (true);
create policy "Permitir INSERT" on mg_temas for insert with check (true);
create policy "Permitir UPDATE" on mg_temas for update using (true) with check (true);
create policy "Permitir DELETE" on mg_temas for delete using (true);

-- Políticas para us_creador_grupo
create policy "Permitir SELECT" on us_creador_grupo for select using (true);
create policy "Permitir INSERT" on us_creador_grupo for insert with check (true);
create policy "Permitir UPDATE" on us_creador_grupo for update using (true) with check (true);
create policy "Permitir DELETE" on us_creador_grupo for delete using (true);

-- Políticas para inscripciones
create policy "Permitir SELECT" on inscripciones for select using (true);
create policy "Permitir INSERT" on inscripciones for insert with check (true);
create policy "Permitir UPDATE" on inscripciones for update using (true) with check (true);
create policy "Permitir DELETE" on inscripciones for delete using (true);

-- Políticas para progreso_temas
create policy "Permitir SELECT" on progreso_temas for select using (true);
create policy "Permitir INSERT" on progreso_temas for insert with check (true);
create policy "Permitir UPDATE" on progreso_temas for update using (true) with check (true);
create policy "Permitir DELETE" on progreso_temas for delete using (true);

-- Políticas para comentarios
create policy "Permitir SELECT" on comentarios for select using (true);
create policy "Permitir INSERT" on comentarios for insert with check (true);
create policy "Permitir UPDATE" on comentarios for update using (true) with check (true);
create policy "Permitir DELETE" on comentarios for delete using (true);

-- Políticas para grupos_modulos
create policy "Permitir SELECT" on grupos_modulos for select using (true);
create policy "Permitir INSERT" on grupos_modulos for insert with check (true);
create policy "Permitir UPDATE" on grupos_modulos for update using (true) with check (true);
create policy "Permitir DELETE" on grupos_modulos for delete using (true);

-- Políticas para modulos_temas
create policy "Permitir SELECT" on modulos_temas for select using (true);
create policy "Permitir INSERT" on modulos_temas for insert with check (true);
create policy "Permitir UPDATE" on modulos_temas for update using (true) with check (true);
create policy "Permitir DELETE" on modulos_temas for delete using (true);





-- Eliminar todas las tablas menos profiles
-- Obtener y eliminar todas las tablas excepto 'profiles'
do $$
declare
  r record;
begin
  for r in (select tablename from pg_tables where schemaname = 'public' and tablename != 'profiles') loop
    execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
  end loop;
end $$;


-- Añadimos una nueva columna, ícono url a la tabla mg_grupos
alter table mg_grupos
add column icono_url text;

-- Permitir que cualquiera suba y lea archivos
create policy "Allow public access"
on storage.objects
for all
using (bucket_id = 'srtgrupos');


-- Agregamos descripción a la tabla módulos
alter table mg_modulos
add column descripcion text;

-- Refrescar caché del esquema público manualmente
select pg_catalog.pg_reload_conf();


-- Modificar la tabla mg_temas para agregar control real de tipo de media
alter table mg_temas
add column tipo_video text default 'ninguno', -- 'ninguno' | 'youtube' | 'subido'
add column media_url text;                    -- URL del video (subido o YouTube);


-- Eliminar la columna antigua que ya no se usa
alter table mg_temas drop column video_url;

-- Renombrar tipo_video a tipo_contenido
--alter table mg_temas rename column tipo_video to tipo_contenido;

-- Esto no cambia nada, pero fuerza a actualizar el esquema
alter table mg_temas rename column tipo_contenido to tipo_video;




-- Comenzamos a crear los Roles de la base de datos

-- 1. Tabla de roles (catálogo)
create table if not exists roles (
  id serial primary key,
  nombre text not null unique check (
    nombre in ('invitado', 'estudiante', 'psicologo', 'tutor', 'admin')
  )
);

-- 2. Tabla intermedia usuarios_roles (muchos a muchos)
create table if not exists usuarios_roles (
  id_profile uuid not null references profiles(id) on delete cascade,
  id_rol integer not null references roles(id) on delete cascade,
  asignado_por uuid references profiles(id) on delete set null,
  fecha_asignacion timestamp default current_timestamp,
  primary key (id_profile, id_rol)
);

-- 3. Insertar roles base
insert into roles (nombre) values
  ('invitado'),
  ('estudiante'),
  ('psicologo'),
  ('tutor'),
  ('admin')
on conflict do nothing;

-- Agrega el rol invitado por defecto.

create policy "insertar invitado por defecto"
on usuarios_roles for insert
with check (
  exists (
    select 1 from roles where id = usuarios_roles.id_rol and nombre = 'invitado'
  ) or auth.role() = 'service_role'
);




-- Ajustamos las políticas nuevas en las nuevas tablas, son políticas de prueba
alter table roles enable row level security;
alter table usuarios_roles enable row level security;


-- Tabla: roles
create policy "Permitir SELECT" on roles for select using (true);
create policy "Permitir INSERT" on roles for insert with check (true);
create policy "Permitir UPDATE" on roles for update using (true) with check (true);
create policy "Permitir DELETE" on roles for delete using (true);

-- Tabla: usuarios_roles
create policy "Permitir SELECT" on usuarios_roles for select using (true);
create policy "Permitir INSERT" on usuarios_roles for insert with check (true);
create policy "Permitir UPDATE" on usuarios_roles for update using (true) with check (true);
create policy "Permitir DELETE" on usuarios_roles for delete using (true);
