# Dynamic Form Builder - Next.js (TypeScript + Tailwind CSS)

**Live Demo:**  
[https://shantanu-bajaj-qa-2-form-builder.vercel.app/](https://shantanu-bajaj-qa-2-form-builder.vercel.app/)

---

## 🚀 Overview

This project is a **dynamic form builder** built with Next.js, TypeScript, and Tailwind CSS. It allows students to:

- **Login** with their roll number and name (user registration via API)
- **Fetch and render a dynamic multi-section form** based on API schema
- **Validate** each section as per backend-provided metadata
- **Navigate** through form sections (Prev/Next), with validation gating
- **Review a summary page** before final submission
- **Submit** responses (console-logged)

All form fields, sections, and validations are generated dynamically from the backend API response-nothing is hardcoded.

---

## ✨ Features Implemented

### 1. User Authentication & Registration
- Simple login form for roll number and name
- Registers user via `POST /create-user` API before showing the form

### 2. Dynamic Form Fetching & Rendering
- Fetches form structure from `GET /get-form` API using the roll number
- Renders form sections and fields dynamically based on API response
- Supports all field types: text, email, tel, textarea, date, dropdown, radio, checkbox

### 3. Section-Based Navigation
- Form is split into multiple sections
- Only one section is visible at a time
- Users must complete and validate the current section before moving to the next
- Each section has **Prev** and **Next** buttons; only the last section has **Submit**

### 4. Dynamic Validation
- All validation (required, minLength, maxLength, email, etc.) is generated from the API schema
- Validation errors are shown contextually under each field
- Section cannot be advanced until all fields in the current section are valid

### 5. Summary/Review Page
- After all sections, a **Summary** page displays all entered responses grouped by section
- Users can review their responses before final submission
- Option to go back and edit any section before submitting

### 6. Submission
- On final submit, all form data is logged to the console as per requirements

### 7. Modern, Responsive UI
- Built with Tailwind CSS for a clean, accessible, and responsive design
- UI adapts to desktop and mobile screens
- Focus on clarity and usability

### 8. TypeScript & Best Practices
- All components and logic are strongly typed
- Code is modular and easy to extend

---

## 🗂️ Project Structure

- `app/`: Next.js App Router pages and layout
- `components/`: All React components (DynamicForm, SectionForm, SummaryPage, etc.)
- `lib/`: API utility functions
- `types/`: TypeScript interfaces for form schema

---

## 🛠️ How It Works

1. **Login/Register:**  
   User enters roll number and name. Registration is done via API.

2. **Fetch Form:**  
   The app fetches the dynamic form schema for the user.

3. **Render Sections:**  
   Each section is rendered with its fields, using dynamic validation.

4. **Navigate Sections:**  
   Users can move forward only if the current section is valid. They can also go back to previous sections.

5. **Summary Page:**  
   After all sections, a summary page displays all responses for review.

6. **Submit:**  
   On confirmation, the entire response is logged to the console.

---

## 🖥️ Live Demo

[https://shantanu-bajaj-qa-2-form-builder.vercel.app/](https://shantanu-bajaj-qa-2-form-builder.vercel.app/)

---
