# 🧪 Guía de Testing Personalizado y Verificación de Estado — LeadFlow

Este documento contiene la estrategia de verificación, testing personalizado y el estado actual de integración del sistema **LeadFlow (SaaS CRM para Agencias de Viajes)**. Su objetivo es proporcionar un manual técnico para validar que el motor de decisiones comerciales, el CRM y la inteligencia artificial funcionen de manera integrada y sin fricciones.

---

## 📌 Arquitectura y Flujo del Sistema

El siguiente diagrama ilustra cómo fluyen los datos y las decisiones en el ecosistema de LeadFlow, desde el primer contacto comercial hasta la automatización de la recompra y las consultas al asistente de IA:

```mermaid
graph TD
    A[Landing Page: Quiz/Formulario] -- "1. Registro del Lead (Estado: Nuevo)" --> B[(Supabase PostgreSQL)]
    B -- "2. Lectura en tiempo real" --> C[CRM Lite: Panel de Leads]
    C -- "3. Registrar Acción de Venta" --> D[Historial: acciones_dia]
    D -- "4. Trigger SQL / Adaptador" --> B
    
    B -- "5. Control de Fechas y CLV" --> E[Panel de Segmentos]
    E -- "6. Auto-Trigger de Recompra (es_cliente = true + días trigger)" --> F[(Tabla: recompras)]
    F -- "7. Flujo de Recompra" --> G[CRM: Detalle Recompra]
    
    C -- "8. Contexto del Lead" --> H[Asistente IA Workspace]
    H -- "9. Webhook HTTP POST" --> I[n8n Flow (Producción)]
    I -- "10. Estrategia & Copys sugeridos" --> H
```

---

## 🎯 Estado de Avance del Proyecto (Fase de Validación)

A continuación se detalla el checklist de verificación de lo implementado en el sistema comercial contra lo planificado en el **Documento Maestro**:

| Componente / Módulo | Estado | Técnica Utilizada | Archivos Clave |
| :--- | :---: | :--- | :--- |
| **Infraestructura Base** | ✅ Listo | Supabase SDK Client con variables de entorno de Vite | [supabase.ts](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/lib/supabase.ts) |
| **Lista General de Leads** | ✅ Listo | Lectura dinámica desde tabla `leads` con adaptador antifrágil para mapear estados numéricos. | [leads.index.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/leads.index.tsx) |
| **Ficha y Detalle de Lead** | ✅ Listo | Carga previa (`beforeLoad` / parameters parsing) por `leadId`. Contexto completo de pasajeros. | [leads.$leadId.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/leads.$leadId.tsx) |
| **Registro de Acciones de Venta** | ✅ Listo | Escritura transaccional en `acciones_dia` mediante modal. Refresco automático del pipeline e historial. | [leads.$leadId.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/leads.$leadId.tsx) |
| **Dashboard y Métricas** | ✅ Listo | Consultas agregadas a Supabase. Tasa de conversión, promedio de días de cierre e indicador de retrasos > 24h. | [dashboard.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/dashboard.tsx) |
| **Segmentos del Día** | ✅ Listo | Tareas prioritarias dinámicas (Leads sin respuesta, follow-ups vencidos, clientes dormidos en recompra). | [segmentos.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/segmentos.tsx) |
| **Lógica Auto-Trigger Recompra** | ✅ Listo | Detección automática en `/segmentos` de clientes que superan el límite de días (`dias_recompra_trigger`) para crear registro en `recompras`. | [segmentos.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/segmentos.tsx) |
| **CRM Recompras (Venta Cruzada)** | ✅ Listo | Pipeline de recompra y stepper visual (Pendiente $\to$ Contactado $\to$ En seguimiento $\to$ Convertido $\to$ Descartado). | [recompra.index.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/recompra.index.tsx) |
| **Asistente IA Chat (n8n)** | ✅ Listo | Integración de chat contextual con webhook de n8n en producción (`/webhook/asistenteIA`) y manejo de errores de conexión/CORS. | [analisis-ia.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/analisis-ia.tsx) |
| **Landing de Captación (Público)** | 🟡 Mock | Formulario interactivo simulado. Falta conectar con el `INSERT` real en Supabase para registrar leads en la BD. | [landing.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/landing.tsx) |

---

## 🛠️ Procedimientos de Test Personalizado (Manual & Integración)

### 📋 Test Case 1: Flujo de Gestión Comercial (Verificación CRM)
* **Objetivo:** Comprobar que el registro de una acción diaria de venta actualiza el historial, cambia la etapa del pipeline y recalcula la fecha de la próxima acción siguiendo el motor de decisiones.
* **Pasos:**
  1. Ingresá al CRM, seleccioná un lead en estado **"Nuevo"** o **"Contactado"** en la pestaña de [Listado de Leads](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/leads.index.tsx).
  2. Hacé clic en **"Registrar Acción"**.
  3. Elegí un tipo de acción (ej. *WhatsApp*) y un resultado (ej. *Solicita información*).
  4. Agregá una nota libre (ej. *"Solicitó itinerario detallado por mensaje"*).
  5. Hacé clic en **"Guardar Acción"**.
* **Resultados Esperados:**
  * El estado del lead en el stepper lineal superior debe cambiar a **"Contactado"** (o el estado sugerido por la dimensión del resultado).
  * En la tabla de **"Historial de Acciones"** debe aparecer de inmediato el nuevo registro con la fecha, el tipo, el resultado y tu nota descriptiva.
  * La base de datos debe reflejar una nueva fila en `acciones_dia` vinculada al `id_lead`.

---

### 📋 Test Case 2: Motor de Recompra (Auto-Trigger)
* **Objetivo:** Comprobar que un cliente que cumplió su ciclo de viaje (Brasil: 180 días, Caribe: 365 días) genera de forma automática una alerta de recompra sin intervención humana.
* **Pasos:**
  1. Usando la consola de Supabase (SQL Editor), insertá o modificá un lead de prueba asegurando que sea cliente y que su última fecha de compra sea antigua:
     ```sql
     UPDATE leads 
     SET es_cliente = true, 
         fecha_ultima_compra = NOW() - INTERVAL '190 days', 
         id_servicio = 1 -- Servicio de Brasil (Trigger de 180 días)
     WHERE nombre = 'Lead de Prueba Recompra';
     ```
  2. Navegá a la sección de [Segmentos del Día](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/segmentos.tsx).
* **Resultados Esperados:**
  * Al cargarse la pantalla, el sistema detecta que el lead ya completó los 180 días establecidos para Brasil, no tiene un proceso activo de recompra e inserta automáticamente un registro en la tabla `recompras` en estado **"Pendiente"** (ID: 1).
  * El contador del segmento **"Lanzar recompra"** debe incrementarse automáticamente en $+1$.
  * Al hacer clic en *"Ver clientes"*, el lead de prueba debe aparecer listado en el panel de **Recompra**.

---

### 📋 Test Case 3: Integración del Asistente IA (n8n Webhook)
* **Objetivo:** Validar que la interfaz de chat comercial se comunica de forma correcta con el flujo de producción de n8n y pasa el contexto del cliente activo.
* **Pasos:**
  1. Dirigite a la sección de [Asistente IA](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/analisis-ia.tsx).
  2. Seleccioná un lead para cargar el contexto de "Orientación Comercial IA" en la barra superior.
  3. Hacé clic en uno de los *chips* de acción rápida (ej. *"¿Cómo manejo la objeción de precio?"*) o escribí un mensaje personalizado en la caja de texto.
  4. Enviá el mensaje.
* **Resultados Esperados:**
  * La aplicación enviará un payload con la siguiente estructura al webhook de n8n:
    ```json
    {
      "message": "¿Cómo manejo la objeción de precio?",
      "lead": {
        "name": "Nombre Lead",
        "status": "Contactado",
        "destination": "Cancún",
        "tripType": "Familia",
        "daysInPipeline": 3,
        "budget": "$1.000–$2.000",
        "passengers": 4,
        "whatsapp": "+54...",
        "assignedTo": "Laura García"
      }
    }
    ```
  * Deberías ver un indicador animado de **"Analizando..."**.
  * Tras unos segundos, aparecerá la respuesta redactada en producción de n8n brindándote la táctica comercial para el lead.
  * *Manejo de Errores:* En caso de fallas de red, CORS o workflows apagados, el sistema debe desplegar un mensaje amigable con las soluciones posibles e indicar la URL actual conectada.

---

### 📋 Test Case 4: Dashboard, KPIs y Alertas
* **Objetivo:** Validar las agregaciones en la base de datos y la alerta de leads desatendidos (>24 horas).
* **Pasos:**
  1. Desde la consola SQL de Supabase, modifica la última actividad de un lead activo para simular retraso en la atención:
     ```sql
     UPDATE leads
     SET ultima_actividad = NOW() - INTERVAL '30 hours'
     WHERE id_estado IN (1, 2, 3, 4) AND es_cliente = false
     LIMIT 1;
     ```
  2. Accedé al [Dashboard](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/dashboard.tsx).
* **Resultados Esperados:**
  * El texto motivacional de bienvenida debe reportar correctamente que hay leads esperando respuesta hace más de 24 horas.
  * El gráfico de barras de "Servicios más consultados" debe agrupar los leads actuales por su respectivo `id_servicio` y coincidir con la información de la base de datos.

---

## 🗃️ Semillas SQL para Testing en Supabase

Podés ejecutar estas sentencias SQL en el editor de Supabase para inicializar tu base de datos con registros válidos para todas las pruebas descritas en esta guía:

```sql
-- 1. Insertar dimensiones de servicios si no existen
INSERT INTO dim_servicios (id_servicio, nombre, dias_recompra_trigger)
VALUES 
  (1, 'Brasil', 180),
  (2, 'Caribe', 365)
ON CONFLICT (id_servicio) DO NOTHING;

-- 2. Insertar dimensiones del pipeline de venta
INSERT INTO dim_estado_pipeline (id_estado, nombre, orden)
VALUES 
  (1, 'Nuevo', 1),
  (2, 'Contactado', 2),
  (3, 'En negociación', 3),
  (4, 'Comprometido', 4),
  (5, 'Cerrado ganado', 5),
  (6, 'Cerrado perdido', 6)
ON CONFLICT (id_estado) DO NOTHING;

-- 3. Insertar lead activo de prueba para flujo comercial
INSERT INTO leads (id_lead, nombre, contacto, id_servicio, id_estado, fecha_creacion, ultima_actividad, es_cliente)
VALUES 
  ('8d8b67b1-2e6f-47d0-a35c-4f9cf9be8dfd', 'Carlos Gómez', '+5491155554444', 2, 1, NOW(), NOW(), false)
ON CONFLICT (id_lead) DO NOTHING;

-- 4. Insertar cliente listo para el Auto-Trigger de Recompra (Brasil > 180 días)
INSERT INTO leads (id_lead, nombre, contacto, id_servicio, id_estado, fecha_creacion, ultima_actividad, es_cliente, fecha_ultima_compra, cantidad_compras, valor_total_cliente)
VALUES 
  ('ef6e5891-b4d4-42b7-a37a-7bf3b9ca7511', 'Mariana Paz', '+5491188887777', 1, 5, NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', true, NOW() - INTERVAL '190 days', 1, 2500)
ON CONFLICT (id_lead) DO NOTHING;
```

---

## 🛠️ Herramientas de Diagnóstico en Consola de Navegador

Si querés probar o depurar peticiones y mapeos en caliente, podés pegar los siguientes fragmentos de código Javascript directamente en la pestaña **Console** de las herramientas de desarrollo de tu navegador (F12):

### 🔍 1. Simulación de Envío al Webhook de n8n
```javascript
fetch("https://gonzalocba.app.n8n.cloud/webhook/asistenteIA", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: "Test manual de conexión",
    lead: { name: "Cliente Test", destination: "Brasil", budget: "$1.000–$2.000" }
  })
})
.then(res => {
  console.log(`Estado Respuesta HTTP: ${res.status}`);
  return res.json();
})
.then(data => console.log("Respuesta recibida de n8n:", data))
.catch(err => console.error("Error en la conexión / CORS:", err));
```

### 🔍 2. Comprobación del Cliente Supabase Local
```javascript
// Verifica que la librería y el cliente de Supabase estén definidos y respondiendo
(async () => {
  try {
    const { data, error } = await window.__SUPABASE_CLIENT__
      .from('dim_servicios')
      .select('*')
      .limit(3);
    
    if (error) throw error;
    console.table(data);
  } catch (err) {
    console.error("No se pudo consultar Supabase desde la consola:", err.message);
  }
})();
```

---

> [!IMPORTANT]
> **Regla Crítica de Arquitectura (Restricción #1 y #4)**
> Recordá que toda lógica de decisión (cambio de estados, cálculo de prioridades, auto-trigger de recompras y CLV) debe residir única y exclusivamente en el backend (Supabase / SQL). El frontend de **LeadFlow** debe limitarse a visualizar los datos ya procesados y a despachar inputs transaccionales al servidor. Queda estrictamente prohibido recalcular estas lógicas en el código del cliente.

> [!TIP]
> **Paso Siguiente Recomendado**
> Para completar al 100% la hoja de ruta del MVP, se recomienda conectar el archivo de la landing page pública [landing.tsx](file:///h:/1%20EMPRESA%202/2-PROyecTOs/CURSOS/Curso%20Landing%20IA/webapp/app/lead-whisperer-51/src/routes/landing.tsx) con una consulta real de inserción (`INSERT INTO leads`) en Supabase, reemplazando el estado `submitted` mockeado por uno real para que los nuevos leads ingresen al pipeline directamente en tiempo real.
