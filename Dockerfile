FROM node:12.14.1
WORKDIR /usr/app/
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 5000
CMD npm start
