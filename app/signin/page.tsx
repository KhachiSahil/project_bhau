"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
  const [Name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('employee')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await signIn('credentials', {
      redirect: false,
      name: Name,
      password,
      role,
    })
    
    if (res?.error) {
      setError(res.error)
    } else if (res?.ok) {
      if (role === 'admin') {
        router.push('/Admin')
      } else {
        router.push('/Website')
      }
    }

  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="Enter your name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Role</label>
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-neutral-800 transition duration-150 shadow-xs"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
