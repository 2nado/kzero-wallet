# kzero-wallet

A zero-knowledge proof wallet system built with TypeScript and React.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm (recommended package manager)

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Development

#### Core Packages Development

To develop the core packages (zk-core, zk-wallet, zk-react):

```bash
pnpm dev
```

This will start development servers for all packages in watch mode.

#### Examples

Run the basic integration example:

```bash
pnpm dev:example
```

Run the full wallet example:

```bash
pnpm dev:wallet
```

### Scripts

- `pnpm build` - Build all packages
- `pnpm dev` - Start development mode for core packages
- `pnpm dev:example` - Start the basic example
- `pnpm dev:wallet` - Start the wallet example
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run ESLint
- `pnpm check-types` - Run TypeScript type checking

### Project Structure

```
├── packages/
│   ├── zk-core/          # Core ZK proof functionality
│   ├── zk-wallet/        # Wallet cryptography and messaging
│   ├── zk-react/         # React components and hooks
│   └── dev/              # Shared development configuration
├── example/              # Basic integration example
└── example-wallet/       # Full wallet implementation
```

## License

GPL-3.0