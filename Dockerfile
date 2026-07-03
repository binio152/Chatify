# ---   Stage1: Building frontend   ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend .
ENV VITE_API_URL=
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN npm run build

# ---   Stage1: Building backend   ---
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app/backend
COPY backend/package*.json .
RUN npm install
COPY backend .
RUN npm run build


FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY backend/package*.json .
RUN npm install --omit=dev && npm cache clean --force

COPY --from=backend-build /app/backend/dist .
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD [ "node", "index.js" ]