import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const OLIVE = '#6B7A4F'
const GOLD = '#C9A961'
const CREAM = '#FAF7F0'
const INK = '#3F4436'

interface Props {
  name?: string
}

const Email = ({ name }: Props) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>Falta apenas 1 mês para o nosso casamento!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={kicker}>Falta 1 mês</Text>
          <Heading style={names}>Joana &amp; Diogo</Heading>
          <Text style={dateLine}>19 Setembro 2026</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Olá {name || 'amigo(a)'},</Text>
          <Text style={paragraph}>
            Está quase! Falta apenas um mês para o nosso grande dia e queremos partilhar
            contigo os detalhes finais.
          </Text>

          <Hr style={hr} />

          <Text style={detailLabel}>Local</Text>
          <Text style={detailValue}>Quinta Glicínia</Text>

          <Text style={detailLabel}>Hora</Text>
          <Text style={detailValue}>14:00 — recomendamos chegar 20 minutos antes</Text>

          <Text style={detailLabel}>Dress code</Text>
          <Text style={detailValue}>Formal / elegante (evitar branco)</Text>

          <Hr style={hr} />

          <Section style={{ textAlign: 'center' as const }}>
            <Button href="https://joanaediogo.com" style={button}>
              Ver todos os detalhes
            </Button>
          </Section>

          <Text style={paragraph}>
            Qualquer dúvida, responde a este email ou visita{' '}
            <Link href="https://joanaediogo.com" style={link}>
              joanaediogo.com
            </Link>
            .
          </Text>
          <Text style={signature}>Até breve, Joana &amp; Diogo</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Está quase! Falta apenas 1 mês 💚',
  displayName: 'Lembrete — 1 mês antes',
  previewData: { name: 'Maria' },
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
const detailLabel = {
  margin: '0 0 2px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: GOLD,
}
const detailValue = { margin: '0 0 16px', fontSize: '17px', color: INK }
const hr = { borderColor: `${GOLD}55`, margin: '24px 0' }
const button = {
  backgroundColor: OLIVE,
  color: '#ffffff',
  padding: '14px 28px',
  borderRadius: '4px',
  fontSize: '15px',
  textDecoration: 'none',
  display: 'inline-block',
}
const signature = { margin: '24px 0 0', fontSize: '22px', color: OLIVE }
const link = { color: GOLD }
