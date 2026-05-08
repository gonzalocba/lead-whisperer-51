


# SEGMENTOS DEL DÍA — DEFINICIÓN OPERATIVA MVP

## PROPÓSITO
La pantalla **Segmentos del día** representa la capa operativa del sistema.
No muestra etapas del pipeline directamente.

Transforma:
Pipeline + reglas de negocio + customer journey
en:
acciones concretas ejecutables por el vendedor.

---
# LÓGICA DEL SISTEMA
-
Pipeline interno
→ reglas condicionales
→ segmentos dinámicos
→ acción operativa
→ ejecución comercial

# ESTRUCTURA DE PANTALLA
Encabezado
Segmentos del día
Tu lista de tareas para hoy

## 1. PRIORIDAD ALTA
Resolver bloqueos inmediatos.

Leads sin respuesta
UI
Leads sin respuesta       Contactar 5   → Ver leads
Condicional SQL
id_estado = 2
AND ultima_actividad <= NOW() - INTERVAL '24 hours'
AND es_cliente = false
________________________________________
Follow-ups vencidos
UI
Follow-ups vencidos      Resolver 3    → Ver leads
Condicional SQL
proxima_accion_fecha < CURRENT_DATE
AND es_cliente = false
AND id_estado IN (2,3,4)
________________________________________
Clientes para recompra
UI
Clientes para recompra   Contactar 4   → Ver clientes
Condicional SQL
es_cliente = true
AND fecha_ultima_compra + dias_recompra_trigger <= CURRENT_DATE
AND activo_recompra = true
________________________________________

## 2. OPORTUNIDADES
Leads con alta probabilidad de conversión.
________________________________________
Leads en negociación
UI
Leads en negociación     Reactivar 6   → Ver leads
Condicional SQL
id_estado = 3
AND ultima_actividad <= NOW() - INTERVAL '48 hours'
________________________________________
Leads de alto valor
UI
Leads de alto valor      Contactar 3   → Ver leads
Condicional SQL
valor_estimado >= 3000
AND id_estado IN (2,3,4)
AND es_cliente = false
Si valor_estimado no existe aún, usar mock temporal.
________________________________________
Leads con alta intención
UI
Leads con alta intención Activar 4     → Ver leads
Condicional SQL
ultimo_resultado IN (
 'Solicita información',
 'Cotización enviada'
)
AND ultima_actividad >= NOW() - INTERVAL '48 hours'
________________________________________

## 3. ESCALA
Acciones masivas.
________________________________________
Lanzar recompra
UI
Lanzar recompra          Clientes 7    → Ver clientes
Condicional SQL
es_cliente = true
AND recompra_disponible = true
AND fecha_contacto_recompra IS NULL
________________________________________
Leads interesados Cancún
UI
Leads interesados Cancún Contactar 10 → Ver leads
Condicional SQL
id_servicio = CANCUN
AND id_estado IN (1,2)
En MVP puede estar hardcodeado.
________________________________________
Leads dormidos
UI
Leads dormidos           Reactivar 8   → Ver leads
Condicional SQL
ultima_actividad <= NOW() - INTERVAL '5 days'
AND id_estado IN (2,3)
AND es_cliente = false
________________________________________

# VISUAL FINAL
SEGMENTOS DEL DÍA
Tu lista de tareas para hoy

● PRIORIDAD ALTA
Leads sin respuesta        Contactar 5   → Ver leads
Follow-ups vencidos        Resolver 3    → Ver leads
Clientes para recompra     Contactar 4   → Ver clientes

● OPORTUNIDADES
Leads en negociación       Reactivar 6   → Ver leads
Leads de alto valor        Contactar 3   → Ver leads
Leads con alta intención   Activar 4     → Ver leads

● ESCALA
Lanzar recompra            Clientes 7    → Ver clientes
Leads interesados Cancún   Contactar 10  → Ver leads
Leads dormidos             Reactivar 8   → Ver leads
________________________________________

# COMPORTAMIENTO DEL CLICK
Cada fila debe redirigir filtrando automáticamente.
________________________________________
Ejemplo
Click:
Leads sin respuesta
Redirección:
/lista-leads?segmento=sin_respuesta
________________________________________
# REGLA DE IMPLEMENTACIÓN
Cada segmento debe componerse de:
consulta SQL
+
contador dinámico
+
redirección filtrada
________________________________________
# RESTRICCIÓN MVP
NO agregar:
•	automatizaciones reales
•	disparos WhatsApp
•	scoring IA complejo
•	predicción avanzada
Esta pantalla es exclusivamente:
segmentación operativa para ejecución comercial

