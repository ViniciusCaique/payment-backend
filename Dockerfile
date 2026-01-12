FROM node:22 AS build

# Goes to the app directory (think of it like a cd terminal command)
WORKDIR /app

COPY package*.json ./
COPY drizzle.config.ts ./

RUN npm install

# Copy the rest of our app into the container
COPY . .

RUN npm run build

FROM node:22 AS runner

WORKDIR /app

COPY --from=build /app/drizzle.config.ts ./
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]