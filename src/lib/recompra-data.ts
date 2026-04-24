export type RecompraStatus =
  | "Pendiente"
  | "Contactado"
  | "En seguimiento"
  | "Convertido"
  | "Descartado";

export interface RecompraClient {
  id: string;
  name: string;
  service: string; // último destino comprado
  status: RecompraStatus;
  daysInRecompra: number;
  whatsapp: string;
  lastPurchaseDate: string;
  purchasesCount: number;
  totalValue: string;
  timeSinceLastPurchase: string;
  assignedTo: string;
}

export const recompraClients: RecompraClient[] = [
  { id: "r1", name: "María Gómez",       service: "Cancún",      status: "Pendiente",      daysInRecompra: 2,  whatsapp: "+54 9 11 4111-2233", lastPurchaseDate: "12/02/2025", purchasesCount: 2, totalValue: "$3.400 USD", timeSinceLastPurchase: "14 meses", assignedTo: "Laura García" },
  { id: "r2", name: "Javier Núñez",      service: "Punta Cana",  status: "Contactado",     daysInRecompra: 5,  whatsapp: "+54 9 11 4111-3344", lastPurchaseDate: "03/11/2024", purchasesCount: 3, totalValue: "$5.900 USD", timeSinceLastPurchase: "17 meses", assignedTo: "Laura García" },
  { id: "r3", name: "Sofía Ledesma",     service: "Caribe",      status: "En seguimiento", daysInRecompra: 9,  whatsapp: "+54 9 11 4111-4455", lastPurchaseDate: "20/06/2024", purchasesCount: 1, totalValue: "$1.800 USD", timeSinceLastPurchase: "22 meses", assignedTo: "Laura García" },
  { id: "r4", name: "Ramiro Ibáñez",     service: "México",      status: "Convertido",     daysInRecompra: 12, whatsapp: "+54 9 11 4111-5566", lastPurchaseDate: "08/01/2025", purchasesCount: 4, totalValue: "$8.200 USD", timeSinceLastPurchase: "15 meses", assignedTo: "Laura García" },
  { id: "r5", name: "Paula Quiroga",     service: "Cancún",      status: "Descartado",     daysInRecompra: 18, whatsapp: "+54 9 11 4111-6677", lastPurchaseDate: "10/05/2024", purchasesCount: 1, totalValue: "$1.500 USD", timeSinceLastPurchase: "23 meses", assignedTo: "Laura García" },
  { id: "r6", name: "Esteban Vidal",     service: "Punta Cana",  status: "Pendiente",      daysInRecompra: 1,  whatsapp: "+54 9 11 4111-7788", lastPurchaseDate: "25/03/2025", purchasesCount: 2, totalValue: "$3.900 USD", timeSinceLastPurchase: "13 meses", assignedTo: "Laura García" },
  { id: "r7", name: "Carolina Méndez",   service: "Caribe",      status: "En seguimiento", daysInRecompra: 6,  whatsapp: "+54 9 11 4111-8899", lastPurchaseDate: "18/09/2024", purchasesCount: 3, totalValue: "$6.100 USD", timeSinceLastPurchase: "19 meses", assignedTo: "Laura García" },
  { id: "r8", name: "Federico Ruiz",     service: "México",      status: "Contactado",     daysInRecompra: 4,  whatsapp: "+54 9 11 4111-9900", lastPurchaseDate: "02/12/2024", purchasesCount: 2, totalValue: "$4.300 USD", timeSinceLastPurchase: "16 meses", assignedTo: "Laura García" },
];

export const recompraSteps: RecompraStatus[] = [
  "Pendiente",
  "Contactado",
  "En seguimiento",
  "Convertido",
  "Descartado",
];

export const recompraStatusCounts = {
  Pendientes: 2,
  Contactados: 2,
  "En seguimiento": 2,
  Convertidos: 1,
  Descartados: 1,
};

export interface RecompraAction {
  date: string;
  type: string;
  result: string;
  note: string;
}

export const defaultRecompraActions: RecompraAction[] = [
  { date: "10/04/2026 11:20", type: "WhatsApp",          result: "Recompra interesado",  note: "Pidió novedades de Caribe 2026" },
  { date: "07/04/2026 09:05", type: "Seguimiento",       result: "Sin respuesta",        note: "—" },
  { date: "02/04/2026 17:40", type: "Cotización enviada",result: "Recompra interesado",  note: "Envío de paquete familiar" },
];
