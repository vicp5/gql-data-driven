FROM node:12-slim

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts  -g --silent

COPY . ./

RUN echo "REACT_APP_SERVER_URL=http://localhost:8080" > .env
RUN npm run relay

CMD ["npm", "start"]