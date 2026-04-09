# Getting Started

This guide will help you set up your development environment for contributing to the f(x) Protocol Trading Interface.

## Prerequisites

- Node.js 20+ 
- npm or yarn/pnpm
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/Dobbias/fx-trade.git
cd fx-trade

# Install dependencies (when package.json is added)
npm install
```

## Development

```bash
# Start development server
npm run dev

# The app will be available at http://localhost:3000
```

## Testing (Headless Browser)

The project includes a complete headless browser testing setup using Vitest + happy-dom. **No additional browser installation required** - everything runs in a simulated browser environment.

```bash
# Run all tests
npm test

# Run tests with UI interface
npm run test:ui

# Run tests once and exit
npm run test:run

# Generate coverage report
npm run test:coverage
```

See [Testing Guide](./testing.md) for detailed testing documentation.

## Project Structure

```
fx-trade/
├── docs/              # Documentation
│   ├── research/      # Research documents
│   ├── api/           # API documentation
│   └── guides/        # User guides
├── LICENSE            # License file
└── README.md          # Project overview
```

## Resources

- [f(x) Protocol Official Docs](https://fxprotocol.gitbook.io/fx-docs)
- [API & Smart Contract Research](./research/api-smart-contracts.md)
