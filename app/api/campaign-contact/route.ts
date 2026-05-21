import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'


function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidWhatsApp(whatsapp: string): boolean {
  const digits = whatsapp.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 15
}

// Strips control characters and enforces max length. Returns null if not a string or empty.
function sanitize(value: unknown, maxLen: number): string | null {
  if (typeof value !== 'string') return null
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, maxLen) || null
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY not set — skipping verification in dev')
    return true
  }
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    })
    const data = await res.json()
    // reCAPTCHA v3: score >= 0.5 means likely human
    return data.success === true && (data.score ?? 0) >= 0.5
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const emailConfigured = !!process.env.EMAIL_HOST && !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS
  const transporter = emailConfigured
    ? nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_PORT === '465',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
    : null

  try {
    // Reject oversized payloads before parsing JSON
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 10_000) {
      return NextResponse.json({ success: false, error: 'Payload muito grande' }, { status: 413 })
    }

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Requisição inválida' }, { status: 400 })
    }

    // Verify reCAPTCHA v3 token
    const recaptchaToken = typeof body.recaptchaToken === 'string' ? body.recaptchaToken : ''
    const isHuman = await verifyRecaptcha(recaptchaToken)
    if (!isHuman) {
      return NextResponse.json(
        { success: false, error: 'Verificação de segurança falhou. Tente novamente.' },
        { status: 400 }
      )
    }

    // Sanitize and type-check every field with individual length caps
    const full_name    = sanitize(body.full_name, 100)
    const email        = sanitize(body.email, 254)
    const whatsapp     = sanitize(body.whatsapp, 20)
    const city         = sanitize(body.city, 100)
    const neighborhood = sanitize(body.neighborhood, 100)
    const message      = sanitize(body.message, 500)
    const consent      = body.consent === true

    const errors: string[] = []

    if (!full_name || full_name.length < 2)
      errors.push('Nome é obrigatório')

    if (!email)
      errors.push('E-mail é obrigatório')
    else if (!isValidEmail(email))
      errors.push('E-mail inválido')

    if (!whatsapp)
      errors.push('WhatsApp é obrigatório')
    else if (!isValidWhatsApp(whatsapp))
      errors.push('WhatsApp inválido')

    if (!city)
      errors.push('Cidade é obrigatória')

    if (!neighborhood)
      errors.push('Bairro é obrigatório')

    if (!message || message.length < 10)
      errors.push('Sugestão é obrigatória (mínimo 10 caracteres)')

    if (!consent)
      errors.push('Você deve consentir com o armazenamento dos dados')

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Rate limit: same e-mail can only submit once per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('campaign_contacts')
      .select('*', { count: 'exact', head: true })
      .eq('email', email!.toLowerCase())
      .gte('created_at', oneHourAgo)

    if (count && count > 0) {
      return NextResponse.json(
        { success: false, error: 'Já recebemos seu contato. Aguarde antes de tentar novamente.' },
        { status: 429 }
      )
    }

    const { data, error: insertError } = await supabase
      .from('campaign_contacts')
      .insert([{
        full_name: full_name!,
        email: email!.toLowerCase(),
        whatsapp: whatsapp!,
        city: city!,
        neighborhood: neighborhood!,
        message: message!,
        consent: true,
      }])
      .select()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json({ success: false, error: 'Erro ao salvar os dados' }, { status: 500 })
    }

    // Escape all user content before embedding in HTML email
    const candidateName = process.env.NEXT_PUBLIC_CANDIDATE_NAME || 'Candidato'
    const s = (v: string | null) => escapeHtml(v ?? '')

    const htmlEmail = `
<h2>Novo contato — Campanha ${s(candidateName)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">
  <tr><th align="left">Nome</th><td>${s(full_name)}</td></tr>
  <tr><th align="left">E-mail</th><td>${s(email)}</td></tr>
  <tr><th align="left">WhatsApp</th><td>${s(whatsapp)}</td></tr>
  <tr><th align="left">Cidade</th><td>${s(city)}</td></tr>
  <tr><th align="left">Bairro</th><td>${s(neighborhood)}</td></tr>
  <tr><th align="left">Sugestão</th><td>${s(message)}</td></tr>
  <tr><th align="left">Data</th><td>${new Date().toLocaleString('pt-BR')}</td></tr>
</table>`

    const textEmail = [
      `Nome: ${full_name}`,
      `E-mail: ${email}`,
      `WhatsApp: ${whatsapp}`,
      `Cidade: ${city}`,
      `Bairro: ${neighborhood}`,
      `Sugestão: ${message}`,
      `Data: ${new Date().toLocaleString('pt-BR')}`,
    ].join('\n')

    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.CAMPAIGN_EMAIL_TO,
          subject: `Novo contato da campanha — ${candidateName}`,
          text: textEmail,
          html: htmlEmail,
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
      }
    }

    return NextResponse.json(
      { success: true, message: 'Sua participação foi registrada com sucesso!', data },
      { status: 201 }
    )
  } catch (error) {
    console.error('Campaign contact error:', error)
    return NextResponse.json({ success: false, error: 'Erro ao processar sua solicitação' }, { status: 500 })
  }
}
