FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Use --host to allow external access and --port 3000 to match docker-compose mapping
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]