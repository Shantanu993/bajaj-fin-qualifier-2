"use client"

import { useState, useEffect } from "react"
import type { Form } from "@/types"
import FormSectionComponent from "./form-section"
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface DynamicFormProps {
  formData: Form
  rollNumber: string
  formId: string
}

export default function DynamicForm({ formData, rollNumber, formId }: DynamicFormProps) {
  const router = useRouter()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [sectionValidity, setSectionValidity] = useState<Record<number, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const currentSection = formData.sections[currentSectionIndex]
  const isFirstSection = currentSectionIndex === 0
  const isLastSection = currentSectionIndex === formData.sections.length - 1

  // Load saved form values from localStorage
  useEffect(() => {
    const storedFormData = localStorage.getItem(`form_${rollNumber}`)
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData)
      if (parsedData.values) {
        setFormValues(parsedData.values)
      }
    }
  }, [rollNumber])

  // Save form values to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      const storedFormData = localStorage.getItem(`form_${rollNumber}`)
      if (storedFormData) {
        const parsedData = JSON.parse(storedFormData)
        parsedData.values = formValues
        localStorage.setItem(`form_${rollNumber}`, JSON.stringify(parsedData))
      }
    }
  }, [formValues, rollNumber])

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const updateSectionValidity = (sectionId: number, isValid: boolean) => {
    setSectionValidity((prev) => ({
      ...prev,
      [sectionId]: isValid,
    }))
  }

  const handlePrevious = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1)
    }
  }

  const handleNext = () => {
    if (sectionValidity[currentSection.sectionId] && !isLastSection) {
      setCurrentSectionIndex(currentSectionIndex + 1)
    }
  }

  const handleSubmit = () => {
    if (sectionValidity[currentSection.sectionId]) {
      console.log("Form submitted with data:", formValues)

      // Mark form as completed in localStorage
      const storedFormData = localStorage.getItem(`form_${rollNumber}`)
      if (storedFormData) {
        const parsedData = JSON.parse(storedFormData)
        parsedData.status = "completed"
        parsedData.submittedAt = new Date().toISOString()
        localStorage.setItem(`form_${rollNumber}`, JSON.stringify(parsedData))
      }

      setSubmitted(true)

      // Redirect to summary page after 2 seconds
      setTimeout(() => {
        router.push(`/form/summary?rollNumber=${rollNumber}`)
      }, 2000)
    }
  }

  if (submitted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="bg-green-50 rounded-full p-3 mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Submitted Successfully</h2>
        <p className="text-gray-600 mb-6 text-center">
          Thank you for completing the form. Your responses have been recorded.
        </p>
        <p className="text-sm text-gray-500 mb-4">Redirecting to summary page...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{currentSection.title}</h2>
          <span className="text-sm font-medium text-gray-500">
            Section {currentSectionIndex + 1} of {formData.sections.length}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gray-800 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentSectionIndex + 1) / formData.sections.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {currentSection.description && <p className="text-gray-600 mb-6">{currentSection.description}</p>}

      <FormSectionComponent
        section={currentSection}
        formValues={formValues}
        onFieldChange={handleFieldChange}
        onValidityChange={(isValid) => updateSectionValidity(currentSection.sectionId, isValid)}
      />

      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstSection}
          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
            isFirstSection
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {isLastSection ? (
          <button
            onClick={handleSubmit}
            disabled={!sectionValidity[currentSection.sectionId]}
            className={`px-6 py-2 rounded-md transition-colors ${
              sectionValidity[currentSection.sectionId]
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            data-testid="submit-button"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!sectionValidity[currentSection.sectionId]}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              sectionValidity[currentSection.sectionId]
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            data-testid="next-button"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  )
}
