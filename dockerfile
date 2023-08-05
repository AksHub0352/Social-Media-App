FROM node:18-alpine as dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
# RUN npm run build


FROM node:18-alpine as runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/controller ./controller
COPY --from=builder /app/models ./models
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/index.js ./index.js
COPY --from=builder /app/auth.middleware.js ./auth.middleware.js
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.env ./

EXPOSE 8000
CMD ["npm", "run", "start"]