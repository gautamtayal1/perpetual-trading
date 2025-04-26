FROM node:20-alpine

WORKDIR /app

COPY packages/order-queue/package.json ./package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter infra build
RUN pnpm --filter engine build
RUN pnpm --filter order-queue build

WORKDIR /app/services/engine

CMD ["pnpm", "worker"]


