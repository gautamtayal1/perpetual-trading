FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db exec prisma generate
RUN pnpm --filter @repo/types build
RUN pnpm --filter @repo/event-queue build
RUN pnpm --filter @repo/queue build
RUN pnpm --filter @repo/db build

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WSS_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WSS_URL=$NEXT_PUBLIC_WSS_URL

RUN pnpm --filter web build

EXPOSE 3000

CMD ["pnpm", "--filter", "web", "start"]
