FROM node:20-alpine

WORKDIR /app

COPY packages/queue/package.json ./package.json
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/event-queue build
RUN pnpm --filter @repo/engine build
RUN pnpm --filter @repo/queue build

CMD ["pnpm", "--filter", "@repo/queue", "start"]
