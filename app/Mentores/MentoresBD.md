create table if not exists perfil_tutor (
  id_profile uuid primary key references profiles(id) on delete cascade,
  especialidad text,
  descripcion text,
  experiencia text,
  disponibilidad text,
  creado timestamp default current_timestamp
);
