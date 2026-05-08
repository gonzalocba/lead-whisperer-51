
---
# PROMPT 1:
como agente experto en base datos te encargaras de establecer la conexion con supabase, uitliza las skills si es necesario en /docs, 
avancemos con la conexion a supabase, 

PASO 1 — INSTALAR SDK
npm install @supabase/supabase-js

PASO 2 — CREAR .env.local
solicitar los datos url, anon key de proyecto supabase

PASO 3 — CREAR CLIENTE SUPABASE
Crear archivo:
src/lib/supabase.ts

---
# PROMPT 2 — VALIDACIÓN DE CONFIGURACIÓN

Verificá sin ejecutar cambios que la configuración Supabase esté correcta.

Checklist:
1. SDK instalado
2. archivo .env.local detectado
3. variables:
   te paso lo datos de conexion URL y anon key
4. cliente:
   src/lib/supabase.ts
5. importaciones correctas

No modificar código.

Solo responder:
* OK configuración
  o
* listar errores detectados

---
# PROMPT 3 — PRIMERA INTEGRACIÓN

Conectar únicamente la pantalla Lista Leads a Supabase que contiene la tabla principal del proyecto

Reglas:
1. NO modificar diseño
2. NO tocar estilos
3. NO alterar navegación
4. reemplazar solo la fuente mock data

Implementar:
* query real a tabla leads
* loading básico
* manejo básico de error

Validar:
la UI debe verse idéntica, mostrando datos reales

---
# PROMPT 4 — VALIDACIÓN POST INTEGRACIÓN

Necesito auditar la integración Lista Leads.

Verificar:
1. query correcta
2. manejo de loading
3. manejo de error
4. ausencia de imports innecesarios
5. consistencia con skills_core.md

No modificar UI.

Responder:
* integración correcta
  o
* lista exacta de ajustes necesarios

---
# PROMPT 5 — EXPANSIÓN TABLA POR TABLA

Expandir integración Supabase tabla por tabla siguiendo estrictamente modelo_db.md y el archivo interfaz.md

Orden obligatorio:
1. Pantalla Lista Leads, listamos los leads de tabla leads
2. Pantalla Detalle Lead (Lectura de datos del perfil al hacer clic en "Ver").
3. Historial y Formulario "acciones_dia" (Lectura de historial y escritura de nueva acción dentro del Detalle Lead).
4. Dashboard métricas (Lectura agregada)
5. Segmentos (Lectura agrupada).
6. Recompras (Lectura/Escritura en tabla recompras).
7. Landing captación (Insert directo en tabla leads desde formulario público).

Reglas:
* Una integración por vez.
* Validar cada paso, hacer auditoría rápida y pedir mi confirmación antes de pasar al siguiente.
* Conectar selectores de formularios a las tablas "dim_" correspondientes (ej. dim_tipo_accion).
* NO modificar diseño UI.
* NO rediseñar componentes.
* Usar estrictamente las skills del /docs (ej. data_model_guard).

Importante:
- verifica las tablas existentes en supabase segun modelo_db.md que esta en carpeta /docs, para migrar mock data a datos reales
- verificar el estado RLS de tablas deshabilitada para poblar con los datos,  
- la configuración de *Policies* restrictivas se agendará para una auditoría de seguridad final antes del pase a producción

---
# PROMPT 6 — AUTENTICACIÓN

Implementar autenticación Supabase.

Alcance:
1. registro
2. login
3. logout
4. persistencia de sesión

Reglas:
* reutilizar UI existente
* no rediseñar
* no agregar pantallas nuevas salvo necesidad técnica mínima

Validar flujo completo.

---
# PROMPT 7 — RLS

Aplicar Row Level Security en todas las tablas productivas.

Objetivo:
aislar datos por usuario/agencia

Validar:
* lectura permitida solo sobre datos propios
* escritura restringida
* consultas frontend compatibles

---
# PROMPT 8 — POLICIES

Definir policies por rol:
* owner
* admin
* vendedor

Seguir arquitectura white-label de skills_core.md

Entregar:
* policies implementadas
* explicación breve de acceso por rol

---
# PROMPT 9 — AUDITORÍA FINAL

Auditar sistema completo.

Verificar:
1. conexión Supabase
2. integridad modelo_db
3. autenticación
4. RLS
5. consistencia UI
6. cumplimiento restricciones.md
7. cumplimiento skills_core.md

Responder:
* estado general
* riesgos detectados
* listo / no listo para deploy

-------------------------------------------
# FLUJO COMPLETO EN ANTIGRAVITY

Prompt 1 → setup
Prompt 2 → validar
Prompt 3 → conectar tabla central
Prompt 4 → auditar
Prompt 5 → expandir
Prompt 6 → auth
Prompt 7 → RLS
Prompt 8 → policies
Prompt 9 → auditoría final

---
Prompt
↓
revisión Antigravity
↓
npm run dev
↓
git status
↓
commit
↓
siguiente prompt

