FROM node:alpine

RUN npm install -g pm2

CMD cd /var/app && yarn install -s && pm2-docker index.js --name="micah"