<!--
Sync Impact Report:
- Version change: 1.2.0 → 1.3.0
- Modified sections: Added Docker Dependency Synchronization rule under Workflow.
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

### IV. Workflow
- **Git Branching**: A new Git branch MUST be created for each new Spec (feature) created in the project. The branch name MUST follow the format `<spec-number>-<feature-name>` (e.g., `003-user-dashboard`).
- **No Deprecated Code**: NEVER use APIs, libraries, types, or features that are marked as deprecated. Always utilize the modern approaches recommended by their respective documentations.
- **Docker Dependency Synchronization**: Whenever a new package or library is added to the project (frontend or backend), its installation MUST be executed directly inside the active Docker container (`docker compose exec <service> npm install`) or via container rebuild (`docker compose up -d --build <service>`), followed by restarting the container service (`docker compose restart <service>`). Installing dependencies solely on the host machine is strictly forbidden, as Docker anonymous volumes (`node_modules`) do not synchronize automatically with the host filesystem.

## Governance
This Constitution supersedes all other practices and guidelines. Amendments require proper documentation, explicit approval, and a clear migration plan. All Pull Requests and code reviews MUST explicitly verify compliance with these principles.

**Version**: 1.3.0 | **Ratified**: 2026-09-10 | **Last Amended**: 2026-10-30
