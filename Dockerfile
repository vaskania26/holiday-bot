FROM node:16

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --ignore-scripts

COPY ./*.js ./links.html ./

CMD ["node", "./app.js"]



