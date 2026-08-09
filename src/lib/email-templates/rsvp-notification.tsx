import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const OLIVE = '#6B7A4F'
const CREAM = '#FAF7F0'
const INK = '#3F4436'

interface Props {
  name?: string
  email?: string
  guests?: number
  attending?: boolean
  allergies?: string
  song?: string
  message?: string
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <Text style={row}>
    <span style={rowLabel}>{label}: </span>
    {value}
  </Text>
)

const Email = ({ name, email, guests, attending, allergies, song, message }: Props) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>Nova confirmação recebida no site do casamento.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={card}>
          <Heading style={title}>Nova confirmação recebida</Heading>
          <Row label="Nome" value={name || '—'} />
          <Row label="Email" value={email || '—'} />
          <Row label="Nº de convidados" value={guests ? String(guests) : '—'} />
          <Row label="Presença" value={attending === false ? 'Não' : 'Sim'} />
          <Row label="Restrições alimentares" value={allergies || '—'} />
          <Row label="Música escolhida" value={song || '—'} />
          <Row label="Mensagem" value={message || '—'} />
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Nova confirmação de presença',
  displayName: 'RSVP — Notificação para os noivos',
  previewData: {
    name: 'Maria Silva',
    email: 'maria@exemplo.pt',
    guests: 2,
    attending: true,
    allergies: 'Sem glúten',
    song: 'Dancing Queen',
    message: 'Parabéns!',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px 0' }
const card = { backgroundColor: CREAM, padding: '28px', borderRadius: '6px' }
const title = { margin: '0 0 18px', fontSize: '22px', fontWeight: 400, color: OLIVE }
const row = { margin: '0 0 8px', fontSize: '15px', color: INK, lineHeight: '1.6' }
const rowLabel = { color: OLIVE, fontSize: '13px', textTransform: 'uppercase' as const }
