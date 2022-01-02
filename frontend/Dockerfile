FROM node:16-alpine3.12

RUN mkdir /app
WORKDIR /app

#RUN npm install -g nodemon

COPY package.json package.json
#RUN npm install && mv node_modules /node_modules
RUN yarn install && mv node_modules /node_modules

COPY . .

#LABEL maintainer="Nick Janetakis <nick.janetakis@gmail.com>"

CMD yarn serve --port=3002
EXPOSE 3002
