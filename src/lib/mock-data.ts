export type LeadStatus =
  | "Nuevo"
  | "Contactado"
  | "En negociación"
  | "Comprometido"
  | "Cerrado ganado"
  | "Cerrado perdido"
  | "Recompra";

export interface Lead {
  id: string;
  name: string;
  destination: string;
  status: LeadStatus;
  daysInPipeline: number;
  whatsapp: string;
  tripType: string;
  passengers: number;
  estimatedDate: string;
  budget: string;
  assignedTo: string;
}

export const leads: Lead[] = [
  { id: "1", name: "Ana Martínez", destination: "Cancún", status: "Nuevo", daysInPipeline: 1, whatsapp: "+54 9 11 4523-7890", tripType: "Luna de miel", passengers: 2, estimatedDate: "Agosto 2026", budget: "$1.000–$2.000 USD", assignedTo: "Laura García" },
  { id: "2", name: "Carlos Pérez", destination: "Punta Cana", status: "Contactado", daysInPipeline: 4, whatsapp: "+54 9 11 5555-1010", tripType: "Familia", passengers: 4, estimatedDate: "Diciembre 2026", budget: "$2.000+ USD", assignedTo: "Laura García" },
  { id: "3", name: "Valentina Sosa", destination: "Caribe", status: "En negociación", daysInPipeline: 7, whatsapp: "+54 9 11 5555-2020", tripType: "Amigos", passengers: 3, estimatedDate: "Octubre 2026", budget: "$1.000–$2.000 USD", assignedTo: "Laura García" },
  { id: "4", name: "Diego Romero", destination: "México", status: "Comprometido", daysInPipeline: 12, whatsapp: "+54 9 11 5555-3030", tripType: "Familia", passengers: 4, estimatedDate: "Julio 2026", budget: "$2.000+ USD", assignedTo: "Laura García" },
  { id: "5", name: "Lucía Fernández", destination: "Cancún", status: "Cerrado ganado", daysInPipeline: 18, whatsapp: "+54 9 11 5555-4040", tripType: "Luna de miel", passengers: 2, estimatedDate: "Junio 2026", budget: "$2.000+ USD", assignedTo: "Laura García" },
  { id: "6", name: "Tomás Giménez", destination: "Punta Cana", status: "Contactado", daysInPipeline: 3, whatsapp: "+54 9 11 5555-5050", tripType: "Amigos", passengers: 2, estimatedDate: "Septiembre 2026", budget: "$500–$1.000 USD", assignedTo: "Laura García" },
  { id: "7", name: "Camila Torres", destination: "Caribe", status: "Nuevo", daysInPipeline: 1, whatsapp: "+54 9 11 5555-6060", tripType: "Familia", passengers: 3, estimatedDate: "Noviembre 2026", budget: "$1.000–$2.000 USD", assignedTo: "Laura García" },
  { id: "8", name: "Nicolás Álvarez", destination: "México", status: "Cerrado perdido", daysInPipeline: 22, whatsapp: "+54 9 11 5555-7070", tripType: "Corporativo", passengers: 1, estimatedDate: "Mayo 2026", budget: "Hasta $500 USD", assignedTo: "Laura García" },
  { id: "9", name: "Florencia Ríos", destination: "Cancún", status: "En negociación", daysInPipeline: 9, whatsapp: "+54 9 11 5555-8080", tripType: "Luna de miel", passengers: 2, estimatedDate: "Agosto 2026", budget: "$1.000–$2.000 USD", assignedTo: "Laura García" },
  { id: "10", name: "Emilio Castro", destination: "Punta Cana", status: "Nuevo", daysInPipeline: 2, whatsapp: "+54 9 11 5555-9090", tripType: "Familia", passengers: 4, estimatedDate: "Diciembre 2026", budget: "$2.000+ USD", assignedTo: "Laura García" },
];

export const pipelineSteps: LeadStatus[] = [
  "Nuevo",
  "Contactado",
  "En negociación",
  "Comprometido",
  "Cerrado ganado",
];

export const statusCounts = {
  Nuevos: 4,
  Contactados: 6,
  "En negociación": 3,
  Cerrados: 8,
  Recompra: 2,
};

export const wonVsLostByMonth = [
  { month: "Nov", ganados: 4, perdidos: 2 },
  { month: "Dic", ganados: 6, perdidos: 3 },
  { month: "Ene", ganados: 5, perdidos: 4 },
  { month: "Feb", ganados: 8, perdidos: 2 },
  { month: "Mar", ganados: 7, perdidos: 5 },
  { month: "Abr", ganados: 9, perdidos: 3 },
];

export const topDestinations = [
  { name: "Cancún", value: 38 },
  { name: "Punta Cana", value: 27 },
  { name: "Caribe", value: 18 },
  { name: "México", value: 12 },
  { name: "Cuba", value: 5 },
];

export interface ActionEntry {
  date: string;
  type: string;
  result: string;
  note: string;
}

export const defaultActions: ActionEntry[] = [
  { date: "04/04/2026 10:52", type: "WhatsApp", result: "Solicita información", note: "Preguntó por fechas disponibles" },
  { date: "03/04/2026 16:30", type: "Seguimiento", result: "Sin respuesta", note: "—" },
  { date: "01/04/2026 09:15", type: "WhatsApp", result: "Responde positivo", note: "Interesada pide cotización" },
];
