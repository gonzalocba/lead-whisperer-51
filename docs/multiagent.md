## MULTIAGENT ARCHITECTURE

PROPÓSITO
Este proyecto utiliza una arquitectura multiagente para dividir grupos de responsabilidades técnicas y asegurar:
•	separación clara de funciones
•	reducción de errores
•	trazabilidad
•	escalabilidad
•	replicabilidad para futuros verticales
La lógica central es simple:
Cada agente tiene un dominio específico y no debe intervenir fuera de su responsabilidad.
________________________________________
## Arquitectura para replicar agencias plantilla reusable:

AGENTE 1 → Rector

AGENTE 2 → UI/UX

AGENTE 3 → Conexión DB

AGENTE 4 → Desarrollo funcional

AGENTE 5 → QA

AGENTE 6 → Deploy

________________________________________
## PRINCIPIOS GENERALES
1. Separación estricta de responsabilidades
Cada agente opera únicamente dentro de su alcance.
Ejemplos:
•	agente UI no modifica backend
•	agente DB no rediseña pantallas
•	agente QA no implementa lógica
•	agente Deploy no modifica arquitectura funcional

2. Validación obligatoria por etapa
Después de cada intervención:
npm run dev
git status
git add .
git commit -m "descripcion"
git push
No avanzar sin validación.

3. Contexto compartido
Todos los agentes deben operar leyendo:
•	documento_maestro.md
•	implementation_plan.md
•	restricciones.md
•	skills_core.md
Y consumir documentación específica según tarea.
________________________________________

### AGENTES OFICIALES
________________________________________
## AGENTE 1 — RECTOR / CONTEXTO
Función
Coordinar consistencia global del proyecto.
Valida:
•	alineación con documento maestro
•	coherencia entre agentes
•	cumplimiento de restricciones
•	consistencia arquitectónica
Inputs
•	documento_maestro.md
•	implementation_plan.md
•	restricciones.md
Outputs
•	validaciones estratégicas
•	detección de inconsistencias
•	guía de fase
No debe
•	modificar código
•	implementar features
•	alterar UI

________________________________________
## AGENTE 2 — UI / UX
Función
Diseño visual y experiencia de usuario.
Responsable de:
•	layout
•	estructura visual
•	consistencia de pantallas
•	mejoras de usabilidad
Inputs
•	interfaz.md
•	documento_maestro.md
Outputs
•	componentes visuales
•	refinamientos UI
No debe
•	tocar backend
•	modificar queries
•	implementar auth
________________________________________
## AGENTE 3 — CONEXIÓN / BASE DE DATOS
Función
Conectar frontend con Supabase.
Responsable de:
•	integración Supabase
•	queries
•	migración mock data → real data
•	autenticación
•	RLS
•	policies
Inputs
•	modelo_db.md
•	prompts_conexion.md
•	skills_core.md
Outputs
•	tablas conectadas
•	auth funcional
•	seguridad configurada
No debe
•	rediseñar UI
•	alterar navegación visual
________________________________________
## AGENTE 4 — DESARROLLO FUNCIONAL
Función
Implementar lógica operativa del sistema.
Responsable de:
•	formularios
•	transiciones de estado
•	flujos de negocio
•	triggers funcionales
•	automatizaciones
Ejemplos:
•	registrar acción
•	actualizar pipeline
•	activar recompra
•	ejecutar reglas de negocio
Inputs
•	modelo_db.md
•	implementation_plan.md
Outputs
•	comportamiento operativo real
No debe
•	modificar diseño visual sin aprobación
________________________________________
## AGENTE 5 — QA / AUDITORÍA
Función
Auditar calidad técnica.
Valida:
•	errores
•	imports innecesarios
•	performance
•	consistencia
•	seguridad
•	cumplimiento documental
Outputs
•	reporte técnico
•	lista de correcciones
No debe
•	implementar lógica nueva
•	alterar estructura
________________________________________
## AGENTE 6 — DEPLOY / PRODUCCIÓN
Función
Preparar release productivo.
Responsable de:
•	Vercel
•	variables productivas
•	build
•	dominio
•	release final
Outputs
•	aplicación publicada
•	checklist producción
No debe
•	alterar lógica funcional
________________________________________
## ORDEN DE ACTIVACIÓN
1. Rector
↓
2. UI/UX
↓
3. Conexión DB
↓
4. Desarrollo Funcional
↓
5. QA
↓
6. Deploy
________________________________________
## REGLAS ENTRE AGENTES
UI
Puede modificar:
•	componentes
•	layout
•	experiencia visual
No puede modificar:
•	backend
•	seguridad
•	base de datos

DB
Puede modificar:
•	conexión
•	queries
•	auth
•	seguridad
No puede modificar:
•	diseño

Desarrollo Funcional
Puede modificar:
•	lógica funcional
•	flujos operativos
•	automatizaciones
Debe respetar:
•	UI existente
•	modelo_db.md
•	restricciones.md

QA
Solo audita.
No implementa.

Deploy
Solo publica y configura entorno.
No rediseña ni reestructura.
________________________________________
## WORKFLOW ESTÁNDAR
Para cualquier tarea:
1. Elegir agente correcto
↓
2. Enviar prompt específico
↓
3. Revisar resultado
↓
4. Validación local
npm run dev
↓
5. Verificación Git
git status
↓
6. Commit
git add .
git commit -m "descripcion"
git push
↓
7. Continuar
________________________________________
## ARQUITECTURA OPERATIVA
Problema de negocio
↓
Agente Rector
↓
Agente especializado
↓
Implementación
↓
Validación local
↓
Checkpoint Git
↓
QA
↓
Deploy
________________________________________
## OBJETIVO FINAL
Esta arquitectura debe ser reusable para futuros verticales:
•	agencias de viajes
•	concesionarias
•	inmobiliarias
•	educación
•	salud
•	servicios
________________________________________
## VISIÓN DE FRAMEWORK
Este sistema multiagente forma parte estructural del framework del proyecto.
No es documentación auxiliar.
Es una capa operativa obligatoria para asegurar:
•	consistencia
•	velocidad
•	control técnico
•	escalabilidad comercial

