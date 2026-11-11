import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown, CircleAlert, Eye, EyeOff, Search, X } from 'lucide-react'
import { cx } from '../utils/cx'
import s from './primitives.module.css'

interface FieldShellProps {
  label: string
  hideLabel?: boolean
  helper?: string
  /** Turns the border Jasper, adds an alert icon and replaces the helper with this message (in green). */
  error?: string
  className?: string
}

export interface TextFieldProps
  extends FieldShellProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'className'> {
  leadingIcon?: LucideIcon
  trailing?: ReactNode
}

/** Labelled input with helper and error states (components.md §1.3). */
export function TextField({
  label,
  hideLabel,
  helper,
  error,
  leadingIcon: Leading,
  trailing,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const msgId = `${inputId}-msg`
  const message = error ?? helper
  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={inputId} className={hideLabel ? 'sr-only' : s.fieldLabel}>
        {label}
      </label>
      <div className={cx(s.control, error && s.controlError)}>
        {Leading && <Leading className={s.fieldIcon} size={18} aria-hidden />}
        <input
          id={inputId}
          className={s.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? msgId : undefined}
          {...rest}
        />
        {trailing}
        {error && <CircleAlert className={s.fieldIconError} size={18} aria-hidden />}
      </div>
      {message && (
        <p id={msgId} className={s.helper}>
          {message}
        </p>
      )}
    </div>
  )
}

/** Password field with a show/hide toggle. */
export function PasswordField(props: Omit<TextFieldProps, 'type' | 'trailing'>) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye
  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className={s.inlineButton}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
        >
          <Icon size={18} aria-hidden />
        </button>
      }
    />
  )
}

export interface SearchFieldProps extends Omit<TextFieldProps, 'leadingIcon' | 'trailing' | 'label'> {
  label?: string
  onClear?: () => void
}

/** Search input: hidden label, leading search icon, clear button when filled. */
export function SearchField({ label = 'Search', onClear, value, ...rest }: SearchFieldProps) {
  const hasValue = value !== undefined && value !== ''
  return (
    <TextField
      {...rest}
      label={label}
      hideLabel
      type="search"
      value={value}
      leadingIcon={Search}
      trailing={
        hasValue && onClear ? (
          <button type="button" className={s.inlineButton} aria-label="Clear search" onClick={onClear}>
            <X size={18} aria-hidden />
          </button>
        ) : undefined
      }
    />
  )
}

export interface SelectFieldProps
  extends FieldShellProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: Array<{ value: string; label: string }>
}

/** Native select styled as a field with a chevron. */
export function SelectField({ label, hideLabel, helper, error, options, className, id, ...rest }: SelectFieldProps) {
  const autoId = useId()
  const selectId = id ?? autoId
  const msgId = `${selectId}-msg`
  const message = error ?? helper
  return (
    <div className={cx(s.field, className)}>
      <label htmlFor={selectId} className={hideLabel ? 'sr-only' : s.fieldLabel}>
        {label}
      </label>
      <div className={cx(s.control, error && s.controlError)}>
        <select
          id={selectId}
          className={cx(s.input, s.select)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? msgId : undefined}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className={s.fieldIcon} size={18} aria-hidden />
      </div>
      {message && (
        <p id={msgId} className={s.helper}>
          {message}
        </p>
      )}
    </div>
  )
}
