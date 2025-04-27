# Perpetual Trading Platform

A full-stack, microservices-based perpetual futures trading platform built with TypeScript, Redis/BullMQ, PostgreSQL/Prisma, WebSockets, and Docker.

---

## Architecture

https://drive.google.com/file/d/1kqC-oNcMLfUSUw__XNEqLVJdVUS9nPyl/view?usp=sharing

---

## 🧰 Tech Stack

- **Language & Runtime**: Node.js 20, TypeScript  
- **Package Manager**: pnpm  
- **Services & Frameworks**  
  - **API Server** (`apps/server`): Express, Prisma ORM  
  - **WebSocket Server** (`services/wss`): ws + Redis Pub/Sub  
  - **Engine** (`services/engine`): In-memory orderbook, matching logic  
  - **Worker & Queues** (`packages/order-queue`): BullMQ, Redis  
  - **Archiver** (`services/archiver`): Persists trades/positions to PostgreSQL  
  - **Frontend** (`apps/client`): Next.js, React, lightweight-charts  
- **Database**: PostgreSQL (via Prisma)  
- **Cache & Message Bus**: Redis (Pub/Sub + BullMQ)  
- **CI/CD**: GitHub Actions for build → Docker image → deploy to VPS/DigitalOcean  
- **Containerization**: Docker, Docker Compose  

---

---

## 🚀 Getting Started

### 1. Prerequisites  
- Node.js 20 LTS  
- pnpm  
- Docker & Docker Compose  
- PostgreSQL & Redis (or via Docker)

### 2. Clone & Install

```bash
git clone <repo-url>
cd <repo-root>
pnpm install --frozen-lockfile

