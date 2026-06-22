import { differenceInDays, format, isPast, isBefore, addDays, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Guest, BudgetItem, Table } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function now(): string {
  return new Date().toISOString()
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
  } catch {
    return dateStr
  }
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '—'
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy')
  } catch {
    return dateStr
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function daysUntilWedding(weddingDate: string): number {
  try {
    return Math.max(0, differenceInDays(parseISO(weddingDate), new Date()))
  } catch {
    return 0
  }
}

export function isDatePast(dateStr: string): boolean {
  if (!dateStr) return false
  try {
    return isPast(parseISO(dateStr))
  } catch {
    return false
  }
}

export function isDateSoon(dateStr: string, days = 14): boolean {
  if (!dateStr) return false
  try {
    const date = parseISO(dateStr)
    const limit = addDays(new Date(), days)
    return !isPast(date) && isBefore(date, limit)
  } catch {
    return false
  }
}

// ─── Guest helpers ─────────────────────────────────────────────────────────────
export function getTotalAttendees(guests: Guest[]): number {
  return guests
    .filter(g => g.status === 'confirmed')
    .reduce((sum, g) => sum + 1 + (g.hasCompanion ? g.companionCount : 0), 0)
}

export function getTablesNeeded(guests: Guest[], maxPerTable: number): number {
  return Math.ceil(getTotalAttendees(guests) / maxPerTable)
}

export function getGuestsAtTable(guests: Guest[], tableId: string): Guest[] {
  return guests.filter(g => g.tableId === tableId)
}

export function getTableOccupancy(guests: Guest[], tableId: string): number {
  return getGuestsAtTable(guests, tableId).reduce(
    (sum, g) => sum + 1 + (g.hasCompanion ? g.companionCount : 0),
    0
  )
}

// ─── Budget helpers ────────────────────────────────────────────────────────────
export function getBudgetTotals(items: BudgetItem[]) {
  const totalEstimated = items.reduce((s, i) => s + i.estimatedAmount, 0)
  const totalReal      = items.reduce((s, i) => s + i.realAmount, 0)
  const totalPaid      = items.reduce((s, i) => s + i.paidAmount, 0)
  const totalPending   = totalReal - totalPaid
  const totalMandatory = items
    .filter(i => i.priority === 'mandatory')
    .reduce((s, i) => s + i.realAmount, 0)
  const totalReducible = items
    .filter(i => i.priority === 'reducible')
    .reduce((s, i) => s + i.realAmount, 0)
  return { totalEstimated, totalReal, totalPaid, totalPending, totalMandatory, totalReducible }
}

export function getUpcomingPayments(items: BudgetItem[], days = 30) {
  return items.filter(
    i => i.status !== 'paid' && i.dueDate && isDateSoon(i.dueDate, days)
  )
}

// ─── Table helpers ─────────────────────────────────────────────────────────────
export function getTableStats(tables: Table[], guests: Guest[], maxPerTable: number) {
  return tables.map(t => {
    const occupancy = getTableOccupancy(guests, t.id)
    const available = t.capacity - occupancy
    const isFull    = occupancy >= t.capacity
    const isOver    = occupancy > maxPerTable
    return { ...t, occupancy, available, isFull, isOver }
  })
}

// ─── Cerveza calculator ───────────────────────────────────────────────────────
export function calcBeerCost(cans: number, pricePerCan: number) {
  return {
    total: cans * pricePerCan,
    perPerson: (guests: number) => guests > 0 ? (cans * pricePerCan) / guests : 0,
    cansPerPerson: (guests: number) => guests > 0 ? cans / guests : 0,
  }
}
