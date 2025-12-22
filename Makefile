.PHONY: migrate-dev migrate-deploy db-push apply-schema seed-posts seed-clients seed setup build build-all up up-db down logs ensure-db bootstrap init help

# Apply development migrations (creates new migration files if schema changed)
migrate-dev:
	docker compose exec app npx prisma migrate dev

# Apply existing migrations (production/CI friendly)
migrate-deploy:
	docker compose exec app npx prisma migrate deploy

# Push schema to database without generating migration files (rapid prototyping)
db-push:
	docker compose exec app npx prisma db push

# Apply migrations if they exist, otherwise push schema directly
apply-schema: migrate-deploy db-push

# Seed blog posts table
seed-posts:
	docker compose exec app node scripts/seed.js

# Seed clients table
seed-clients:
	docker compose exec app node scripts/migrate-clients.js

# Run all seeds
seed: seed-posts seed-clients

# Complete setup: apply migrations (or push schema) and run all seeds
setup: apply-schema seed 

# Build only the application image
build:
	docker compose build app

# Build all images (app + db)
build-all:
	docker compose build

# Start all services in detached mode
up:
	docker compose up -d

# Start only the database (used by ensure-db)
up-db:
	docker compose up -d db

# Stop and remove containers, networks, images, and volumes created by up
down:
	docker compose down

# Tail logs of the application container
logs:
	docker compose logs -f app

# Ensure that the database container is running (start it if needed)
ensure-db:
	@echo "Ensuring database container is running..."
	@if [ -z "$(shell docker compose ps -q db)" ] || [ "$$(docker inspect -f '{{.State.Running}}' $(shell docker compose ps -q db) 2>/dev/null || echo false)" != "true" ]; then \
		echo "Starting database container..."; \
		docker compose up -d db; \
	else \
		echo "Database container already running."; \
	fi

# Bootstrap: build image, ensure DB, apply migrations, run all seeds
bootstrap: build ensure-db setup

# Init: full cycle – build images, start all services, apply migrations, seed DB
init: build up setup

# Default target
.DEFAULT_GOAL := help

help:
	@echo "Available targets:" && \
	echo "  build          - Build only the application image" && \
	echo "  build-all      - Build all images (app + db)" && \
	echo "  up             - Start all services in detached mode" && \
	echo "  up-db          - Start only the database service" && \
	echo "  down           - Stop and remove all services" && \
	echo "  logs           - Tail application logs" && \
	echo "  migrate-dev    - Create & apply dev migrations" && \
	echo "  migrate-deploy - Apply existing migrations" && \
	echo "  db-push        - Push schema without migrations" && \
	echo "  seed-posts     - Seed blog posts table" && \
	echo "  seed-clients   - Seed clients table" && \
	echo "  seed           - Run all seed scripts" && \
	echo "  setup          - Apply migrations & run all seeds" && \
	echo "  bootstrap      - Build image, start DB if needed, setup DB" && \
	echo "  init           - Full cycle: build images, start all services, apply migrations, seed DB" && \
	echo "  help           - Show this help" 