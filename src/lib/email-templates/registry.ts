import type { ComponentType } from 'react'
import { template as rsvpConfirmation } from './rsvp-confirmation'
import { template as rsvpNotification } from './rsvp-notification'
import { template as oneMonthReminder } from './one-month-reminder'
import { template as oneWeekReminder } from './one-week-reminder'



export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'rsvp-confirmation': rsvpConfirmation,
  'rsvp-notification': rsvpNotification,
  'one-month-reminder': oneMonthReminder,
}

