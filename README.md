# SARAL Frontend Assignment

## LiveLinks
- SARAL Assignment: [https://saral-assignment.netlify.app/]

---

## Overview
This project implements the SARAL frontend assignment with a focus on building a production-grade, scalable UI system.

Key priorities:
- Feature-driven architecture with clear separation of concerns
- Reusable, composable UI components
- Predictable state management for complex multi-step flows
- Pixel-accurate and responsive implementation from Figma

---

## Implemented Scope
- Responsive gamification dashboard (sidebar, top nav, hero, feature cards)
- Multi-step "Create Reward" modal with inline edit/save flows
- Event & reward selectors with validation and contextual feedback
- Commission tier sub-flow with event-based constraints
- Time-bound rewards with date picker, constraints, and validation
- Form validation, disabled states, and contextual tooltips

---

## Tech Stack
- React + TypeScript
- Tailwind CSS
- Shadcn-style UI layer with Base UI primitives
- Redux Toolkit
- date-fns
- Vite

---
## Architecture
Feature-first structure to keep domain logic isolated and scalable:

src/
app/
features/
landing/
reward-modal/
config/ # options, validation
model/ # slice, types, selectors
ui/ # modal and components
components/ui/ # UI primitives (wrappers)
shared/ui/ # cross-feature components

---

## State Management Approach
- **Redux**: manages persisted domain state (event, reward, time-bound config, submission status)
- **Local state**: handles transient UI interactions (dropdown state, draft inputs, modal controls)

This separation ensures predictable business logic while keeping UI interactions responsive and isolated.

---

## Key Engineering Decisions
- Broke down complex modal into focused components for better readability and scalability
- Centralized validation in config/model layer to avoid duplication and improve consistency
- Co-located summary generation with configuration to keep UI and logic aligned
- Used semantic design tokens instead of hardcoded values for consistency and easy theming
- Handled edge cases in date-picker (invalid input, constraints, reset behavior)

---

## Verification
- Linting and production build checks
- Manual validation of:
  - modal lifecycle and interactions
  - dropdown edit/save flows
  - conditional UI restrictions
  - date validation and edge cases
  - responsive behavior

---

## Possible Improvements
- Improve mobile experience for landing page
- Add automated tests for critical flows

