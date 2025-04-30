/components/ModuloGrupos/
│
├── ListaGrupos.tsx          # (Ya existe) Pantalla principal tipo Platzi
├── CrearGrupo.tsx           # (Ya existe) Formulario para crear nuevos grupos
├── GrupoCard.tsx            # (Ya existe) Componente de tarjeta visual
│
├── SelectorGruposEditar.tsx  # 🆕 Nueva pantalla para seleccionar qué grupo quieres editar
│
├── EditorVisual/            # 🆕 Nueva carpeta (especializada en edición)
│   ├── EditorVisualGrupo.tsx   # Contiene la estructura general del editor visual
│   ├── SidebarMenu.tsx         # Barra lateral para navegar módulos/temas
│   ├── GrupoEditor.tsx         # Editor visual para el grupo
│   ├── ModuloEditor.tsx        # Editor visual para módulos
│   ├── TemaEditor.tsx          # Editor visual para temas
│   └── editorTypes.ts          # Tipos de datos (GrupoType, ModuloType, TemaType)
│
└── BD/
    ├── gruposDB.ts           # Consultas relacionadas con grupos
    ├── modulosDB.ts          # (próximamente) Consultas de módulos
    ├── temasDB.ts            # (próximamente) Consultas de temas
