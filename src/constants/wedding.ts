export const WEDDING_DATE = '2026-08-08'
export const BRIDE_NAME   = 'Sarahí'
export const GROOM_NAME   = 'Naim'
export const VENUE        = 'Por confirmar (Padel / Hostería Ambuqui / Airbnb)'
export const CITY         = 'Ibarra'
export const COUNTRY      = 'Ecuador'

export const MAX_PER_TABLE              = 10
export const BEER_PRICE_PER_CAN        = 0.75
export const BOCADITO_BUDGET_PER_PERSON = 10
export const BUDGET_TOTAL              = 5000
export const PLATE_PRICE               = 6.75   // moro
export const DESSERT_PRICE             = 1.25
export const TOTAL_PLATE_PRICE         = PLATE_PRICE + DESSERT_PRICE // $8/persona

export const GUEST_GROUP_LABELS: Record<string, string> = {
  bride_family: 'Familia Novia',
  groom_family: 'Familia Novio',
  friends:      'Amigos',
  church:       'Iglesia',
  work:         'Trabajo',
  other:        'Otros',
}

export const GUEST_STATUS_LABELS: Record<string, string> = {
  confirmed: 'Confirmado',
  pending:   'Pendiente',
  declined:  'No asiste',
}

export const BUDGET_CATEGORY_LABELS: Record<string, string> = {
  venue:         'Salón / Lugar',
  food:          'Comida / Cena',
  bocaditos:     'Bocaditos',
  beverages:     'Bebidas / Cerveza',
  decoration:    'Decoración',
  church:        'Iglesia / Ceremonia',
  music:         'Música / DJ',
  photography:   'Fotografía / Video',
  dress:         'Vestido',
  suit:          'Traje',
  makeup:        'Maquillaje / Peinado',
  souvenirs:     'Recuerdos',
  transport:     'Transporte',
  unexpected:    'Imprevistos',
  other:         'Otros',
}

export const BUDGET_PRIORITY_LABELS: Record<string, string> = {
  mandatory:  'Obligatorio',
  important:  'Importante',
  optional:   'Opcional',
  reducible:  'Se puede reducir',
}

export const VENDOR_STATUS_LABELS: Record<string, string> = {
  quoting:   'Cotizando',
  reserved:  'Reservado',
  paid:      'Pagado',
  discarded: 'Descartado',
}

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgente',
  high:   'Alta',
  medium: 'Media',
  low:    'Baja',
}

export const SHOPPING_PRIORITY_LABELS: Record<string, string> = {
  buy_now:    'Comprar ya',
  buy_later:  'Comprar después',
  quote:      'Cotizar',
  rent:       'Alquilar',
  borrow:     'Pedir prestado',
}

export const SAVINGS_DECISION_LABELS: Record<string, string> = {
  keep:      'Mantener',
  reduce:    'Reducir',
  eliminate: 'Eliminar',
  diy:       'Hacerlo nosotros',
  buy_early: 'Comprar antes',
  quote:     'Cotizar más',
  rent:      'Alquilar',
}

export const NAV_GROUPS = [
  {
    label: 'General',
    items: [
      { path: '/',           label: 'Dashboard',          icon: 'LayoutDashboard' },
    ],
  },
  {
    label: 'Invitados & Mesas',
    items: [
      { path: '/guests',     label: 'Invitados',           icon: 'Users' },
      { path: '/tables',     label: 'Mesas',               icon: 'Grid3x3' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { path: '/budget',     label: 'Presupuesto',         icon: 'DollarSign' },
      { path: '/vendors',    label: 'Proveedores',         icon: 'Store' },
      { path: '/quotes',     label: 'Cotizaciones',        icon: 'FileSearch' },
      { path: '/bocaditos',  label: 'Bocaditos',           icon: 'UtensilsCrossed' },
      { path: '/beverages',  label: 'Bebidas',             icon: 'Wine' },
      { path: '/savings',    label: 'Ahorro & Decisiones', icon: 'PiggyBank' },
    ],
  },
  {
    label: 'Planificación',
    items: [
      { path: '/checklist',  label: 'Checklist',           icon: 'CheckSquare' },
      { path: '/schedule',   label: 'Cronograma del Día',  icon: 'Clock' },
      { path: '/shopping',   label: 'Lista de Compras',    icon: 'ShoppingCart' },
      { path: '/responsibles', label: 'Responsables',      icon: 'UserCheck' },
    ],
  },
  {
    label: 'Evento',
    items: [
      { path: '/ceremony',   label: 'Ceremonia',           icon: 'Church' },
      { path: '/games',      label: 'Juegos & Dinámicas',  icon: 'Gamepad2' },
      { path: '/music',      label: 'Bailes & Canciones',  icon: 'Music' },
      { path: '/mc-script',  label: 'Guion MC',            icon: 'Mic' },
      { path: '/photos',     label: 'Fotos Obligatorias',  icon: 'Camera' },
    ],
  },
  {
    label: 'Contingencia',
    items: [
      { path: '/plan-b',     label: 'Plan B',              icon: 'ShieldAlert' },
      { path: '/emergency',  label: 'Kit de Emergencia',   icon: 'BriefcaseMedical' },
    ],
  },
]
