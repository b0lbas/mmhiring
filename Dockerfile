FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN mkdir -p /app/public/uploads && chown -R node:node /app/public/uploads

RUN npm run build

EXPOSE 3000

RUN echo -e '#!/bin/sh \n\
npx prisma migrate deploy \n\
node scripts/seed.js \n\
npm start' > /app/startup.sh && chmod +x /app/startup.sh

CMD ["/app/startup.sh"]
