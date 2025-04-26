FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY services/wss/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter wss build 

EXPOSE 8081

CMD ["pnpm", "--filter", "wss", "start"]