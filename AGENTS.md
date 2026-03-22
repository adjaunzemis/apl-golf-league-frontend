# AGENTS.md (Frontend)

## Purpose
Defines architecture, UI patterns, and expectations for the Angular frontend.

---

## 🏗️ Architecture

- Framework: Angular (standalone components)
- UI: PrimeNG
- Styling: TailwindCSS

---

## 🧩 Components

- Use standalone components
- Keep components small and focused
- Separate presentation and logic where possible

---

## 🔌 Services

- Handle all API communication
- No HTTP calls inside components
- Strongly type all API responses

---

## 🧠 State Management

- Keep state simple and local unless necessary
- Avoid unnecessary global state

---

## 🧾 Forms

- Use reactive forms
- Include validation for:
  - required fields
  - valid ranges
  - business rules (mirroring backend)

---

## 🎨 UI/UX

- Use PrimeNG components where possible
- Use Tailwind for layout and spacing
- Ensure responsive design
- Mobile-first for score entry

---

## ⚠️ Validation Rules

- Mirror backend validation rules
- Provide clear, user-friendly error messages
- Prevent invalid submissions

---

## 🔄 Error Handling

- Handle API errors gracefully
- Display meaningful messages to users

---

## 🔄 Git

- Small commits
- Clear messages:
  - feat:
  - fix:
  - refactor:

---

## ⚠️ Constraints

- Do NOT duplicate business logic unnecessarily
- Do NOT bypass services for API calls
- Keep UI consistent

---

## 🎯 Definition of Done

- Feature implemented
- UI is responsive and usable
- Validation added
- API integration works