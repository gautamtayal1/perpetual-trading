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
RUN pnpm --filter engine build
RUN pnpm --filter queue build

WORKDIR /app/packages/queue

CMD ["pnpm", "start"]
