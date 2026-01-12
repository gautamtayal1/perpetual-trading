FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./  
COPY services/archiver/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/db build
RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/archiver build

CMD ["pnpm", "--filter", "@repo/archiver", "start"]