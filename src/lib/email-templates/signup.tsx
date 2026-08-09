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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email for {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email</Heading>
        <Text style={text}>
          Thanks for signing up for{' '}
          <Link href={siteUrl} style={link}>
            <strong>{siteName}</strong>
          </Link>
          !
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) by clicking the button below:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Verify Email
        </Button>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
