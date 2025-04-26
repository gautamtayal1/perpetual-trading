FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./  
COPY services/oracle/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter oracle build 

CMD ["pnpm", "--filter", "oracle", "start"]