# Testing Guide

This guide explains how to run and write tests for the f(x) Protocol Trading Interface using our headless browser setup.

## Test Stack

- **Vitest**: Fast test runner with native ESM support
- **happy-dom**: Lightweight headless browser environment (faster than JSDOM)
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom DOM matchers
- **Playwright**: Full browser automation for screenshots and visual testing

## Available Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (for development)
npm test -- --watch

# Run tests with UI interface (interactive)
npm run test:ui

# Run tests once and exit
npm run test:run

# Generate coverage report
npm run test:coverage
```

## Running Tests in Headless Mode

By default, tests run in happy-dom (a headless browser). No additional setup needed.

```bash
# Run headless tests
npm test
```

## Test UI Mode

For an interactive test experience with live updates:

```bash
npm run test:ui
```

This opens a browser-based UI at `http://localhost:51204/__vitest__/` where you can:
- View test results in real-time
- Filter tests by file name or pattern
- See code coverage
- Debug failing tests

## Coverage Reports

Generate a detailed coverage report:

```bash
npm run test:coverage
```

Coverage reports are generated in:
- **Terminal**: Summary output
- **HTML**: `coverage/index.html` - Open in browser for detailed view
- **JSON**: `coverage/coverage-final.json` - For CI/CD integration

## Screenshots for UI Design

For frontend engineers and designers to capture screenshots of the app:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Capture screenshot (default: home page, desktop)
npm run screenshot

# Capture specific page
npm run screenshot -- --url=/trade

# Mobile view (375x667)
npm run screenshot -- --mobile

# Dark mode
npm run screenshot -- --dark

# Custom dimensions
npm run screenshot -- --width=1400 --height=900

# Custom output directory
npm run screenshot -- --output=assets/screenshots
```

**Note**: The dev server must be running (`npm run dev`) before taking screenshots.

Screenshots are saved to the `screenshots/` directory by default with timestamps in the filename.

Perfect for:
- UI design review and iteration
- Documentation and presentations
- Visual regression testing
- Sharing app state with stakeholders

## Writing Tests

### Unit Tests

Create `*.test.ts` files alongside your source code:

```typescript
import { describe, it, expect } from "vitest";

describe("MyFunction", () => {
  it("should do something", () => {
    expect(myFunction(1, 2)).toBe(3);
  });
});
```

### Component Tests

Create `*.test.tsx` files for React components:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## Test Configuration

Test configuration is in `vitest.config.ts`:

- **Environment**: happy-dom (headless browser)
- **Setup file**: `lib/tests/setup.ts` (global mocks and configurations)
- **Coverage**: Excludes `lib/tests/` and config files

## CI/CD Integration

For CI pipelines, use:

```bash
npm run test:run
```

This runs tests once without watch mode and exits with proper status code.

## Troubleshooting

### Tests timing out

Increase timeout in vitest.config.ts:

```ts
test: {
  testTimeout: 10000,
}
```

### Window/media queries not working

The setup file (`lib/tests/setup.ts`) includes mocks for:
- `window.matchMedia`
- Additional browser APIs can be added there

### React warnings about act()

Wrap state updates in `act()` from `@testing-library/react`:

```ts
import { act } from "@testing-library/react";

await act(async () => {
  // State update code
});
```

## Next Steps

- See [lib/tests/](../../lib/tests/) for example tests
- Read [Vitest docs](https://vitest.dev/)
- Read [Testing Library docs](https://testing-library.com/)
