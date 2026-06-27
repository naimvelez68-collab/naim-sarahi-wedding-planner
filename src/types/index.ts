// ─── Wedding Config ───────────────────────────────────────────────────────────
export interface WeddingConfig {
  brideName: string
  groomName: string
  weddingDate: string // ISO date string
  venue: string
  city: string
  country: string
  budgetTotal: number
  guestLimit: number
  maxPerTable: number
}

// ─── Guests ───────────────────────────────────────────────────────────────────
export type GuestStatus = 'confirmed' | 'pending' | 'declined'
export type GuestGroup  = 'bride_family' | 'groom_family' | 'friends' | 'church' | 'work' | 'other'
export type GuestDiet   = 'none' | 'vegetarian' | 'vegan' | 'gluten_free' | 'other'

export interface Guest {
  id: string
  name: string
  group: GuestGroup
  status: GuestStatus
  hasCompanion: boolean
  companionCount: number
  companionName: string
  tableId: string | null
  dietaryRestriction: GuestDiet
  dietaryNote: string
  isElderly: boolean
  isChild: boolean
  hasReducedMobility: boolean
  phone: string
  email: string
  notes: string
  confirmedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Tables ───────────────────────────────────────────────────────────────────
export interface Table {
  id: string
  name: string
  capacity: number
  notes: string
  avoidWith: string[] // ids of guests who should NOT sit at this table
  createdAt: string
  updatedAt: string
}

// ─── Budget ───────────────────────────────────────────────────────────────────
export type BudgetCategory = 'venue' | 'food' | 'bocaditos' | 'beverages' | 'decoration' | 'church' | 'music' | 'photography' | 'dress' | 'suit' | 'makeup' | 'souvenirs' | 'transport' | 'unexpected' | 'other'
export type BudgetStatus   = 'pending' | 'partial' | 'paid'
export type BudgetPriority = 'mandatory' | 'important' | 'optional' | 'reducible'

export interface BudgetItem {
  id: string
  concept: string
  category: BudgetCategory
  estimatedAmount: number
  realAmount: number
  paidAmount: number
  status: BudgetStatus
  priority: BudgetPriority
  dueDate: string
  vendorId: string | null
  notes: string
  receipt: string
  createdAt: string
  updatedAt: string
}

// ─── Vendors ──────────────────────────────────────────────────────────────────
export type VendorStatus = 'quoting' | 'reserved' | 'paid' | 'discarded'
export type VendorRisk   = 'low' | 'medium' | 'high'

export interface Vendor {
  id: string
  name: string
  service: string
  contact: string
  phone: string
  email: string
  city: string
  totalValue: number
  advance: number
  balance: number
  dueDate: string
  status: VendorStatus
  hasContract: boolean
  risk: VendorRisk
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Tasks / Checklist ────────────────────────────────────────────────────────
export type TaskStatus   = 'pending' | 'in_progress' | 'completed' | 'overdue'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  suggestedDate: string
  responsible: string
  priority: TaskPriority
  status: TaskStatus
  category: string
  monthsBefore: number
  notes: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

// ─── Day Schedule ─────────────────────────────────────────────────────────────
export type DayEventStatus = 'planned' | 'in_progress' | 'done' | 'skipped'

export interface DayEvent {
  id: string
  time: string
  activity: string
  duration: number
  responsible: string
  notes: string
  status: DayEventStatus
  createdAt: string
  updatedAt: string
}

// ─── Ceremony ─────────────────────────────────────────────────────────────────
export interface CeremonyStep {
  id: string
  order: number
  title: string
  description: string
  responsible: string
  duration: number
  text: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Games ────────────────────────────────────────────────────────────────────
export type GameStatus = 'planned' | 'confirmed' | 'cancelled'

export interface Game {
  id: string
  name: string
  description: string
  timing: string
  duration: number
  materials: string
  responsible: string
  prizes: string
  notes: string
  status: GameStatus
  createdAt: string
  updatedAt: string
}

// ─── Music ────────────────────────────────────────────────────────────────────
export interface MusicItem {
  id: string
  moment: string
  song: string
  artist: string
  responsible: string
  duration: number
  isProhibited: boolean
  isMandatory: boolean
  notes: string
  order: number
  createdAt: string
  updatedAt: string
}

// ─── MC Script ────────────────────────────────────────────────────────────────
export interface MCSection {
  id: string
  order: number
  title: string
  content: string
  timing: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Photos ───────────────────────────────────────────────────────────────────
export interface PhotoItem {
  id: string
  category: string
  description: string
  isRequired: boolean
  isDone: boolean
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Plan B ───────────────────────────────────────────────────────────────────
export interface PlanBItem {
  id: string
  scenario: string
  solution: string
  responsible: string
  materials: string
  priority: 'high' | 'medium' | 'low'
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Responsibles ─────────────────────────────────────────────────────────────
export interface Responsible {
  id: string
  name: string
  role: string
  phone: string
  email: string
  tasks: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Shopping ─────────────────────────────────────────────────────────────────
export type ShoppingPriority = 'buy_now' | 'buy_later' | 'quote' | 'rent' | 'borrow'
export type ShoppingStatus   = 'pending' | 'purchased' | 'cancelled'

export interface ShoppingItem {
  id: string
  product: string
  quantity: number
  estimatedPrice: number
  realPrice: number
  vendor: string
  priority: ShoppingPriority
  status: ShoppingStatus
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Emergency Kit ────────────────────────────────────────────────────────────
export interface EmergencyKitItem {
  id: string
  item: string
  quantity: number
  responsible: string
  isPacked: boolean
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Quotes / Cotizaciones ────────────────────────────────────────────────────
export type QuoteStatus = 'pending' | 'chosen' | 'discarded'

export interface Quote {
  id: string
  product: string
  vendor: string
  city: string
  price: number
  unit: string
  date: string
  contact: string
  link: string
  notes: string
  status: QuoteStatus
  createdAt: string
  updatedAt: string
}

// ─── Bocaditos ────────────────────────────────────────────────────────────────
export interface BocaditoOption {
  id: string
  option: string
  vendor: string
  pricePerPerson: number
  quantityPerPerson: string
  includesMontaje: boolean
  includesVajilla: boolean
  includesTransport: boolean
  advantages: string
  disadvantages: string
  recommendation: string
  isSelected: boolean
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Beverages ────────────────────────────────────────────────────────────────
export type BeverageType = 'alcoholic' | 'non_alcoholic' | 'water' | 'soda' | 'juice' | 'ice'

export interface Beverage {
  id: string
  name: string
  type: BeverageType
  brand: string
  unit: string
  pricePerUnit: number
  quantityPlanned: number
  quantityPurchased: number
  vendor: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ─── Changelog ───────────────────────────────────────────────────────────────
export interface ChangeEntry {
  id: string
  user: string
  module: string
  action: string
  detail: string
  timestamp: string
}

// ─── Savings / Decisions ──────────────────────────────────────────────────────
export type SavingsDecisionType = 'keep' | 'reduce' | 'eliminate' | 'diy' | 'buy_early' | 'quote' | 'rent'

export interface SavingsDecision {
  id: string
  concept: string
  currentPlan: string
  alternative: string
  estimatedSavings: number
  decision: SavingsDecisionType
  priority: 'high' | 'medium' | 'low'
  notes: string
  createdAt: string
  updatedAt: string
}
