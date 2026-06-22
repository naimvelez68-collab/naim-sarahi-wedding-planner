import React from 'react'
import { cn } from '../../utils'

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary', size = 'md', loading, className, children, disabled, ...props
}) => (
  <button
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'bg-olive-500 text-white hover:bg-olive-600 focus:ring-olive-400':            variant === 'primary',
        'bg-white text-olive-700 border border-olive-300 hover:bg-olive-50 focus:ring-olive-300': variant === 'secondary',
        'text-olive-600 hover:bg-olive-50 focus:ring-olive-200':                      variant === 'ghost',
        'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400':                  variant === 'danger',
        'bg-gold-400 text-white hover:bg-gold-500 focus:ring-gold-300':               variant === 'gold',
        'px-2.5 py-1.5 text-xs': size === 'sm',
        'px-4 py-2 text-sm':     size === 'md',
        'px-6 py-3 text-base':   size === 'lg',
      },
      className
    )}
    {...props}
  >
    {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : null}
    {children}
  </button>
)

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}
export const Card: React.FC<CardProps> = ({ className, children, hover }) => (
  <div className={cn(
    'bg-white rounded-xl border border-stone-200 shadow-sm',
    hover && 'hover:shadow-md transition-shadow duration-200',
    className
  )}>
    {children}
  </div>
)

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'olive' | 'gold' | 'blue' | 'red' | 'amber' | 'gray' | 'green' | 'purple'
interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}
export const Badge: React.FC<BadgeProps> = ({ variant = 'gray', className, children }) => (
  <span className={cn(
    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
    {
      'bg-olive-100 text-olive-700':  variant === 'olive',
      'bg-gold-100 text-gold-700':    variant === 'gold',
      'bg-blue-100 text-blue-700':    variant === 'blue',
      'bg-red-100 text-red-700':      variant === 'red',
      'bg-amber-100 text-amber-700':  variant === 'amber',
      'bg-stone-100 text-stone-600':  variant === 'gray',
      'bg-green-100 text-green-700':  variant === 'green',
      'bg-purple-100 text-purple-700': variant === 'purple',
    },
    className
  )}>
    {children}
  </span>
)

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}
export const Input: React.FC<InputProps> = ({ label, error, hint, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-stone-700">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg bg-white placeholder-stone-400 transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-olive-400',
          error ? 'border-red-400' : 'border-stone-300 hover:border-stone-400',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-stone-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}
export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-stone-700">{label}</label>}
      <textarea
        id={inputId}
        rows={3}
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg bg-white placeholder-stone-400 resize-none transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-olive-400',
          error ? 'border-red-400' : 'border-stone-300 hover:border-stone-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}
export const Select: React.FC<SelectProps> = ({ label, error, options, className, id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-stone-700">{label}</label>}
      <select
        id={inputId}
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg bg-white transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-olive-400',
          error ? 'border-red-400' : 'border-stone-300 hover:border-stone-400',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
  footer?: React.ReactNode
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg', footer }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative w-full bg-white rounded-2xl shadow-2xl animate-slide-in flex flex-col max-h-[90vh]', maxWidth)}>
        <div className="flex items-center justify-between p-5 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800 font-serif">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
        {footer && <div className="p-5 border-t border-stone-200 bg-stone-50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  )
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
interface ConfirmProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
  variant?: 'danger' | 'primary'
}
export const ConfirmDialog: React.FC<ConfirmProps> = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Confirmar', variant = 'danger' }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl animate-slide-in p-6">
        <h3 className="text-base font-semibold text-stone-800 mb-2">{title}</h3>
        <p className="text-sm text-stone-600 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancelar</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: React.ReactNode
  color?: 'olive' | 'gold' | 'blue' | 'red' | 'amber' | 'green'
  className?: string
}
export const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, color = 'olive', className }) => (
  <Card className={cn('p-4', className)}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">{label}</p>
        <p className={cn('text-2xl font-bold mt-1', {
          'text-olive-600': color === 'olive',
          'text-gold-600':  color === 'gold',
          'text-blue-600':  color === 'blue',
          'text-red-600':   color === 'red',
          'text-amber-600': color === 'amber',
          'text-green-600': color === 'green',
        })}>{value}</p>
        {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
      </div>
      {icon && (
        <div className={cn('p-2 rounded-lg', {
          'bg-olive-50 text-olive-500': color === 'olive',
          'bg-gold-50 text-gold-500':   color === 'gold',
          'bg-blue-50 text-blue-500':   color === 'blue',
          'bg-red-50 text-red-500':     color === 'red',
          'bg-amber-50 text-amber-500': color === 'amber',
          'bg-green-50 text-green-500': color === 'green',
        })}>
          {icon}
        </div>
      )}
    </div>
  </Card>
)

// ─── Alert ────────────────────────────────────────────────────────────────────
type AlertVariant = 'info' | 'warning' | 'error' | 'success'
interface AlertProps {
  variant?: AlertVariant
  title?: string
  message: string
  className?: string
}
export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, message, className }) => (
  <div className={cn(
    'flex gap-3 p-4 rounded-xl text-sm',
    {
      'bg-blue-50 text-blue-800 border border-blue-200':   variant === 'info',
      'bg-amber-50 text-amber-800 border border-amber-200': variant === 'warning',
      'bg-red-50 text-red-800 border border-red-200':      variant === 'error',
      'bg-green-50 text-green-800 border border-green-200': variant === 'success',
    },
    className
  )}>
    <span className="text-lg leading-none">
      {variant === 'info' && 'ℹ️'}
      {variant === 'warning' && '⚠️'}
      {variant === 'error' && '🚨'}
      {variant === 'success' && '✅'}
    </span>
    <div>
      {title && <p className="font-semibold">{title}</p>}
      <p className={title ? 'mt-0.5 opacity-90' : ''}>{message}</p>
    </div>
  </div>
)

// ─── Progress Bar ─────────────────────────────────────────────────────────────
interface ProgressProps {
  value: number
  max?: number
  color?: 'olive' | 'gold' | 'red' | 'blue'
  showLabel?: boolean
  className?: string
}
export const ProgressBar: React.FC<ProgressProps> = ({ value, max = 100, color = 'olive', showLabel, className }) => {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className={cn('w-full', className)}>
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', {
            'bg-olive-500': color === 'olive',
            'bg-gold-400':  color === 'gold',
            'bg-red-500':   color === 'red',
            'bg-blue-500':  color === 'blue',
          })}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-stone-500 mt-1 text-right">{pct}%</p>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}
export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-stone-300 mb-4">{icon}</div>}
    <p className="text-stone-600 font-medium">{title}</p>
    {description && <p className="text-sm text-stone-400 mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)

// ─── Checkbox ─────────────────────────────────────────────────────────────────
interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  className?: string
}
export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, className }) => (
  <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-stone-300 text-olive-500 focus:ring-olive-400 accent-olive-500"
    />
    {label && <span className="text-sm text-stone-700">{label}</span>}
  </label>
)

// ─── Page Header ──────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      {icon && <div className="p-2 bg-olive-50 text-olive-600 rounded-xl">{icon}</div>}
      <div>
        <h1 className="text-2xl font-bold text-stone-800 font-serif">{title}</h1>
        {subtitle && <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
)
