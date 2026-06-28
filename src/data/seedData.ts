import { uid, now } from '../utils'
import {
  Guest, Table, BudgetItem, Vendor, Task, DayEvent,
  CeremonyStep, Game, MusicItem, MCSection, PhotoItem,
  PlanBItem, Responsible, ShoppingItem, EmergencyKitItem,
  Quote, BocaditoOption, Beverage, SavingsDecision, WeddingConfig,
} from '../types'

const t = now()
const g = (
  name: string,
  group: Guest['group'],
  status: Guest['status'],
  companion: string | null,
  tableId: string | null,
  elderly = false,
  child = false,
  notes = ''
): Guest => ({
  id: uid(), name, group, status,
  hasCompanion: !!companion, companionCount: companion ? 1 : 0, companionName: companion ?? '',
  tableId, dietaryRestriction: 'none', dietaryNote: '', isElderly: elderly,
  isChild: child, hasReducedMobility: false, phone: '', email: '', notes,
  createdAt: t, updatedAt: t,
})

export const defaultConfig: WeddingConfig = {
  brideName:   'Sarahí',
  groomName:   'Naim',
  weddingDate: '2026-08-08',
  venue:       'Portal del Lago (opción principal cotizada) — Ibarra',
  city:        'Ibarra',
  country:     'Ecuador',
  budgetTotal:  5000,
  guestLimit:   150,
  maxPerTable:  10,
}

// ─── Tables ─────────────────────────────────────────────────────────────────
export const seedTables: Table[] = [
  { id: 'tb01', name: 'Mesa Novios',            capacity: 10, notes: 'Novios + padrinos principales', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb02', name: 'Familia Novia 1',        capacity: 10, notes: 'Padres y hermanos de Sarahí', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb03', name: 'Familia Novia 2',        capacity: 10, notes: 'Tíos y primos de Sarahí', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb04', name: 'Familia Novio 1',        capacity: 10, notes: 'Padres y hermanos de Naim', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb05', name: 'Familia Novio 2',        capacity: 10, notes: 'Tíos y primos de Naim', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb06', name: 'Familia Extendida Novio',capacity: 10, notes: 'Familia extendida lado Naim', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb07', name: 'Iglesia',               capacity: 10, notes: 'Hermanos y líderes de iglesia', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb08', name: 'Amigos Íntimos 1',      capacity: 10, notes: '', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb09', name: 'Amigos Íntimos 2',      capacity: 10, notes: '', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb10', name: 'Amigos & Compromiso',   capacity: 10, notes: 'Amigos y compromisos varios', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb11', name: 'Varios / Pendientes',   capacity: 10, notes: 'Invitados por confirmar grupo', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb12', name: 'Mesa Reserva 1',        capacity: 10, notes: 'Para invitados de último momento', avoidWith: [], createdAt: t, updatedAt: t },
  { id: 'tb13', name: 'Mesa Reserva 2',        capacity: 10, notes: 'Para invitados de último momento', avoidWith: [], createdAt: t, updatedAt: t },
]

// ─── Guests — Lista actualizada 28-Jun-2026 ──────────────────────────────────
// Confirmados = invitados-2026-06-28.csv (32 confirmados únicos)
export const seedGuests: Guest[] = [
  // ── Familia directa Novio ─────────────────────────────────────────────────
  g('Juan Carlos Vélez',       'groom_family', 'confirmed', null,             'tb04'),
  g('María Isabel Posada',     'groom_family', 'confirmed', null,             'tb04'),
  g('Juan José Vélez',         'groom_family', 'confirmed', 'Angie Calderón', 'tb04'),
  g('Carlos Vélez',            'groom_family', 'confirmed', null,             'tb04'),
  g('Margoth Riofrío',         'groom_family', 'confirmed', null,             'tb04'),
  g('Amparo Quintero',         'groom_family', 'confirmed', null,             'tb04'),
  g('Ángela Posada',           'groom_family', 'pending',   null,             'tb04'),
  g('Claudia Moreno',          'groom_family', 'confirmed', null,             'tb04'),
  g('Evelyn Vélez',            'groom_family', 'confirmed', null,             'tb04'),
  g('Sandra Riofrío',          'groom_family', 'confirmed', null,             'tb05'),
  g('Vladimir Bazante',        'groom_family', 'pending',   null,             'tb05'),
  g('Juan José Bazante',       'groom_family', 'pending',   'Acompañante',    'tb05'),
  g('Joshua Bazante',          'groom_family', 'confirmed', 'Acompañante',    'tb05'),
  g('Pamela Bazante',          'groom_family', 'pending',   'Jacques Simon',  'tb05'),
  g('Vladimir Bazante R.',     'groom_family', 'pending',   'Acompañante',    'tb05'),
  g('Luis Fernando',           'groom_family', 'confirmed', null,             'tb05', false, false, '📸 Fotógrafo y videógrafo — primo de Naim (gratis)'),
  g('María Fernanda Molina',   'groom_family', 'pending',   'Inti Molina',    'tb05'),
  g('Lucciana Gallegos',       'groom_family', 'pending',   null,             null),
  g('Alexander Molina',        'groom_family', 'pending',   null,             'tb05'),
  g('Juan Manuel Molina',      'groom_family', 'pending',   null,             'tb05'),
  // ── Familia extendida Novio ───────────────────────────────────────────────
  g('Olga Lara',               'groom_family', 'pending',   null,             'tb06', true),
  g('María Fernanda Haro',     'groom_family', 'pending',   'Geovanny Andrade','tb06'),
  g('Valentina Andrade',       'groom_family', 'pending',   null,             'tb06'),
  g('Mateo Andrade',           'groom_family', 'pending',   null,             'tb06'),
  g('Lupe Eguez',              'groom_family', 'pending',   null,             'tb06', true),
  g('David Illingworth',       'groom_family', 'pending',   'Por confirmar',  'tb06'),
  g('Pepe Vélez',              'groom_family', 'pending',   'Por confirmar',  'tb06'),
  g('Susana (tía)',             'groom_family', 'pending',   'Por confirmar',  'tb06', true),
  g('Anita Riofrío',           'groom_family', 'pending',   'Guillo',         null),
  g('David Haro',              'groom_family', 'pending',   'Pareja',         null),
  g('Paola Haro',              'groom_family', 'pending',   'Pareja',         null),
  g('Ricardo Riofrío',         'groom_family', 'pending',   null,             'tb06'),
  g('Bianca Vélez',            'groom_family', 'pending',   'Acompañante',    'tb06'),
  g('Andrés Vaca',             'groom_family', 'pending',   'Acompañante',    'tb06'),
  // ── Familia directa Novia ─────────────────────────────────────────────────
  g('Renán Guevara',           'bride_family', 'confirmed', null,             'tb02'),
  g('Mónica Ibarra',           'bride_family', 'confirmed', null,             'tb02'),
  g('Flor Gaibor',             'bride_family', 'confirmed', null,             'tb02'),
  g('Arely Guevara',           'bride_family', 'confirmed', 'Miguel Rocha',   'tb02'),
  g('David Guevara',           'bride_family', 'pending',   'Anahis Santillán','tb02'),
  g('Renán P. Guevara',        'bride_family', 'pending',   'Gabriela Suquillo','tb02'),
  g('Paola Guevara',           'bride_family', 'pending',   null,             'tb02'),
  g('Tannia Guevara',          'bride_family', 'pending',   null,             'tb03'),
  g('Ana María Guevara',       'bride_family', 'pending',   null,             'tb03'),
  g('Byron Ibarra',            'bride_family', 'confirmed', null,             'tb03'),
  g('Verónica Ibarra',         'bride_family', 'pending',   null,             'tb03'),
  g('Elizabeth Ibarra',        'bride_family', 'pending',   null,             'tb03'),
  g('Patricio Guevara',        'bride_family', 'pending',   'Lucy',           'tb03', true),
  // ── Iglesia ───────────────────────────────────────────────────────────────
  g('Isaac Zambrano',          'church',       'confirmed', null,             'tb07'),
  g('Sharon',                  'church',       'confirmed', null,             'tb07'),
  g('Xavier',                  'church',       'pending',   null,             'tb07'),
  g('María Eugenia',           'church',       'pending',   null,             'tb07'),
  g('José (iglesia)',           'church',       'pending',   null,             'tb07'),
  g('Mathías',                 'church',       'pending',   null,             'tb07'),
  g('Klever',                  'church',       'pending',   'Mujer',          'tb07'),
  g('Malena',                  'church',       'pending',   null,             'tb07'),
  g('Teresa',                  'church',       'pending',   null,             null),
  g('Abby',                    'church',       'pending',   null,             null),
  g('Diego (iglesia)',          'church',       'pending',   null,             null),
  g('Elena (iglesia)',          'church',       'pending',   null,             null),
  g('Baterista',               'church',       'pending',   null,             null, false, false, 'Músico de iglesia'),
  // ── Amigos íntimos ────────────────────────────────────────────────────────
  g('Mateo Bracho',            'friends',      'confirmed', 'Acompañante',    'tb08'),
  g('Estefi Erazo',            'friends',      'pending',   'Acompañante',    'tb08'),
  g('Fabián Urresta',          'friends',      'confirmed', 'Acompañante',    'tb08'),
  g('Joyce Baus',              'friends',      'pending',   null,             'tb08'),
  g('Jeremy',                  'friends',      'pending',   'Acompañante',    'tb09'),
  g('Jaime Orquera',           'friends',      'pending',   'Vanessa',        'tb09'),
  g('Kandy Jaramillo',         'friends',      'pending',   'Acompañante',    'tb09'),
  g('Mayra Ormaza',            'friends',      'confirmed', 'Acompañante',    'tb09'),
  // ── Por confirmar (pendientes) ────────────────────────────────────────────
  g('Nancy Andrade',           'other',        'pending',   null,             'tb10'),
  g('Petronio Calderón',       'other',        'pending',   null,             'tb10'),
  g('Fabrizio Celleri',        'other',        'pending',   null,             'tb10'),
  g('Alejandra Cereceda',      'other',        'pending',   null,             'tb10'),
  g('Gabriela Acosta',         'other',        'pending',   'Acompañante',    'tb11'),
  g('Nicole Ruiz',             'other',        'pending',   'Acompañante',    null),
  // ── Confirmados CSV 28-Jun-2026 ───────────────────────────────────────────
  g('Alejandra Pozo',          'other',        'confirmed', null,             null),
  g('Angie Calderón',          'other',        'confirmed', null,             null),
  g('Jacqueline Viteri',       'other',        'confirmed', 'Acompañante',    'tb11'),
  g('Erick Tigse',             'other',        'confirmed', 'Acompañante',    null),
  g('Joel Solís',              'other',        'confirmed', null,             null),
  g('Ángel Túnala',            'other',        'confirmed', null,             null),
  g('Sofía Velasco',           'other',        'confirmed', null,             'tb11'),
  g('Miguel Rocha',            'bride_family', 'confirmed', null,             'tb02'),
  g('Carolina Olmedo',         'other',        'confirmed', null,             null),
  g('Anahis Santillán',        'bride_family', 'confirmed', null,             'tb02'),
  g('Estefanny Chávez',        'friends',      'confirmed', null,             null),
]

// ─── Budget — Portal del Lago Paquete Élite · $5,183 venue + extras ──────────
// 100 personas · Fotografía GRATIS (Luis Fernando)
export const seedBudget: BudgetItem[] = [
  {
    id: uid(), concept: 'Portal del Lago — Paquete Élite (100 pax)',
    category: 'venue', estimatedAmount: 5183, realAmount: 5183, paidAmount: 0,
    status: 'pending', priority: 'mandatory', dueDate: '2026-07-15',
    vendorId: null, notes: '$51.83/persona × 100 pax. INCLUYE: salón 8h, coordinación, decoración, arreglos florales, mantelería, sillas Tiffany, vajilla, menú 4 tiempos, bocaditos (3/persona), bebidas (gaseosas/agua/limonada/té helado/Jamaica), hielo, descorche, DJ + sonido profesional, luces, maestro de ceremonias, personal completo, backing + espejo + pirotecnia + neblina vals. NO incluye vino.', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Fotografía y video',
    category: 'photography', estimatedAmount: 0, realAmount: 0, paidAmount: 0,
    status: 'paid', priority: 'mandatory', dueDate: '',
    vendorId: null, notes: '✅ GRATIS — Luis Fernando (primo de Naim) cubre fotos y video completo', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Vestido de novia',
    category: 'dress', estimatedAmount: 400, realAmount: 400, paidAmount: 400,
    status: 'paid', priority: 'mandatory', dueDate: '2026-06-01',
    vendorId: null, notes: '✅ Pagado', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Traje del novio',
    category: 'suit', estimatedAmount: 180, realAmount: 180, paidAmount: 180,
    status: 'paid', priority: 'mandatory', dueDate: '2026-06-01',
    vendorId: null, notes: '✅ Pagado', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Maquillaje y peinado (novia)',
    category: 'makeup', estimatedAmount: 120, realAmount: 120, paidAmount: 0,
    status: 'pending', priority: 'mandatory', dueDate: '2026-08-01',
    vendorId: null, notes: 'Incluye prueba previa', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Torta de bodas',
    category: 'food', estimatedAmount: 80, realAmount: 80, paidAmount: 0,
    status: 'pending', priority: 'important', dueDate: '2026-08-05',
    vendorId: null, notes: 'Pastelería local Ibarra — 3 pisos para 100 personas (adicional al postre del paquete)', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Recuerdos para invitados',
    category: 'souvenirs', estimatedAmount: 100, realAmount: 100, paidAmount: 0,
    status: 'pending', priority: 'optional', dueDate: '2026-07-20',
    vendorId: null, notes: 'Detalle simple: vela, semilla, o chocolate personalizado', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Impresiones (menús, programa ceremonia, carteles sobre)',
    category: 'other', estimatedAmount: 40, realAmount: 40, paidAmount: 0,
    status: 'pending', priority: 'important', dueDate: '2026-07-25',
    vendorId: null, notes: 'Incluye CARTEL para sobres/regalos en efectivo', receipt: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), concept: 'Imprevistos / Emergencias',
    category: 'unexpected', estimatedAmount: 150, realAmount: 0, paidAmount: 0,
    status: 'pending', priority: 'important', dueDate: '',
    vendorId: null, notes: 'Fondo de emergencia — guardar en efectivo el día de la boda', receipt: '', createdAt: t, updatedAt: t,
  },
]
// Total estimado: $6,073 (Portal del Lago $5,183 + extras) · Presupuesto aprobado: $5,000

// ─── Vendors ────────────────────────────────────────────────────────────────
export const seedVendors: Vendor[] = [
  {
    id: 'v1', name: 'Catering / Cocinera (por definir)',
    service: 'Moro con carne + postre para 130 personas',
    contact: 'Por confirmar', phone: '', email: '', city: 'Ibarra',
    totalValue: 1040, advance: 0, balance: 1040, dueDate: '2026-08-01',
    status: 'quoting', hasContract: false, risk: 'high',
    notes: '$6.75 moro + $1.25 postre = $8/persona × 130. Cotizar 3 opciones mínimo.',
    createdAt: t, updatedAt: t,
  },
  {
    id: 'v2', name: 'Luis Fernando (primo Naim)',
    service: 'Fotografía y video completo',
    contact: 'Luis Fernando', phone: '', email: '', city: 'Ibarra',
    totalValue: 0, advance: 0, balance: 0, dueDate: '',
    status: 'reserved', hasContract: false, risk: 'low',
    notes: '✅ GRATIS — primo del novio. Confirmar cámara, memoria SD, batería cargada.',
    createdAt: t, updatedAt: t,
  },
  {
    id: 'v3', name: 'DJ (por definir)',
    service: 'DJ + equipo de sonido completo',
    contact: 'Por confirmar', phone: '', email: '', city: 'Ibarra',
    totalValue: 350, advance: 100, balance: 250, dueDate: '2026-07-15',
    status: 'quoting', hasContract: false, risk: 'medium',
    notes: 'Playlist: Juan Luis Guerra, Carlos Vives, Fonseca, Romeo Santos, Marc Anthony. Todo música de amor.',
    createdAt: t, updatedAt: t,
  },
  {
    id: 'v4', name: 'Pastelería (por definir)',
    service: 'Torta de bodas 3 pisos',
    contact: 'Por confirmar', phone: '', email: '', city: 'Ibarra',
    totalValue: 80, advance: 0, balance: 80, dueDate: '2026-08-05',
    status: 'quoting', hasContract: false, risk: 'low',
    notes: 'Cotizar en 3 pastelerías locales de Ibarra.',
    createdAt: t, updatedAt: t,
  },
  {
    id: 'v5', name: 'Maquillista (por definir)',
    service: 'Maquillaje y peinado novia',
    contact: 'Por confirmar', phone: '', email: '', city: 'Ibarra',
    totalValue: 120, advance: 0, balance: 120, dueDate: '2026-08-01',
    status: 'quoting', hasContract: false, risk: 'medium',
    notes: 'Incluir prueba en julio. Llegar a las 08:00 el día de la boda.',
    createdAt: t, updatedAt: t,
  },
]

// ─── Checklist ──────────────────────────────────────────────────────────────
export const seedTasks: Task[] = [
  // Completadas
  { id: uid(), title: 'Elegir vestido de novia', description: '', dueDate: '2026-04-01', suggestedDate: '', responsible: 'Sarahí', priority: 'urgent', status: 'completed', category: 'Vestuario', monthsBefore: 4, notes: '', completedAt: t, createdAt: t, updatedAt: t },
  { id: uid(), title: 'Comprar traje del novio', description: '', dueDate: '2026-04-01', suggestedDate: '', responsible: 'Naim', priority: 'urgent', status: 'completed', category: 'Vestuario', monthsBefore: 4, notes: '', completedAt: t, createdAt: t, updatedAt: t },
  // Urgentes / pendientes
  { id: uid(), title: 'Definir y reservar el lugar del evento', description: 'Decidir entre: Padel de la tía, Hostería Ambuqui, o Airbnb cerca de Ibarra', dueDate: '2026-06-30', suggestedDate: '2026-06-15', responsible: 'Naim y Sarahí', priority: 'urgent', status: 'pending', category: 'Lugar', monthsBefore: 1, notes: 'Ver comparación de 3 opciones en Plan B', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Contratar DJ', description: 'Confirmar disponibilidad para 8/08/2026. Entregar playlist.', dueDate: '2026-06-30', suggestedDate: '2026-06-15', responsible: 'Naim', priority: 'urgent', status: 'pending', category: 'Música', monthsBefore: 1, notes: 'Playlist: Juan Luis Guerra, Carlos Vives, Fonseca', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Contratar cocinera / catering para moro', description: 'Moro con carne $6.75 + postre $1.25 = $8/persona × 130', dueDate: '2026-07-01', suggestedDate: '2026-06-20', responsible: 'Sarahí', priority: 'urgent', status: 'pending', category: 'Comida', monthsBefore: 1, notes: 'Cotizar mínimo 3 opciones', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Confirmar asistencia a todos los invitados', description: 'Llamar/WhatsApp a pendientes para confirmar número exacto', dueDate: '2026-07-15', suggestedDate: '2026-07-01', responsible: 'Sarahí + mamá', priority: 'high', status: 'pending', category: 'Invitados', monthsBefore: 1, notes: 'Lista actual: 124. Meta: confirmar todos antes del 15/07', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Confirmar disponibilidad Luis Fernando (fotos)', description: 'Confirmar que tiene equipo, memoria, batería y backup', dueDate: '2026-07-01', suggestedDate: '2026-06-20', responsible: 'Naim', priority: 'urgent', status: 'pending', category: 'Fotografía', monthsBefore: 1, notes: 'Preguntar si tiene cámara de video o necesitamos cámara adicional', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Diseñar y enviar invitaciones digitales', description: 'Incluir: fecha, hora 14:00, lugar (cuando esté confirmado), y nota de regalo en sobre', dueDate: '2026-07-01', suggestedDate: '2026-06-15', responsible: 'Sarahí', priority: 'high', status: 'pending', category: 'Invitados', monthsBefore: 1, notes: 'La invitación DEBE mencionar que el regalo es solo en sobre (efectivo o transferencia)', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Prueba de maquillaje y peinado', description: 'Sesión de prueba previa a la boda', dueDate: '2026-07-20', suggestedDate: '2026-07-15', responsible: 'Sarahí', priority: 'high', status: 'pending', category: 'Belleza', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Encargar bocaditos variados', description: 'Dulces y salados para mesa de autoservicio. Pedir a persona de confianza o catering.', dueDate: '2026-07-25', suggestedDate: '2026-07-15', responsible: 'Sarahí / mamá', priority: 'high', status: 'pending', category: 'Comida', monthsBefore: 0, notes: 'Variedad: tequeños, empanadas, canguil, mini sánduches, suspiros, trufas', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Comprar cervezas en distribuidora', description: '150 latas Pilsener — buscar precio al por mayor $0.72-$0.75/lata', dueDate: '2026-08-05', suggestedDate: '2026-08-01', responsible: 'Naim', priority: 'medium', status: 'pending', category: 'Bebidas', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Comprar mimosas (cava + jugo)', description: '10 botellas cava + 10 L jugo naranja para ~100 copas', dueDate: '2026-08-06', suggestedDate: '2026-08-05', responsible: 'Naim', priority: 'medium', status: 'pending', category: 'Bebidas', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Asignar mesas a todos los invitados confirmados', description: '', dueDate: '2026-07-25', suggestedDate: '2026-07-20', responsible: 'Sarahí', priority: 'high', status: 'pending', category: 'Logística', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Imprimir carteles "el regalo es en sobre"', description: 'Diseño elegante para poner en entrada y mesas', dueDate: '2026-07-30', suggestedDate: '2026-07-25', responsible: 'Naim o Sarahí', priority: 'high', status: 'pending', category: 'Logística', monthsBefore: 0, notes: 'Texto: "Tu regalo más especial es tu presencia. Si deseas obsequiarnos algo, lo recibimos en sobre 💌"', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Ensayo general de la ceremonia', description: 'Ensayo en el lugar con el pastor', dueDate: '2026-08-07', suggestedDate: '2026-08-07', responsible: 'Novios + Pastor', priority: 'high', status: 'pending', category: 'Ceremonia', monthsBefore: 0, notes: 'Día anterior a la boda', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Preparar kit de emergencia completo', description: 'Ver lista en módulo Kit de Emergencia', dueDate: '2026-08-07', suggestedDate: '2026-08-06', responsible: 'Sarahí + dama', priority: 'medium', status: 'pending', category: 'Logística', monthsBefore: 0, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), title: 'Pedir pizzas el día del evento', description: '5-6 pizzas grandes para mesa de autoservicio', dueDate: '2026-08-08', suggestedDate: '2026-08-08', responsible: 'Responsable asignado', priority: 'medium', status: 'pending', category: 'Comida', monthsBefore: 0, notes: 'Pedir a las 15:30 para que lleguen a las 16:30', createdAt: t, updatedAt: t },
]

// ─── Cronograma Real — Sábado 8 de agosto 2026 (ceremonia 14:00) ─────────────
export const seedDaySchedule: DayEvent[] = [
  { id: uid(), time: '08:00', activity: 'Preparación de la novia — maquillaje y peinado',        duration: 180, responsible: 'Sarahí + maquillista',        notes: 'En casa o salón. Maquillista llega puntual.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '11:00', activity: 'Novio se alista / familia llega al lugar',               duration: 90,  responsible: 'Naim + familia',               notes: '', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '12:00', activity: 'Decoración final del lugar / última revisión',           duration: 120, responsible: 'Responsable deco + familia',   notes: 'Flores, mesas, carteles, mesas de bocaditos y pizza listas', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '12:30', activity: 'Fotos previas — novia lista (getting ready)',             duration: 45,  responsible: 'Luis Fernando (fotógrafo)',    notes: 'Fotos íntimas de la novia antes de la ceremonia', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '13:20', activity: 'Fotos previas — novio y familia',                        duration: 30,  responsible: 'Luis Fernando (fotógrafo)',    notes: '', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '13:30', activity: 'Llegada y acomodación de invitados',                     duration: 30,  responsible: 'Responsable de bienvenida',   notes: 'Recibir con música ambiental suave. Entregar programa.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '14:00', activity: '⛪ INICIO DE LA CEREMONIA',                              duration: 75,  responsible: 'Pastor / Officiante',          notes: 'Entrada de padrinos → novio → novia. Ver módulo Ceremonia.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '15:15', activity: 'Fin de ceremonia — salida de novios + confeti/pétalos',  duration: 15,  responsible: 'Invitados + coordinador',     notes: 'Lluvia de pétalos en la salida', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '15:30', activity: 'Fotos grupales — familias, padrinos, amigos',            duration: 45,  responsible: 'Luis Fernando (fotógrafo)',    notes: 'Secuencia: novios solos → familias → amigos → todos', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '16:15', activity: 'Fotos de novios en exteriores (locación)',               duration: 45,  responsible: 'Luis Fernando (fotógrafo)',    notes: 'Sesión romántica. Elegir locación antes del evento.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '16:30', activity: '🍕 Mesa de bocaditos + pizza abierta para invitados',   duration: 60,  responsible: 'Catering / responsable mesas', notes: 'Invitados se sirven libremente. DJ pone música ambiente.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '17:30', activity: '🎉 ENTRADA OFICIAL DE LOS NOVIOS AL SALÓN',             duration: 15,  responsible: 'DJ + Maestro de Ceremonia',   notes: 'Canción de entrada alegre. Aplausos. Serpentinas.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '17:45', activity: 'Palabras de bienvenida + oración de apertura',           duration: 10,  responsible: 'Maestro de Ceremonia / Pastor', notes: 'Anunciar también la opción de regalo en sobre', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '17:55', activity: '🍽️ Servicio del almuerzo — Moro con carne + postre',   duration: 60,  responsible: 'Catering / cocinera',         notes: 'Servicio en mesas. Bebidas disponibles.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '18:55', activity: 'Palabras de familiares y amigos (máx. 4 personas)',      duration: 25,  responsible: 'Maestro de Ceremonia',        notes: 'Máx. 5 min por persona. Coordinar con anticipación quiénes hablan.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '19:20', activity: '🥂 BRINDIS + Corte de torta',                           duration: 20,  responsible: 'Maestro de Ceremonia + DJ',   notes: 'Mimosas para el brindis', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '19:40', activity: '💃 PRIMER BAILE de los novios',                         duration: 10,  responsible: 'DJ',                           notes: 'La canción favorita de la pareja. Pista despejada.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '19:50', activity: 'Baile del novio con su madre / novia con su padre',      duration: 10,  responsible: 'DJ',                           notes: '', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '20:00', activity: '🎮 Juegos y dinámicas (bingo, trivia, quién dijo)',     duration: 40,  responsible: 'Maestro de Ceremonia',        notes: 'Ver módulo Juegos. Premios listos.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '20:40', activity: '🎵 FIESTA — DJ en vivo (Juan Luis Guerra, Carlos Vives, Fonseca...)', duration: 150, responsible: 'DJ', notes: 'Tinto de verano + cerveza disponibles. Música romántica y bailable.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '23:10', activity: 'Anuncio cierre + sorteo de centros de mesa',             duration: 15,  responsible: 'Maestro de Ceremonia',        notes: 'Invitados se llevan el centro de mesa como recuerdo', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), time: '23:25', activity: '✨ DESPEDIDA DE NOVIOS — lluvia de bengalas / pétalos', duration: 15,  responsible: 'Todos los invitados',         notes: 'Final emotivo. Última foto grupal.', status: 'planned', createdAt: t, updatedAt: t },
]

// ─── Ceremony ───────────────────────────────────────────────────────────────
export const seedCeremony: CeremonyStep[] = [
  { id: uid(), order: 1, title: 'Música de entrada (ambiente)',    description: 'Música suave mientras llegan los invitados',                  responsible: 'DJ / músico iglesia', duration: 15, text: '', notes: 'Canon in D o música instrumental', createdAt: t, updatedAt: t },
  { id: uid(), order: 2, title: 'Entrada de padrinos',            description: 'Los padrinos ingresan y toman sus lugares',                   responsible: 'Padrinos',            duration: 3,  text: '', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 3, title: 'Entrada del novio',              description: 'Naim entra acompañado de su madre',                           responsible: 'Naim + madre',        duration: 3,  text: '¡De pie para recibir al novio!', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 4, title: 'Entrada de la novia',            description: 'Sarahí entra al son de su canción elegida',                   responsible: 'Sarahí + padre',      duration: 4,  text: '¡Todos de pie para recibir a la novia!', notes: 'A Thousand Years - Christina Perri (instrumental)', createdAt: t, updatedAt: t },
  { id: uid(), order: 5, title: 'Palabras de bienvenida',         description: 'El pastor da la bienvenida',                                  responsible: 'Pastor / Officiante', duration: 5,  text: 'Bienvenidos a esta celebración sagrada. Estamos aquí para ser testigos del amor de Naim y Sarahí.', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6, title: 'Oración inicial',               description: 'Oración de apertura por la unión',                            responsible: 'Pastor / Officiante', duration: 4,  text: 'Padre, bendice esta unión. Que sea un reflejo de Tu amor.', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 7, title: 'Lectura bíblica',               description: 'Lectura especial por un invitado',                            responsible: 'Invitado especial',   duration: 4,  text: '1 Corintios 13:4-8 — "El amor es paciente, es bondadoso..."', notes: 'Elegir quién lee con anticipación', createdAt: t, updatedAt: t },
  { id: uid(), order: 8, title: 'Mensaje del pastor',            description: 'Reflexión sobre el matrimonio y el amor',                     responsible: 'Pastor / Officiante', duration: 15, text: '', notes: 'Pedir al pastor que sea cálido, breve y personal para Naim y Sarahí', createdAt: t, updatedAt: t },
  { id: uid(), order: 9, title: 'Votos matrimoniales',           description: 'Intercambio de votos personalizados',                         responsible: 'Naim y Sarahí',       duration: 8,  text: 'Yo, [nombre], te tomo a ti como mi esposo/a, para amarte y respetarte, en la salud y en la enfermedad, en la alegría y en el dolor, todos los días de mi vida.', notes: 'Preparar votos personalizados — pueden agregar anécdotas propias', createdAt: t, updatedAt: t },
  { id: uid(), order: 10, title: 'Intercambio de anillos',        description: 'Colocación y bendición de los anillos',                       responsible: 'Naim, Sarahí, Pastor', duration: 5, text: 'Con este anillo, símbolo de mi amor eterno, yo te desposo.', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 11, title: 'Declaración de matrimonio',     description: 'El pastor los declara casados',                               responsible: 'Pastor / Officiante', duration: 2,  text: '¡Los declaro marido y mujer! ¡Puede besar a la novia!', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 12, title: 'El primer beso como casados',   description: 'Primer beso matrimonial',                                     responsible: 'Naim y Sarahí',       duration: 2,  text: '', notes: '📸 Foto obligatoria', createdAt: t, updatedAt: t },
  { id: uid(), order: 13, title: 'Firma del acta / Oración final', description: 'Firma con testigos y oración de cierre',                     responsible: 'Novios + Padrinos',   duration: 8,  text: '', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 14, title: 'Salida de los novios',          description: 'Salida triunfal entre los invitados con pétalos',             responsible: 'Todos',               duration: 5,  text: '¡Aplaudan a los nuevos esposos, Naim y Sarahí!', notes: 'Lluvia de pétalos / confeti biodegradable', createdAt: t, updatedAt: t },
]

// ─── Music — Playlist completa ───────────────────────────────────────────────
export const seedMusic: MusicItem[] = [
  // Momentos obligatorios
  { id: uid(), order: 1,  moment: 'Ambiente — llegada de invitados',      song: 'Colección instrumental romántica', artist: 'Varios',           responsible: 'DJ', duration: 30, isProhibited: false, isMandatory: true,  notes: 'Bossa nova / jazz romántico suave', createdAt: t, updatedAt: t },
  { id: uid(), order: 2,  moment: 'Entrada de la novia',                  song: 'A Thousand Years (instrumental)', artist: 'Christina Perri',  responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: true,  notes: 'Versión instrumental o en vivo', createdAt: t, updatedAt: t },
  { id: uid(), order: 3,  moment: 'Entrada oficial novios al salón',       song: 'Vivir Mi Vida',                  artist: 'Marc Anthony',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: true,  notes: '🎉 Alegre, festivo, que suban el ánimo', createdAt: t, updatedAt: t },
  { id: uid(), order: 4,  moment: 'Primer baile de novios',                song: 'Por definir (favorita pareja)',   artist: '',                 responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: true,  notes: 'Elegir la canción que los represente. Opciones: Burbujas de Amor, Te Mando Flores, Bésame', createdAt: t, updatedAt: t },
  { id: uid(), order: 5,  moment: 'Baile novio con su madre',              song: 'La Niña de mis Ojos',            artist: 'Varios (bolero)',  responsible: 'DJ', duration: 3,  isProhibited: false, isMandatory: true,  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6,  moment: 'Baile novia con su padre',              song: 'Hija',                           artist: 'Ricardo Arjona',   responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: true,  notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 7,  moment: 'Brindis',                               song: 'A pedir su Mano',                artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 2,  isProhibited: false, isMandatory: true,  notes: 'Mientras se sirven las mimosas', createdAt: t, updatedAt: t },
  // Playlist fiesta — Juan Luis Guerra
  { id: uid(), order: 10, moment: 'Playlist fiesta',                       song: 'Burbujas de Amor',               artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 11, moment: 'Playlist fiesta',                       song: 'Estrellitas y Duendes',          artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 12, moment: 'Playlist fiesta',                       song: 'La Bilirrubina',                 artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '¡La favorita!', createdAt: t, updatedAt: t },
  { id: uid(), order: 13, moment: 'Playlist fiesta',                       song: 'El Niágara en Bicicleta',        artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 14, moment: 'Playlist fiesta',                       song: 'Ojalá que llueva café',          artist: 'Juan Luis Guerra', responsible: 'DJ', duration: 3,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  // Carlos Vives
  { id: uid(), order: 20, moment: 'Playlist fiesta',                       song: 'La Bicicleta',                   artist: 'Carlos Vives & Shakira', responsible: 'DJ', duration: 3, isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 21, moment: 'Playlist fiesta',                       song: 'Robarte un Beso',                artist: 'Carlos Vives',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 22, moment: 'Playlist fiesta',                       song: 'Bésame',                         artist: 'Carlos Vives',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 23, moment: 'Playlist fiesta',                       song: 'Volví a Nacer',                  artist: 'Carlos Vives',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '💕 Muy romántica', createdAt: t, updatedAt: t },
  { id: uid(), order: 24, moment: 'Playlist fiesta',                       song: 'Casualidad',                     artist: 'Carlos Vives',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  // Fonseca
  { id: uid(), order: 30, moment: 'Playlist fiesta',                       song: 'Te Mando Flores',                artist: 'Fonseca',          responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '💐 Ideal para el primer baile también', createdAt: t, updatedAt: t },
  { id: uid(), order: 31, moment: 'Playlist fiesta',                       song: 'Eres Mi Sueño',                  artist: 'Fonseca',          responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 32, moment: 'Playlist fiesta',                       song: 'No Te Cambio',                   artist: 'Fonseca',          responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  // Otros románticos
  { id: uid(), order: 40, moment: 'Playlist fiesta',                       song: 'Propuesta Indecente',            artist: 'Romeo Santos',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 41, moment: 'Playlist fiesta',                       song: 'Obsesión',                       artist: 'Aventura',         responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 42, moment: 'Playlist fiesta',                       song: 'Por Fin Te Encontré',            artist: 'Cali & El Dandee', responsible: 'DJ', duration: 3,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 43, moment: 'Playlist fiesta',                       song: 'Corazón sin Cara',               artist: 'Prince Royce',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 44, moment: 'Playlist fiesta',                       song: 'Darte un Beso',                  artist: 'Prince Royce',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 45, moment: 'Playlist fiesta',                       song: 'Vivir Mi Vida',                  artist: 'Marc Anthony',     responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '🔥 Para subir la energía', createdAt: t, updatedAt: t },
  { id: uid(), order: 46, moment: 'Playlist fiesta',                       song: 'Hasta el Fin del Mundo',         artist: 'Cristian Castro',  responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 47, moment: 'Playlist fiesta',                       song: 'Quiero',                         artist: 'Morat',            responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 48, moment: 'Playlist fiesta',                       song: 'Es Por Ti',                      artist: 'Juanes',           responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 49, moment: 'Cierre emotivo',                        song: 'Cuando Nadie Ve',                artist: 'Alejandro Sanz',   responsible: 'DJ', duration: 4,  isProhibited: false, isMandatory: false, notes: 'Canción de cierre emotivo', createdAt: t, updatedAt: t },
  // Prohibidas
  { id: uid(), order: 99, moment: 'PROHIBIDA',                             song: 'Reggaetón explícito / letras vulgares', artist: 'Varios', responsible: '', duration: 0,  isProhibited: true,  isMandatory: false, notes: 'No reggaetón vulgar. La música debe ser familiar y de amor.', createdAt: t, updatedAt: t },
]

// ─── MC Script ──────────────────────────────────────────────────────────────
export const seedMCScript: MCSection[] = [
  { id: uid(), order: 1, title: 'Bienvenida inicial',
    content: 'Buenas tardes a todos. Bienvenidos a esta celebración tan especial. Es un honor recibirles hoy para ser testigos del amor y la unión de Naim y Sarahí. Esta tarde es de ellos — y de cada uno de ustedes que son parte de su historia.',
    timing: 'Antes de la ceremonia (13:45)', notes: 'Música baja, tono cálido', createdAt: t, updatedAt: t },
  { id: uid(), order: 2, title: 'Entrada de los novios al salón',
    content: 'Damas y caballeros, con mucha alegría y emoción, ¡les pedimos que se pongan de pie para recibir a los protagonistas de esta tarde! ¡Los nuevos esposos, Naim y Sarahí!',
    timing: '17:30 — entrada al salón', notes: 'DJ sube música alegre. Aplausos, serpentinas.', createdAt: t, updatedAt: t },
  { id: uid(), order: 3, title: 'Anuncio del regalo en sobre',
    content: 'Antes de comenzar, Naim y Sarahí nos han pedido compartirles algo importante: su deseo más grande es que estén aquí con ellos. Si desean hacerles un regalo, lo reciben con mucho cariño en sobre — ya sea en efectivo o por transferencia. Los sobres estarán disponibles en la mesa de entrada. ¡Muchas gracias por su generosidad y amor!',
    timing: '17:45 — palabras de bienvenida', notes: '⚠️ Importante mencionar esto con gracia, sin que suene incómodo', createdAt: t, updatedAt: t },
  { id: uid(), order: 4, title: 'Anuncio mesas de bocaditos y pizza',
    content: 'En este momento tienen disponibles nuestra mesa de bocaditos y nuestra mesa de pizza — siéntanse libres de acercarse y servirse. ¡Está todo para ustedes!',
    timing: '16:30 — apertura mesas', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 5, title: 'Anuncio del almuerzo',
    content: 'Los invitamos a tomar su lugar en la mesa asignada. En unos momentos les serviremos el almuerzo. Disfruten de la compañía y de estos momentos únicos que jamás se repiten.',
    timing: '17:55 — antes del almuerzo', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 6, title: 'Palabras de familiares',
    content: 'Ha llegado uno de los momentos más emotivos: las palabras de quienes más los conocen y los aman. Les pido que sean breves pero desde el corazón — máximo 5 minutos. Que el amor que sientan por ellos se sienta en cada palabra.',
    timing: '18:55', notes: 'Coordinar con anticipación quiénes van a hablar (máx. 4 personas)', createdAt: t, updatedAt: t },
  { id: uid(), order: 7, title: 'Brindis',
    content: '¡Llegó el momento del brindis! Levantemos las copas y brindemos por Naim y Sarahí. Por su amor, por su futuro, por las aventuras que les esperan juntos. ¡Salud!',
    timing: '19:20', notes: 'DJ baja música durante el brindis', createdAt: t, updatedAt: t },
  { id: uid(), order: 8, title: 'Primer baile',
    content: 'Y ahora, el momento que todos estábamos esperando. Les pedimos que despejemos la pista de baile. Naim, Sarahí… la pista es suya. ¡Que bailen como si nadie los mirara!',
    timing: '19:40', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), order: 9, title: 'Inicio de juegos',
    content: '¡Llegó la hora de divertirnos! Vamos a ver quién conoce mejor a los novios. Por favor presten atención, porque ¡hay premios en juego!',
    timing: '20:00', notes: 'Ver módulo Juegos para el guion completo de cada dinámica', createdAt: t, updatedAt: t },
  { id: uid(), order: 10, title: 'Cierre y despedida',
    content: 'Llegamos al final de esta noche tan hermosa. En nombre de Naim y Sarahí, mil gracias por estar aquí, por su amor y por hacer de este día algo que ninguno olvidaremos. ¡Que vivan los novios! ¡Que viva el amor!',
    timing: '23:10', notes: 'Seguido del sorteo de centros de mesa y la despedida con bengalas', createdAt: t, updatedAt: t },
]

// ─── Games ──────────────────────────────────────────────────────────────────
export const seedGames: Game[] = [
  { id: uid(), name: '¿Qué tanto conoces a los novios?', description: 'El MC hace preguntas sobre Naim y Sarahí. Cada mesa anota sus respuestas. Gana la mesa con más aciertos. Las preguntas se preparan con anticipación (gustos, cómo se conocieron, fechas especiales).', timing: 'Después de la cena (20:00)', duration: 20, materials: 'Hojas de preguntas x mesa, esferos, papelitos', responsible: 'Maestro de Ceremonia', prizes: 'Chocolates o botella para la mesa ganadora', notes: 'Preparar 15 preguntas mixtas novio/novia', status: 'confirmed', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Bingo de Boda personalizado', description: 'Cartones de bingo con palabras de la boda (beso, anillo, brindis, etc.). El MC canta las palabras en vez de números. El ganador grita "¡Boda!" en vez de "Bingo".', timing: 'Después del primer baile (20:20)', duration: 20, materials: 'Cartones de bingo impresos (130 uds), marcadores de frijoles o papelitos', responsible: 'Maestro de Ceremonia', prizes: 'Botella de vino o detalle especial', notes: 'Diseñar e imprimir cartones antes. Fácil para todas las edades.', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), name: '¿Quién lo dijo?', description: 'El MC lee frases graciosas o tiernas que dijeron los novios. Los invitados adivina si lo dijo Naim o Sarahí. Muy cómico y personal.', timing: 'Mitad de la fiesta', duration: 10, materials: 'Lista de 10 frases preparadas', responsible: 'Maestro de Ceremonia', prizes: 'Premio para quien acierte más', notes: 'Pedir a los novios que revelen frases graciosas o secretas de su relación', status: 'planned', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Sorteo de centros de mesa', description: 'Al final, se sortea quién se lleva el centro de mesa de cada tabla. El MC anuncia una dinámica simple (el que tenga cierta característica). Los invitados se llevan un recuerdo.', timing: 'Cierre (23:10)', duration: 10, materials: 'Centros de mesa como premios', responsible: 'Maestro de Ceremonia', prizes: 'Centro de mesa', notes: 'Así los invitados se llevan un recuerdo y la decoración no se desperdicia', status: 'confirmed', createdAt: t, updatedAt: t },
]

// ─── Photos ─────────────────────────────────────────────────────────────────
export const seedPhotos: PhotoItem[] = [
  { id: uid(), category: 'Getting Ready', description: 'Novia lista — retrato final antes de salir', isRequired: true, isDone: false, notes: 'Con maquillaje y vestido', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Entrada de la novia', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Cara del novio al ver a la novia', isRequired: true, isDone: false, notes: 'Momento muy emotivo', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Intercambio de anillos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Primer beso como casados', isRequired: true, isDone: false, notes: '📸 La foto más importante', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Ceremonia', description: 'Salida de la iglesia / lugar con pétalos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia', description: 'Novios con padres de Sarahí', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia', description: 'Novios con padres de Naim', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia', description: 'Novios con ambas familias juntas', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia', description: 'Novios con hermanos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Familia', description: 'Novios con adultos mayores / abuelos', isRequired: true, isDone: false, notes: 'Prioridad — son delicados', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Padrinos', description: 'Novios con todos los padrinos', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Amigos', description: 'Novios con amigos íntimos', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Exteriores', description: 'Sesión romántica novios solos (locación)', isRequired: true, isDone: false, notes: '15:30-16:15', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Recepción', description: 'Novios entrando al salón', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Recepción', description: 'Mesa de bocaditos', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Recepción', description: 'Mesa de pizza', isRequired: false, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Recepción', description: 'Brindis + copas de mimosa', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Recepción', description: 'Corte de torta', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Fiesta', description: 'Primer baile de novios', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Fiesta', description: 'Baile con padres', isRequired: true, isDone: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Fiesta', description: 'Despedida final — bengalas / pétalos', isRequired: true, isDone: false, notes: 'Última foto grupal', createdAt: t, updatedAt: t },
  { id: uid(), category: 'Espontáneas', description: 'Risas, abrazos y momentos naturales', isRequired: false, isDone: false, notes: 'Luis Fernando: buscar estos momentos todo el día', createdAt: t, updatedAt: t },
]

// ─── Plan B — opciones de lugar incluidas ────────────────────────────────────
export const seedPlanB: PlanBItem[] = [
  {
    id: uid(), scenario: 'LUGAR OPCIÓN 1 — Padel de la tía (Ibarra)',
    solution: '✅ Ventajas: económico, familiar, sin transporte. ❌ Desventajas: espacio abierto (riesgo lluvia), infraestructura limitada, quizás sin cocina profesional. Verificar capacidad real para 150 personas con mesas.',
    responsible: 'Naim (contactar tía)', materials: 'Carpas como respaldo si llueve', priority: 'high', notes: 'Confirmar: luz, baños, espacio para mesas y pista de baile', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'LUGAR OPCIÓN 2 — Hostería familiar Ambuqui (40 min)',
    solution: '✅ Ventajas: ambiente natural hermoso, espacio grande, posible alojamiento. ❌ Desventajas: 40 min de Ibarra (transporte invitados), más caro, logística compleja. Ideal si quieren noche de bodas allá.',
    responsible: 'Naim y Sarahí', materials: 'Transporte invitados (furgoneta/bus)', priority: 'high', notes: 'Preguntar precio por día completo. Ver si incluye cocina.', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'LUGAR OPCIÓN 3 — Airbnb grande cerca de Ibarra (24h)',
    solution: '✅ Ventajas: privacidad total, pueden quedarse hasta el día siguiente, espacio para alojar familia cercana, ambiente íntimo. ❌ Desventajas: capacidad real de 150 personas, precio de 24h, limpieza final. BUSCAR: haciendas o fincas rurales en Ibarra/Urcuquí/Cotacachi.',
    responsible: 'Sarahí (buscar en Airbnb/Facebook)', materials: 'Buscar en: Airbnb, Facebook Marketplace, grupos de eventos Ibarra', priority: 'high', notes: 'Buscar términos: "hacienda para eventos Ibarra", "finca para bodas Imbabura"', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'Lluvia el día del evento',
    solution: 'Si es en lugar abierto: tener carpa o toldo reservado. Si es en Airbnb/hacienda: verificar que tenga área cubierta suficiente.',
    responsible: 'Naim', materials: 'Contacto de alquiler de carpas en Ibarra', priority: 'high', notes: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'Cocinera / catering falla el día del evento',
    solution: 'Tener número de un segundo contacto. Opción emergencia: pedir pizza adicional + bocaditos extra. Tener $150 en efectivo de emergencia.',
    responsible: 'Sarahí', materials: '$150 efectivo, número de pizzería de confianza', priority: 'high', notes: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'DJ falla / problema con sonido',
    solution: 'Tener playlist en Spotify/YouTube en celular + parlante Bluetooth de respaldo. Designar a alguien que maneje la música de emergencia.',
    responsible: 'Naim', materials: 'Celular cargado, parlante Bluetooth, playlist guardada offline', priority: 'high', notes: '', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'Luis Fernando (fotógrafo) no puede asistir',
    solution: 'Tener de respaldo a un segundo fotógrafo amateur de confianza. O contratar fotógrafo de emergencia con tiempo. No depender solo de Luis Fernando.',
    responsible: 'Naim', materials: 'Número de 1-2 fotógrafos alternativos en Ibarra', priority: 'medium', notes: 'Aunque es gratis, confirmar 2 semanas antes', createdAt: t, updatedAt: t,
  },
  {
    id: uid(), scenario: 'Invitados que traen regalo físico (no sobre)',
    solution: 'Tener una mesa o espacio para recibir objetos. Pero ser muy claros desde la invitación y el MC sobre la preferencia de sobre.',
    responsible: 'Maestro de Ceremonia', materials: 'Cartel elegante: "Tu regalo en sobre es lo más especial 💌"', priority: 'medium', notes: '', createdAt: t, updatedAt: t,
  },
]

// ─── Responsibles ───────────────────────────────────────────────────────────
export const seedResponsibles: Responsible[] = [
  { id: uid(), name: 'Naim', role: 'Novio / Coordinador logística', phone: '', email: '', tasks: 'DJ, bebidas, transporte, pagos, Plan B, contacto proveedores', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Sarahí', role: 'Novia / Coordinadora general', phone: '', email: '', tasks: 'Invitados, mesas, decoración, catering, invitaciones, kit emergencia', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Luis Fernando', role: '📸 Fotógrafo y videógrafo', phone: '', email: '', tasks: 'Fotos y video completo del evento (getting ready → despedida)', notes: 'Primo de Naim. Confirmar equipo, memoria y batería.', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Por definir', role: 'Maestro de Ceremonia', phone: '', email: '', tasks: 'Guion completo, anunciar regalo en sobre, juegos, brindis, cierre', notes: 'Persona con carisma y voz. Ver módulo Guion MC.', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Por definir', role: 'Responsable de mesas de bocaditos y pizza', phone: '', email: '', tasks: 'Montar mesa, reponer, coordinar pizzas a las 15:30, retirar al final', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Por definir (dama de honor)', role: 'Apoyo a la novia + kit emergencia', phone: '', email: '', tasks: 'Cargar kit de emergencia, acompañar a Sarahí, emergencias', notes: '', createdAt: t, updatedAt: t },
]

// ─── Shopping ───────────────────────────────────────────────────────────────
export const seedShopping: ShoppingItem[] = [
  { id: uid(), product: 'Cervezas Pilsener (150 latas)', quantity: 150, estimatedPrice: 0.75, realPrice: 0, vendor: 'Distribuidora al por mayor', priority: 'buy_later', status: 'pending', notes: 'Buscar precio por mayor. Meta: $0.72/lata. Comprar 1 semana antes.', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cava económica (mimosas)', quantity: 10, estimatedPrice: 8, realPrice: 0, vendor: 'Supermaxi / Santa María', priority: 'buy_later', status: 'pending', notes: '10 botellas para ~100 copas de mimosa', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Jugo de naranja (para mimosas)', quantity: 10, estimatedPrice: 2.50, realPrice: 0, vendor: 'Supermaxi', priority: 'buy_later', status: 'pending', notes: '10 litros', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Vino tinto económico (tinto de verano)', quantity: 8, estimatedPrice: 5, realPrice: 0, vendor: 'Supermaxi / Santa María', priority: 'buy_later', status: 'pending', notes: '+ gaseosa limonada', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Agua sin gas (packs)', quantity: 20, estimatedPrice: 2, realPrice: 0, vendor: 'Supermaxi', priority: 'buy_later', status: 'pending', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Gaseosas variadas + jugos (sin alcohol)', quantity: 30, estimatedPrice: 0.70, realPrice: 0, vendor: 'Supermaxi', priority: 'buy_later', status: 'pending', notes: 'Para niños y quienes no toman alcohol', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Hielo (bolsas 5kg)', quantity: 10, estimatedPrice: 2.50, realPrice: 0, vendor: 'Supermaxi', priority: 'buy_later', status: 'pending', notes: 'Comprar día anterior', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Pizzas grandes (mesa de pizza)', quantity: 6, estimatedPrice: 13, realPrice: 0, vendor: 'Pizzería local Ibarra', priority: 'buy_later', status: 'pending', notes: 'Pedir a las 15:30 para que lleguen a las 16:30', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Bocaditos dulces (para la mesa)', quantity: 200, estimatedPrice: 0.50, realPrice: 0, vendor: 'Encargo a familiar / pastelería', priority: 'quote', status: 'pending', notes: 'Suspiros, trufas, mini cakes, alfajores', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Bocaditos salados (para la mesa)', quantity: 200, estimatedPrice: 0.50, realPrice: 0, vendor: 'Encargo a familiar / catering', priority: 'quote', status: 'pending', notes: 'Tequeños, empanadas mini, mini sánduches, canguil gourmet', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cartones Bingo de Boda (impresos)', quantity: 130, estimatedPrice: 0.15, realPrice: 0, vendor: 'Imprenta local', priority: 'buy_now', status: 'pending', notes: 'Diseñar en Canva y mandar a imprimir', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cartel "regalo en sobre" (impreso grande)', quantity: 3, estimatedPrice: 5, realPrice: 0, vendor: 'Imprenta local', priority: 'buy_now', status: 'pending', notes: 'Para entrada, mesa de novios y zona de sobres', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Libro de firmas + árbol de huellas', quantity: 1, estimatedPrice: 20, realPrice: 0, vendor: 'Papelería / Amazon', priority: 'buy_now', status: 'pending', notes: 'Con tampón de colores para las huellas', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Pétalos de rosas (para salida y despedida)', quantity: 5, estimatedPrice: 3, realPrice: 0, vendor: 'Mercado / floristería', priority: 'buy_later', status: 'pending', notes: 'Comprar día anterior', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Bengalas de boda (sparklers)', quantity: 1, estimatedPrice: 20, realPrice: 0, vendor: 'Pirotecnia / Amazon', priority: 'quote', status: 'pending', notes: 'Para la despedida final de los novios', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Sobres para regalos (caja decorativa)', quantity: 1, estimatedPrice: 15, realPrice: 0, vendor: 'Papelería / artesanal', priority: 'buy_now', status: 'pending', notes: 'Caja decorada donde los invitados dejan sus sobres', createdAt: t, updatedAt: t },
]

// ─── Emergency Kit ───────────────────────────────────────────────────────────
export const seedEmergencyKit: EmergencyKitItem[] = [
  { id: uid(), item: 'Aguja e hilo (blanco, beige, negro)', quantity: 1, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Alfileres de seguridad', quantity: 10, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Cinta doble faz', quantity: 1, responsible: 'Sarahí', isPacked: false, notes: 'Para emergencias del vestido', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Curitas / banditas', quantity: 10, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Toallitas húmedas', quantity: 10, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Retoque de maquillaje (base, polvo, labial)', quantity: 1, responsible: 'Sarahí', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Perfume de la novia', quantity: 1, responsible: 'Sarahí', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Desodorante (novio y novia)', quantity: 2, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Cargadores de celular + powerbank', quantity: 2, responsible: 'Naim', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Analgésicos / ibuprofeno', quantity: 6, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Pastillas para el estómago', quantity: 4, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Peine y pasadores extra', quantity: 5, responsible: 'Sarahí', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Tijeras pequeñas', quantity: 1, responsible: 'Dama de honor', isPacked: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Dinero en efectivo de emergencia ($150)', quantity: 1, responsible: 'Naim', isPacked: false, notes: 'Para imprevistos del día', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Protector solar', quantity: 1, responsible: 'Dama de honor', isPacked: false, notes: 'Para fotos al aire libre', createdAt: t, updatedAt: t },
  { id: uid(), item: 'Spray fijador para el pelo (mini)', quantity: 1, responsible: 'Sarahí', isPacked: false, notes: '', createdAt: t, updatedAt: t },
]

// ─── Quotes ─────────────────────────────────────────────────────────────────
export const seedQuotes: Quote[] = [
  { id: uid(), product: 'Moro con carne (plato completo)', vendor: 'Cocinera 1 (por cotizar)', city: 'Ibarra', price: 6.75, unit: 'plato/persona', date: '', contact: '', link: '', notes: 'Precio referencial. Cotizar incluyendo montaje y vajilla.', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Postre (mousse/flan/copa)', vendor: 'Pastelería (por cotizar)', city: 'Ibarra', price: 1.25, unit: 'por persona', date: '', contact: '', link: '', notes: '', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cerveza Pilsener lata 355ml', vendor: 'Distribuidora El Toro', city: 'Ibarra', price: 0.72, unit: 'lata', date: '', contact: '', link: '', notes: 'Mínimo 100 unidades', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cerveza Pilsener lata 355ml', vendor: 'Supermaxi Ibarra', city: 'Ibarra', price: 0.89, unit: 'lata', date: '', contact: '', link: '', notes: 'Precio estante sin descuento', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Cava económica (para mimosas)', vendor: 'Supermaxi', city: 'Ibarra', price: 8.00, unit: 'botella', date: '', contact: '', link: '', notes: 'Buscar marca más económica', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'Pizza grande familiar', vendor: 'Pizzería local (por cotizar)', city: 'Ibarra', price: 13.00, unit: 'pizza', date: '', contact: '', link: '', notes: '8-10 porciones por pizza. Variedades: queso, jamón, mixta.', status: 'pending', createdAt: t, updatedAt: t },
  { id: uid(), product: 'DJ + equipo sonido completo', vendor: 'DJ (por cotizar)', city: 'Ibarra', price: 350.00, unit: 'evento', date: '', contact: '', link: '', notes: 'Incluir luces, micrófono y playlist personalizada', status: 'pending', createdAt: t, updatedAt: t },
]

// ─── Bocaditos ──────────────────────────────────────────────────────────────
export const seedBocaditos: BocaditoOption[] = [
  { id: uid(), option: 'Mesa mixta — encargo a familiar', vendor: 'Familia / amigas', pricePerPerson: 1.50, quantityPerPerson: '3 dulces + 3 salados (aprox)', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Muy económico, toque personal y casero, mayor cantidad', disadvantages: 'Requiere coordinación y trabajo previo de varias personas', recommendation: '⭐ Mejor opción si tienen apoyo familiar. Organizarlo 3 días antes.', isSelected: false, notes: 'Dulces: suspiros, trufas, coquitos. Salados: tequeños, empanadas, canguil.', createdAt: t, updatedAt: t },
  { id: uid(), option: 'Catering bocaditos básico sin montaje', vendor: 'Proveedor local Ibarra', pricePerPerson: 3.50, quantityPerPerson: '3 dulces + 3 salados por persona', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Presentación profesional, sin trabajo de cocina', disadvantages: 'Necesita vajilla propia y alguien que monte la mesa', recommendation: 'Buena opción si se consigue vajilla prestada', isSelected: false, notes: '', createdAt: t, updatedAt: t },
  { id: uid(), option: 'Bandejas de supermercado + complementos', vendor: 'Supermaxi / Santa María', pricePerPerson: 2.00, quantityPerPerson: 'Bandejas según cantidad', includesMontaje: false, includesVajilla: false, includesTransport: false, advantages: 'Fácil de conseguir, precio razonable, variedad disponible', disadvantages: 'Presentación básica, menos personalizado', recommendation: 'Combinar con algunos bocaditos caseros para mejorar presentación', isSelected: false, notes: '', createdAt: t, updatedAt: t },
]

// ─── Beverages ──────────────────────────────────────────────────────────────
export const seedBeverages: Beverage[] = [
  { id: uid(), name: 'Cerveza Pilsener', type: 'alcoholic', brand: 'Pilsener', unit: 'lata 355ml', pricePerUnit: 0.75, quantityPlanned: 150, quantityPurchased: 0, vendor: 'Distribuidora', notes: '~1.15 latas/persona para 130 invitados', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Mimosas (cava + naranja)', type: 'alcoholic', brand: 'Cava + Jugo', unit: 'copa', pricePerUnit: 1.30, quantityPlanned: 100, quantityPurchased: 0, vendor: 'Supermaxi', notes: '10 bot. cava + 10L jugo para ~100 copas. Para brindis y apertura.', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Tinto de verano', type: 'alcoholic', brand: 'Vino tinto + gaseosa', unit: 'vaso', pricePerUnit: 0.80, quantityPlanned: 80, quantityPurchased: 0, vendor: 'Supermaxi', notes: '8 bot. vino + gaseosa limonada. Alternativa suave al alcohol.', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Agua sin gas', type: 'water', brand: 'Agua Luna / Pure Water', unit: 'botella 500ml', pricePerUnit: 0.30, quantityPlanned: 80, quantityPurchased: 0, vendor: 'Supermaxi', notes: '', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Gaseosas variadas', type: 'soda', brand: 'Coca-Cola / Sprite', unit: 'lata 354ml', pricePerUnit: 0.70, quantityPlanned: 30, quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Para niños y quienes no toman alcohol', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Jugos de fruta', type: 'juice', brand: 'Del Valle / Sunny', unit: 'botella 300ml', pricePerUnit: 0.50, quantityPlanned: 20, quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Adultos mayores y niños', createdAt: t, updatedAt: t },
  { id: uid(), name: 'Hielo', type: 'ice', brand: '', unit: 'bolsa 5kg', pricePerUnit: 2.50, quantityPlanned: 10, quantityPurchased: 0, vendor: 'Supermaxi', notes: 'Comprar día anterior', createdAt: t, updatedAt: t },
]

// ─── Savings ────────────────────────────────────────────────────────────────
export const seedSavings: SavingsDecision[] = [
  { id: uid(), concept: 'Fotografía', currentPlan: 'Contratar fotógrafo profesional ($800-$1,500)', alternative: '✅ Luis Fernando (primo) lo hace gratis', estimatedSavings: 1000, decision: 'eliminate', priority: 'high', notes: 'Ya resuelto. Ahorro enorme.', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Bocaditos', currentPlan: 'Catering profesional ($3.50/persona = $455)', alternative: 'Hacerlos en casa con apoyo familiar ($1.50/persona = $195)', estimatedSavings: 260, decision: 'diy', priority: 'high', notes: 'Organizarlo 3 días antes con familia', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Decoración', currentPlan: 'Decoradora profesional ($300-$500)', alternative: 'Decoración DIY con flores de mercado + familia ($80-$120)', estimatedSavings: 300, decision: 'diy', priority: 'medium', notes: 'Flores del mercado La Playa de Ibarra son económicas', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Cervezas', currentPlan: 'Supermaxi $0.89/lata × 150 = $133', alternative: 'Distribuidora al por mayor $0.72/lata × 150 = $108', estimatedSavings: 25, decision: 'buy_early', priority: 'low', notes: 'Pequeño ahorro pero suma', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Recuerdos', currentPlan: 'Comprar recuerdos individuales ($1-$2/persona = $150-$250)', alternative: 'Centros de mesa como recuerdo (sorteo al final = $0 extra)', estimatedSavings: 200, decision: 'eliminate', priority: 'medium', notes: 'Los centros de mesa SE CONVIERTEN en el recuerdo. ¡Idea inteligente!', createdAt: t, updatedAt: t },
  { id: uid(), concept: 'Transporte novios', currentPlan: 'Carro decorado alquilado ($150-$200)', alternative: 'Carro de familiar decorado con flores ($20-$30)', estimatedSavings: 150, decision: 'diy', priority: 'medium', notes: 'Buscar en la familia quién tiene carro bonito', createdAt: t, updatedAt: t },
]
