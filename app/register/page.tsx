"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [rollNumber, setRollNumber] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rollNumber.trim() || !name.trim()) {
      setError("Please enter both roll number and name")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("https://dynamic-form-generator-9rl7.onrender.com/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollNumber,
          name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to register user")
      }

      // Store user in localStorage
      const userData = {
        rollNumber,
        name,
        registeredAt: new Date().toISOString(),
      }

      // Store in localStorage
      localStorage.setItem(`user_${rollNumber}`, JSON.stringify(userData))

      setSuccess(true)

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Registration</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <input
                id="rollNumber"
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your roll number"
                disabled={loading || success}
                data-testid="roll-number-input"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Enter your full name"
                disabled={loading || success}
                data-testid="name-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-70 mb-4"
              data-testid="register-button"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-gray-800 font-medium hover:underline">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
