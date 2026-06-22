FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Next.js needs to see env vars at runtime
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]
