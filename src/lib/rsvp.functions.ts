import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const sheetSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  telefone: z.string().trim().regex(/^[0-9+\s()-]{6,20}$/),
  pessoas: z.number().int().min(1).max(10),
  presenca: z.enum(['sim', 'nao']),
  restricoes: z.string().max(500).default(''),
  musica: z.string().max(200).default(''),
  mensagem: z.string().max(1000).default(''),
});

export const syncRsvpToSheet = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => sheetSchema.parse(data))
  .handler(async ({ data }) => {
    const { forwardToSheet } = await import('./rsvp.server');
    return forwardToSheet(data);
  });

const emailSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  guests: z.number().int().min(1).max(10),
  attending: z.boolean(),
  allergies: z.string().max(500).default(''),
  song: z.string().max(200).default(''),
  message: z.string().max(1000).default(''),
});

export const sendRsvpEmails = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => emailSchema.parse(data))
  .handler(async ({ data }) => {
    const { sendRsvpNotifications } = await import('./rsvp-emails.server');
    const result = await sendRsvpNotifications(data);
    console.log('[rsvp-emails] send result', JSON.stringify(result));
    return result;
  });


const duplicateSchema = z.object({
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30),
});

export const checkRsvpDuplicate = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => duplicateSchema.parse(data))
  .handler(async ({ data }) => {
    const { findExistingRsvp } = await import('./rsvp.server');
    return findExistingRsvp(data.email, data.phone);
  });
