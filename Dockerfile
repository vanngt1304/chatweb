FROM node:24-alpine
WORKDIR /app

# Copy file cài đặt trước
COPY backend/package.json ./backend/

# Cài thư viện
WORKDIR /app/backend
RUN npm install

# Copy toàn bộ code
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend

# Chạy server
EXPOSE 3000
CMD ["node", "backend/server.js"]
