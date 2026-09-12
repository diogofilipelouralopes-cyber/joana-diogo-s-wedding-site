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
const GOLD = '#B8935A'
const CREAM = '#FBF8F1'
const INK = '#3F4736'

interface Props {
  name?: string
}

const Email = ({ name }: Props) => (
  <Html lang="pt" dir="ltr">
    <Head />
    <Preview>
      19 de setembro · Glicínia Wedding House · Cerimónia às 14h00. Vê tudo no nosso site.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: 'center' as const }}>
          <Text style={monogram}>J &amp; D</Text>
          <Text style={kicker}>Falta uma semana</Text>
          <Heading style={names}>Joana &amp; Diogo</Heading>
          <Text style={script}>a nossa maior viagem</Text>
          <Text style={dateLine}>19 · 09 · 2026</Text>
        </Section>

        <Hr style={hr} />

        <Section style={{ textAlign: 'center' as const }}>
          {name ? <Text style={greeting}>Olá {name},</Text> : null}
          <Text style={paragraph}>
            Está tudo preparado no nosso site — é lá que encontras tudo o que precisas de saber
            para o dia.
          </Text>
          <Button href="https://joanaediogo.com" style={primaryButton}>
            Ver tudo no site
          </Button>
        </Section>

        <Section style={siteList}>
          <Text style={label}>No site podes ver</Text>
          <Text style={{ ...paragraph, margin: '12px 0 0', lineHeight: '28px' }}>
            · Horários e programa do dia
            <br />· Morada e como chegar
            <br />· Alojamento e perguntas frequentes
            <br />· Lista de presentes
            <br />· Livro de mensagens para os noivos
          </Text>
        </Section>

        <Section style={{ textAlign: 'center' as const, marginTop: '32px' }}>
          <Text style={label}>Local</Text>
          <Text style={venue}>Glicínia Wedding House, Freamunde</Text>
          <Text style={paragraph}>Cerimónia às 14h00 · Estacionamento no local</Text>
          <Button href="https://maps.app.goo.gl/PqSYW3fkz5wGmmrj9" style={ghostButton}>
            Abrir no Google Maps
          </Button>
        </Section>

        <Hr style={hr} />

        <Section style={{ textAlign: 'center' as const }}>
          <Text style={paragraph}>
            Dúvidas? WhatsApp{' '}
            <Link href="https://wa.me/351912633104" style={link}>
              Joana
            </Link>{' '}
            ou{' '}
            <Link href="https://wa.me/32493945581" style={link}>
              Diogo
            </Link>
            .
          </Text>
          <Text style={{ ...paragraph, fontSize: '13px', color: '#8A8F7E' }}>
            No dia, as fotografias podem ser partilhadas no{' '}
            <Link href="https://photos.app.goo.gl/ZfRKu3pg8oHait6eA" style={link}>
              álbum partilhado
            </Link>
            .
          </Text>
          <Text style={script}>Até sábado!</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Falta uma semana — Joana & Diogo',
  displayName: 'Lembrete — 1 semana antes',
  previewData: { name: 'Maria' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, serif' }
const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 32px',
  backgroundColor: CREAM,
  border: `1px solid #DCC9A6`,
  borderRadius: '12px',
}
const monogram = {
  margin: '0 auto',
  width: '72px',
  lineHeight: '70px',
  border: `1px dashed ${GOLD}`,
  borderRadius: '36px',
  fontSize: '18px',
  letterSpacing: '2px',
  color: OLIVE,
  textAlign: 'center' as const,
}
const kicker = {
  margin: '28px 0 0',
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase' as const,
  color: GOLD,
}
const names = {
  margin: '14px 0 0',
  fontSize: '28px',
  fontWeight: 400,
  letterSpacing: '8px',
  textTransform: 'uppercase' as const,
  color: OLIVE,
}
const script = { margin: '8px 0 0', fontStyle: 'italic', fontSize: '26px', color: GOLD }
const dateLine = { margin: '20px 0 0', fontSize: '17px', letterSpacing: '6px', color: OLIVE }
const greeting = { margin: '0 0 14px', fontSize: '19px', color: OLIVE }
const paragraph = {
  margin: '0 0 18px',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '26px',
  color: '#4A5240',
}
const label = {
  margin: '0',
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: GOLD,
}
const venue = { margin: '12px 0 8px', fontSize: '19px', color: INK }
const siteList = {
  marginTop: '22px',
  padding: '22px 24px',
  backgroundColor: '#F7F1E6',
  border: `1px dashed #DCC9A6`,
  borderRadius: '10px',
}
const hr = { borderColor: '#DCC9A6', margin: '28px 0' }
const primaryButton = {
  backgroundColor: OLIVE,
  color: CREAM,
  padding: '18px 28px',
  borderRadius: '10px',
  fontSize: '14px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
}
const ghostButton = {
  backgroundColor: CREAM,
  border: `1px solid ${GOLD}`,
  color: OLIVE,
  padding: '16px 24px',
  borderRadius: '10px',
  fontSize: '13px',
  letterSpacing: '2.5px',
  textTransform: 'uppercase' as const,
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
  marginTop: '12px',
}
const link = { color: OLIVE }
