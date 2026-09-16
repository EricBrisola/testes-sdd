<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified sections: Aligned principles strictly with the requested Quality, Architecture, and Design rules.
-->
# Constitution

## Core Principles

### I. Qualidade
- **TypeScript Strictness**: TypeScript is mandatory. There MUST NOT be any implicit or explicit `any` types.
- **Functional Components**: Only functional components are permitted. DO NOT use `React.FC` or `React.FunctionComponent`. Components must be created using standard functions (`function Component() {}`) or simple arrow functions. DO NOT use the `React` object to create components.
- **Props Typing**: Component Props MUST always be explicitly typed.
- **UI Logic**: Components used exclusively for the UI MUST NOT contain any business logic.

### II. Arquitetura
- **Separation of Concerns**: There MUST be a strict separation between types, UI components, and data logic.
- **Styling**: The use of inline CSS is strictly forbidden. NEVER mix component structure with its styles in the same file. Always create a separate style file for each component.
- **Dependencies**: The addition of unnecessary dependencies is forbidden.

### III. Design
- **Responsiveness**: All components MUST be fully responsive and work flawlessly on mobile devices.

## Governance
This Constitution supersedes all other practices and guidelines. Amendments require proper documentation, explicit approval, and a clear migration plan. All Pull Requests and code reviews MUST explicitly verify compliance with these principles.

**Version**: 1.1.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-09-10
