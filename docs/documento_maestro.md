# Documento Maestro del Proyecto
## SaaS de Captación y Seguimiento Comercial para Agencias de Viajes

> Versión 2.0 · Abril 2026  
> Stack: Lovable → GitHub → Antigravity · Base de datos: Supabase · IA: Anthropic Claude API  
> Fundador: [APPS IA] · Estado: Prototipo parcial en desarrollo

---

INDICE:
## 1. El Problema
## 2. La Solución
## 3. Usuario Objetivo
## 4. Propuesta de Valor
## 5. Funcionalidades por Módulo (MVP)
## 6. Stack Técnico
## 7. MODELO DE DATOS — CRM OPERATIVO AGENCIA DE VIAJES
## 8. Roadmap de Desarrollo
## 9. Modelo de Negocio
## 10. Fundamentos UI/UX
## 11. Go-To-Market
## 12. Análisis de Competencia
## 13. Métricas Clave (KPIs)
## 14. Notas del Fundador
## 15. Restricciones — Qué No Hacer


## 1. El Problema

Las agencias de viajes de paquetes turísticos (subnicho: Caribe y Brasil) no cuentan con un sistema comercial estructurado para captar y convertir leads provenientes de redes sociales.

Los problemas concretos detectados mediante investigación en perfiles de Instagram de agencias son:

**Captación sin enfoque comercial.** El link en bio lleva a un Linktree con links genéricos al home del sitio web, sin ningún call-to-action orientado a la venta. No hay un punto de entrada que eduque, segmente y enfoque al lead antes del primer contacto.

**Conversaciones desde cero.** Cuando el link lleva directo a WhatsApp, el vendedor recibe el contacto sin ningún contexto previo: no sabe el destino de interés, el presupuesto, la fecha estimada ni el tipo de viaje. La conversación se alarga buscando esa información básica antes de poder hacer una propuesta.

**Seguimiento sin sistema.** El avance del lead en el proceso de compra se registra, en el mejor caso, en una planilla de Excel. No existe visibilidad del estado de cada lead, ni de cuánto tiempo lleva en cada etapa, ni de qué acciones realizó el equipo.

**Sin aprendizaje comercial.** Las agencias no tienen forma de saber qué estrategias de venta funcionan, qué objeciones son más frecuentes ni qué vendedor tiene mejor tasa de conversión. Cada venta es un evento aislado sin retroalimentación sistémica.

**Recompra: estimular la recompra de nuevos productos con metricas temporales precisas
## Resumen
Agencias de viajes
sistema comercial
Captacion enfoque
Seguimiento
Aprendizaje comercial
Recompra

---

## 2. La Solución

Una plataforma SaaS que actúa como puente comercial entre el interés inicial del lead (redes sociales) y el cierre de la venta, estructurando todo el proceso en tres módulos integrados:

**Módulo 1 — Landing de captación.** Una página de aterrizaje propia para cada agencia que educa, segmenta y enfoca al lead mediante un quiz o formulario antes del primer contacto humano. El lead llega al vendedor con contexto completo.

**Módulo 2 — CRM Lite.** Un panel de seguimiento simple y funcional donde el equipo de ventas registra cada interacción, avanza el lead en el pipeline y tiene visibilidad total del estado comercial en tiempo real como asi tambien evalua segmentos de clientes segun diferentes estados

**Módulo 3 — Agente IA.** Un asistente que analiza el perfil del lead y el historial de acciones para sugerir estrategias comerciales, detectar objeciones y alertar cuando un lead lleva demasiado tiempo sin movimiento.

La plataforma no busca reemplazar al vendedor humano. Busca darle contexto, estructura y herramientas para que cierre más y mejor.

## Resumen
plataforma SaaS multi-tenan
landing captacion
CRM seguimiento lite
Agente IA analisis
Apoyo equipo ventas
---

## 3. Usuario Objetivo

### Cliente (quien paga)
Gerente comercial o de ventas de agencias de viajes medianas-pequeñas que venden paquetes turísticos a destinos como Caribe (Cancún, Punta Cana, Cuba) y destinos Brasil (Rio, Florianopolis, Maceio). Tiene entre 2 y 10 vendedores a cargo. Siente la presión de mejorar resultados pero no tiene tiempo ni presupuesto para implementar un CRM complejo.

**Perfil psicográfico del decisor:**
- Frustrado con el Excel pero no quiere aprender Salesforce
- Activo en Instagram, conoce el problema de la bio sin enfoque
- Toma decisiones rápido si ve valor concreto y precio accesible
- Valora lo simple, lo visual y lo que "funciona desde el día uno"

### Usuario (quien usa el día a día)
Vendedor de la agencia. Recibe leads por WhatsApp con contexto pre-cargado, registra sus acciones en el panel y consulta al agente IA cuando está trabado con un lead. No tiene formación técnica. Necesita que el sistema sea tan simple como usar Instagram.

### Lead (usuario final de la landing)
Persona de entre 25 y 50 años que vio contenido de la agencia en Instagram y tiene interés real en un viaje. Está en etapa de exploración o comparación. Completa el quiz en menos de 2 minutos desde el celular.

## Resumen
Cliente objetivo
perfil decisor compra
Usuario app
usuario lead
---

## 4. Propuesta de Valor

**Para el gerente comercial:**
> "Convertí tu Instagram en una máquina de leads calificados. Tus vendedores saben exactamente a quién llaman y qué decirles antes de marcar."

**Para el vendedor:**
> "Llegás a cada conversación con el destino, el presupuesto y la fecha ya cargados. Solo tenés que cerrar."

**Diferenciadores clave frente a la competencia:**

Dimensión
Excel / WhatsApp
CRM genérico (HubSpot)
Esta plataforma

[
  {
    "Dimensión": "Segmentación antes del contacto",
    "Excel / WhatsApp": "No",
    "CRM genérico (HubSpot)": "No",
    "Esta plataforma": "Sí, por quiz"
  },
  {
    "Dimensión": "Enfocado en turismo",
    "Excel / WhatsApp": "No",
    "CRM genérico (HubSpot)": "No",
    "Esta plataforma": "Sí"
  },
  {
    "Dimensión": "Precio accesible para agencias chicas",
    "Excel / WhatsApp": "Gratis pero ineficiente",
    "CRM genérico (HubSpot)": "Caro y complejo",
    "Esta plataforma": "Sí"
  },
  {
    "Dimensión": "Agente IA de ventas incluido",
    "Excel / WhatsApp": "No",
    "CRM genérico (HubSpot)": "No (costo extra)",
    "Esta plataforma": "Sí"
  },
  {
    "Dimensión": "Tiempo de implementación",
    "Excel / WhatsApp": "Inmediato (pero sin valor)",
    "CRM genérico (HubSpot)": "Semanas",
    "Esta plataforma": "1 día"
  }
]

## Resumen
cualificacion de leads
segmentacion interes
captacion de informacion
Agente IA analisis
Implementacion Agil
---



## 5. Funcionalidades por Módulo (MVP)

### Módulo 1 — Landing de captación
- URL propia por agencia: `agencia.plataforma.com`
- Dos versiones testables: formulario clásico (A) y quiz interactivo (B)

- Campos fijos del subnicho paquetes turísticos:
  - Destino de interés: Caribe / México / Ambos
  - Tipo de viaje: Luna de miel · Familia · Amigos · Corporativo
  - Cantidad de pasajeros
  - Fecha estimada de viaje
  - Presupuesto aproximado (rangos en USD)
  - Nombre completo y número de WhatsApp

- Al completar el formulario:
  - Lead se registra automáticamente en Supabase con estado "Nuevo"
  - Mensaje de WhatsApp pre-cargado se dispara al vendedor via link `wa.me`
  - El mensaje incluye resumen del quiz y link directo al perfil en el CRM

**Formato del mensaje WA al vendedor:**
```
Nuevo lead: [Nombre]
Destino: [Destino] · Tipo: [Tipo de viaje]
Pasajeros: [N] · Fecha: [Fecha estimada]
Presupuesto: [Rango USD]
Ver en CRM → [link perfil]
```
### Módulo 2 — CRM Lite

**Panel Dashboard (vista general):**
- metricas generales
- KPI's claves del negocio

**Panel de leads (vista lista):**
- Tabla con columnas: Nombre · Destino · Estado · Próxima acción · Prioridad · Acciones
- Contadores en header por etapa del pipeline
- Filtros: por estado, por vendedor asignado, por fecha de ingreso, por destino
- Búsqueda por nombre o destino

**Pipeline de 5 etapas:**
1. Nuevo — ingresó, sin contacto todavía
2. Contactado — primer contacto realizado
3. En negociación — cotización enviada o interés confirmado
4. Comprometido — señado o confirmación verbal
5. Cerrado ganado / Cerrado perdido

**Perfil del lead:**
- Datos del quiz (solo lectura, tal como los completó)
- Estado actual en pipeline con indicador visual
- Vendedor asignado
- Notas libres del vendedor
- Historial de acciones (tabla cronológica)

**Registro de acciones de venta:**
- Tipo de acción: WhatsApp · Llamada · Cotización enviada · Seguimiento · Reunión
- Resultado: Sin respuesta · Solicita información · Responde positivo · Objeción precio · Objeción fecha · Objeción indecisión · Cerrado ganado · Cerrado perdido
- Cambio de etapa (opcional en la misma acción)
- Nota libre (opcional)
- Fecha y hora automáticas

NOTA
aqui esta proyectado agregar trigger y registro de recompra, es decir una vez que el cliente compro un paquete establecer un rango temporal por paquete para automatizar alerta por accion de recompra, ejemplo viajo a playa del carmen en 9 meses se activa un trigger para iniciar prospeccion recompra


**Panel Segmentos:**
segmentacion de grupos de clientes segun estados en el pipeline

**Panel Recompra:**
accion sobre los clientes que han comprado en la agencia anteriormente y mediante un sistema de metrica temporal se establece nuevos gestionales comerciales para la venta de nuevos productos

### Módulo 3 — Agente IA Perfil
**Modo consultivo perfil lead (on-demand, MVP):**
- Botón "Analizar lead" en el perfil
- El agente recibe: datos del quiz + historial completo de acciones + notas del vendedor
- Devuelve en pantalla:
  - Diagnóstico de situación del lead
  - Objeciones detectadas con su tipo
  - Señales de interés identificadas
  - Estrategia recomendada para el próximo contacto con ejemplos concretos de mensaje

**Modo proactivo seccion alertas (automático, V1):**
- Alerta cuando hay 2+ acciones consecutivas con resultado "Sin respuesta"
- Alerta cuando el lead lleva más de 7 días en la misma etapa sin movimiento
- Las alertas aparecen en el panel con indicador visual y acceso directo al análisis

### Módulo 4 — Agente IA Comercial
Tiene como tarea un analisis general donde analiza 
cantidad leads
tasa de cierre, 
dias promedio de cierre,
analisis de recompra 

## Resumen
Landing de captacion
CRM seguimiento
Agente IA analisis perfil
Agente IA analisis comercial

---
## 6. Stack Técnico

### Frontend
- **Lovable** — desarrollo visual con React 
- Diseño minimalista y funcional, mobile-first
- Componentes: shadcn/ui como base

### Backend y base de datos
- **Supabase** — PostgreSQL gestionado
- Supabase Auth para autenticación por agencia
- Row Level Security (RLS) para aislamiento multi-tenant
- Supabase Storage para logos de agencias (v1)

### Integraciones externas
- **Anthropic Claude API** — modelo `claude-sonnet` para el agente IA
- **WhatsApp** — link `wa.me` con texto pre-cargado (MVP) → WhatsApp Business API (v2)

### Deploy
- **GitHub** — repositorio del proyecto generado desde Lovable
- **Antigravity** — deploy de producción desde el repositorio GitHub
- **Vercel** — deploy publico

### Herramientas de desarrollo
- Lovable para vibe coding iterativo
- Supabase Studio para gestión directa de base de datos
- GitHub para control de versiones entre iteraciones
- Antigravity desarrollo final app
- Vercel deploy 

## Resumen
frontend
backend
integraciones herramientas externas
deploy
herramientas desarrollo---

## 7. MODELO DE DATOS — CRM OPERATIVO AGENCIA DE VIAJES

La base de datos esta soportada por supabase actuando como backend
Verificar modelo y relaciones en /docs archivo modelo_db.md

## 8. Roadmap de Desarrollo

### Etapa 0 — Fundación (semana 1)
Preparar la infraestructura antes de tocar Lovable.

- [ ] Agregar tablas `agencias` y `usuarios` en Supabase
- [ ] Agregar columnas del quiz en tabla `lead`
- [ ] Configurar RLS básico
- [ ] Crear agencia de prueba en la base de datos
- [ ] Configurar proyecto en Lovable con conexión a Supabase

### Etapa 1 — MVP CRM (semanas 2–3)
Validar el flujo interno con una agencia piloto real.

- [ ] Panel listado de leads con filtros y contadores por etapa
- [ ] Perfil del lead con datos del quiz + historial de acciones
- [ ] Modal de nueva acción (tipo + resultado + cambio de etapa + nota)
- [ ] Auth básico: login de la agencia piloto
- [ ] Deploy en Antigravity

**Criterio de éxito:** la agencia piloto usa el panel durante 2 semanas y registra todas sus acciones ahí.

### Etapa 2 — Landing de captación (semana 4)
Conectar el tráfico externo con el CRM.

- [ ] Landing pública con formulario clásico (versión A)
- [ ] Registro automático del lead en Supabase al enviar
- [ ] Disparo del link `wa.me` con resumen pre-cargado
- [ ] Página de confirmación post-formulario
- [ ] Test end-to-end: Instagram bio → formulario → CRM → WA vendedor

**Criterio de éxito:** los primeros leads reales entran por la landing y aparecen en el CRM sin carga manual.

### Etapa 3 — Agente IA + quiz (semanas 5–6)
Agregar inteligencia y optimizar la captación.

- [ ] Integración Claude API en perfil del lead (botón "Analizar")
- [ ] Guardar análisis en tabla `ia_analisis`
- [ ] Landing versión B: quiz interactivo paso a paso
- [ ] A/B test visual entre versión A y B
- [ ] Panel de métricas básicas (tasa de cierre, tiempo en pipeline)

**Criterio de éxito:** el vendedor consulta el agente IA al menos 1 vez por semana por lead.

### Etapa 4 — Multi-tenant y escala (semanas 7–9)
Escalar a 3–5 agencias pagantes.

- [ ] Onboarding de nueva agencia (admin crea agencia + usuario)
- [ ] Subdominio dinámico por agencia
- [ ] Configuración de perfil de agencia (logo, nombre)
- [ ] Multi-vendedor: asignación de leads por vendedor
- [ ] Alertas proactivas del agente IA (sin respuesta 2+ acciones, +7 días sin movimiento)

**Criterio de éxito:** 3 agencias activas con al menos 1 mes de uso pagante.

### Etapa 5 — Monetización y próximo nicho (semanas 10–16)
Sistema completo, replicable a concesionarias e inmobiliarias.

- [ ] Billing automatizado (Stripe o Mercado Pago)
- [ ] Onboarding self-service (agencia se registra sola)
- [ ] Panel de insights agregados por agencia (objeciones frecuentes, estrategias que cierran)
- [ ] WhatsApp Business API (mensajes automatizados reales)
- [ ] Adaptación del quiz para nicho concesionarias (campos: modelo, presupuesto, financiación)
- [ ] Adaptación del quiz para nicho inmobiliarias (campos: tipo propiedad, zona, financiación)


## Resumen
fundacion problema-solucion
landing captacion
CRM
analisis agente IA
onboarding cliente
monetizacion
---


## 9. Modelo de Negocio

### Propuesta de precio

Plan
Target
Precio
Incluye

[
  {
    "Plan": "Piloto",
    "Target": "1ª agencia (validación)",
    "Precio": "$0",
    "Incluye": "Todo el MVP, soporte directo"
  },
  {
    "Plan": "Starter",
    "Target": "Agencias 1–10",
    "Precio": "$45 USD/mes",
    "Incluye": "Landing + CRM + IA básica"
  },
  {
    "Plan": "Pro (v2)",
    "Target": "Agencias 10+",
    "Precio": "$75 USD/mes",
    "Incluye": "Todo + alertas proactivas + insights agregados"
  }
]

El precio se cobra manualmente en las primeras 10 agencias (transferencia o Mercado Pago). Billing automatizado entra en Etapa 5.

### Estructura de costos variables

Costo
Estimacion

[
  {
    "Costo": "Supabase",
    "Estimación": "Free tier hasta ~500 usuarios activos"
  },
  {
    "Costo": "Lovable",
    "Estimación": "Plan según uso durante desarrollo"
  },
  {
    "Costo": "Claude API (IA)",
    "Estimación": "~$0.003 por análisis · 100 análisis/mes/agencia = $0.30/agencia/mes"
  },
  {
    "Costo": "Antigravity",
    "Estimación": "Costo fijo de hosting"
  }
]


Setup Inicial
Con 10 agencias a $700 USD, 
ingreso único por setuo inicial $7000 USD
Con 10 agencias a $50 USD, 
ingreso mantenimiento mensual es $500 USD con costo IA de $3 totales.

### Proyección MRR objetivo

Etapa
Agencias
MRR (Monthly Recurring Revenue)

[
  {
    "Etapa": "MVP validado",
    "Agencias": "1 piloto",
    "MRR": "$0"
  },
  {
    "Etapa": "V1 lanzamiento",
    "Agencias": "5 agencias",
    "MRR": "$225 USD"
  },
  {
    "Etapa": "V1 consolidado",
    "Agencias": "15 agencias",
    "MRR": "$675 USD"
  },
  {
    "Etapa": "V2 con nuevos nichos",
    "Agencias": "40 agencias",
    "MRR": "$3.000 USD"
  }
]
---

## 10. Fundamentos UI/UX

### Principios de diseño

**Minimalista y funcional.** Cada pantalla tiene un único objetivo. No hay elementos decorativos que no cumplan una función. Si algo no ayuda al vendedor a cerrar, no está.

**Mobile-first.** El vendedor usa el panel desde el celular durante o después de una llamada. Cada interacción tiene que funcionar perfectamente en pantalla de 390px.

**Cero fricción en el flujo crítico.** El camino "ver lead → registrar acción → avanzar etapa" debe completarse en menos de 3 toques. Es el flujo que se usa 10 veces por día.

**Feedback visual inmediato.** Cada acción del usuario tiene confirmación visual instantánea (toast, cambio de color, contador actualizado). El vendedor nunca duda si guardó algo.

### Paleta y estética

- Fondo neutro claro (blanco/gris muy suave)
- Tipografía sans-serif, peso regular para cuerpo y medium para énfasis
- Colores de estado en el pipeline: escala de grises a verde (de Nuevo a Cerrado ganado), rojo para Perdido
- Sin gradientes, sin sombras pesadas, sin animaciones decorativas
- Referencia estética: Linear, Notion, Raycast

### Pantallas principales del MVP

1. **Login** — campo email + contraseña, logo de la agencia
3. **Dashboard Metricas** — dashboard inicial va a tener cantidad de leads, tasa de cierre, dias promedio cierre, analisis IA general
2. **Segmentos** — segmentos de clientes establecidos por filtros de estados
2. **Lista Leads / Detalle leads** — tabla con filtros, contadores por etapa
3. **Perfil  lead** — datos del quiz, estado, historial, botón nueva acción, botón analizar IA
4. **Recompra** — clientes que ya compraron en la agencia por medio de metricas especificas se activan alertas para ofrecer nuevos productos despues de un cierto tiempo
6. **Página de análisis IA** — diagnóstico, objeciones, señales de interés, estrategia sugerida
5. **Landing pública** — formulario/quiz, sin nav, foco total en la conversión

## Resumen
principios diseño
paleta colores (2 a 3)
pantallas MVP

---
## 11. Go-To-Market

### Estrategia para las primeras 5 agencias

El canal más eficiente en la etapa de validación es el contacto directo y manual. No escala, pero enseña más que cualquier campaña.

**Paso 1 — Identificar agencias target en Instagram.**
Buscar agencias que publican contenido de Caribe y México, tienen entre 1.000 y 50.000 seguidores, y usan Linktree o llevan a WhatsApp directo sin segmentación. Esas son las que tienen el problema exacto.

**Paso 2 — Contacto por DM con diagnóstico gratuito.**
Enviar un mensaje personalizado que muestre el problema específico de esa agencia ("vi que tu link en bio lleva directo a WhatsApp sin capturar info del lead") y ofrecer una demo en 20 minutos. No vender la plataforma, vender la conversación.

**Paso 3 — Demo centrada en el dolor, no en las features.**
Mostrar el flujo completo: lead entra por Instagram → quiz → vendedor recibe WA con contexto → CRM muestra el perfil completo. El pitch es "así llega el próximo lead a tu vendedor" no "mirá todas las funciones que tiene".

**Paso 4 — Piloto gratuito de 30 días.**
La primera agencia que diga sí entra gratis a cambio de feedback semanal y permiso para usar el caso como referencia. El objetivo no es cobrar, es validar que usan el sistema todos los días.

**Paso 5 — Caso de éxito como herramienta de venta.**
Con datos reales del piloto (cuántos leads, tasa de cierre, tiempo ahorrado), construir el primer caso de uso y usarlo para conseguir las siguientes 4 agencias.

### Canal a explorar en V1
Una vez validado el producto, evaluar contenido educativo en LinkedIn dirigido a gerentes comerciales de agencias, mostrando el problema de las landingpages genéricas con datos reales del sector.

## Resumen
busqueda target
contacto en frio
piloto de prueba
caso exito

---

## 12. Análisis de Competencia

### Competidores directos
No existe actualmente un CRM específico para agencias de viajes pequeñas en mercados de habla hispana con captación integrada desde redes sociales. Ese es el espacio en blanco.

### Competidores indirectos

**Excel / Google Sheets**
Lo que usan hoy la mayoría. Es gratuito y flexible, pero no captura leads automáticamente, no tiene pipeline visual, no envía alertas, no integra IA y requiere carga manual de todo. La principal barrera para reemplazarlo es el hábito, no la funcionalidad.

**HubSpot CRM (free tier)**
Potente pero genérico. No tiene landing de captación integrada orientada a turismo, no tiene campos relevantes para el sector (destino, tipo de viaje, presupuesto de paquete), y la curva de aprendizaje es alta para un equipo sin formación técnica. El gerente lo prueba, lo ve complejo y vuelve al Excel.

**CRMs genéricos latinoamericanos (Kommo, Bitrix24)**
Más accesibles en precio, pero igualmente genéricos. Ninguno tiene el concepto de "landing de captación + segmentación + CRM + IA" como flujo integrado orientado a un nicho específico.

### Ventaja competitiva sostenible
La combinación de nicho específico (turismo de paquetes) + captación integrada + IA comercial orientada a objeciones de viaje es difícil de replicar rápido por un CRM genérico grande. El CORE no es la tecnología, es el conocimiento del proceso de venta específico del sector.

## Resumen
competencia directa
competencia indirecta
ofertas multiclientes 
ventaja competitiva

---

## 13. Métricas Clave (KPIs)

### KPIs del producto (por agencia)

**Tasa de cierre**
Leads cerrados ganados / total de leads ingresados en el período. Indica la efectividad comercial del equipo usando el sistema. Meta inicial: visibilidad (conocer el número). Meta V1: mejora del 15% vs período sin sistema.

**Tiempo promedio en pipeline**
Días promedio desde que el lead entra como "Nuevo" hasta "Cerrado ganado" o "Cerrado perdido". Indica velocidad de conversión. Un tiempo alto sugiere leads sin seguimiento o proceso atascado.

**Tasa de conversión landing → lead registrado**
Visitantes únicos de la landing / leads que completan el formulario. Indicador de efectividad de la captación. Meta: >25% de conversión.

### KPIs del negocio SaaS

**MRR (Monthly Recurring Revenue)**
Ingresos recurrentes mensuales totales de todas las agencias activas. Métrica principal de salud del negocio.

**Churn mensual**
Porcentaje de agencias que cancelan en un mes. Meta: menos del 5% mensual.

**Tiempo hasta primer valor (Time to Value)**
Días desde que una agencia se registra hasta que registra su primer lead en el sistema. Meta: menos de 24 horas.

### KPIs de uso del agente IA

**Análisis por lead activo**
Cuántas veces por semana los vendedores consultan el agente IA. Indica adopción real del módulo.

**Correlación análisis IA → cierre**
Leads donde se usó el análisis IA vs tasa de cierre de esos leads comparada con los que no lo usaron. Es el KPI de valor del módulo IA a largo plazo.

## Resumen
KPI del producto
KPI SaaS
KPI Agente IA
---


## 14. Notas del Fundador

Esta plataforma nace de una observación de campo real, no de una suposición. El problema fue detectado revisando perfiles reales de agencias en Instagram con metodología Comet. Eso es una ventaja enorme frente a productos que se construyen desde el escritorio.

El riesgo principal no es técnico. Lovable + Supabase + Claude API resuelven el 100% de lo que el MVP necesita. El riesgo real es de adopción: conseguir que el equipo de ventas de una agencia pequeña cambie su hábito de Excel/WhatsApp y use el sistema todos los días. Por eso el MVP debe ser tan simple que el vendedor lo entienda en 5 minutos sin ninguna capacitación.

La estrategia de nicho-first es correcta. Agencias de viajes de paquetes es un subnicho suficientemente específico para que el producto se sienta hecho a medida, y suficientemente grande para validar el modelo antes de escalar. El core de captación + CRM + IA es el mismo para concesionarias e inmobiliarias. Lo que cambia entre nichos son los campos del quiz y las objeciones típicas del agente IA.

No apresurarse a cobrar. La primera agencia tiene que enamorarse del producto antes de que aparezca una factura. Un piloto gratuito bien ejecutado vale más que diez ventas presionadas que churnan al mes.

## Resumen
acciones a seguir
estrategia comercial 

---

## 15. Restricciones — Qué No Hacer

Remitirse en /docs al documento restricciones_sistema.md

---

*Documento vivo — actualizar con cada iteración del producto.*  
*Versión 2.0 · Generado en abril 2026*
