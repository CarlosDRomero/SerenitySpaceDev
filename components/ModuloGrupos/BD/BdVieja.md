create table grupos_apoyo (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  imagen_url text,
  creador_id uuid references auth.users(id),
  activo boolean default true,
  creado_en timestamp with time zone default now()
);

create table modulos_grupo (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid references grupos_apoyo(id) on delete cascade,
  nombre text not null,
  orden integer default 0,
  activo boolean default true
);

create table temas_modulo (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid references modulos_grupo(id) on delete cascade,
  titulo text not null,
  descripcion text,
  video_youtube_url text,
  video_supabase_url text,
  orden integer default 0
);

create table prueba_insert (
  id uuid primary key default gen_random_uuid(),
  texto text
);

select * from prueba_insert

alter table grupos_apoyo
add column fijo boolean default false;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'grupos_apoyo';

create table foto_y_video (
  id uuid primary key default gen_random_uuid(),
  imagen_url text,
  video_url text,
  creado_en timestamp with time zone default now()
);



for INSERT
to public
with check (true)

insert into foto_y_video (nombre_archivo, url_archivo, tipo)
values ('test.jpg', 'https://fake-url.com/test.jpg', 'foto');


-- Tener en cuenta las políticas para poder subir archivos

create policy "Permitir subida pública"
on storage.objects
for insert
to public
with check (bucket_id = 'fotoyvideo');


-- Tabla de usuarios (opcional por ahora, puede usarse para autenticación futura)
CREATE TABLE G_Usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT,
    email TEXT UNIQUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de grupos
CREATE TABLE G_Grupos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT,
    creador_id UUID REFERENCES G_Usuarios(id),
    fijo BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Crear política de inserción pública
CREATE POLICY "Permitir inserciones públicas"
ON "g_grupos"
FOR INSERT
TO public
WITH CHECK (true);

-- Tabla de módulos por grupo
CREATE TABLE G_Modulos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grupo_id UUID REFERENCES G_Grupos(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    orden INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de temas por módulo
CREATE TABLE G_Temas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID REFERENCES G_Modulos(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    video_youtube_url TEXT,
    video_supabase_url TEXT,
    imagen_url TEXT,
    orden INTEGER DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de subtemas por tema
CREATE TABLE G_Subtemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id UUID REFERENCES G_Temas(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    video_youtube_url TEXT,
    video_supabase_url TEXT,
    imagen_url TEXT,
    orden INTEGER DEFAULT 0,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios para temas
CREATE TABLE G_Comentarios_Temas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id UUID REFERENCES G_Temas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Comentarios para subtemas
CREATE TABLE G_Comentarios_Subtemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtema_id UUID REFERENCES G_Subtemas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);




-----------------------------------------

-- Asegura que 'creador_id' permita NULL
ALTER TABLE "g_grupos"
ALTER COLUMN "creador_id" DROP NOT NULL;

-- Asegura que 'fijo' no sea obligatorio y tenga un valor por defecto
ALTER TABLE "g_grupos"
ALTER COLUMN "fijo" SET DEFAULT false,
ALTER COLUMN "fijo" DROP NOT NULL;

-- Asegura que 'activo' no sea obligatorio y tenga un valor por defecto
ALTER TABLE "g_grupos"
ALTER COLUMN "activo" SET DEFAULT true,
ALTER COLUMN "activo" DROP NOT NULL;


-------------------------------------------------------


-- Tabla: gr_grupos
create table if not exists gr_grupos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  imagen_url text,
  creado_por uuid, -- opcional: referencia a auth.users si se usa autenticación
  fecha_creacion timestamp default current_timestamp,
  activo boolean default true
);

-- Tabla: gr_modulos
create table if not exists gr_modulos (
  id uuid primary key default gen_random_uuid(),
  grupo_id uuid not null references gr_grupos(id) on delete cascade,
  nombre text not null,
  orden integer default 0,
  activo boolean default true
);

-- Tabla: gr_temas
create table if not exists gr_temas (
  id uuid primary key default gen_random_uuid(),
  modulo_id uuid not null references gr_modulos(id) on delete cascade,
  titulo text not null,
  descripcion text,
  video_youtube_url text,        -- opcional
  video_supabase_url text,       -- opcional (videos subidos)
  orden integer default 0
);

-- Activar Row-Level Security (si usarás autenticación)
alter table gr_grupos enable row level security;
alter table gr_modulos enable row level security;
alter table gr_temas enable row level security;

-- Políticas de acceso (desactivadas por defecto, puedes activarlas luego)

-- create policy "grupos propios" on gr_grupos
-- for all using (creado_por = auth.uid());

-- create policy "modulos propios" on gr_modulos
-- for all using (exists (
--   select 1 from gr_grupos g where g.id = grupo_id and g.creado_por = auth.uid()
-- ));

-- create policy "temas propios" on gr_temas
-- for all using (exists (
--   select 1 from gr_modulos m
--   join gr_grupos g on m.grupo_id = g.id
--   where m.id = modulo_id and g.creado_por = auth.uid()
-- ));



----
--- habilitar las políticas temporalmente

-- Habilitar RLS
alter table gr_grupos enable row level security;
alter table gr_modulos enable row level security;
alter table gr_temas enable row level security;

-- Políticas para gr_grupos
create policy "Permitir SELECT en gr_grupos"
on gr_grupos for select using (true);

create policy "Permitir INSERT en gr_grupos"
on gr_grupos for insert with check (true);

create policy "Permitir UPDATE en gr_grupos"
on gr_grupos for update using (true) with check (true);

create policy "Permitir DELETE en gr_grupos"
on gr_grupos for delete using (true);

-- Políticas para gr_modulos
create policy "Permitir SELECT en gr_modulos"
on gr_modulos for select using (true);

create policy "Permitir INSERT en gr_modulos"
on gr_modulos for insert with check (true);

create policy "Permitir UPDATE en gr_modulos"
on gr_modulos for update using (true) with check (true);

create policy "Permitir DELETE en gr_modulos"
on gr_modulos for delete using (true);

-- Políticas para gr_temas
create policy "Permitir SELECT en gr_temas"
on gr_temas for select using (true);

create policy "Permitir INSERT en gr_temas"
on gr_temas for insert with check (true);

create policy "Permitir UPDATE en gr_temas"
on gr_temas for update using (true) with check (true);

create policy "Permitir DELETE en gr_temas"
on gr_temas for delete using (true);
