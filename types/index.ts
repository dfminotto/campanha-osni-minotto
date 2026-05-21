// types/contact.ts
export interface Contact {
  id: string
  full_name: string
  email: string
  whatsapp: string
  city: string
  neighborhood: string
  participation_type: string
  main_problem: string
  message: string | null
  consent: boolean
  created_at: string
}

// types/user.ts
export interface UserProfile {
  id: string
  email: string
  role: 'admin' | 'viewer'
  created_at: string
}
