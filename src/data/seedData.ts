import { uid, now } from '../utils'
import {
  Guest, Table, BudgetItem, Vendor, Task, DayEvent,
  CeremonyStep, Game, MusicItem, MCSection, PhotoItem,
  PlanBItem, Responsible, ShoppingItem, EmergencyKitItem,
  Quote, BocaditoOption, Beverage, SavingsDecision, WeddingConfig,
} from '../types'

const t = now()

export const defaultConfig: WeddingConfig = {
  brideName:   'Sarahí',
  groomName:   'Naim',
  weddingDate: '2026-08-08',
  venue:       'Por confirmar',
  city:        'Ibarra',
  country:     'Ecuador',
  budgetTotal:  20000,
  guestLimit:   150,
  maxPerTable:  10,
}

// ─── Tables ────────────────────────────────────────────────────────────────────
export const seedTables: Table[] = [
  { id: 'tb1', name: 'Mesa Novios',        capacity: 10, notes: 'Mesa principal — novios y padrinos', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb2', name: 'Mesa Familia Novia', capacity: 10, notes: 'Familia directa de Sarahí',          avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb3', name: 'Mesa Familia Novio', capacity: 10, notes: 'Familia directa de Naim',            avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb4', name: 'Mesa Amigos 1',      capacity: 10, notes: 'Amigos cercanos de los novios',      avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb5', name: 'Mesa Amigos 2',      capacity: 10, notes: '',                                   avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb6', name: 'Mesa Iglesia',       capacity: 10, notes: 'Hermanos y líderes de iglesia',      avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb7', name: 'Mesa Trabajo',       capacity: 10, notes: 'Compañeros de trabajo',              avoidWith: [], createdAt: t, updatedAt: t },
]

// ─── Guests ────────────────────────────────────────────────────────────────────
export const seedGuests: Guest[] = [
  { id: uid(), name: 'Carlos Morales',    group: 'groom_family', status: 'confirmed', hasCompanion: true,  companionCount: 1, companionName: 'Elena Morales',   tableId: 'tb3', dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0991234567', email: '', notes: 'Papá del novio', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Lucía Andrade',     group: 'bride_family', status: 'confirmed', hasCompanion: true,  companionCount: 1, companionName: 'Roberto Andrade', tableId: 'tb2', dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0987654321', email: '', notes: 'Mamá de la novia', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Pedro Andrade',     group: 'bride_family', status: 'confirmed', hasCompanion: false, companionCount: 0, companionName: '',                tableId: 'tb2', dietaryRestriction: 'none', dietaryNote: '', isElderly: true,  isChild: false, hasReducedMobility: true,  phone: '0976543210', email: '', notes: 'Abuelo de la novia', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Valentina Torres',  group: 'friends',      status: 'confirmed', hasCompanion: true,  companionCount: 1, companionName: 'Marco Torres',    tableId: 'tb4', dietaryRestriction: 'vegetarian', dietaryNote: 'No consume carne', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0965432109', email: 'valen@gmail.com', notes: 'Amiga de la novia desde el colegio', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Ricardo Suárez',    group: 'friends',      status: 'confirmed', hasCompanion: false, companionCount: 0, companionName: '',                tableId: 'tb4', dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0954321098', email: '', notes: 'Amigo del novio', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Pastor Juan Cruz',  group: 'church',       status: 'confirmed', hasCompanion: true,  companionCount: 1, companionName: 'María Cruz',      tableId: 'tb6', dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0943210987', email: '', notes: 'Pastor que oficia la boda', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Ana López',         group: 'work',         status: 'pending',   hasCompanion: false, companionCount: 0, companionName: '',                tableId: null,  dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0932109876', email: '', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Diego Rueda',       group: 'groom_family', status: 'pending',   hasCompanion: true,  companionCount: 1, companionName: '',                tableId: null,  dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0921098765', email: '', notes: 'Primo del novio', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Sofía Benítez',     group: 'friends',      status: 'declined',  hasCompanion: false, companionCount: 0, companionName: '',                tableId: null,  dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '', email: '', notes: 'No puede asistir por viaje', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Miguel Cevallos',   group: 'church',       status: 'confirmed', hasCompanion: false, companionCount: 0, companionName: '',                tableId: 'tb6', dietaryRestriction: 'none', dietaryNote: '', isElderly: false, isChild: false, hasReducedMobility: false, phone: '0910987654', email: '', notes: 'Líder de jóvenes', createdAt: t, updatedAt: t },
]

// ─── Budget ────────────────────────────────────────────────────────────────────
export const seedBudget: BudgetItem[] = [
  { id: uid(), concept: 'Catering — cena completa',       category: 'food',        estimatedAmount: 8000, realAmount: 8500, paidAmount: 2000, status: 'partial', priority: 'mandatory',  dueDate: '2026-07-01', vendorId: null, notes: 'Incluye montaje y servicio', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Decoración salón',               category: 'decoration',  estimatedAmount: 2500, realAmount: 2200, paidAmount: 500,  status: 'partial', priority: 'important',  dueDate: '2026-07-15', vendorId: null, notes: 'Arreglos florales y centros de mesa', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Fotografía + Video',             category: 'photography', estimatedAmount: 1800, realAmount: 1800, paidAmount: 900,  status: 'partial', priority: 'mandatory',  dueDate: '2026-06-01', vendorId: null, notes: 'Anticipo del 50% pagado', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Vestido de novia',               category: 'dress',       estimatedAmount: 1200, realAmount: 1100, paidAmount: 1100, status: 'paid',    priority: 'mandatory',  dueDate: '2026-05-01', vendorId: null, notes: 'Incluye ajuste final', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Traje del novio',                category: 'suit',        estimatedAmount: 400,  realAmount: 380,  paidAmount: 380,  status: 'paid',    priority: 'mandatory',  dueDate: '2026-05-01', vendorId: null, notes: '', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'DJ / Sonido',                   category: 'music',       estimatedAmount: 800,  realAmount: 800,  paidAmount: 200,  status: 'partial', priority: 'important',  dueDate: '2026-07-20', vendorId: null, notes: 'DJ contratado, anticipo pagado', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Maquillaje y peinado',          category: 'makeup',      estimatedAmount: 300,  realAmount: 280,  paidAmount: 0,    status: 'pending', priority: 'important',  dueDate: '2026-08-01', vendorId: null, notes: '', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Iglesia — ofrenda',             category: 'church',      estimatedAmount: 150,  realAmount: 150,  paidAmount: 0,    status: 'pending', priority: 'mandatory',  dueDate: '2026-08-08', vendorId: null, notes: '', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Recuerdos para invitados',      category: 'souvenirs',   estimatedAmount: 500,  realAmount: 450,  paidAmount: 0,    status: 'pending', priority: 'optional',   dueDate: '2026-07-20', vendorId: null, notes: '100 recuerdos aprox', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Bocaditos',                     category: 'bocaditos',   estimatedAmount: 1500, realAmount: 1400, paidAmount: 0,    status: 'pending', priority: 'important',  dueDate: '2026-07-25', vendorId: null, notes: '~$10 por persona, 140 personas', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Cervezas (150 latas)',          category: 'beverages',   estimatedAmount: 113,  realAmount: 113,  paidAmount: 0,    status: 'pending', priority: 'important',  dueDate: '2026-08-05', vendorId: null, notes: '$0.75 x lata', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Transporte novios',             category: 'transport',   estimatedAmount: 200,  realAmount: 200,  paidAmount: 0,    status: 'pending', priority: 'important',  dueDate: '2026-08-01', vendorId: null, notes: '', receipt: '', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Imprevistos',                   category: 'unexpected',  estimatedAmount: 500,  realAmount: 0,    paidAmount: 0,    status: 'pending', priority: 'important',  dueDate: '',           vendorId: null, notes: 'Fondo de emergencia', receipt: '', createdAt: t, updatedAt: t },
]

// ─── Vendors ───────────────────────────────────────────────────────────────────
export const seedVendors: Vendor[] = [
  { id: 'v1', name: 'Banquetes El Sabor',    service: 'Catering completo',      contact: 'Carmen Vásquez',  phone: '0991112233', email: 'elsabor@gmail.com',   city: 'Ibarra', totalValue: 8500, advance: 2000, balance: 6500, dueDate: '2026-07-01', status: 'reserved', hasContract: true,  risk: 'low',    notes: 'Menú: consomé, seco de pollo, arroz, ensalada', createdAt: t, updatedAt: t },
  { id: 'v2', name: 'Foto Video Momentos',   service: 'Fotografía y video',     contact: 'Andrés Paz',      phone: '0982223344', email: 'momentos@gmail.com',  city: 'Ibarra', totalValue: 1800, advance: 900,  balance: 900,  dueDate: '2026-06-01', status: 'reserved', hasContract: true,  risk: 'low',    notes: 'Incluye álbum digital y 1 álbum impreso', createdAt: t, updatedAt: t },
  { id: 'v3', name: 'DJ Ritmo Latino',       service: 'DJ y sonido',            contact: 'Carlos Flores',   phone: '0973334455', email: '',                    city: 'Ibarra', totalValue: 800,  advance: 200,  balance: 600,  dueDate: '2026-07-20', status: 'reserved', hasContract: false, risk: 'medium', notes: 'Sin contrato aún — pendiente firmar', createdAt: t, updatedAt: t },
  { id: 'v4', name: 'Floral Arte',           service: 'Decoración floral',      contact: 'Patricia Hidalgo', phone: '0964445566', email: '',                   city: 'Ibarra', totalValue: 2200, advance: 500,  balance: 1700, dueDate: '2026-07-15', status: 'reserved', hasContract: false, risk: 'medium', notes: '', createdAt: t, updatedAt: t },
  { id: 'v5', name: 'Estudio Glamour',       service: 'Maquillaje y peinado',   contact: 'Laura Ríos',      phone: '0955556677', email: '',                    city: 'Ibarra', totalValue: 280,  advance: 0,    balance: 280,  dueDate: '2026-08-01', status: 'quoting',  hasContract: false, risk: 'low',    notes: 'Paquete novia + madres', createdAt: t, updatedAt: t },
]

// ─── Tasks ─────────────────────────────────────────────────────────────────────
export const seedTasks: Task[] = [
  // Completed
  { id: uid(), title: 'Reservar salón de eventos',        description: 'Buscar y reservar el lugar para la recepción', dueDate: '2025-12-31', suggestedDate: '2025-10-01', responsible: 'Naim y Sarahí', priority: 'urgent', status: 'completed', category: 'Lugar', monthsBefore: 9, notes: '', completedAt: '2025-11-15', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Contratar fotógrafo/videógrafo',   description: 'Seleccionar y contratar al fotógrafo y videógrafo', dueDate: '2026-02-28', suggestedDate: '2026-01-01', responsible: 'Sarahí', priority: 'urgent', status: 'completed', category: 'Proveedores', monthsBefore: 6, notes: '', completedAt: '2026-02-01', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Elegir vestido de novia',          description: 'Pruebas y compra del vestido', dueDate: '2026-03-31', suggestedDate: '2026-01-01', responsible: 'Sarahí', priority: 'urgent', status: 'completed', category: 'Vestuario', monthsBefore: 5, notes: '', completedAt: '2026-03-15', createdAt: t, updatedAt: t },
  // In progress
  { id: uid(), title: 'Confirmar lista de invitados',     description: 'Enviar invitaciones y hacer seguimiento de confirmaciones', dueDate: '2026-07-01', suggestedDate: '2026-06-01', responsible: 'Sarahí', priority: 'high', status: 'in_progress', category: 'Invitados', monthsBefore: 1, notes: 'Falta confirmar al 40% de invitados', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Finalizar menú con el catering',   description: 'Confirmar menú definitivo y número de personas', dueDate: '2026-07-10', suggestedDate: '2026-06-15', responsible: 'Naim', priority: 'high', status: 'in_progress', category: 'Catering', monthsBefore: 1, notes: '', createdAt: t, updatedAt: t },
  // Pending
  { id: uid(), title: 'Diseñar y enviar invitaciones',    description: 'Crear el diseño digital y físico de invitaciones', dueDate: '2026-06-30', suggestedDate: '2026-05-01', responsible: 'Sarahí', priority: 'high', status: 'pending', category: 'Invitados', monthsBefore: 2, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Distribuir mesas de invitados',    description: 'Asignar cada invitado a su mesa', dueDate: '2026-07-25', suggestedDate: '2026-07-15', responsible: 'Sarahí', priority: 'high', status: 'pending', category: 'Logística', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Comprar cervezas y bebidas',       description: 'Adquirir las bebidas para el evento', dueDate: '2026-08-05', suggestedDate: '2026-08-01', responsible: 'Naim', priority: 'high', status: 'pending', category: 'Bebidas', monthsBefore: 0, notes: '150 latas aprox', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Confirmar DJ y lista de canciones', description: 'Enviar la playlist definitiva al DJ', dueDate: '2026-07-20', suggestedDate: '2026-07-10', responsible: 'Naim y Sarahí', priority: 'high', status: 'pending', category: 'Música', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Preparar kit de emergencia',       description: 'Reunir todos los elementos del kit', dueDate: '2026-08-07', suggestedDate: '2026-08-05', responsible: 'Sarahí', priority: 'medium', status: 'pending', category: 'Logística', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Firmar contrato con DJ',           description: 'Formalizar el contrato con DJ Ritmo Latino', dueDate: '2026-07-01', suggestedDate: '2026-06-15', responsible: 'Naim', priority: 'urgent', status: 'pending', category: 'Proveedores', monthsBefore: 1, notes: 'Sin contrato = riesgo alto', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Decorar la iglesia',               description: 'Coordinar decoración floral en la iglesia', dueDate: '2026-08-07', suggestedDate: '2026-08-06', responsible: 'Familia novia', priority: 'high', status: 'pending', category: 'Ceremonia', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Ensayo de la boda',                description: 'Ensayo general en la iglesia', dueDate: '2026-08-07', suggestedDate: '2026-08-07', responsible: 'Pastor Juan Cruz', priority: 'high', status: 'pending', category: 'Ceremonia', monthsBefore: 0, notes: 'Día anterior a la boda', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Pagar saldo al fotógrafo',         description: 'Pagar el 50% restante', dueDate: '2026-06-01', suggestedDate: '2026-06-01', responsible: 'Naim', priority: 'urgent', status: 'pending', category: 'Pagos', monthsBefore: 2, notes: '$900 pendientes', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Comprar recuerdos',                description: 'Adquirir o fabricar los recuerdos', dueDate: '2026-07-20', suggestedDate: '2026-07-01', responsible: 'Sarahí', priority: 'medium', status: 'pending', category: 'Detalles', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
]

// ─── Day Schedule ──────────────────────────────────────────────────────────────
export const seedDaySchedule: DayEvent[] = [
  { id: uid(), time: '07:00', activity: 'Preparación de la novia — maquillaje y peinado',  duration: 180, responsible: 'Sarahí + estilista',         notes: 'Estudios Glamour',                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '08:00', activity: 'Preparación del novio — vestirse y llegar',       duration: 60,  responsible: 'Naim + familia',              notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '09:00', activity: 'Fotografías previas — novio con familia',         duration: 60,  responsible: 'Andrés Paz (fotógrafo)',       notes: 'Fotos del novio antes de la boda',  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '10:00', activity: 'Fotografías previas — novia lista',               duration: 60,  responsible: 'Andrés Paz (fotógrafo)',       notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '11:00', activity: 'Llegada de invitados a la iglesia',               duration: 30,  responsible: 'Responsable de bienvenida',   notes: 'Entregar programas de ceremonia',   status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '11:30', activity: 'Ceremonia religiosa',                             duration: 90,  responsible: 'Pastor Juan Cruz',            notes: 'Iglesia a confirmar',               status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '13:00', activity: 'Salida de novios + fotos en exteriores',          duration: 60,  responsible: 'Andrés Paz (fotógrafo)',       notes: 'Fotos familiares y de novios',      status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '14:00', activity: 'Traslado al salón de recepción',                  duration: 30,  responsible: 'Chofer contratado',           notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '14:30', activity: 'Cóctel de bienvenida y bocaditos',               duration: 60,  responsible: 'Catering + Maestro de Cere.', notes: 'Mesa de bocaditos disponible',      status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '15:30', activity: 'Entrada oficial de los novios',                  duration: 15,  responsible: 'DJ + Maestro de Ceremonia',   notes: 'Música de entrada',                 status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '15:45', activity: 'Palabras de bienvenida y oración',               duration: 15,  responsible: 'Maestro de Ceremonia',        notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '16:00', activity: 'Cena / Almuerzo de bodas',                       duration: 90,  responsible: 'Catering',                    notes: 'Servicio en mesas',                 status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '17:30', activity: 'Palabras de familiares y amigos',                duration: 30,  responsible: 'Familias de novios',          notes: 'Máximo 3-4 personas, 5 min c/u',    status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '18:00', activity: 'Brindis y torta',                                duration: 20,  responsible: 'Maestro de Ceremonia',        notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '18:20', activity: 'Primer baile de novios',                         duration: 10,  responsible: 'DJ',                          notes: 'Canción: a definir',                status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '18:30', activity: 'Baile con padres',                               duration: 10,  responsible: 'DJ',                          notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '18:40', activity: 'Juegos y dinámicas',                             duration: 45,  responsible: 'Maestro de Ceremonia',        notes: 'Bingo, trivia, dinámicas',          status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '19:25', activity: 'Fiesta y baile libre',                           duration: 180, responsible: 'DJ',                          notes: '',                                  status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '22:25', activity: 'Cierre y despedida de novios',                   duration: 20,  responsible: 'Maestro de Ceremonia',        notes: 'Lluvia de pétalos',                 status: 'planned', createdAt: t, updatedAt: t },
]

// ─── Ceremony ──────────────────────────────────────────────────────────────────
export const seedCeremony: CeremonyStep[] = [
  { id: uid(), order: 1, title: 'Entrada de padrinos',      description: 'Los padrinos ingresan al altar',                  responsible: 'Padrinos',            duration: 5,  text: 'Los padrinos tomarán sus lugares al frente.',                                    notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 2, title: 'Entrada del novio',        description: 'El novio entra acompañado de su madre',           responsible: 'Naim',                duration: 3,  text: 'El novio ingresa acompañado por su madre al son de la música.',                  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 3, title: 'Entrada de la novia',      description: 'La novia entra con su padre',                     responsible: 'Sarahí y su padre',   duration: 5,  text: 'Todos puestos de pie para recibir a la novia.',                                  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 4, title: 'Palabras de bienvenida',   description: 'El pastor da la bienvenida',                      responsible: 'Pastor Juan Cruz',    duration: 5,  text: 'Bienvenidos a esta celebración sagrada. Estamos reunidos para ser testigos del amor de Naim y Sarahí.', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 5, title: 'Oración inicial',          description: 'Oración por la unión',                            responsible: 'Pastor Juan Cruz',    duration: 5,  text: 'Padre celestial, te pedimos tu bendición sobre este matrimonio...',              notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6, title: 'Lectura bíblica',          description: 'Lectura del pasaje bíblico',                      responsible: 'Invitado especial',   duration: 5,  text: '1 Corintios 13:4-8 — "El amor es sufrido, es benigno..."',                       notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 7, title: 'Mensaje del pastor',       description: 'Palabras del pastor sobre el matrimonio',         responsible: 'Pastor Juan Cruz',    duration: 15, text: 'Reflexión sobre el amor, la fidelidad y el compromiso ante Dios.',               notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 8, title: 'Votos matrimoniales',      description: 'Intercambio de votos entre los novios',           responsible: 'Naim y Sarahí',       duration: 10, text: 'Yo, [nombre], te tomo a ti, [nombre], como mi esposo/a...',                      notes: 'Preparar votos personalizados', createdAt: t, updatedAt: t },
  { id: uid(), order: 9, title: 'Intercambio de anillos',   description: 'Colocación y bendición de los anillos',           responsible: 'Naim, Sarahí, Pastor', duration: 5, text: 'Con este anillo te desposo y te entrego mi amor eterno.',                         notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 10, title: 'Declaración de matrimonio', description: 'El pastor declara el matrimonio',               responsible: 'Pastor Juan Cruz',    duration: 3,  text: 'Por el poder que me confiere la Iglesia y ante Dios, los declaro marido y mujer.', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 11, title: 'El beso',                 description: 'Primer beso como casados',                        responsible: 'Naim y Sarahí',       duration: 2,  text: '¡Puede besar a la novia!',                                                        notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 12, title: 'Firma del acta',          description: 'Firma del documento civil/religioso',             responsible: 'Novios y padrinos',   duration: 10, text: '',                                                                                 notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 13, title: 'Oración de cierre',       description: 'Oración final de bendición',                      responsible: 'Pastor Juan Cruz',    duration: 3,  text: '',                                                                                 notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 14, title: 'Salida de los novios',    description: 'Los novios salen al corredor de invitados',        responsible: 'Naim y Sarahí',       duration: 5,  text: '¡Aplaudan a los nuevos esposos Naim y Sarahí!',                                   notes: 'Pétalos o confeti en la salida', createdAt: t, updatedAt: t },
]

// ─── Games ─────────────────────────────────────────────────────────────────────
export const seedGames: Game[] = [
  { id: uid(), name: '¿Qué tanto conoces a los novios?', description: 'Preguntas sobre la pareja, cada mesa compite. La mesa con más respuestas correctas gana.', timing: 'Después de la cena', duration: 20, materials: 'Hojas de preguntas, esferos, bolsas de premios', responsible: 'Maestro de Ceremonia', prizes: 'Chocolates o bebidas para la mesa ganadora', notes: 'Preparar 15 preguntas de cada novio', status: 'confirmed', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Bingo de Boda',                    description: 'Cartones personalizados con palabras y momentos de la boda. Se canta en vivo.', timing: 'Antes del baile', duration: 20, materials: 'Cartones de bingo impresos, marcadores, bolsa de cartones', responsible: 'Maestro de Ceremonia', prizes: 'Botella de vino o detalle especial', notes: 'Imprimir 120 cartones', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), name: '¿Quién lo dijo?',                  description: 'El MC lee frases que alguno de los novios dijo, los invitados adivinan quién fue.', timing: 'Durante la fiesta', duration: 15, materials: 'Tarjetas con frases', responsible: 'Maestro de Ceremonia', prizes: 'Premio para el ganador individual', notes: 'Pedir a familias que aporten frases', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Baile de la silla',                description: 'Versión adultos con música romántica. Perfecto para todas las edades.', timing: 'Mitad de fiesta', duration: 15, materials: 'Sillas, música', responsible: 'DJ + MC', prizes: 'Premio para ganador', notes: 'Fácil para adultos mayores también', status: 'planned', createdAt: t, updatedAt: t },
]

// ─── Music ────────────────────────────────────────────────────────────────────
export const seedMusic: MusicItem[] = [
  { id: uid(), order: 1,  moment: 'Entrada de la novia a la iglesia',  song: 'Canon in D',                 artist: 'Johann Pachelbel',       responsible: 'Músico iglesia', duration: 4, isProhibited: false, isMandatory: true,  notes: 'Versión instrumental', createdAt: t, updatedAt: t },
  { id: uid(), order: 2,  moment: 'Salida de la iglesia',              song: 'A Thousand Years',           artist: 'Christina Perri',        responsible: 'Músico iglesia', duration: 4, isProhibited: false, isMandatory: true,  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 3,  moment: 'Entrada de novios al salón',        song: 'Por definir',                artist: '',                       responsible: 'DJ',             duration: 3, isProhibited: false, isMandatory: true,  notes: 'Elegir con los novios', createdAt: t, updatedAt: t },
  { id: uid(), order: 4,  moment: 'Primer baile de novios',            song: 'Por definir',                artist: '',                       responsible: 'DJ',             duration: 4, isProhibited: false, isMandatory: true,  notes: 'La favorita de la pareja', createdAt: t, updatedAt: t },
  { id: uid(), order: 5,  moment: 'Baile del novio con su madre',      song: 'La niña de mis ojos',        artist: 'Pappo',                  responsible: 'DJ',             duration: 4, isProhibited: false, isMandatory: true,  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6,  moment: 'Baile de la novia con su padre',    song: 'Hija',                       artist: 'Ricardo Arjona',         responsible: 'DJ',             duration: 4, isProhibited: false, isMandatory: true,  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 7,  moment: 'Hora loca / Fiesta',                song: 'Cumbia mix',                 artist: 'DJ',                     responsible: 'DJ',             duration: 3, isProhibited: false, isMandatory: false, notes: 'Mezcla tropical para animar', createdAt: t, updatedAt: t },
  { id: uid(), order: 8,  moment: 'Brindis',                           song: 'Cheers',                     artist: 'Rihanna',                responsible: 'DJ',             duration: 2, isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 9,  moment: 'PROHIBIDA',                         song: 'Soltera',                    artist: 'Lunay',                  responsible: '',               duration: 0, isProhibited: true,  isMandatory: false, notes: 'No poner reggaetón explícito', createdAt: t, updatedAt: t },
  { id: uid(), order: 10, moment: 'Cierre de fiesta',                  song: 'La Vida es un Carnaval',     artist: 'Celia Cruz',             responsible: 'DJ',             duration: 4, isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
]

// ─── MC Script ────────────────────────────────────────────────────────────────
export const seedMCScript: MCSection[] = [
  { id: uid(), order: 1, title: 'Bienvenida', content: 'Buenas tardes a todos. Bienvenidos a esta celebración tan especial. Es un honor recibirles hoy para ser testigos del amor y la unión de Naim y Sarahí. Esta noche es de ellos y de ustedes, que son parte fundamental de su historia.', timing: 'Al inicio', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 2, title: 'Presentación de los novios', content: 'Damas y caballeros, con mucho cariño y alegría, les pedimos que se pongan de pie para recibir a los protagonistas de esta noche: ¡Naim y Sarahí!', timing: 'Entrada al salón', notes: 'Poner música de entrada aquí', createdAt: t, updatedAt: t },
  { id: uid(), order: 3, title: 'Anuncio de la cena', content: 'Los invitamos a tomar su lugar en la mesa asignada. El servicio de cena comenzará en unos momentos. Disfruten de la compañía y de estos momentos únicos.', timing: 'Antes de la cena', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 4, title: 'Palabras de familias', content: 'Ahora quisiera invitar a las personas que deseen compartir unas palabras de cariño para los novios. Les pido que sean breves pero sinceras.', timing: 'Después de la cena', notes: 'Máximo 3-4 personas', createdAt: t, updatedAt: t },
  { id: uid(), order: 5, title: 'Anuncio del brindis', content: 'Ha llegado el momento del brindis. Levantemos nuestras copas para brindar por Naim y Sarahí, por su amor, por su futuro juntos, y porque esta noche sea el primero de miles de recuerdos hermosos.', timing: 'Brindis', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6, title: 'Anuncio del primer baile', content: 'Con mucho amor, les pedimos que despejemos la pista. Es momento del primer baile de los novios como esposos. Naim, Sarahí... la pista es suya.', timing: 'Primer baile', notes: 'DJ activa la canción', createdAt: t, updatedAt: t },
  { id: uid(), order: 7, title: 'Anuncio de juegos', content: '¡Llegó el momento de divertirnos! Vamos a demostrar quién conoce mejor a los novios. Por favor presten atención a las instrucciones...', timing: 'Juegos', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 8, title: 'Cierre del evento', content: 'Llegamos al final de esta noche tan especial. En nombre de Naim y Sarahí, muchas gracias por acompañarlos en este día. Su presencia ha sido el mejor regalo. ¡Que vivan los novios!', timing: 'Cierre', notes: 'Música de despedida', createdAt: t, updatedAt: t },
]

// ─── Photos ───────────────────────────────────────────────────────────────────
export const seedPhotos: PhotoItem[] = [
  { id: uid(), category: 'Novios', description: 'Novios solos — retratos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Novios', description: 'Novios con anillos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Novios', description: 'Primer beso como casados', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia Sarahí', description: 'Sarahí con padres', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia Sarahí', description: 'Sarahí con hermanos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia Sarahí', description: 'Sarahí con abuelos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia Naim', description: 'Naim con padres', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia Naim', description: 'Naim con hermanos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia completa', description: 'Novios con ambas familias', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Padrinos', description: 'Novios con padrinos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Amigos', description: 'Novios con amigos cercanos', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Entrada de la novia', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Intercambio de anillos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Detalles', description: 'Decoración del salón', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Detalles', description: 'Mesa de bocaditos', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Detalles', description: 'Torta de bodas', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Fiesta', description: 'Primer baile', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Fiesta', description: 'Baile con padres', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Espontáneas', description: 'Risas y momentos naturales', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
]

// ─── Plan B ───────────────────────────────────────────────────────────────────
export const seedPlanB: PlanBItem[] = [
  { id: uid(), scenario: 'Lluvia durante la ceremonia exterior', solution: 'Tener carpa de respaldo reservada o mover al interior de la iglesia. Coordinado previamente con el local.', responsible: 'Naim', materials: 'Contacto del local, paraguas para invitados', priority: 'high', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Proveedor de catering no llega', solution: 'Tener número de un segundo catering de emergencia. Tener snacks básicos disponibles.', responsible: 'Sarahí', materials: 'Número de respaldo: pendiente', priority: 'high', notes: 'Investigar caterings alternativos en Ibarra', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Falla el sonido / DJ', solution: 'Tener una playlist en Spotify/YouTube con las canciones clave. Parlante Bluetooth de respaldo.', responsible: 'Naim', materials: 'Celular cargado, parlante Bluetooth, playlist guardada', priority: 'high', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Retraso de los novios', solution: 'El MC mantiene entretenidos a los invitados con una dinámica improvisada.', responsible: 'Maestro de Ceremonia', materials: 'Lista de preguntas de respaldo', priority: 'medium', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Falta de bebidas o hielo', solution: 'Tener identificado el supermercado más cercano. Asignar a una persona para la compra de emergencia.', responsible: 'Ricardo Suárez', materials: '$50 en efectivo de emergencia', priority: 'medium', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Problema con vestido de novia', solution: 'Kit de emergencia incluye aguja, hilo blanco, alfileres de seguridad y cinta doble faz.', responsible: 'Sarahí (dama de honor)', materials: 'Kit de emergencia', priority: 'high', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), scenario: 'Emergencia médica de un invitado', solution: 'Identificar hospital más cercano. Tener botiquín básico. Una persona designada para emergencias.', responsible: 'Valentina Torres', materials: 'Botiquín, número de hospital, Cruz Roja Ibarra', priority: 'high', notes: 'Hospital San Vicente de Paúl - Ibarra', createdAt: t, updatedAt: t },
]

// ─── Responsibles ──────────────────────────────────────────────────────────────
export const seedResponsibles: Responsible[] = [
  { id: uid(), name: 'Naim',             role: 'Novio / Coordinador general', phone: '0991234567', email: '', tasks: 'Pagos, proveedores, bebidas, transporte', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Sarahí',           role: 'Novia / Decoración',          phone: '0987654321', email: '', tasks: 'Invitados, decoración, mesas, vestido, maquillaje', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Valentina Torres', role: 'Dama de honor',               phone: '0965432109', email: '', tasks: 'Kit de emergencia, apoyo a la novia, emergencias médicas', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Ricardo Suárez',   role: 'Padrino / Apoyo novio',       phone: '0954321098', email: '', tasks: 'Bebidas emergencia, transporte invitados', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Pastor Juan Cruz', role: 'Officiante de la ceremonia',  phone: '0943210987', email: '', tasks: 'Ceremonia completa, mensaje, votos', notes: '', createdAt: t, updatedAt: t },
]

// ─── Shopping ─────────────────────────────────────────────────────────────────
export const seedShopping: ShoppingItem[] = [
  { id: uid(), product: 'Cervezas (150 latas)',      quantity: 150, estimatedPrice: 113,  realPrice: 0, vendor: 'Supermaxi / Tía',       priority: 'buy_later', status: 'pending', notes: '$0.75 c/u — comprar 1 semana antes', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Hielo (10 bolsas)',         quantity: 10,  estimatedPrice: 25,   realPrice: 0, vendor: 'Supermaxi',             priority: 'buy_now',   status: 'pending', notes: 'Comprar día anterior', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Agua sin gas (24 packs)',   quantity: 24,  estimatedPrice: 48,   realPrice: 0, vendor: 'Supermaxi',             priority: 'buy_later', status: 'pending', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Recuerdos para invitados',  quantity: 120, estimatedPrice: 450,  realPrice: 0, vendor: 'Por cotizar',           priority: 'quote',     status: 'pending', notes: 'Cotizar en Ibarra y Quito', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Porta menús de mesa',       quantity: 15,  estimatedPrice: 30,   realPrice: 0, vendor: 'Por cotizar',           priority: 'quote',     status: 'pending', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Libro de firmas',           quantity: 1,   estimatedPrice: 25,   realPrice: 0, vendor: 'Papelería',             priority: 'buy_now',   status: 'pending', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Pétalos de rosas',          quantity: 5,   estimatedPrice: 15,   realPrice: 0, vendor: 'Mercado / floristería', priority: 'buy_later', status: 'pending', notes: 'Para la salida de la iglesia', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cartones de Bingo de Boda', quantity: 120, estimatedPrice: 20,   realPrice: 0, vendor: 'Imprenta local',        priority: 'buy_now',   status: 'pending', notes: 'Diseñar e imprimir', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Sillas para ceremonia',     quantity: 120, estimatedPrice: 0,    realPrice: 0, vendor: 'Incluido en local',     priority: 'rent',      status: 'pending', notes: 'Verificar si el salón las incluye', createdAt: t, updatedAt: t },
]

// ─── Emergency Kit ─────────────────────────────────────────────────────────────
export const seedEmergencyKit: EmergencyKitItem[] = [
  { id: uid(), item: 'Aguja e hilo (blanco, negro, nude)', quantity: 1, responsible: 'Valentina Torres', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Alfileres de seguridad',             quantity: 10, responsible: 'Valentina Torres', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Cinta doble faz',                   quantity: 1, responsible: 'Sarahí',            isPacked: false, notes: 'Para emergencias del vestido', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Curitas / banditas',                 quantity: 10, responsible: 'Valentina Torres', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Toallitas húmedas',                  quantity: 10, responsible: 'Valentina Torres', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Retoque de maquillaje',              quantity: 1, responsible: 'Sarahí',            isPacked: false, notes: 'Base, labial, polvo translúcido', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Perfume de la novia',               quantity: 1, responsible: 'Sarahí',            isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Desodorante',                       quantity: 2, responsible: 'Valentina Torres', isPacked: false, notes: 'Uno para novio, uno para novia', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Cargadores de celular',             quantity: 2, responsible: 'Ricardo Suárez',   isPacked: false, notes: 'Más powerbank', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Analgésicos / ibuprofeno',          quantity: 6, responsible: 'Valentina Torres', isPacked: false, notes: 'Para dolor de cabeza o pies', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Peine y pasadores extra',           quantity: 5, responsible: 'Sarahí',            isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Tijeras pequeñas',                  quantity: 1, responsible: 'Valentina Torres', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Dinero en efectivo (emergencias)',  quantity: 1, responsible: 'Naim',              isPacked: false, notes: '$100 mínimo', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Protector solar',                   quantity: 1, responsible: 'Valentina Torres', isPacked: false, notes: 'Para fotos al aire libre', createdAt: t, updatedAt: t },
]

// ─── Quotes / Cotizaciones ────────────────────────────────────────────────────
export const seedQuotes: Quote[] = [
  { id: uid(), product: 'Cerveza Pilsener lata 355ml', vendor: 'Supermaxi Ibarra',       city: 'Ibarra',  price: 0.89, unit: 'lata',    date: '2026-06-15', contact: '',             link: '', notes: 'Precio de estante, sin descuento por volumen', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cerveza Pilsener lata 355ml', vendor: 'Tía Ibarra',             city: 'Ibarra',  price: 0.80, unit: 'lata',    date: '2026-06-15', contact: '',             link: '', notes: '', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cerveza Pilsener lata 355ml', vendor: 'Distribuidora El Toro',  city: 'Ibarra',  price: 0.72, unit: 'lata',    date: '2026-06-15', contact: '0991234000',  link: '', notes: 'Mínimo 100 unidades', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Bocaditos (paquete mixto)',   vendor: 'Catering Delicias',       city: 'Ibarra',  price: 9.50, unit: 'persona', date: '2026-06-10', contact: '0982345000',  link: '', notes: 'Incluye montaje y vajilla', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Bocaditos (paquete mixto)',   vendor: 'Banquetes Familiar',      city: 'Ibarra',  price: 8.00, unit: 'persona', date: '2026-06-10', contact: '0973456000',  link: '', notes: 'Sin vajilla, sin montaje', status: 'pending', createdAt: t, updatedAt: t },
]

// ─── Bocaditos ────────────────────────────────────────────────────────────────
export const seedBocaditos: BocaditoOption[] = [
  { id: uid(), option: 'Catering profesional completo', vendor: 'Catering Delicias Ibarra', pricePerPerson: 9.50, quantityPerPerson: '4 dulces + 4 salados', includesMontaje: true, includesVajilla: true, includesTransport: true, advantages: 'Todo incluido, profesional, sin trabajo extra', disadvantages: 'El más caro', recommendation: 'Mejor opción si el presupuesto lo permite', isSelected: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), option: 'Catering básico sin montaje',   vendor: 'Banquetes Familiar',        pricePerPerson: 8.00, quantityPerPerson: '3 dulces + 3 salados', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Precio accesible', disadvantages: 'Necesita vajilla propia y montaje', recommendation: 'Buena opción si se consiguen vajillas', isSelected: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), option: 'Bocaditos hechos en casa',      vendor: 'Familia y amigas',          pricePerPerson: 4.00, quantityPerPerson: '3 dulces + 3 salados', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Muy económico, toque personal', disadvantages: 'Mucho trabajo, necesita coordinación', recommendation: 'Solo si hay familia dispuesta a cocinar', isSelected: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), option: 'Bandejas de supermercado',      vendor: 'Supermaxi / Santa María',   pricePerPerson: 5.50, quantityPerPerson: '3 dulces + 2 salados', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Fácil de conseguir, precio medio', disadvantages: 'Presentación básica, sin personalización', recommendation: 'Opción equilibrada entre costo y facilidad', isSelected: false, notes: '', createdAt: t, updatedAt: t },
]

// ─── Beverages ────────────────────────────────────────────────────────────────
export const seedBeverages: Beverage[] = [
  { id: uid(), name: 'Cerveza Pilsener',   type: 'alcoholic',     brand: 'Pilsener',    unit: 'lata 355ml', pricePerUnit: 0.75, quantityPlanned: 150, quantityPurchased: 0, vendor: 'Por definir', notes: '~1.5 latas por persona (100 invitados)', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Cerveza Club',       type: 'alcoholic',     brand: 'Club',        unit: 'lata 355ml', pricePerUnit: 0.80, quantityPlanned: 24,  quantityPurchased: 0, vendor: 'Por definir', notes: 'Alternativa para quienes no toman Pilsener', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Agua sin gas',       type: 'water',         brand: 'Agua Luna',   unit: 'botella 500ml', pricePerUnit: 0.30, quantityPlanned: 80, quantityPurchased: 0, vendor: 'Supermaxi', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Coca-Cola',          type: 'soda',          brand: 'Coca-Cola',   unit: 'lata 354ml', pricePerUnit: 0.70, quantityPlanned: 30,  quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Para niños y adultos que no toman alcohol', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Jugo de fruta',      type: 'juice',         brand: 'Del Valle',   unit: 'botella 300ml', pricePerUnit: 0.50, quantityPlanned: 30, quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Para niños y adultos mayores', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Hielo',             type: 'ice',           brand: 'Hielo bolsa', unit: 'bolsa 5kg',  pricePerUnit: 2.50, quantityPlanned: 10,  quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Comprar día anterior', createdAt: t, updatedAt: t },
]

// ─── Savings Decisions ────────────────────────────────────────────────────────
export const seedSavings: SavingsDecision[] = [
  { id: uid(), concept: 'Decoración floral', currentPlan: 'Florería completa $2,200', alternative: 'Flores de mercado + floreros alquilados $800', estimatedSavings: 1400, decision: 'reduce', priority: 'high', notes: 'Investigar mercado La Playa de Ibarra', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Recuerdos',         currentPlan: 'Proveedor profesional $450', alternative: 'Elaborar en casa con frascos + etiquetas $150', estimatedSavings: 300, decision: 'diy', priority: 'medium', notes: 'Fácil de hacer, ahorra bastante', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Torta de bodas',    currentPlan: 'Pastelería gourmet $350', alternative: 'Pastelería local $150', estimatedSavings: 200, decision: 'quote', priority: 'medium', notes: 'Cotizar en Ibarra', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Cervezas',          currentPlan: 'Comprar en supermercado precio normal', alternative: 'Comprar en distribuidora al por mayor', estimatedSavings: 50, decision: 'buy_early', priority: 'low', notes: 'Distribuidora El Toro ofrece $0.72/lata', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Transporte novios', currentPlan: 'Carro decorado alquilado $200', alternative: 'Carro de familiar decorado $30 en decoración', estimatedSavings: 170, decision: 'diy', priority: 'medium', notes: 'Ver si algún familiar tiene un carro bonito', createdAt: t, updatedAt: t },
]
