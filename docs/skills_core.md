# 🧠 Core Skills — Sistema de Desarrollo SaaS (Antigravity)

Este conjunto de 6 *skills* constituye la base operativa para construir una webapp SaaS robusta, escalable y replicable (modelo 80/20) en el entorno de desarrollo con Antigravity.
Cada skill ataca un vector crítico de falla: datos, lógica, interacción, interfaz, calidad y escalabilidad.  
Su uso conjunto asegura consistencia técnica, evita errores estructurales y permite construir sistemas listos para escalar a múltiples agencias sin rehacer arquitectura.
---
# 🔥 CORE SKILLS OPERATIVOS

## 🧠 1. `supabase_connector`
## 🧠 2. `data_model_guard`
## 🧠 3. `form_handler_builder`
## 🧠 4. `ui_consistency_enforcer`
## 🧠 5. `frontend_qa_reviewer`
## 🧠 6. `white_label_architect`

---

## 🧠 1. `supabase_connector`

👉 Conecta frontend con la base de datos (Supabase)

### ✔️ HACER
- Usar cliente oficial de Supabase
- Implementar `fetch`, `insert`, `update`
- Respetar nombres exactos (`tabla.campo`)
- Centralizar acceso a datos (funciones reutilizables)

### ❌ NO HACER
- NO usar datos mock si existe conexión real
- NO inventar campos
- NO duplicar queries en múltiples componentes
- NO escribir lógica de negocio compleja en frontend

### ⚙️ IMPLEMENTACIÓN
- Crear instancia única de cliente Supabase
- Usar servicios o helpers para queries
- Manejar errores básicos (`try/catch`)

### 📌 EJEMPLO
Reemplazar datos mock en Lista Leads por query real a `leads`

---

## 🧠 2. `data_model_guard`

👉 Protege la integridad del modelo de datos

### ✔️ HACER
- Validar que todos los campos existan en el modelo
- Respetar relaciones FK (leads, acciones_dia, recompras)
- Usar IDs correctos (no strings sueltos)
- Validar tipos de datos antes de insertar

### ❌ NO HACER
- NO crear campos inexistentes
- NO modificar estructura del modelo sin autorización
- NO mezclar lógica de negocio en frontend
- NO romper relaciones entre tablas

### ⚙️ IMPLEMENTACIÓN
- Validar payload antes de enviar a Supabase
- Mapear datos UI → estructura DB
- Usar enums/IDs definidos en DIM

### 📌 EJEMPLO
Al crear acción:
usar `id_resultado` válido de `dim_resultado_accion`

---

## 🧠 3. `form_handler_builder`

👉 Construye formularios robustos y usables

### ✔️ HACER
- Validar inputs antes de enviar
- Manejar estados (`loading`, `error`, `success`)
- Normalizar datos (fechas, strings, nulls)
- Prevenir doble submit

### ❌ NO HACER
- NO enviar datos incompletos
- NO permitir múltiples submits simultáneos
- NO dejar errores sin feedback al usuario
- NO enviar null innecesarios

### ⚙️ IMPLEMENTACIÓN
- Usar estado local para formularios
- Deshabilitar botón en loading
- Mostrar mensajes claros de error

### 📌 EJEMPLO
Formulario de nueva acción:
validar `id_lead`, `id_tipo_accion`, `id_resultado`

---

## 🧠 4. `ui_consistency_enforcer`

👉 Mantiene coherencia visual y de interacción

### ✔️ HACER
- Reutilizar componentes existentes
- Mantener estructura visual actual
- Respetar jerarquía de información
- Mantener consistencia en tablas y botones

### ❌ NO HACER
- NO rediseñar UI existente
- NO cambiar estilos globales
- NO crear nuevos patrones visuales innecesarios
- NO romper consistencia entre pantallas

### ⚙️ IMPLEMENTACIÓN
- Usar mismos componentes de tabla
- Mantener layout existente
- Solo agregar nuevas vistas (sin modificar actuales)

### 📌 EJEMPLO
Pantalla Segmentos debe verse igual que Lista Leads (tabla full width)

---

## 🧠 5. `frontend_qa_reviewer`

👉 Detecta errores y asegura calidad del frontend

### ✔️ HACER
- Revisar errores en consola
- Validar flujos completos (no solo UI)
- Detectar renders innecesarios
- Verificar estados (loading, vacío, error)

### ❌ NO HACER
- NO dejar errores silenciosos
- NO asumir que funciona sin testear flujo
- NO ignorar warnings relevantes

### ⚙️ IMPLEMENTACIÓN
- Probar navegación completa
- Validar casos borde (sin datos, error API)
- Revisar performance básica

### 📌 EJEMPLO
Lista Leads:
verificar carga, vacío y error de conexión

---

## 🧠 6. `white_label_architect`

👉 Asegura que el sistema sea escalable y vendible (multi-agencia)

### ✔️ HACER
- Separar datos, lógica y branding
- Usar variables de entorno (.env)
- Mantener estructura adaptable
- Evitar dependencias rígidas

### ❌ NO HACER
- NO hardcodear nombres de agencia
- NO fijar textos específicos de negocio
- NO acoplar lógica a un solo cliente

### ⚙️ IMPLEMENTACIÓN
- Configurar variables para entorno
- Permitir personalización futura
- Mantener lógica genérica

### 📌 EJEMPLO
No usar “Agencia XYZ” en código → usar variable configurable

---

# 🧠 RESUMEN
- supabase_connector → conecta datos  
- data_model_guard → protege estructura  
- form_handler_builder → maneja inputs  
- ui_consistency_enforcer → mantiene UI  
- frontend_qa_reviewer → valida calidad  
- white_label_architect → permite escalar  

---

# 🔥 FRASE CLAVE

**“Estos skills no solo construyen el sistema, evitan que se rompa cuando escala.”**
