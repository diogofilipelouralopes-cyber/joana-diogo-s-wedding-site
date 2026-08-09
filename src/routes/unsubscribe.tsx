import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/unsubscribe')({
  component: UnsubscribePage,
  head: () => ({
    meta: [
      { title: 'Cancelar subscrição — Joana & Diogo' },
      {
        name: 'description',
        content: 'Cancela a subscrição dos emails do casamento de Joana & Diogo.',
      },
      { property: 'og:title', content: 'Cancelar subscrição — Joana & Diogo' },
      {
        property: 'og:description',
        content: 'Cancela a subscrição dos emails do casamento de Joana & Diogo.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
})

type State = 'loading' | 'valid' | 'invalid' | 'already' | 'done' | 'error'

function UnsubscribePage() {
  const [state, setState] = useState<State>('loading')
  const [email, setEmail] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    setToken(t)
    if (!t) {
      setState('invalid')
      return
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const data = await r.json().catch(() => ({}))
        if (!r.ok || data?.valid === false) {
          setState(data?.alreadyUnsubscribed || data?.used ? 'already' : 'invalid')
          return
        }
        if (data?.email) setEmail(data.email)
        setState('valid')
      })
      .catch(() => setState('error'))
  }, [])

  const confirm = async () => {
    if (!token) return
    setSubmitting(true)
    try {
      const r = await fetch('/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      setState(r.ok ? 'done' : 'error')
    } catch {
      setState('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 bg-background">
      <div className="w-full max-w-md text-center border border-border rounded-lg p-8 bg-card">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
          Joana &amp; Diogo
        </p>
        <h1 className="font-serif text-2xl mb-4 text-foreground">Cancelar subscrição</h1>

        {state === 'loading' && (
          <p className="text-muted-foreground">A validar o teu pedido…</p>
        )}

        {state === 'valid' && (
          <>
            <p className="text-muted-foreground mb-6">
              {email ? (
                <>
                  Queres deixar de receber emails em <strong>{email}</strong>?
                </>
              ) : (
                'Queres deixar de receber os nossos emails?'
              )}
            </p>
            <button
              onClick={confirm}
              disabled={submitting}
              className="w-full rounded-md bg-primary text-primary-foreground py-3 disabled:opacity-60"
            >
              {submitting ? 'A processar…' : 'Confirmar cancelamento'}
            </button>
          </>
        )}

        {state === 'done' && (
          <p className="text-muted-foreground">
            Subscrição cancelada. Não voltarás a receber estes emails.
          </p>
        )}

        {state === 'already' && (
          <p className="text-muted-foreground">
            Este pedido já tinha sido processado — já não recebes os nossos emails.
          </p>
        )}

        {state === 'invalid' && (
          <p className="text-muted-foreground">
            Este link não é válido ou já expirou.
          </p>
        )}

        {state === 'error' && (
          <p className="text-muted-foreground">
            Ocorreu um erro. Tenta novamente mais tarde.
          </p>
        )}

        <a
          href="/"
          className="inline-block mt-8 text-sm underline text-muted-foreground hover:text-foreground"
        >
          Voltar ao site
        </a>
      </div>
    </main>
  )
}
