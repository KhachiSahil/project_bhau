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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="bg-white p-8 border border-black rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Name</label>
            <input
              type="Name"
              className="w-full px-4 py-2 rounded-md bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={Name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Role</label>
            <select
              className="w-full px-4 py-2 rounded-md bg-white text-black border border-black focus:outline-none focus:ring-2 focus:ring-gray-600"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-300 text-black font-semibold py-2 rounded-md hover:bg-gray-400 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
