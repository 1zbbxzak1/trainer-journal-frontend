FROM node:20.12.2 as build
WORKDIR /app/src
COPY package*.json ./

RUN npm install -g @angular/cli
RUN npm install --legacy-peer-deps

COPY . ./

RUN npm run build

FROM node:20.12.2
WORKDIR /usr/app
COPY --from=build /app/src/dist/trainer-journal-frontend/ ./
CMD node server/server.mjs
EXPOSE 4200
