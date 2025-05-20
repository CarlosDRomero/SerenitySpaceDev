# SerenitySpace

# $ eas env:pull sobreescribe los archivos ocultos debe tener permiso del admin de git


**Aplicación móvil para el seguimiento y apoyo en la gestión de la ansiedad en estudiantes universitarios.**

---

## Descripción General

SerenitySpace es una plataforma móvil desarrollada para acompañar emocionalmente a los estudiantes universitarios mediante herramientas de evaluación, comunicación, grupos de apoyo y recursos interactivos. Este sistema combina tecnologías modernas, principios de diseño modular y arquitectura escalable para ofrecer una experiencia segura y accesible.

---

## Tecnologías y Herramientas Utilizadas

### Frontend
- **React Native**: Framework principal para apps móviles (iOS y Android).
- **Expo**: Entorno de desarrollo que simplifica compilación, testing y despliegue OTA.
- **TypeScript**: Mejora la mantenibilidad y evita errores en tiempo de desarrollo.
- **Google Auth**: Autenticación de usuarios mediante cuenta de Google.

### Backend
- **Supabase**: Plataforma backend con:
  - **PostgreSQL** como motor de base de datos.
  - Autenticación integrada con RLS (Row-Level Security).
  - **Storage tipo S3** para almacenamiento de archivos (bucket: `srtgrupos`).
  - **Funciones Edge** para lógica personalizada.

- **Stream SDK**:
  - Chat en tiempo real y videollamadas entre usuarios.
  - Estados emocionales representados por colores.

### DevOps y CI/CD
- **Expo EAS**: Compilación automatizada y despliegue over-the-air desde GitHub.
- **GitHub**: Control de versiones y flujo de trabajo basado en ramas.

### Modelado y Documentación
- **Lucidchart**: Diagramas UML (clases, componentes, despliegue).
- **Figma**: Mockups y diseño de interfaces.
- **Word / Excel**: Informe de requerimientos y arquitectura del sistema.

---

## Estructura de la Base de Datos

Las principales entidades del sistema:

- `usuarios`: Manejo de autenticación, roles y perfiles.
- `mg_grupos`: Grupos de apoyo o académicos.
- `mg_modulos`: Módulos dentro de grupos.
- `mg_temas`: Contenido multimedia por tema.
- `inscripciones`, `progreso_temas`, `comentarios`: Seguimiento personalizado.
- Relacionales: `us_creador_grupo`, `grupos_modulos`, `modulos_temas`.

> Toda la base de datos tiene habilitado **RLS** para seguridad granular por usuario.

---

## Seguridad

- Hash de contraseñas y verificación por correo (Supabase).
- Políticas de acceso configuradas por tabla (SELECT, INSERT, UPDATE, DELETE).
- Variables de entorno protegidas (mediante EAS).
- TLS para todas las comunicaciones.
- Certificaciones como **SOC 2** y **HIPAA** en servicios de terceros (Stream).

---

## Funcionalidades Clave por Módulo

| Módulo                | Función principal                                                  |
|-----------------------|--------------------------------------------------------------------|
| Autenticación         | Login, registro y gestión de sesiones seguras.                     |
| Roles y permisos      | Control de accesos por tipo de usuario.                            |
| Test de Ansiedad      | Evaluación obligatoria inicial del estudiante.                     |
| Diario Emocional      | Análisis por IA de entradas diarias.                               |
| Notificaciones        | Alertas personalizadas según estado emocional.                     |
| Grupos y Comunidad    | Unirse, crear y explorar grupos afines.                            |
| Chat y Videollamadas  | Comunicación segura con mentores, tutores y psicólogos.            |
| Recursos Multimedia   | Videos, audios, modelos 2D/3D y guías prácticas.                   |
| BackOffice            | Gestión del sistema por parte de administradores.                  |
| Personalización       | Ajustes de UI/UX, accesibilidad y preferencias.                    |

---

## Despliegue

- Aplicación compilada y firmada con **Expo EAS**.
- Actualizaciones automáticas OTA (Over-The-Air).
- Infraestructura totalmente gestionada: sin necesidad de servidores propios.

---

## Equipo de Desarrollo

- Carlos Manuel Cárdenas Toledo  
- Diego Fernando Lugo Franco  
- Carlos David Romero Restrepo  

Universidad Cooperativa de Colombia - Facultad de Ingeniería  
Proyecto desarrollado en el marco del Semillero OPENIN.

---

## Licencia

Este proyecto es de carácter académico y de libre uso para fines educativos. Para distribución comercial, contactar al equipo desarrollador.

