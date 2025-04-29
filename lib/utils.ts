import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique form ID based on name, roll number, and current timestamp
 */
export function generateFormId(name: string, rollNumber: string): string {
  const timestamp = Date.now().toString(36)
  const nameInitials = name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  // Create a unique ID combining initials, roll number, and timestamp
  return `${nameInitials}-${rollNumber}-${timestamp}`.toUpperCase()
}
