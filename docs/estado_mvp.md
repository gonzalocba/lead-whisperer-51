# 🚀 Estado de Integración: LeadFlow MVP (Travel CRM)

Este documento sirve como registro oficial del progreso de migración desde datos estáticos (Mock) hacia una arquitectura Cloud real con **Supabase**, preparado para ser presentado y replicado en múltiples agencias de viajes.

---

## 🎯 Objetivo General
Transformar el frontend estático de LeadFlow en un CRM funcional, dinámico y respaldado por una base de datos relacional robusta (PostgreSQL) sin alterar la experiencia de usuario (UX/UI).

---

## ✅ Hitos Logrados (Lo que hicimos)

Hasta el momento, hemos completado con éxito la fase troncal del sistema comercial:

### 1. Conexión Core (Infraestructura)
- Integración del SDK de Supabase con variables de entorno (`.env.local`) preparadas para el entorno de Vite.
- Creación de un cliente único en `src/lib/supabase.ts` para centralizar todas las peticiones.

### 2. Paso 1: Lista General de Leads
- Migración de la vista de entrada comercial. 
- Los leads ahora se leen dinámicamente de la tabla `leads`.
- **Logro técnico:** Se implementó un adaptador "antifrágil". Esto significa que aunque la base de datos envíe IDs numéricos para los estados (`id_estado`), el frontend los traduce en tiempo real para mantener los chips visuales perfectos.

### 3. Paso 2: Perfil Comercial (Detalle Lead)
- Conexión de la vista individual de cada pasajero.
- Los datos como presupuesto, fecha estimada, tipo de viaje y destino ahora provienen de Supabase en tiempo de carga (`beforeLoad`), evitando parpadeos visuales al navegar.

### 4. Paso 3: Historial y Acciones Diarias
- **Arquitectura de Base de Datos:** Se crearon exitosamente las tablas dimensionales (`dim_tipo_accion`, `dim_resultado_accion`, `dim_estado_pipeline`) y la tabla de hechos (`acciones_dia`).
- **Lectura Dinámica:** El historial de la aplicación ahora cruza los IDs numéricos con las tablas dimensionales para mostrar nombres legibles.
- **Escritura Transaccional:** El formulario "Registrar acción" hace un `INSERT` real en Supabase, cuenta con bloqueos de botones y *spinners* de carga para dar un buen *feedback* al vendedor, y actualiza el listado instantáneamente al finalizar con éxito.

> **Decisión Técnica - RLS (Seguridad):** Por el momento, la seguridad a nivel de fila (Row Level Security) se encuentra intencionalmente deshabilitada en las tablas operativas para favorecer la velocidad de desarrollo del MVP. La configuración de *Policies* restrictivas se agendará para una auditoría de seguridad final antes del pase a producción.

---

## 🗺️ Hoja de Ruta (Lo que queda por delante)

Siguiendo el esquema de trabajo estructurado, estos son los siguientes módulos a integrar:

### 📊 Paso 4: Dashboard y Métricas
- **Objetivo:** Hacer que los KPIs, gráficos y el panel de "Estado del Pipeline" dejen de ser estáticos.
- **Técnica:** Lectura agregada. Agruparemos y contaremos datos desde `leads` y `acciones_dia` para alimentar los componentes visuales de la página de inicio.

### 🎯 Paso 5: Segmentos de Leads
- **Objetivo:** Mostrar las sub-listas priorizadas de leads basados en sus estados del embudo y los días transcurridos.
- **Técnica:** Lectura filtrada y agrupada.

### 🔄 Modificación de BD (Punto de inflexión)
- Se ejecutará un `ALTER TABLE` sobre la tabla `leads` para añadir los campos de análisis de cierre y CLV (`es_cliente`, `cantidad_compras`, etc.). Este paso dejará la cancha lista para el módulo final de recompras.

### 💸 Paso 6: Recompras
- **Objetivo:** Conectar el flujo dedicado a clientes recurrentes.
- **Técnica:** Lectura y escritura sobre la tabla `recompras` y dimensiones asociadas (`dim_estado_recompra`, `dim_resultado_recompra`).

### 🌐 Paso 7: Top of Funnel (Landing de Captación)
- **Objetivo:** Conectar el punto de entrada público.
- **Técnica:** Asegurar que cuando un visitante llena el formulario en la web de la agencia, se ejecute un `INSERT` directo en la tabla `leads`, ingresando automáticamente al pipeline como "Nuevo".

---
*Documento generado automáticamente para seguimiento del proyecto LeadFlow MVP.*
