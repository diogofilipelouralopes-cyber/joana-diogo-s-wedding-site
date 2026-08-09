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
  Link,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const OLIVE = '#6B7A4F'
const GOLD = '#C9A961'
const CREAM = '#FAF7F0'
const INK = '#3F4436'

interface Props {
  name?: string
  guests?: number
  attending?: boolean
}

const Email = ({ name, guests, attending = true }: Props) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>Recebemos a tua confirmação para o nosso casamento.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={kicker}>Confirmação recebida</Text>
          <Heading style={names}>Joana &amp; Diogo</Heading>
          <Text style={dateLine}>19 Setembro 2026</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Olá {name || 'amigo(a)'},</Text>
          <Text style={paragraph}>
            {attending
              ? 'Recebemos a tua confirmação para o nosso casamento no dia 19 de setembro de 2026. Estamos muito felizes por partilhar este momento contigo.'
              : 'Recebemos a tua resposta. Lamentamos que não possas estar connosco, mas estarás sempre no nosso pensamento.'}
          </Text>
          {attending && guests ? (
            <Text style={paragraph}>
              Número de pessoas registadas: <strong>{guests}</strong>
            </Text>
          ) : null}
          <Text style={paragraph}>
            Podes rever toda a informação em{' '}
            <Link href="https://joanaediogo.com" style={link}>
              joanaediogo.com
            </Link>
            .
          </Text>
          <Text style={signature}>Joana &amp; Diogo</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Confirmação recebida — Casamento Joana & Diogo',
  displayName: 'RSVP — Confirmação ao convidado',
  previewData: { name: 'Maria', guests: 2, attending: true },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = { maxWidth: '600px', margin: '0 auto', padding: '0 0 32px' }
const header = {
  backgroundColor: OLIVE,
  padding: '36px 24px',
  textAlign: 'center' as const,
  borderRadius: '6px 6px 0 0',
}
const kicker = {
  margin: '0 0 10px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase' as const,
  color: GOLD,
}
const names = { margin: '0', fontSize: '34px', fontWeight: 400, color: '#ffffff' }
const dateLine = {
  margin: '12px 0 0',
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: '#ffffff',
}
const content = { backgroundColor: CREAM, padding: '32px 28px', borderRadius: '0 0 6px 6px' }
const greeting = { margin: '0 0 18px', fontSize: '20px', color: OLIVE }
const paragraph = { margin: '0 0 14px', fontSize: '16px', lineHeight: '1.7', color: INK }
const signature = { margin: '24px 0 0', fontSize: '22px', color: OLIVE }
const link = { color: GOLD }
