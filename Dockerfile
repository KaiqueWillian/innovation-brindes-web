# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
ARG API_BASE_URL=https://apihomolog.innovationbrindes.com.br
ARG NEXT_PUBLIC_API_BASE_URL=https://apihomolog.innovationbrindes.com.br
ARG NEXT_PUBLIC_IMAGE_HOST=innovationbrindes.com.br
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_IMAGE_HOST=$NEXT_PUBLIC_IMAGE_HOST
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ARG API_BASE_URL=https://apihomolog.innovationbrindes.com.br
ARG NEXT_PUBLIC_API_BASE_URL=https://apihomolog.innovationbrindes.com.br
ARG NEXT_PUBLIC_IMAGE_HOST=innovationbrindes.com.br
ENV NODE_ENV=production
ENV PORT=3000
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_IMAGE_HOST=$NEXT_PUBLIC_IMAGE_HOST

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
