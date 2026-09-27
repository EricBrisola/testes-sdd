FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx prisma generate || true
RUN npm run build || true
EXPOSE 3000
CMD ["npm", "run", "dev"]
