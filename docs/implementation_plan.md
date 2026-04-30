# Plan de Implementación — SaaS CRM Comercial para Agencias de Viajes

---

## 🎯 Objetivo del Plan

Este plan define las etapas para construir un prototipo funcional (frontend-first validado) del sistema SaaS de captación y seguimiento comercial.

El objetivo es:
- Validar flujo completo: captación → CRM → acción
- Simular comportamiento real sin dependencia inicial de base de datos
- Minimizar fricción al pasar a Supabase en etapas posteriores
- Servir como contexto estructurado para Antigravity

---

## 🧠 Uso del Plan
Este documento será utilizado dentro de Antigravity como:

- Contexto de implementación
- Guía de construcción del sistema
- Referencia para mantener coherencia con el modelo definido

⚠️ Importante:
- La lógica ya está definida en el documento maestro
- Este plan NO redefine lógica, solo ejecuta

## Resumen
Objetivo
Uso del plan
Importante logica documento maestro

---

# 🧭 FASE 1 — ESTRUCTURA DE DATOS SIMULADOS (MOCK DATA)

Antes de construir UI, definir datos ficticios que simulen la base real.

## Objetivo
Simular Supabase sin conectarlo aun, asegurando coherencia futura y evitando fricciones

## Revisar tablas FACT y DIM en modelo_db.md
---

## Resumen
Datos ficticios simulacion modelo base



# 🔐 FASE 2 — AUTENTICACIÓN (SIMULADA)

## Objetivo
Simular acceso por agencia sin backend real.

## Implementar:
- Pantalla login simple
- Input email + password
- Acceso mock (hardcodeado)

---

# 🧩 FASE 3 — MÓDULO 2: CRM LITE (CORE DEL SISTEMA)

## 🎯 Objetivo
Validar el flujo principal del sistema comercial.

Verificar el archivo interfaz.md donde se establecen las pantallas de la aplicación y sus funciones


---

# 🌐 FASE 4 — MÓDULO 1: LANDING DE CAPTACIÓN

## 🎯 Objetivo
Simular entrada de leads desde Instagram.

---
## 🧾 Landing
- propuesta clara
- sin navegación
- foco conversión

---
## 📝 Formulario
Campos:
- destino
- tipo viaje
- pasajeros
- fecha
- presupuesto
- nombre
- WhatsApp

---
## 🧠 Quiz (simulación)
- pasos secuenciales tipo Google Forms
- UX simple mobile-first

---

## 🔁 Output
Simular:
- creación de lead
- redirección a WhatsApp (link wa.me)

---
## Resumen
proceso captacion leads


# 🤖 FASE 5 — MÓDULO 3: AGENTE IA ANÁLISIS

## 🎯 Objetivo
Simular capa de inteligencia comercial

---
## Botón: "Analizar Lead"
Mostrar:
- diagnóstico
- objeciones
- señales de interés
- sugerencia de acción

---
## ⚠️ Importante
- No conectar API real
- Simular respuesta IA

## Resumen
capa IA inteligencia comercial

---
# ⚙️ FASE 6 — INTEGRACIÓN CON ANTIGRAVITY

## Objetivo
Usar Antigravity para:
- interpretar el proyecto
- estructurar componentes
- preparar integración backend futura

---
## Acciones
- importar repo desde GitHub
- cargar documento maestro
- cargar este plan
- validar consistencia

## Resumen
integracion antigravity

---

# 🗄️ FASE 7 — TRANSICIÓN A BASE DE DATOS (SUPABASE)

## 🎯 Objetivo
Reemplazar mock data por datos reales

---
## Implementar:
- tablas reales (leads, acciones, dimensiones)
- relaciones
- lógica SQL:
  - estado
  - próxima acción

---
## ⚠️ Regla clave
NO modificar estructura definida en modelo original

## Resumen
transicion modelo data a supabase
evitar fricciones

---
# 🔌 FASE 8 — CONEXIÓN FRONTEND + BACKEND

## Objetivo
Conectar UI con Supabase

---
## Acciones
- reemplazar mocks
- consumir datos reales
- validar flujo completo

## Resumen
conexion front y back

---
# 🚀 FASE 9 — DEPLOY

## Objetivo
Publicar MVP funcional

---
## Acciones
- deploy en Antigravity / Vercel
- test mobile
- test flujo completo

## Resumen
plan deploy

---

# 🔁 FASE 10 — ITERACIÓN

## Objetivo
Mejorar producto con uso real
---
## Ajustes
- UI
- lógica
- agente IA
- métricas

## Resumen
iteracion mejora producto

---

# 🔥 PRINCIPIO FINAL

Este sistema no es solo visual.

👉 Es un motor de decisiones comerciales.
La UI simula.
La DB ejecuta.
La lógica define todo.

## Resumen
sistema MVP agencias viajes
---
