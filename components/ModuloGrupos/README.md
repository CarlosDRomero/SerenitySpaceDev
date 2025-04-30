# Estructura inicial de módulo grupos
/components/ModuloGrupos/
│
├── index.tsx               # Componente principal (antes era ModuloGrupos.tsx)
│
├── CrearGrupo.tsx           # Formulario para crear un nuevo grupo
├── ListaGrupos.tsx          # Listado visual de todos los grupos
├── DetalleGrupo.tsx         # Ver detalle de un grupo
│
├── CrearModulo.tsx          # Crear módulos dentro de un grupo
├── ListaModulos.tsx         # Listar módulos del grupo
│
├── CrearTema.tsx            # Crear temas dentro de un módulo
├── ListaTemas.tsx           # Listar temas del módulo
│
├── BDgrupos.ts              # Funciones para consultar/insertar en Supabase (grupos, módulos, temas)
└── utils.ts                 # Utilidades pequeñas si es necesario (opcional)

# eas build --profile development --platform android - Construir la build -- Ignorar package_lock.json


Librerías
    * npx expo install expo-av react-native-webview
    * npx expo install expo-video-thumbnails

eas build --platform android --profile development
npm install --"revisión de librerías faltantes"
