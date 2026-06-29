import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { uid, now } from '../utils'
import {
  WeddingConfig, Guest, Table, BudgetItem, Vendor, Task,
  DayEvent, CeremonyStep, Game, MusicItem, MCSection,
  PhotoItem, PlanBItem, Responsible, ShoppingItem,
  EmergencyKitItem, Quote, BocaditoOption, Beverage, SavingsDecision,
  ChangeEntry,
} from '../types'
import {
  defaultConfig, seedGuests, seedTables, seedBudget, seedVendors,
  seedTasks, seedDaySchedule, seedCeremony, seedGames, seedMusic,
  seedMCScript, seedPhotos, seedPlanB, seedResponsibles, seedShopping,
  seedEmergencyKit, seedQuotes, seedBocaditos, seedBeverages, seedSavings,
} from '../data/seedData'

interface WeddingStore {
  // ── Meta ──────────────────────────────────────────────────────────────────
  isInitialized: boolean
  config: WeddingConfig

  // ── Changelog ─────────────────────────────────────────────────────────────
  changelog: ChangeEntry[]
  lastReadAt: string
  addChangeEntry: (entry: ChangeEntry) => void
  setChangelog:   (entries: ChangeEntry[]) => void
  markAllRead:    () => void

  // ── Data ──────────────────────────────────────────────────────────────────
  guests:       Guest[]
  tables:       Table[]
  budgetItems:  BudgetItem[]
  vendors:      Vendor[]
  tasks:        Task[]
  daySchedule:  DayEvent[]
  ceremony:     CeremonyStep[]
  games:        Game[]
  music:        MusicItem[]
  mcScript:     MCSection[]
  photos:       PhotoItem[]
  planB:        PlanBItem[]
  responsibles: Responsible[]
  shopping:     ShoppingItem[]
  emergencyKit: EmergencyKitItem[]
  quotes:       Quote[]
  bocaditos:    BocaditoOption[]
  beverages:    Beverage[]
  savings:      SavingsDecision[]

  // ── Config actions ────────────────────────────────────────────────────────
  updateConfig: (updates: Partial<WeddingConfig>) => void

  // ── Guest actions ─────────────────────────────────────────────────────────
  addGuest:            (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGuest:         (id: string, updates: Partial<Guest>) => void
  deleteGuest:         (id: string) => void
  assignGuestToTable:  (guestId: string, tableId: string | null) => void

  // ── Table actions ─────────────────────────────────────────────────────────
  addTable:     (table: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTable:  (id: string, updates: Partial<Table>) => void
  deleteTable:  (id: string) => void

  // ── Budget actions ────────────────────────────────────────────────────────
  addBudgetItem:    (item: Omit<BudgetItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void
  deleteBudgetItem: (id: string) => void

  // ── Vendor actions ────────────────────────────────────────────────────────
  addVendor:    (v: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateVendor: (id: string, updates: Partial<Vendor>) => void
  deleteVendor: (id: string) => void

  // ── Task actions ──────────────────────────────────────────────────────────
  addTask:       (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask:    (id: string, updates: Partial<Task>) => void
  deleteTask:    (id: string) => void
  completeTask:  (id: string) => void

  // ── Day schedule actions ──────────────────────────────────────────────────
  addDayEvent:    (event: Omit<DayEvent, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDayEvent: (id: string, updates: Partial<DayEvent>) => void
  deleteDayEvent: (id: string) => void

  // ── Ceremony actions ──────────────────────────────────────────────────────
  addCeremonyStep:    (step: Omit<CeremonyStep, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCeremonyStep: (id: string, updates: Partial<CeremonyStep>) => void
  deleteCeremonyStep: (id: string) => void
  reorderCeremony:    (steps: CeremonyStep[]) => void

  // ── Game actions ──────────────────────────────────────────────────────────
  addGame:    (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateGame: (id: string, updates: Partial<Game>) => void
  deleteGame: (id: string) => void

  // ── Music actions ─────────────────────────────────────────────────────────
  addMusicItem:    (item: Omit<MusicItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateMusicItem: (id: string, updates: Partial<MusicItem>) => void
  deleteMusicItem: (id: string) => void

  // ── MC Script actions ─────────────────────────────────────────────────────
  addMCSection:    (section: Omit<MCSection, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateMCSection: (id: string, updates: Partial<MCSection>) => void
  deleteMCSection: (id: string) => void

  // ── Photo actions ─────────────────────────────────────────────────────────
  addPhotoItem:    (item: Omit<PhotoItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePhotoItem: (id: string, updates: Partial<PhotoItem>) => void
  deletePhotoItem: (id: string) => void
  togglePhoto:     (id: string) => void

  // ── Plan B actions ────────────────────────────────────────────────────────
  addPlanBItem:    (item: Omit<PlanBItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updatePlanBItem: (id: string, updates: Partial<PlanBItem>) => void
  deletePlanBItem: (id: string) => void

  // ── Responsible actions ───────────────────────────────────────────────────
  addResponsible:    (r: Omit<Responsible, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateResponsible: (id: string, updates: Partial<Responsible>) => void
  deleteResponsible: (id: string) => void

  // ── Shopping actions ──────────────────────────────────────────────────────
  addShoppingItem:    (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void
  deleteShoppingItem: (id: string) => void

  // ── Emergency kit actions ─────────────────────────────────────────────────
  addEmergencyItem:    (item: Omit<EmergencyKitItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateEmergencyItem: (id: string, updates: Partial<EmergencyKitItem>) => void
  deleteEmergencyItem: (id: string) => void
  toggleEmergencyItem: (id: string) => void

  // ── Quote actions ─────────────────────────────────────────────────────────
  addQuote:    (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateQuote: (id: string, updates: Partial<Quote>) => void
  deleteQuote: (id: string) => void

  // ── Bocadito actions ──────────────────────────────────────────────────────
  addBocadito:         (b: Omit<BocaditoOption, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBocadito:      (id: string, updates: Partial<BocaditoOption>) => void
  deleteBocadito:      (id: string) => void
  selectBocadito:      (id: string) => void

  // ── Beverage actions ──────────────────────────────────────────────────────
  addBeverage:    (b: Omit<Beverage, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateBeverage: (id: string, updates: Partial<Beverage>) => void
  deleteBeverage: (id: string) => void

  // ── Savings actions ───────────────────────────────────────────────────────
  addSavings:    (s: Omit<SavingsDecision, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSavings: (id: string, updates: Partial<SavingsDecision>) => void
  deleteSavings: (id: string) => void

  // ── Seed / reset ──────────────────────────────────────────────────────────
  initializeSeedData: () => void
  resetAllData:       () => void
}

export const useWeddingStore = create<WeddingStore>()(
  persist(
    (set, _get) => ({
      isInitialized: false,
      config:        defaultConfig,

      // ── Changelog ───────────────────────────────────────────────────────────
      changelog:  [],
      lastReadAt: new Date(0).toISOString(),
      addChangeEntry: (entry) =>
        set(s => ({ changelog: [entry, ...s.changelog].slice(0, 100) })),
      setChangelog: (entries) =>
        set({ changelog: entries }),
      markAllRead: () =>
        set({ lastReadAt: new Date().toISOString() }),

      guests:       [],
      tables:       [],
      budgetItems:  [],
      vendors:      [],
      tasks:        [],
      daySchedule:  [],
      ceremony:     [],
      games:        [],
      music:        [],
      mcScript:     [],
      photos:       [],
      planB:        [],
      responsibles: [],
      shopping:     [],
      emergencyKit: [],
      quotes:       [],
      bocaditos:    [],
      beverages:    [],
      savings:      [],

      // ── Config ─────────────────────────────────────────────────────────────
      updateConfig: (updates) =>
        set(s => ({ config: { ...s.config, ...updates } })),

      // ── Guests ─────────────────────────────────────────────────────────────
      addGuest: (guest) =>
        set(s => ({ guests: [...s.guests, { ...guest, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateGuest: (id, updates) =>
        set(s => ({ guests: s.guests.map(g => g.id === id ? { ...g, ...updates, updatedAt: now() } : g) })),
      deleteGuest: (id) =>
        set(s => ({ guests: s.guests.filter(g => g.id !== id) })),
      assignGuestToTable: (guestId, tableId) =>
        set(s => ({ guests: s.guests.map(g => g.id === guestId ? { ...g, tableId, updatedAt: now() } : g) })),

      // ── Tables ─────────────────────────────────────────────────────────────
      addTable: (table) =>
        set(s => ({ tables: [...s.tables, { ...table, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateTable: (id, updates) =>
        set(s => ({ tables: s.tables.map(t => t.id === id ? { ...t, ...updates, updatedAt: now() } : t) })),
      deleteTable: (id) =>
        set(s => ({
          tables: s.tables.filter(t => t.id !== id),
          guests: s.guests.map(g => g.tableId === id ? { ...g, tableId: null } : g),
        })),

      // ── Budget ─────────────────────────────────────────────────────────────
      addBudgetItem: (item) =>
        set(s => ({ budgetItems: [...s.budgetItems, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateBudgetItem: (id, updates) =>
        set(s => ({ budgetItems: s.budgetItems.map(b => b.id === id ? { ...b, ...updates, updatedAt: now() } : b) })),
      deleteBudgetItem: (id) =>
        set(s => ({ budgetItems: s.budgetItems.filter(b => b.id !== id) })),

      // ── Vendors ────────────────────────────────────────────────────────────
      addVendor: (v) =>
        set(s => ({ vendors: [...s.vendors, { ...v, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateVendor: (id, updates) =>
        set(s => ({ vendors: s.vendors.map(v => v.id === id ? { ...v, ...updates, updatedAt: now() } : v) })),
      deleteVendor: (id) =>
        set(s => ({ vendors: s.vendors.filter(v => v.id !== id) })),

      // ── Tasks ──────────────────────────────────────────────────────────────
      addTask: (task) =>
        set(s => ({ tasks: [...s.tasks, { ...task, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateTask: (id, updates) =>
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates, updatedAt: now() } : t) })),
      deleteTask: (id) =>
        set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),
      completeTask: (id) =>
        set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status: 'completed', completedAt: now(), updatedAt: now() } : t) })),

      // ── Day schedule ───────────────────────────────────────────────────────
      addDayEvent: (event) =>
        set(s => ({ daySchedule: [...s.daySchedule, { ...event, id: uid(), createdAt: now(), updatedAt: now() }].sort((a, b) => a.time.localeCompare(b.time)) })),
      updateDayEvent: (id, updates) =>
        set(s => ({ daySchedule: s.daySchedule.map(e => e.id === id ? { ...e, ...updates, updatedAt: now() } : e) })),
      deleteDayEvent: (id) =>
        set(s => ({ daySchedule: s.daySchedule.filter(e => e.id !== id) })),

      // ── Ceremony ───────────────────────────────────────────────────────────
      addCeremonyStep: (step) =>
        set(s => ({ ceremony: [...s.ceremony, { ...step, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateCeremonyStep: (id, updates) =>
        set(s => ({ ceremony: s.ceremony.map(c => c.id === id ? { ...c, ...updates, updatedAt: now() } : c) })),
      deleteCeremonyStep: (id) =>
        set(s => ({ ceremony: s.ceremony.filter(c => c.id !== id) })),
      reorderCeremony: (steps) =>
        set(() => ({ ceremony: steps })),

      // ── Games ──────────────────────────────────────────────────────────────
      addGame: (game) =>
        set(s => ({ games: [...s.games, { ...game, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateGame: (id, updates) =>
        set(s => ({ games: s.games.map(g => g.id === id ? { ...g, ...updates, updatedAt: now() } : g) })),
      deleteGame: (id) =>
        set(s => ({ games: s.games.filter(g => g.id !== id) })),

      // ── Music ──────────────────────────────────────────────────────────────
      addMusicItem: (item) =>
        set(s => ({ music: [...s.music, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateMusicItem: (id, updates) =>
        set(s => ({ music: s.music.map(m => m.id === id ? { ...m, ...updates, updatedAt: now() } : m) })),
      deleteMusicItem: (id) =>
        set(s => ({ music: s.music.filter(m => m.id !== id) })),

      // ── MC Script ──────────────────────────────────────────────────────────
      addMCSection: (section) =>
        set(s => ({ mcScript: [...s.mcScript, { ...section, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateMCSection: (id, updates) =>
        set(s => ({ mcScript: s.mcScript.map(m => m.id === id ? { ...m, ...updates, updatedAt: now() } : m) })),
      deleteMCSection: (id) =>
        set(s => ({ mcScript: s.mcScript.filter(m => m.id !== id) })),

      // ── Photos ─────────────────────────────────────────────────────────────
      addPhotoItem: (item) =>
        set(s => ({ photos: [...s.photos, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updatePhotoItem: (id, updates) =>
        set(s => ({ photos: s.photos.map(p => p.id === id ? { ...p, ...updates, updatedAt: now() } : p) })),
      deletePhotoItem: (id) =>
        set(s => ({ photos: s.photos.filter(p => p.id !== id) })),
      togglePhoto: (id) =>
        set(s => ({ photos: s.photos.map(p => p.id === id ? { ...p, isDone: !p.isDone, updatedAt: now() } : p) })),

      // ── Plan B ─────────────────────────────────────────────────────────────
      addPlanBItem: (item) =>
        set(s => ({ planB: [...s.planB, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updatePlanBItem: (id, updates) =>
        set(s => ({ planB: s.planB.map(p => p.id === id ? { ...p, ...updates, updatedAt: now() } : p) })),
      deletePlanBItem: (id) =>
        set(s => ({ planB: s.planB.filter(p => p.id !== id) })),

      // ── Responsibles ───────────────────────────────────────────────────────
      addResponsible: (r) =>
        set(s => ({ responsibles: [...s.responsibles, { ...r, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateResponsible: (id, updates) =>
        set(s => ({ responsibles: s.responsibles.map(r => r.id === id ? { ...r, ...updates, updatedAt: now() } : r) })),
      deleteResponsible: (id) =>
        set(s => ({ responsibles: s.responsibles.filter(r => r.id !== id) })),

      // ── Shopping ───────────────────────────────────────────────────────────
      addShoppingItem: (item) =>
        set(s => ({ shopping: [...s.shopping, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateShoppingItem: (id, updates) =>
        set(s => ({ shopping: s.shopping.map(i => i.id === id ? { ...i, ...updates, updatedAt: now() } : i) })),
      deleteShoppingItem: (id) =>
        set(s => ({ shopping: s.shopping.filter(i => i.id !== id) })),

      // ── Emergency kit ──────────────────────────────────────────────────────
      addEmergencyItem: (item) =>
        set(s => ({ emergencyKit: [...s.emergencyKit, { ...item, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateEmergencyItem: (id, updates) =>
        set(s => ({ emergencyKit: s.emergencyKit.map(i => i.id === id ? { ...i, ...updates, updatedAt: now() } : i) })),
      deleteEmergencyItem: (id) =>
        set(s => ({ emergencyKit: s.emergencyKit.filter(i => i.id !== id) })),
      toggleEmergencyItem: (id) =>
        set(s => ({ emergencyKit: s.emergencyKit.map(i => i.id === id ? { ...i, isPacked: !i.isPacked, updatedAt: now() } : i) })),

      // ── Quotes ─────────────────────────────────────────────────────────────
      addQuote: (quote) =>
        set(s => ({ quotes: [...s.quotes, { ...quote, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateQuote: (id, updates) =>
        set(s => ({ quotes: s.quotes.map(q => q.id === id ? { ...q, ...updates, updatedAt: now() } : q) })),
      deleteQuote: (id) =>
        set(s => ({ quotes: s.quotes.filter(q => q.id !== id) })),

      // ── Bocaditos ──────────────────────────────────────────────────────────
      addBocadito: (b) =>
        set(s => ({ bocaditos: [...s.bocaditos, { ...b, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateBocadito: (id, updates) =>
        set(s => ({ bocaditos: s.bocaditos.map(b => b.id === id ? { ...b, ...updates, updatedAt: now() } : b) })),
      deleteBocadito: (id) =>
        set(s => ({ bocaditos: s.bocaditos.filter(b => b.id !== id) })),
      selectBocadito: (id) =>
        set(s => ({ bocaditos: s.bocaditos.map(b => ({ ...b, isSelected: b.id === id })) })),

      // ── Beverages ──────────────────────────────────────────────────────────
      addBeverage: (b) =>
        set(s => ({ beverages: [...s.beverages, { ...b, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateBeverage: (id, updates) =>
        set(s => ({ beverages: s.beverages.map(b => b.id === id ? { ...b, ...updates, updatedAt: now() } : b) })),
      deleteBeverage: (id) =>
        set(s => ({ beverages: s.beverages.filter(b => b.id !== id) })),

      // ── Savings ────────────────────────────────────────────────────────────
      addSavings: (s_) =>
        set(s => ({ savings: [...s.savings, { ...s_, id: uid(), createdAt: now(), updatedAt: now() }] })),
      updateSavings: (id, updates) =>
        set(s => ({ savings: s.savings.map(sv => sv.id === id ? { ...sv, ...updates, updatedAt: now() } : sv) })),
      deleteSavings: (id) =>
        set(s => ({ savings: s.savings.filter(sv => sv.id !== id) })),

      // ── Seed / Reset ───────────────────────────────────────────────────────
      initializeSeedData: () =>
        set({
          isInitialized: true,
          config:        defaultConfig,
          guests:        seedGuests,
          tables:        seedTables,
          budgetItems:   seedBudget,
          vendors:       seedVendors,
          tasks:         seedTasks,
          daySchedule:   seedDaySchedule,
          ceremony:      seedCeremony,
          games:         seedGames,
          music:         seedMusic,
          mcScript:      seedMCScript,
          photos:        seedPhotos,
          planB:         seedPlanB,
          responsibles:  seedResponsibles,
          shopping:      seedShopping,
          emergencyKit:  seedEmergencyKit,
          quotes:        seedQuotes,
          bocaditos:     seedBocaditos,
          beverages:     seedBeverages,
          savings:       seedSavings,
        }),

      resetAllData: () =>
        set({
          isInitialized: false,
          config:        defaultConfig,
          guests:        [],
          tables:        [],
          budgetItems:   [],
          vendors:       [],
          tasks:         [],
          daySchedule:   [],
          ceremony:      [],
          games:         [],
          music:         [],
          mcScript:      [],
          photos:        [],
          planB:         [],
          responsibles:  [],
          shopping:      [],
          emergencyKit:  [],
          quotes:        [],
          bocaditos:     [],
          beverages:     [],
          savings:       [],
        }),
    }),
    {
      name: 'wedding-planner-v5',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
