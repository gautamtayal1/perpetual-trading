# Perpetual Trading Platform

A full-stack, microservices-based perpetual futures trading platform built with TypeScript, Redis/BullMQ, PostgreSQL/Prisma, WebSockets, and Docker.

---

## Architecture

![Architecture](https://res.cloudinary.com/dutbrfinr/image/upload/v1745736508/pgnpbhznfstdsnidmukl.png)

---

## 🧰 Tech Stack

- **Language & Runtime**: Node.js 20, TypeScript  
- **Package Manager**: pnpm  
- **Services & Frameworks**  
  - **API Server** (`apps/server`): Express, Prisma ORM  
  - **WebSocket Server** (`services/wss`): WebSockets + Redis Pub/Sub  
  - **Engine** (`services/engine`): In-memory orderbook, matching logic  
  - **Worker & Queues** (`packages/queue`): BullMQ, Redis  
  - **Archiver** (`services/archiver`): Persists trades/positions to PostgreSQL  
  - **Frontend** (`apps/web`): Next.js, React, lightweight-charts  
- **Database**: PostgreSQL (via Prisma)  
- **Cache & Message Bus**: Redis (Pub/Sub + BullMQ)  
- **CI/CD**: GitHub Actions for build → Docker image → deploy to VPS/DigitalOcean  
- **Containerization**: Docker, Docker Compose  

---

