import React, { useState, useRef, useEffect } from 'react'
import { useAccessibility } from './AccessibilityProvider'
import { getValidationMessage, generateId } from '@/utils/accessibility'
import styles from './AccessibleForm.module.css'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'textarea' | 'select'
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helpText?: string
  options?: { value: string; label: string }[]
  rows?: number
  maxLength?: number
  minLength?: number
  pattern?: string
  autoComplete?: string
  ariaDescribedBy?: string
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  options = [],
  rows = 3,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  ariaDescribedBy
}: FormFieldProps) {
  const { announce } = useAccessibility()
  const [isFocused, setIsFocused] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)
  
  const fieldId = generateId(`field-${name}`)
  const errorId = generateId(`error-${name}`)
  const helpId = generateId(`help-${name}`)
  
  const describedBy = [
    error && errorId,
    helpText && helpId,
    ariaDescribedBy
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
    setHasInteracted(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setHasInteracted(true)
    onBlur?.()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  // Announce validation errors
  useEffect(() => {
    if (error && hasInteracted) {
      announce(`Error: ${error}`, 'assertive')
    }
  }, [error, hasInteracted, announce])

  const renderField = () => {
    const commonProps = {
      id: fieldId,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder,
      required,
      disabled,
      maxLength,
      minLength,
      pattern,
      autoComplete,
      'aria-invalid': !!error,
      'aria-describedby': describedBy || undefined,
      'aria-required': required,
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
            rows={rows}
            className={`${styles.field} ${styles.textarea} ${error ? styles.error : ''}`}
            {...commonProps}
          />
        )
      
      case 'select':
        return (
          <select
            ref={fieldRef as React.RefObject<HTMLSelectElement>}
            className={`${styles.field} ${styles.select} ${error ? styles.error : ''}`}
            {...commonProps}
          >
            <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      default:
        return (
          <input
            ref={fieldRef as React.RefObject<HTMLInputElement>}
            type={type}
            className={`${styles.field} ${error ? styles.error : ''}`}
            {...commonProps}
          />
        )
    }
  }

  return (
    <div className={styles.fieldGroup}>
      <label 
        htmlFor={fieldId} 
        className={`${styles.label} ${required ? styles.required : ''}`}
      >
        {label}
        {required && (
          <span className={styles.requiredIndicator} aria-label="required">
            *
          </span>
        )}
      </label>
      
      {renderField()}
      
      {helpText && (
        <div id={helpId} className={styles.helpText}>
          {helpText}
        </div>
      )}
      
      {error && (
        <div 
          id={errorId} 
          className={styles.errorText}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
    </div>
  )
}

interface AccessibleFormProps {
  children: React.ReactNode
  onSubmit: (data: FormData) => void
  className?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

export function AccessibleForm({
  children,
  onSubmit,
  className = '',
  ariaLabel,
  ariaDescribedBy
}: AccessibleFormProps) {
  const { announce } = useAccessibility()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const form = e.currentTarget
    const formData = new FormData(form)
    
    // Check for validation errors
    const invalidFields = form.querySelectorAll('[aria-invalid="true"]')
    if (invalidFields.length > 0) {
      announce('Please correct the errors before submitting', 'assertive')
      return
    }
    
    announce('Form submitted successfully', 'polite')
    onSubmit(formData)
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${styles.form} ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      noValidate
    >
      {children}
    </form>
  )
}

// Hook for form validation
export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
    const error = getValidationMessage(field)
    setErrors(prev => {
      const newErrors = { ...prev }
      if (error) {
        newErrors[field.name] = error
      } else {
        delete newErrors[field.name]
      }
      return newErrors
    })
    return !error
  }

  const clearError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setErrors({})
  }

  const hasErrors = Object.keys(errors).length > 0

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors
  }
}
