FROM node:16-alpine


RUN npm i --global npm

COPY ./app /app
RUN chmod -R 777 /app 

USER node
WORKDIR /app

RUN npm install && npm run build
CMD ["node", "build/index.js", "--threaded"]