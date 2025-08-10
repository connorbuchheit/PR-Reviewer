import type { PRData, ReviewResults } from "@/types/pr-data"

export const mockPRs: PRData[] = [
  {
    id: "pr_142",
    title: "Optimize database queries and add caching layer",
    number: 142,
    author: "sarah-dev",
    branch: "feature/db-optimization",
    files: 8,
    additions: 156,
    deletions: 43,
    status: "reviewed",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T10:45:00Z",
    description:
      "This PR introduces Redis caching and optimizes several database queries to improve application performance. Includes connection pooling and query batching improvements.",
    labels: ["performance", "database", "caching"],
    reviewScore: 85,
    priority: "high",
  },
  {
    id: "pr_141",
    title: "Add user authentication with JWT tokens",
    number: 141,
    author: "mike-security",
    branch: "feature/jwt-auth",
    files: 12,
    additions: 234,
    deletions: 67,
    status: "open",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    description:
      "Implements JWT-based authentication system with refresh tokens, password hashing using bcrypt, and role-based access control.",
    labels: ["security", "authentication", "backend"],
    priority: "high",
  },
  {
    id: "pr_140",
    title: "Refactor React components to use TypeScript",
    number: 140,
    author: "alex-frontend",
    branch: "refactor/typescript-migration",
    files: 24,
    additions: 445,
    deletions: 312,
    status: "reviewed",
    createdAt: "2024-01-13T11:45:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    description:
      "Migrates all React components from JavaScript to TypeScript, adds proper type definitions, and improves component prop validation.",
    labels: ["typescript", "frontend", "refactor"],
    reviewScore: 92,
    priority: "medium",
  },
  {
    id: "pr_139",
    title: "Fix memory leak in WebSocket connections",
    number: 139,
    author: "jenny-backend",
    branch: "bugfix/websocket-memory-leak",
    files: 3,
    additions: 45,
    deletions: 23,
    status: "merged",
    createdAt: "2024-01-12T16:20:00Z",
    updatedAt: "2024-01-13T10:15:00Z",
    description:
      "Fixes a critical memory leak in WebSocket connection handling by properly cleaning up event listeners and connection objects.",
    labels: ["bugfix", "websocket", "memory"],
    reviewScore: 88,
    priority: "high",
  },
  {
    id: "pr_138",
    title: "Add comprehensive unit tests for API endpoints",
    number: 138,
    author: "david-qa",
    branch: "test/api-unit-tests",
    files: 15,
    additions: 567,
    deletions: 12,
    status: "reviewed",
    createdAt: "2024-01-11T09:30:00Z",
    updatedAt: "2024-01-12T14:45:00Z",
    description:
      "Adds comprehensive unit tests for all API endpoints, includes edge case testing, error handling validation, and mock data setup.",
    labels: ["testing", "api", "quality"],
    reviewScore: 94,
    priority: "medium",
  },
  {
    id: "pr_137",
    title: "Implement dark mode theme support",
    number: 137,
    author: "lisa-design",
    branch: "feature/dark-mode",
    files: 18,
    additions: 289,
    deletions: 156,
    status: "open",
    createdAt: "2024-01-10T13:15:00Z",
    updatedAt: "2024-01-11T11:20:00Z",
    description:
      "Adds dark mode support with theme switching, CSS custom properties for colors, and persistent theme preference storage.",
    labels: ["ui", "theme", "frontend"],
    priority: "low",
  },
  {
    id: "pr_136",
    title: "Upgrade dependencies and fix security vulnerabilities",
    number: 136,
    author: "tom-devops",
    branch: "chore/dependency-updates",
    files: 6,
    additions: 78,
    deletions: 134,
    status: "merged",
    createdAt: "2024-01-09T10:45:00Z",
    updatedAt: "2024-01-10T08:30:00Z",
    description:
      "Updates all dependencies to latest versions, fixes 3 high-severity security vulnerabilities, and updates CI/CD pipeline configurations.",
    labels: ["security", "dependencies", "maintenance"],
    reviewScore: 76,
    priority: "high",
  },
  {
    id: "pr_135",
    title: "Add real-time notifications system",
    number: 135,
    author: "carlos-fullstack",
    branch: "feature/notifications",
    files: 21,
    additions: 678,
    deletions: 89,
    status: "open",
    createdAt: "2024-01-08T15:30:00Z",
    updatedAt: "2024-01-09T12:45:00Z",
    description:
      "Implements real-time notification system using WebSockets, includes push notifications, email notifications, and notification preferences.",
    labels: ["feature", "websocket", "notifications"],
    priority: "medium",
  },
]

export const mockReviewResults: Record<string, ReviewResults> = {
  pr_142: {
    summary:
      "This PR introduces significant performance improvements through query optimization and Redis caching. The implementation follows repository patterns well but has a critical SQL injection vulnerability that must be addressed. Knowledge conflicts detected regarding connection pooling requirements.",
    score: 85,
    categories: {
      performance: 92,
      security: 65, // Lower due to SQL injection
      style: 88,
      testing: 70,
    },
    comments: [
      {
        file: "src/database/queries.ts",
        line: 23,
        type: "error",
        message: "CRITICAL: SQL injection vulnerability detected. Use parameterized queries to prevent attacks.",
        code: "const query = `SELECT * FROM users WHERE id = ${userId}`",
      },
      {
        file: "src/cache/redis.ts",
        line: 15,
        type: "warning",
        message: "Connection pooling recommended for production scalability and security compliance.",
        code: "const client = redis.createClient()",
      },
      {
        file: "src/database/queries.ts",
        line: 45,
        type: "optimization",
        message: "Excellent query optimization! This should significantly reduce N+1 problems.",
        code: "const users = await db.query('SELECT * FROM users WHERE team_id IN (?)', [teamIds])",
      },
    ],
    packages: [
      { name: "ioredis", reason: "Better Redis client with connection pooling and TypeScript support" },
      { name: "pg", reason: "PostgreSQL client with built-in parameterized query support" },
    ],
  },
  pr_140: {
    summary:
      "Outstanding TypeScript migration with comprehensive type definitions and excellent code quality. This PR demonstrates best practices throughout and significantly improves type safety. No security concerns identified. Highly recommended for approval.",
    score: 92,
    categories: {
      performance: 88,
      security: 95, // High - no security issues
      style: 96,
      testing: 88,
    },
    comments: [
      {
        file: "src/components/UserProfile.tsx",
        line: 45,
        type: "suggestion",
        message: "Consider using a more specific type instead of 'any' for better type safety.",
        code: "const handleSubmit = (data: any) => {",
      },
      {
        file: "src/types/user.ts",
        line: 12,
        type: "optimization",
        message: "Excellent type definitions! Consider adding JSDoc comments for better developer experience.",
        code: "export interface User {",
      },
      {
        file: "tsconfig.json",
        line: 8,
        type: "optimization",
        message: "Perfect TypeScript configuration with strict mode enabled. Great work!",
        code: '"strict": true,',
      },
    ],
    packages: [
      { name: "@types/react", reason: "Updated React type definitions for better compatibility" },
      { name: "@typescript-eslint/eslint-plugin", reason: "Enhanced TypeScript linting rules" },
    ],
  },
  pr_139: {
    summary:
      "Excellent critical bug fix that properly addresses the WebSocket memory leak. The implementation is clean, targeted, and includes appropriate error handling. Well-tested with regression prevention. Ready for immediate deployment.",
    score: 88,
    categories: {
      performance: 94, // High - fixes memory leak
      security: 85,
      style: 85,
      testing: 88,
    },
    comments: [
      {
        file: "src/websocket/connection.ts",
        line: 67,
        type: "optimization",
        message:
          "Perfect fix! Proper cleanup prevents memory leaks. Consider adding cleanup timeout as safety measure.",
        code: "connection.removeAllListeners(); connection = null;",
      },
      {
        file: "tests/websocket/connection.test.ts",
        line: 23,
        type: "optimization",
        message: "Excellent regression test! This will prevent the memory leak from reoccurring.",
        code: "expect(getActiveConnections()).toBe(0);",
      },
    ],
    packages: [{ name: "ws", reason: "Updated WebSocket library with better memory management" }],
  },
  pr_138: {
    summary:
      "Exceptional testing implementation that sets the gold standard for API testing. Comprehensive coverage, excellent organization, and perfect execution. This PR significantly improves code reliability and should serve as a model for future testing efforts.",
    score: 94,
    categories: {
      performance: 85,
      security: 92, // High - comprehensive security testing
      style: 96,
      testing: 98, // Nearly perfect
    },
    comments: [
      {
        file: "tests/api/users.test.ts",
        line: 156,
        type: "suggestion",
        message: "Excellent test structure! Consider extracting common setup into helper functions for reusability.",
        code: "beforeEach(() => { setupTestDatabase(); });",
      },
      {
        file: "tests/helpers/mockData.ts",
        line: 23,
        type: "optimization",
        message: "Outstanding mock data structure! Perfect balance of realism and maintainability.",
        code: "export const mockUser = { id: 1, email: 'test@example.com' };",
      },
      {
        file: "tests/api/auth.test.ts",
        line: 89,
        type: "optimization",
        message: "Comprehensive security testing including edge cases and attack vectors. Excellent work!",
        code: "expect(response.status).toBe(401);",
      },
    ],
    packages: [
      { name: "@testing-library/jest-dom", reason: "Enhanced Jest matchers for better assertions" },
      { name: "supertest", reason: "Superior API endpoint testing utilities" },
    ],
  },
  pr_136: {
    summary:
      "Good dependency maintenance work with proper security vulnerability fixes. Some package updates may need compatibility testing. The security improvements are significant, but code style consistency could be better.",
    score: 76,
    categories: {
      performance: 72,
      security: 95, // High - fixes vulnerabilities
      style: 68,
      testing: 70,
    },
    comments: [
      {
        file: "package.json",
        line: 45,
        type: "warning",
        message: "Major version update may introduce breaking changes. Test thoroughly in staging.",
        code: '"react": "^18.0.0"',
      },
      {
        file: ".github/workflows/ci.yml",
        line: 23,
        type: "suggestion",
        message: "Consider pinning action versions for better security and reproducibility.",
        code: "uses: actions/setup-node@v3",
      },
    ],
    packages: [{ name: "npm-audit-resolver", reason: "Better handling of security audit results" }],
  },
}
