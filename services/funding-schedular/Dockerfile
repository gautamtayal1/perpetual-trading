FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./  
COPY services/funding-schedular/package.json ./package.json
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter funding-schedular build 

CMD ["pnpm", "--filter", "funding-schedular", "start"]