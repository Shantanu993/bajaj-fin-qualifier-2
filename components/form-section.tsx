"use client"

import { useEffect, useState } from "react"
import type { FormField, FormSection } from "@/types"
import FormFieldComponent from "./form-field"

interface FormSectionProps {
  section: FormSection
  formValues: Record<string, any>
  onFieldChange: (fieldId: string, value: any) => void
  onValidityChange: (isValid: boolean) => void
}

export default function FormSectionComponent({
  section,
  formValues,
  onFieldChange,
  onValidityChange,
}: FormSectionProps) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  // Validate all fields in this section
  const validateSection = () => {
    const errors: Record<string, string> = {}
    let isValid = true

    section.fields.forEach((field) => {
      const value = formValues[field.fieldId] || ""
      const error = validateField(field, value)

      if (error) {
        errors[field.fieldId] = error
        isValid = false
      }
    })

    setFieldErrors(errors)
    onValidityChange(isValid)
    return isValid
  }

  // Validate a single field
  const validateField = (field: FormField, value: any): string | null => {
    // Skip validation for non-required empty fields
    if (!field.required && (value === "" || value === null || value === undefined)) {
      return null
    }

    // Required field validation
    if (field.required && (value === "" || value === null || value === undefined)) {
      return field.validation?.message || "This field is required"
    }

    // String-based validations
    if (typeof value === "string") {
      // Min length validation
      if (field.minLength !== undefined && value.length < field.minLength) {
        return `Minimum length is ${field.minLength} characters`
      }

      // Max length validation
      if (field.maxLength !== undefined && value.length > field.maxLength) {
        return `Maximum length is ${field.maxLength} characters`
      }

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address"
        }
      }

      // Phone validation
      if (field.type === "tel" && value) {
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(value.replace(/\D/g, ""))) {
          return "Please enter a valid 10-digit phone number"
        }
      }

      // Date of birth validation (16+ years)
      if (field.type === "date" && field.fieldId.toLowerCase().includes("birth") && value) {
        const birthDate = new Date(value)
        const today = new Date()
        const age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        // If birth month is after current month or same month but birth day is after current day, subtract 1 from age
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          if (age - 1 < 16) {
            return "You must be at least 16 years old"
          }
        } else if (age < 16) {
          return "You must be at least 16 years old"
        }
      }

      // Pincode validation (digits only)
      if (field.fieldId.toLowerCase().includes("pincode") || field.fieldId.toLowerCase().includes("zip")) {
        const pincodeRegex = /^\d+$/
        if (!pincodeRegex.test(value)) {
          return "Pincode should contain only digits"
        }
      }
    }

    return null
  }

  // Handle field change and validate
  const handleFieldChange = (fieldId: string, value: any) => {
    onFieldChange(fieldId, value)

    const field = section.fields.find((f) => f.fieldId === fieldId)
    if (field) {
      const error = validateField(field, value)

      setFieldErrors((prev) => ({
        ...prev,
        [fieldId]: error || "",
      }))
    }
  }

  // Validate section whenever form values change
  useEffect(() => {
    validateSection()
  }, [formValues])

  // Check if there are any address-related fields that should be conditionally shown
  useEffect(() => {
    // Find the mailing address checkbox field
    const mailingAddressField = section.fields.find(
      (f) =>
        f.type === "checkbox" &&
        (f.fieldId.toLowerCase().includes("mailing") || f.label.toLowerCase().includes("mailing")),
    )

    // If we found the field and it's checked, make sure to validate all fields
    if (mailingAddressField && formValues[mailingAddressField.fieldId]) {
      validateSection()
    }
  }, [formValues])

  return (
    <div className="space-y-6">
      {section.fields.map((field) => (
        <FormFieldComponent
          key={field.fieldId}
          field={field}
          value={formValues[field.fieldId] || ""}
          error={fieldErrors[field.fieldId]}
          onChange={(value) => handleFieldChange(field.fieldId, value)}
        />
      ))}
    </div>
  )
}
