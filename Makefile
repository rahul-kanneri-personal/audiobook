.PHONY: help install run format lint test migrate up down logs clean

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies with Poetry"
	@echo "  run         - Run the FastAPI application"
	@echo "  format      - Format code with Black and isort"
	@echo "  lint        - Lint code with flake8"
	@echo "  test        - Run tests with pytest"
	@echo "  migrate     - Run database migrations"
	@echo "  migrate-create - Create a new migration"
	@echo "  up          - Start services with docker-compose"
	@echo "  down        - Stop services with docker-compose"
	@echo "  logs        - Show logs from docker-compose"
	@echo "  clean       - Clean up containers and volumes"

# Poetry commands
install:
	cd apps/backend && poetry install

# Development commands
run:
	cd apps/backend && poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

format:
	cd apps/backend && poetry run black .
	cd apps/backend && poetry run isort .

lint:
	cd apps/backend && poetry run flake8 .

test:
	cd apps/backend && poetry run pytest

# Database commands
migrate:
	cd apps/backend && poetry run alembic upgrade head

migrate-create:
	cd apps/backend && poetry run alembic revision --autogenerate -m "$(message)"

# Docker commands
up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

# Setup commands
setup-pre-commit:
	cd apps/backend && poetry run pre-commit install

setup-dev: install setup-pre-commit
	@echo "Development environment setup complete!"