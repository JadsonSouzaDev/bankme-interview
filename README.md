# Bankme Interview - Turbo Repo

This project is configured as a monorepo using [Turbo Repo](https://turbo.build/repo) to manage multiple applications.

## Project Structure

```
bankme-interview/
├── apps/
│   ├── backend/          # NestJS API
│   └── frontend/         # Next.js Frontend
├── packages/             # Packages used between apps
│   ├── shared/           # DTOs and utils
├── package.json          # Root monorepo configuration
├── turbo.json            # Turbo configuration
├── README.md             # Documentation for configuring environment
└── README.old.md         # Original test documentation
```

## How to Use

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run only the backend
npm run -w apps/backend dev

# Run only the frontend
npm run -w apps/frontend dev
```

### Build

```bash
# Build all apps
npm run build

# Build only the backend
npm run -w apps/backend build

# Build only the frontend
npm run -w apps/frontend build
```

### Testing

```bash
# Run tests for all apps
npm run test

# Run tests only for the backend
npm run -w apps/backend test

# Run tests only for the frontend
npm run -w apps/frontend test
```

### Linting

```bash
# Lint all apps
npm run lint

# Lint only the backend
npm run -w apps/backend lint

# Lint only the frontend
npm run -w apps/frontend lint
```

### Cleanup

```bash
# Clean builds for all apps
npm run clean
```

## 🐳 Docker Compose

The project includes Docker Compose configuration to facilitate development and deployment.

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

#### Production

```bash
# Build and run all services
docker-compose up -d

# Build only (without running)
docker-compose build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
```

### Available Services

- **Backend**: NestJS API on port `3001`
- **Redis**: Cache and messaging on port `6379`
- **Frontend**: NextJS interface on port `3000`

### Environment Variables

The following variables are automatically configured:

- `DATABASE_URL`: SQLite database file
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Environment (production/development)

### Volumes

- `./data`: SQLite database data
- `redis-data`: Redis data (persistent)

### Health Checks

Services include automatic health checks:

```bash
# Check service status
docker-compose ps

# View health check logs
docker-compose logs backend | grep health
```

## Turbo Repo Benefits

1. **Smart Caching**: Turbo caches builds and tests for faster execution
2. **Parallel Execution**: Multiple commands are executed in parallel when possible
3. **Dependencies**: Automatically manages dependencies between workspaces
4. **Consistency**: Ensures all apps follow the same build/test rules

## 🔍 Useful Turbo Commands

```bash
# See which tasks would be executed (dry-run)
npx turbo run build --dry-run

# Execute only in specific workspaces
npx turbo run build --filter=@bankme/backend

# See dependencies between workspaces
npx turbo run build --graph

# Clear Turbo cache
npx turbo clean
``` 