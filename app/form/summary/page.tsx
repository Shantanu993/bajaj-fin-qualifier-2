"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function FormSummaryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rollNumber = searchParams.get("rollNumber")

  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (!rollNumber) {
      router.push("/login")
      return
    }

    // Get user data
    const storedUserData = localStorage.getItem(`user_${rollNumber}`)
    if (!storedUserData) {
      router.push("/login")
      return
    }

    // Get form data
    const storedFormData = localStorage.getItem(`form_${rollNumber}`)
    if (!storedFormData) {
      router.push(`/form?rollNumber=${rollNumber}`)
      return
    }

    const parsedUserData = JSON.parse(storedUserData)
    const parsedFormData = JSON.parse(storedFormData)

    // Check if form is completed
    if (parsedFormData.status !== "completed") {
      router.push(`/form?rollNumber=${rollNumber}`)
      return
    }

    setUserData(parsedUserData)
    setFormData(parsedFormData)
    setLoading(false)
  }, [rollNumber, router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700" />
        <p className="mt-4 text-gray-600">Loading your form summary...</p>
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
            <div className="flex items-center mb-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Form Submission Summary</h1>
            </div>

            <div className="flex flex-wrap items-center mt-2 gap-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {userData.name}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Roll Number:</span> {rollNumber}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Form ID:</span> {formData.formId}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Submitted:</span> {new Date(formData.submittedAt).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-50 rounded-full p-3">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Form Submitted Successfully</h2>
            <p className="text-gray-600 mb-8 text-center">
              Thank you for completing the form. Your responses have been recorded.
            </p>

            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Form Responses</h3>

              <div className="space-y-4">
                {Object.entries(formData.values).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
                    <div className="font-medium text-gray-700 sm:w-1/3 mr-10">{key}:</div>
                    <div className="text-gray-800 sm:w-2/3 ">{value?.toString() || "-"}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Link href="/">
                <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
