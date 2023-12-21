FROM node:18-alpine

ARG PORT=3000

ENV PORT ${PORT}

RUN mkdir -p /app

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE $PORT

CMD ["npm", "run", "start:prod"]