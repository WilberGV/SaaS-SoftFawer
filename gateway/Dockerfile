FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY dist ./dist

# Create sessions directory
RUN mkdir -p /app/sessions

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV SESSION_DIR=/app/sessions

EXPOSE 3001

CMD ["node", "dist/server.js"]
