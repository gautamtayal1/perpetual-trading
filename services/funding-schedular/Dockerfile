FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./  
COPY services/funding-schedular/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/event-queue build
RUN pnpm --filter @repo/funding-schedular build

CMD ["pnpm", "--filter", "@repo/funding-schedular", "start"]