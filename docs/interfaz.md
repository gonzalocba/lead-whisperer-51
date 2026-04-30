# 🖥️ ESTRUCTURA DE PANTALLAS — CRM OPERATIVO

---

## 🎯 OBJETIVO

Definir las 4 pantallas principales del sistema para:

- gestión comercial
- seguimiento de leads
- toma de decisiones
- análisis con IA

---

# 🧭 1. PANTALLA: DASHBOARD

## 🔷 Cabecera
- Saludo: "Hola, {nombre_vendedor}"
- Mensaje motivacional (Agente IA)
- Fecha actual

---

## 🔷 KPIs — Estado del Pipeline

Estados:

1. nuevo  
2. contactar  
3. evaluar_propuesta  
4. seguimiento  
5. cerrado  
6. perdido  
7. recompra (opcional)

---

## 🔷 Gráfico Principal
- Cerrados vs Perdidos
- Análisis temporal (por día / semana / mes)

---

## 🔷 Gráficos Secundarios

- Días promedio de cierre  
- Destinos más consultados  

---

## 🔷 Bloque IA (Resumen General)
- Análisis global del pipeline
- Insights automáticos
- Alertas comerciales

---

## 🔷 Menú Lateral

- Dashboard  
- Lista Leads  
- Detalle Lead  
- Documentación  
- Análisis IA General  
- Logout  

---

# 📋 2. PANTALLA: SEGMENTO LEADS

## 🔷 Segmentos
- Segmentos por prioridad segun estado pipeline
- Sub segmentos segun estado pipeline

---

## 🔷 Acceso a lista
- Desde cada sub segmento se accede a lista de leads

---

## 🔷 Acceso a lead
- Desde lista se accede a cada lead en particular

---

# 📋 3. PANTALLA: LISTA DE LEADS

---

## 🔷 2.1 Filtros

- Botones por estado del pipeline  
- Selector de estado  
- Selector de días en embudo  
- Búsqueda por nombre  

---



## 🔷 2.2 Tabla de Leads

Columnas:

- Nombre  
- Destino  
- Estado  
- Días en embudo  

---

# 👤 4. PANTALLA: DETALLE LEAD

---

## 🔷 3.1 Búsqueda
- Buscador por nombre

---

## 🔷 3.2 Encabezado Lead
- Nombre: Ana Martínez  
- Producto: Cancún — Luna de miel  

---

## 🔷 3.3 Ficha del Lead

Datos:

- WhatsApp  
- Destino  
- Tipo de viaje  
- Pasajeros  
- Fecha estimada  
- Presupuesto  

---

## 🔷 3.4 Estado en Pipeline

Visualización tipo recorrido lineal:

1. Nuevo  
2. Contactado  
3. En negociación  
4. Comprometido  
5. Cerrado ganado  

---

## 🔷 3.5 Análisis IA (Lead)

Bloques:

- Diagnóstico  
- Objeciones detectadas  
- Señales de interés  
- Estrategia recomendada  
- Mensaje sugerido segun customer journey 

---

## 🔷 3.6 Historial de Acciones

Tabla:

- Fecha  
- Tipo  
- Resultado  
- Nota  
---

# 🤖 5. PANTALLA: ANÁLISIS IA GLOBAL

---

## 🔷 Objetivo

Analizar comportamiento general del sistema comercial

---

## 🔷 Bloques

### 📦 Patrones de oferta
- Productos más vendidos
- Tendencias por destino

---

### ⚠️ Objeciones generales
- Problemas recurrentes
- Fricción en el proceso de venta

---

### 📈 Recomendaciones

- Acciones sugeridas a nivel global  
- Ajustes en estrategia comercial  
- Optimización del pipeline  
---

# 🧠 NOTAS GENERALES

- Todas las pantallas deben usar datos simulados (mock) en fase inicial  
- No implementar lógica en frontend  
- El frontend solo visualiza datos del modelo  
- La lógica vive en backend (Supabase)

---

# 🔥 PRINCIPIO

👉 El sistema no solo muestra datos  
👉 El sistema guía decisiones comerciales
