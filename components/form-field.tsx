"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { FormField } from "@/types"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  field: FormField
  value: any
  error?: string
  onChange: (value: any) => void
}

export default function FormFieldComponent({ field, value, error, onChange }: FormFieldProps) {
  const [showAdditionalAddress, setShowAdditionalAddress] = useState(false)

  // Check if this is the mailing address checkbox field
  const isMailingAddressField =
    field.type === "checkbox" &&
    (field.fieldId.toLowerCase().includes("mailing") || field.label.toLowerCase().includes("mailing"))

  // Handle checkbox change for mailing address
  const handleMailingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setShowAdditionalAddress(isChecked)
    onChange(isChecked)
  }

  // Initialize showAdditionalAddress based on value
  useEffect(() => {
    if (isMailingAddressField) {
      setShowAdditionalAddress(!!value)
    }
  }, [isMailingAddressField, value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMailingAddressField) {
      handleMailingAddressChange(e)
    } else {
      onChange(e.target.checked)
    }
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "date":
        return (
          <input
            type={field.type}
            id={field.fieldId}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              error ? "border-red-300" : "border-gray-300"
            }`}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
          />
        )

      case "textarea":
        return (
          <textarea
            id={field.fieldId}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder || ""}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              error ? "border-red-300" : "border-gray-300"
            }`}
            rows={4}
            maxLength={field.maxLength}
            data-testid={field.dataTestId}
          />
        )

      case "dropdown":
        return (
          <select
            id={field.fieldId}
            value={value}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${
              error ? "border-red-300" : "border-gray-300"
            }`}
            data-testid={field.dataTestId}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value} data-testid={option.dataTestId}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.fieldId}-${option.value}`}
                  name={field.fieldId}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300"
                  data-testid={option.dataTestId}
                />
                <label htmlFor={`${field.fieldId}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.fieldId}
              checked={!!value}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded"
              data-testid={field.dataTestId}
            />
            <label htmlFor={field.fieldId} className="ml-2 block text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        )

      default:
        return <div>Unsupported field type: {field.type}</div>
    }
  }

  return (
    <div
      className={`space-y-1 ${isMailingAddressField && showAdditionalAddress ? "mb-6 pb-4 border-b border-gray-200" : ""}`}
    >
      {field.type !== "checkbox" && (
        <label htmlFor={field.fieldId} className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderField()}

      {error && (
        <div className="flex items-center mt-1 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}

      {isMailingAddressField && showAdditionalAddress && (
        <div className="mt-4 pt-3 space-y-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-800">Mailing Address</h4>
          <p className="text-sm text-gray-600">Please provide your mailing address below.</p>
        </div>
      )}
    </div>
  )
}
