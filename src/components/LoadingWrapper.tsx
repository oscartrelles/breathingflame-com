import React from 'react'
import { LoadingState } from './LoadingState'
import { ErrorState } from './ErrorState'

interface LoadingWrapperProps {
  loading: boolean
  error?: Error | string | null
  children: React.ReactNode
  loadingMessage?: string
  errorTitle?: string
  errorMessage?: string
  onRetry?: () => void
  retryText?: string
  variant?: 'page' | 'card' | 'inline'
  loadingVariant?: 'spinner' | 'dots' | 'pulse'
  loadingSize?: 'sm' | 'md' | 'lg'
  className?: string
  showErrorDetails?: boolean
}

export function LoadingWrapper({
  loading,
  error,
  children,
  loadingMessage = 'Loading...',
  errorTitle = 'Something went wrong',
  errorMessage = 'We encountered an error while loading this content.',
  onRetry,
  retryText = 'Try Again',
  variant = 'page',
  loadingVariant = 'spinner',
  loadingSize = 'md',
  className = '',
  showErrorDetails = false
}: LoadingWrapperProps) {
  // Show error state if there's an error
  if (error) {
    return (
      <ErrorState
        title={errorTitle}
        message={errorMessage}
        error={error}
        onRetry={onRetry}
        retryText={retryText}
        variant={variant}
        className={className}
        showDetails={showErrorDetails}
      />
    )
  }

  // Show loading state if loading
  if (loading) {
    return (
      <LoadingState
        message={loadingMessage}
        variant={loadingVariant}
        size={loadingSize}
        className={className}
        fullScreen={variant === 'page'}
      />
    )
  }

  // Show children if not loading and no error
  return <>{children}</>
}
