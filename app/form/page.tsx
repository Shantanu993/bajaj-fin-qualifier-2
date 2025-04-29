"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DynamicForm from "@/components/dynamic-form"
import type { FormResponse } from "@/types"
import { Loader2 } from "lucide-react"
import { generateFormId } from "@/lib/utils"

export default function FormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rollNumber = searchParams.get("rollNumber")

  const [formData, setFormData] = useState<FormResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [formId, setFormId] = useState<string>("")

  useEffect(() => {
    if (!rollNumber) {
      router.push("/login")
      return
    }

    // Get user data from localStorage
    const storedUserData = localStorage.getItem(`user_${rollNumber}`)
    if (!storedUserData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(storedUserData)
    setUserData(user)

    // Check if form is already in progress
    const storedFormData = localStorage.getItem(`form_${rollNumber}`)

    // Generate a unique form ID
    const uniqueFormId = generateFormId(user.name, rollNumber)
    setFormId(uniqueFormId)

    const fetchForm = async () => {
      try {
        setLoading(true)

        // If we have stored form data and API data, use that
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData)
          if (parsedFormData.apiData) {
            setFormData(parsedFormData.apiData)
            setLoading(false)
            return
          }
        }

        // Otherwise fetch from API
        const response = await fetch(
          `https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch form data")
        }

        const data = await response.json()
        setFormData(data)

        // Store the API data
        const formStorage = storedFormData
          ? JSON.parse(storedFormData)
          : {
              formId: uniqueFormId,
              values: {},
              status: "in_progress",
              apiData: data,
            }

        if (!storedFormData) {
          localStorage.setItem(`form_${rollNumber}`, JSON.stringify(formStorage))
        } else if (!formStorage.apiData) {
          formStorage.apiData = data
          localStorage.setItem(`form_${rollNumber}`, JSON.stringify(formStorage))
        }
      } catch (err) {
        setError("Failed to load form. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchForm()
  }, [rollNumber, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
        <p className="mt-4 text-gray-600">Loading your form...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (!formData || !userData) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">{formData.form.formTitle}</h1>
            <div className="flex flex-wrap items-center mt-2 gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {userData.name}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Roll Number:</span> {rollNumber}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Form ID:</span> {formId}
              </div>
            </div>
          </div>
          <DynamicForm formData={formData.form} rollNumber={rollNumber as string} formId={formId} />
        </div>
      </div>
    </main>
  )
}
