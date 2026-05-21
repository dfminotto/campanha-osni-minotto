'use client'

import { FormEvent, useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'

interface FormError { [key: string]: string }

const EMPTY_FORM = {
  full_name: '', email: '', whatsapp: '', city: '',
  neighborhood: '', message: '', consent: false,
}

function FormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormError>({})
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')
  const [formData, setFormData] = useState(EMPTY_FORM)
  const field = (name: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2461] disabled:opacity-50 ${
      errors[name] ? 'border-red-400' : 'border-gray-200'
    }`

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setServerError('')
    setSuccess(false)

    try {
      const recaptchaToken = executeRecaptcha ? await executeRecaptcha('campaign_contact') : ''

      const res = await fetch('/api/campaign-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (Array.isArray(data.errors)) {
          const fieldErrors: FormError = {}
          data.errors.forEach((err: string) => {
            if (err.includes('Nome')) fieldErrors.full_name = err
            else if (err.includes('E-mail')) fieldErrors.email = err
            else if (err.includes('WhatsApp')) fieldErrors.whatsapp = err
            else if (err.includes('Cidade')) fieldErrors.city = err
            else if (err.includes('Bairro')) fieldErrors.neighborhood = err
            else if (err.includes('sugestão') || err.includes('Sugestão')) fieldErrors.message = err
            else if (err.includes('consentimento')) fieldErrors.consent = err
            else setServerError(err)
          })
          setErrors(fieldErrors)
        } else {
          setServerError(data.error || 'Não foi possível enviar. Tente novamente.')
        }
        return
      }

      setSuccess(true)
      setFormData(EMPTY_FORM)
      setTimeout(() => setSuccess(false), 6000)
    } catch {
      setServerError('Não foi possível enviar. Tente novamente em instantes.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {success && (
        <div className="p-3 bg-green-50 border border-green-300 text-green-800 rounded-lg text-sm font-medium">
          ✅ Obrigado! Sua participação foi registrada com sucesso.
        </div>
      )}
      {serverError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      {/* Nome + Email */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
            disabled={isLoading} maxLength={100} placeholder="Nome completo *" className={field('full_name')} />
          {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
        </div>
        <div>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            disabled={isLoading} maxLength={254} placeholder="E-mail *" className={field('email')} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>

      {/* WhatsApp + Cidade */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
            disabled={isLoading} maxLength={20} placeholder="WhatsApp * (( ) )" className={field('whatsapp')} />
          {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp}</p>}
        </div>
        <div>
          <input type="text" name="city" value={formData.city} onChange={handleChange}
            disabled={isLoading} maxLength={100} placeholder="Cidade *" className={field('city')} />
          {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
        </div>
      </div>

      {/* Bairro */}
      <div>
        <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange}
          disabled={isLoading} maxLength={100} placeholder="Bairro *" className={field('neighborhood')} />
        {errors.neighborhood && <p className="mt-1 text-xs text-red-500">{errors.neighborhood}</p>}
      </div>

      {/* Sugestão */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">Sua sugestão ou ideia para a cidade *</label>
        <textarea name="message" value={formData.message} onChange={handleChange}
          disabled={isLoading} rows={4} maxLength={500}
          placeholder="Conte o que você mudaria, o que falta no seu bairro, ou como podemos melhorar a cidade..."
          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2461] disabled:opacity-50 resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`} />
        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
      </div>

      {/* Consentimento */}
      <div className="flex items-start gap-2">
        <input type="checkbox" id="consent" name="consent" checked={formData.consent}
          onChange={handleChange} disabled={isLoading} className="mt-0.5 h-4 w-4 cursor-pointer accent-[#0d2461]" />
        <label htmlFor="consent" className="text-xs text-gray-600 cursor-pointer">
          Autorizo o uso dessas informações para contato da nossa equipe.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-red-500">{errors.consent}</p>}

      {/* Botão */}
      <button type="submit" disabled={isLoading}
        className="w-full bg-[#f5a623] hover:bg-yellow-500 disabled:bg-gray-300 text-black font-bold py-3 px-4 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
        {isLoading ? 'Enviando...' : 'Enviar sugestão'}
      </button>

      <p className="text-[10px] text-gray-400 text-center">
        Protegido por reCAPTCHA —{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacidade</a>
        {' '}e{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Termos</a>.
      </p>
    </form>
  )
}

export function CampaignContactForm() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}>
      <FormInner />
    </GoogleReCaptchaProvider>
  )
}
