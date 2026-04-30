# Restricciones del Sistema — CRM Operativo Agencias de Viajes

---

## 🎯 Objetivo

Asegurar que la implementación respete la arquitectura definida y no degrade el sistema.

---

INIDICE:
## 🔴 1. LÓGICA DEL SISTEMA
## 🔴 2. MOTOR DE DECISIONES
## 🔴 3. MODELO DE DATOS
## 🔴 4. FRONTEND
## 🔴 5. BASE DE DATOS
## 🔴 6. MOCK VS REAL
## 🔴 7. ESCALABILIDAD
## 🔴 8. ANTIGRAVITY
## 🔴 9. PRINCIPIO GENERAL
## 🔴 10. OTRAS RESTRICCIONES


## 🔴 1. LÓGICA DEL SISTEMA

- Toda la lógica vive en backend (Supabase / SQL)
- NO implementar lógica en frontend
- El frontend solo visualiza y envía datos

---

## 🔴 2. MOTOR DE DECISIONES

Debe respetarse:

- resultado → estado
- resultado → próxima acción
- lógica de recompra
- lógica de CLV
- lógica de score (prioridad)

❌ No modificar estas reglas
❌ No simplificarlas

---

## 🔴 3. MODELO DE DATOS

- Respetar tablas definidas en modelo_db.md
- No eliminar relaciones
- No fusionar tablas sin justificación

❌ No crear estructura basada solo en UI

---
## 🔴 4. FRONTEND

- NO calcular:
  - estado
  - prioridad
  - próxima acción

- Solo consumir datos ya procesados

---

## 🔴 5. BASE DE DATOS

- Debe permitir:
  - múltiples acciones por lead
  - múltiples ciclos (recompra)
  - cálculo de CLV

❌ No simplificar a modelo plano

---

## 🔴 6. MOCK VS REAL

- Mock data debe reflejar estructura real
- No usar estructuras distintas

---

## 🔴 7. ESCALABILIDAD

- Sistema debe ser reutilizable (80/20)
- No hardcodear lógica por nicho

---

## 🔴 8. ANTIGRAVITY

- Antigravity NO define arquitectura
- Solo implementa lo definido

---

## 🔴 9. PRINCIPIO GENERAL

👉 El sistema es un motor de decisiones, no un CRUD
## 🔴 10.  OTRAS RESTRICCIONES

### Restricciones de producto

**No reemplazar al vendedor humano.** La plataforma asiste, sugiere y organiza. La decisión de qué decir, cuándo llamar y cómo cerrar es siempre del vendedor. El agente IA recomienda, no actúa. Esta restricción es también un argumento de venta: "no te reemplazamos, te potenciamos".

**No manejar pagos de los viajes.** La plataforma no procesa ni registra pagos de paquetes turísticos. El cierre económico ocurre fuera del sistema (transferencia, mercado pago, efectivo). El CRM registra el estado del lead, no la transacción financiera.

**No construir features no solicitadas por usuarios reales.** Antes de agregar cualquier funcionalidad nueva al roadmap, debe existir al menos un usuario real que la haya pedido explícitamente. El riesgo de sobre ingeniería es alto en productos construidos con vibe coding por la velocidad de generación.

### Restricciones técnicas

**No sobre-ingenierizar el multi-tenant en el MVP.** En la Etapa 1, la plataforma funciona para una sola agencia hardcodeada. El modelo será Single-Tenant (Instancia Individual por Agencia), la arquitectura es separada ya que cada agencia de viajes contratara su propia plataforma lo que vuelve la implementación mucho más limpia y segura por defecto para evitar mezcla de datos entre clientes

**No integrar WhatsApp Business API en el MVP.** El link `wa.me` con texto pre-cargado resuelve el problema de contexto sin fricción técnica. La API real de WhatsApp Business requiere aprobación de Meta, gestión de plantillas y complejidad de integración que no agrega valor hasta tener agencias pagando.

**No construir billing automatizado antes de tener 5 agencias pagantes.** El cobro manual en los primeros clientes es intencional. Permite iterar el precio, entender qué incluir en cada plan y validar la disposición a pagar sin invertir tiempo en infraestructura de pagos prematuramente.

**Prototipo completo, no añadir el stack técnico ni bases de datos supabase ya que primero quiero que sea netamente un prototipo.



### Restricciones de diseño

**No agregar campos al formulario de captación sin evidencia.** El quiz tiene 6 campos. Cada campo adicional reduce la tasa de conversión. Cualquier cambio al formulario requiere datos reales que justifiquen el trade-off.

**No hacer el panel complejo para "impresionar".** El usuario objetivo es un vendedor de agencia sin formación técnica. Cada feature que se agrega al CRM sin un caso de uso claro es una pantalla más que el usuario no entiende y que aumenta el churn.


## Resumen
restricciones producto
restricciones técnicas
restricciones base datos
restricciones diseño





