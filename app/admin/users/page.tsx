// app/admin/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { AdminLayout } from '@/components/admin/AdminLayout'

interface User {
  id: string
  email: string
  role: 'admin' | 'viewer'
  created_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'viewer' as 'admin' | 'viewer',
  })

  // Check auth and load users
  useEffect(() => {
    const checkAuthAndLoadUsers = async () => {
      try {
        const {
          data: { session },
        } = await getSupabase().auth.getSession()

        if (!session) {
          router.push('/login')
          return
        }

        // Check if user is admin
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        if (!profileError && userProfile?.role === 'admin') {
          // Load all users
          const { data: allUsers, error: usersError } = await supabase
            .from('user_profiles')
            .select('id, email, role, created_at')

          if (!usersError && allUsers) {
            setUsers(allUsers as User[])
          }
        } else {
          // Non-admin users should not access this page
          router.push('/admin')
        }
      } catch (err) {
        console.error('Auth error:', err)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoadUsers()
  }, [router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const {
        data: { session },
      } = await getSupabase().auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar usuário')
        return
      }

      // Success
      setSuccessMessage('Usuário criado com sucesso!')
      setFormData({
        email: '',
        password: '',
        role: 'viewer',
      })

      // Reload users list
      const { data: allUsers } = await supabase
        .from('user_profiles')
        .select('id, email, role, created_at')

      if (allUsers) {
        setUsers(allUsers as User[])
      }

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (err) {
      console.error('Create user error:', err)
      setError('Erro ao criar usuário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout userRole="admin">
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout userRole="admin">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Novo Usuário</h2>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-800 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded mb-4 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Tipo de Acesso
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="admin">Administrador</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Visualizador: apenas lê contatos
                  <br />
                  Administrador: cria usuários e acessa tudo
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {isSubmitting ? 'Criando...' : 'Criar Usuário'}
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Usuários ({users.length})
              </h2>
            </div>

            {users.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-600">
                Nenhum usuário criado ainda
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        E-mail
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo de Acesso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data de Criação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role === 'admin'
                              ? 'Administrador'
                              : 'Visualizador'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
