# Audiobook Backend API

A FastAPI-based backend for the audiobook application.

## Features

- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Alembic** - Database migration tool
- **PostgreSQL** - Database
- **Poetry** - Dependency management
- **Docker** - Containerization
- **Code Quality** - Black, isort, flake8, pre-commit hooks

## Project Structure

```
apps/backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py
│   │       └── endpoints/
│   │           └── health.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   └── database.py
│   ├── models/
│   ├── schemas/
│   └── main.py
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
├── alembic.ini
├── Dockerfile
├── pyproject.toml
├── .pre-commit-config.yaml
└── env.example
```

## Quick Start

### Using Docker (Recommended)

1. Copy the environment file:
   ```bash
   cp apps/backend/env.example apps/backend/.env
   ```

2. Start the services:
   ```bash
   make up
   ```

3. Run migrations:
   ```bash
   make migrate
   ```

4. Access the API at http://localhost:8000

### Local Development

1. Install Poetry (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Set up pre-commit hooks:
   ```bash
   make setup-pre-commit
   ```

4. Copy environment file:
   ```bash
   cp apps/backend/env.example apps/backend/.env
   ```

5. Start PostgreSQL (using Docker):
   ```bash
   docker run -d --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15
   ```

6. Run migrations:
   ```bash
   make migrate
   ```

7. Start the development server:
   ```bash
   make run
   ```

## Available Commands

- `make install` - Install dependencies with Poetry
- `make run` - Run the FastAPI application
- `make format` - Format code with Black and isort
- `make lint` - Lint code with flake8
- `make test` - Run tests with pytest
- `make migrate` - Run database migrations
- `make migrate-create` - Create a new migration
- `make up` - Start services with docker-compose
- `make down` - Stop services with docker-compose
- `make logs` - Show logs from docker-compose
- `make clean` - Clean up containers and volumes

## API Endpoints

- `GET /` - Root endpoint
- `GET /api/v1/health/` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Environment Variables

Copy `env.example` to `.env` and modify as needed:

- `POSTGRES_SERVER` - PostgreSQL server host
- `POSTGRES_USER` - PostgreSQL username
- `POSTGRES_PASSWORD` - PostgreSQL password
- `POSTGRES_DB` - PostgreSQL database name
- `POSTGRES_PORT` - PostgreSQL port
- `BACKEND_CORS_ORIGINS` - CORS origins (comma-separated)

## Development

The project uses pre-commit hooks to ensure code quality. These will run automatically on commit and include:

- Black code formatting
- isort import sorting
- flake8 linting
- Various pre-commit hooks

## Database Migrations

To create a new migration:
```bash
make migrate-create message="Your migration description"
```

To apply migrations:
```bash
make migrate
```
