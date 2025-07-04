FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY .env ./app/apps/web

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/event-queue build
RUN pnpm --filter @repo/queue build
RUN pnpm --filter @repo/db build
RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
