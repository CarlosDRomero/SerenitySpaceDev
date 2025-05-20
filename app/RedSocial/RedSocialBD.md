-- Tabla de relaciones sociales tipo amistad
create table if not exists amistades (
  id uuid primary key default gen_random_uuid(),
  de uuid not null references profiles(id) on delete cascade,         -- Quien envía la solicitud
  para uuid not null references profiles(id) on delete cascade,       -- Quien la recibe
  estado text not null check (estado in ('pendiente', 'aceptado', 'rechazado')),
  fecha timestamp default current_timestamp
);

-- Habilitar Row Level Security
alter table amistades enable row level security;

-- Políticas de desarrollo (abiertas, luego se ajustan)

create policy "Permitir SELECT" on amistades for select using (true);
create policy "Permitir INSERT" on amistades for insert with check (true);
create policy "Permitir UPDATE" on amistades for update using (true) with check (true);
create policy "Permitir DELETE" on amistades for delete using (true);

-- Índices opcionales para rendimiento
create index if not exists idx_amistades_de on amistades(de);
create index if not exists idx_amistades_para on amistades(para);
