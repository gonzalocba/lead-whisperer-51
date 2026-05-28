import { Lead } from "@/lib/mock-data";

export interface AICopilotAnalysis {
  objection: string;
  objectionDetail: string;
  recommendation: string;
  suggestedMessage: string;
}

/**
 * Lógica de inferencia táctica determinista.
 * Analiza el contexto comercial del lead y devuelve
 * objeción probable, detalle, recomendación y mensaje sugerido.
 */
export function inferAIAnalysis(lead: Lead): AICopilotAnalysis {
  const isStale = lead.daysInPipeline >= 3;
  const destination = lead.destination || "el viaje";
  const tripType = lead.tripType?.toLowerCase() || "";
  const name = lead.name;

  let objection = "Precio";
  let objectionDetail = `El presupuesto de ${
    lead.budget || "$1.000-$2.000 USD"
  } es muy ajustado para las comodidades que busca en ${destination}. Teme pagar de más.`;
  let recommendation =
    "Refuerzo valor + urgencia. Ofrecer desglose comparando hotel estándar vs todo incluido.";
  let suggestedMessage = `¡Hola ${name}! ¿Cómo estás? Estuve revisando opciones para tu viaje a ${destination}. Armé una opción que se ajusta súper bien a tu presupuesto, y otra premium con beneficios espectaculares. ¿Te gustaría que te las envíe por WhatsApp?`;

  if (
    tripType.includes("boda") ||
    tripType.includes("miel") ||
    tripType.includes("pareja") ||
    tripType.includes("romantico")
  ) {
    objection = "Precio Resort Premium";
    objectionDetail =
      "Al ser Luna de Miel, valora la calidad del hotel pero le asusta exceder el presupuesto. Teme que un hotel económico arruine la ocasión.";
    recommendation =
      "Refuerzo valor + anclaje emocional. Destacar All-Inclusive y detalles de cortesía para bodas.";
    suggestedMessage = `¡Hola ${name}! 👋 ¿Cómo va todo? Para tu Luna de Miel en ${destination} conseguí un paquete especial All-Inclusive con upgrade de habitación y atenciones de cortesía. ¡Sin gastos extra allá! ¿Te comparto la propuesta por WhatsApp?`;
  } else if (
    tripType.includes("familia") ||
    tripType.includes("niño") ||
    tripType.includes("hijo")
  ) {
    objection = "Disponibilidad Vuelo/Hotel";
    objectionDetail = `Viajar con la familia (${lead.passengers} pasajeros) requiere coordinación logística. Le preocupa no conseguir habitaciones contiguas y que los precios suban si demora.`;
    recommendation =
      "Garantizar disponibilidad + preventa. Pre-reserva bloqueando tarifas de grupo sin costo por 48h.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo están? Bloqueé provisoriamente cupos de avión y habitación familiar todo incluido para ${destination} para asegurar la tarifa de preventa. ¿Te envío los detalles?`;
  } else if (
    tripType.includes("corporativo") ||
    tripType.includes("trabajo") ||
    tripType.includes("negocio")
  ) {
    objection = "Flexibilidad de Fechas";
    objectionDetail =
      "El viaje corporativo requiere flexibilidad absoluta. Teme penalidades ante cancelaciones o reprogramaciones de último momento.";
    recommendation =
      "Tarifa flexible + seguro. Cotización con cambios ilimitados y seguro de asistencia total.";
    suggestedMessage = `Estimado ${name}, buenas tardes. Preparé el presupuesto para ${destination} con flexibilidad total de cambios y seguro completo. ¿Le envío la cotización formal por mail o un resumen por WhatsApp?`;
  } else if (tripType.includes("amigo") || tripType.includes("grupo")) {
    objection = "Consenso del Grupo";
    objectionDetail =
      "En viajes grupales es difícil acordar presupuesto. Le preocupa que la propuesta sea cara para algún integrante.";
    recommendation =
      "Desglose por persona + facilidades. Precio dividido por pasajero con opciones de pago.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo va? Diseñé una propuesta con precio excelente por persona y opciones de pago divididas para el viaje a ${destination}. ¿Te las comparto para el grupo de WhatsApp?`;
  }

  // Override por inactividad
  if (isStale) {
    objection = "Enfriamiento del Interés";
    objectionDetail =
      "Más de 3 días sin actividad en pipeline. Puede estar analizando competidores o postergando la decisión.";
    recommendation =
      "Pregunta abierta + gancho promocional. Reactivar con cupos de última hora o cierre inminente de preventa.";
    suggestedMessage = `¡Hola ${name}! ¿Cómo estás? Acaban de abrirse 2 cupos promocionales con vuelo directo a ${destination} en las fechas que consultaste. Las tarifas de preventa cierran mañana. ¿Seguís con planes de viajar?`;
  }

  return { objection, objectionDetail, recommendation, suggestedMessage };
}
