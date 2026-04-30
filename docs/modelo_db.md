MODELO DE DATOS — CRM OPERATIVO AGENCIA DE VIAJES

## 🧱 FACT

### TABLA: leads
id_lead (uuid)  
nombre  
contacto  
fecha_creacion  
ultima_actividad  
proxima_accion_fecha  
--
id_servicio  
id_estado  
id_vendedor  

-- cierre  
fecha_cierre  
es_cliente (boolean)  

-- CLV base  
fecha_ultima_compra  
cantidad_compras  
valor_total_cliente (opcional)  

---
### TABLA: acciones_dia
id_accion (uuid)  
id_lead  
id_tipo_accion  
id_resultado  
fecha_accion  
proxima_accion_fecha
descripcion  

---
### TABLA: recompras
id_recompra (uuid)  
id_lead  
id_servicio  
id_tipo_accion  

fecha_trigger  
fecha_contacto  
fecha_resultado  

id_estado_recompra  
id_resultado_recompra  

proxima_accion_fecha  

origen (manual|automatico)
activo (boolean)  
observaciones  

---
## 🧩 DIMENSIONES

### dim_estado_pipeline (VENTA)
id_estado  
nombre  
orden  

Valores:
1 nuevo  
2 contactado  
3 seguimiento  
4 cerrado  
5 perdido  

---
### dim_estado_recompra
id_estado_recompra  
nombre  
orden  

Valores:
1 pendiente  
2 contactado  
3 en_seguimiento  
4 convertido  
5 descartado  

---
### dim_tipo_accion
id_tipo_accion  
nombre  

Valores:
1 Llamada  
2 WhatsApp  
3 Email  
4 Cotización enviada  
5 Seguimiento  

---
### dim_resultado_accion (VENTA)
id_resultado  
nombre  
id_estado_pipeline_sugerido
dias_proxima_accion  



Valores:
1 No responde → contactado (1 día)  
2 Responde → contactado (2 días)  
3 Interesado → seguimiento (1 día)  
4 Solicita información → contactado (1 día)  
5 Cotización enviada → seguimiento (2 días)  
6 En análisis → seguimiento (3 días)  
7 Rechazado → perdido  
8 Cerrado ganado → cerrado  ---

### dim_resultado_recompra
id_resultado_recompra  
nombre  
id_estado_recompra_sugerido  
dias_proxima_accion  

Valores:
1 Recompra interesado → en_seguimiento (1 día)  
2 Recompra no interesado → en_seguimiento (7 días)  
3 Recompra cerrado ganado → convertido  
4 Sin respuesta → pendiente (3 días)  

---
### dim_servicios
id_servicio  
nombre  
dias_recompra_trigger  

Ejemplos:
Brasil → 180 días  
Caribe → 365 días  

---
### dim_vendedor
id_vendedor  
nombre  
email  

---
## 🔗 RELACIONES

### Venta
- leads.id_lead → acciones_dia.id_lead 
- leads.id_servicio → dim_servicios.id_servicio
- leads.id_vendedor → dim_vendedor.id_vendedor 
- leads.id_estado → dim_estado_pipeline.id_estado  
- acciones_dia.id_resultado → dim_resultado_accion.id_resultado  
- acciones_dia.id_tipo_accion → dim_tipo_accion.id_tipo_accion  
- dim_resultado_accion.id_estado_pipeline_sugerido → dim_estado_pipeline.id_estado  
---

### Recompra
- leads.id_lead → recompras.id_lead  
- recompras.id_servicio → dim_servicios.id_servicio  
- recompras.id_estado_recompra → dim_estado_recompra.id_estado_recompra  
- recompras.id_resultado_recompra → dim_resultado_recompra.id_resultado_recompra  
- recompras.id_tipo_accion → dim_tipo_accion.id_tipo_accion  
- dim_resultado_recompra.id_estado_recompra_sugerido → dim_estado_recompra.id_estado_recompra  

---
## ⚙️ LÓGICA SOPORTADA

### 🔷 Trigger de recompra
Si:
- leads.es_cliente = true  
- hoy >= fecha_ultima_compra + dias_recompra_trigger  

(donde dias_recompra_trigger proviene de dim_servicios)

→ crear registro en recompras  

---
### 🔷 Flujo de recompra
pendiente → contactado → seguimiento → convertido / descartado  

---
### 🔷 Impacto en leads
Si recompra convertida:
- cantidad_compras + 1  
- fecha_ultima_compra = hoy  

---
### 🔷 Regla de integridad
Solo puede existir UNA recompra activa por lead  

---
## ✅ FIN
