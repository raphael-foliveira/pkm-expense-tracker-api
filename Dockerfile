FROM node:20.10-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npm run build

CMD ["npm", "run", "start"]