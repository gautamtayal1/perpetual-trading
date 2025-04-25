FROM node:20

WORKDIR /app

COPY . .

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/server... build

WORKDIR /app/apps/server

CMD ["pnpm", "--filter", "server", "start"]
