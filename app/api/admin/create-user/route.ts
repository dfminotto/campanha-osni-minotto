import { supabaseAdmin } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Initialize Supabase for checking current user role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper function to get user from request header
async function getSessionUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return null
  }

  return user
}

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getSessionUser(request)

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !userProfile || userProfile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Apenas administradores podem criar usuários' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, password, role } = body

    // Validation
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter no mínimo 8 caracteres' },
        { status: 400 }
      )
    }

    if (!role || !['admin', 'viewer'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role deve ser admin ou viewer' },
        { status: 400 }
      )
    }

    // Create user using service role
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (createError || !newUser) {
      console.error('Create user error:', createError)
      return NextResponse.json(
        { success: false, error: 'Erro ao criar usuário' },
        { status: 500 }
      )
    }

    // Create user profile
    const { error: profileCreateError } = await supabaseAdmin
      .from('user_profiles')
      .insert([
        {
          id: newUser.user.id,
          email: email.toLowerCase(),
          role,
        },
      ])

    if (profileCreateError) {
      console.error('Create profile error:', profileCreateError)
      // Clean up created auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json(
        { success: false, error: 'Erro ao criar perfil do usuário' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Usuário criado com sucesso',
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
