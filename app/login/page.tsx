"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [rollNumber, setRollNumber] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rollNumber.trim() || !name.trim()) {
      setError("Please enter both roll number and name")
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check if user exists in localStorage
      const userData = localStorage.getItem(`user_${rollNumber}`)

      if (!userData) {
        throw new Error("User not found. Please register first.")
      }

      const user = JSON.parse(userData)

      // Verify that the name matches
      if (user.name.toLowerCase() !== name.toLowerCase()) {
        throw new Error("Invalid credentials. Please check your roll number and name.")
      }

      // Check if user has a form in progress or completed
      const formData = localStorage.getItem(`form_${rollNumber}`)
      const formStatus = formData ? JSON.parse(formData).status : null

      // Set current user in session
      sessionStorage.setItem("currentUser", JSON.stringify(user))

      // Redirect based on form status
      if (formStatus === "completed") {
        router.push(`/form/summary?rollNumber=${encodeURIComponent(rollNumber)}`)
      } else {
        router.push(`/form?rollNumber=${encodeURIComponent(rollNumber)}`)
      }
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
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
                disabled={loading}
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
                disabled={loading}
                data-testid="name-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-70 mb-4"
              data-testid="login-button"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/register" className="text-gray-800 font-medium hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
