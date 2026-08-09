import * as React from 'react'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components'

interface EmailChangeEmailProps {
  siteName: string
  // oldEmail is the user's current address (HookData.OldEmail). For the
  // NEW-recipient half of a secure email_change fanout, `email` equals the
  // recipient (NEW), so the "from" line must render oldEmail to read
  // "from OLD to NEW" instead of "from NEW to NEW".
  oldEmail: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  oldEmail,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email change</Heading>
        <Text style={text}>
          You requested to change your email address for {siteName} from{' '}
          <Link href={`mailto:${oldEmail}`} style={link}>
            {oldEmail}
          </Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>
            {newEmail}
          </Link>
          .
        </Text>
        <Text style={text}>
          Click the button below to confirm this change:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this change, please secure your account
          immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "Georgia, 'Times New Roman', serif",
  padding: '24px 0',
}
const container = {
  padding: '40px 36px',
  maxWidth: '560px',
  backgroundColor: '#FBF8F1',
  border: '1px solid #E3D8C0',
  borderRadius: '4px',
}
const h1 = {
  fontSize: '24px',
  fontWeight: 'normal' as const,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  color: '#6B7A4F',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}
const text = {
  fontSize: '15px',
  color: '#4A4A45',
  lineHeight: '1.7',
  margin: '0 0 24px',
}
const link = { color: '#B8935A', textDecoration: 'underline' }
const button = {
  backgroundColor: '#6B7A4F',
  color: '#FBF8F1',
  fontSize: '14px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  borderRadius: '2px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'center' as const,
}
const codeStyle = {
  fontSize: '28px',
  letterSpacing: '0.3em',
  color: '#6B7A4F',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontWeight: 'bold' as const,
}
const footer = {
  fontSize: '12px',
  color: '#8A8578',
  margin: '32px 0 0',
  borderTop: '1px solid #E3D8C0',
  paddingTop: '16px',
  textAlign: 'center' as const,
}
