FROM node:20-alpine

WORKDIR /app

EXPOSE 3000

CMD sh -c "npm install && npx prisma generate && npm run start:dev"
